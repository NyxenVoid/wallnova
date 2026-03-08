import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ModerationResult {
  approved: boolean;
  violations: {
    type: string;
    severity: "warning" | "severe" | "critical";
    details: string;
    confidence: number;
  }[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Get auth user from request
    const authHeader = req.headers.get("Authorization");
    const supabaseUser = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_PUBLISHABLE_KEY") || Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader || "" } },
    });
    const { data: { user } } = await supabaseUser.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { title, description, tags, imageBase64 } = await req.json();

    // Build the moderation prompt
    const textContent = [
      title && `Title: ${title}`,
      description && `Description: ${description}`,
      tags?.length && `Tags: ${tags.join(", ")}`,
    ]
      .filter(Boolean)
      .join("\n");

    const messages: any[] = [
      {
        role: "system",
        content: `You are a strict content moderation AI for a wallpaper sharing platform. You must analyze both text and images for policy violations.

Detect these violation categories:
- "abusive_language": Profanity, slurs, hate speech, harassment, threats, or discriminatory language
- "sexual_content": Nudity, sexually explicit or suggestive content in images or text
- "personal_info": Personal photos (selfies, identifiable faces in casual settings), phone numbers, addresses, or private data
- "violence": Graphic violence, gore, or disturbing imagery
- "spam": Repetitive nonsensical text, gibberish, or obvious spam
- "copyright": Obvious watermarked content from other platforms

Respond ONLY with a JSON object matching this schema:
{
  "approved": boolean,
  "violations": [
    {
      "type": "abusive_language" | "sexual_content" | "personal_info" | "violence" | "spam" | "copyright",
      "severity": "warning" | "severe" | "critical",
      "details": "Brief explanation",
      "confidence": 0.0-1.0
    }
  ]
}

Rules:
- If no violations found, return {"approved": true, "violations": []}
- Only flag violations with confidence >= 0.7
- "critical" severity = immediate block (explicit sexual, extreme violence, hate speech)
- "severe" = strong violation (suggestive content, personal photos, moderate abuse)
- "warning" = mild concern (borderline language, mild spam)
- Be strict but fair. Artistic content (paintings, digital art) with mild themes is OK.
- Wallpaper-appropriate content: landscapes, abstract, gaming, anime (non-sexual), digital art, etc.`,
      },
    ];

    // Build user message with optional image
    const userContent: any[] = [];
    if (textContent) {
      userContent.push({ type: "text", text: `Analyze this wallpaper submission:\n\n${textContent}` });
    }
    if (imageBase64) {
      userContent.push({
        type: "image_url",
        image_url: { url: imageBase64 },
      });
    }
    if (!userContent.length) {
      return new Response(JSON.stringify({ approved: true, violations: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    messages.push({ role: "user", content: userContent });

    // Call Lovable AI with vision-capable model
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        temperature: 0.1,
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI service payment required." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errText);
      // On AI failure, allow the upload but log it
      return new Response(JSON.stringify({ approved: true, violations: [], warning: "Moderation temporarily unavailable" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json();
    const rawContent = aiData.choices?.[0]?.message?.content || "";

    // Parse the JSON from the response (handle markdown code blocks)
    let result: ModerationResult;
    try {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      result = jsonMatch ? JSON.parse(jsonMatch[0]) : { approved: true, violations: [] };
    } catch {
      console.error("Failed to parse moderation response:", rawContent);
      result = { approved: true, violations: [] };
    }

    // Log violations to database using service role
    if (result.violations.length > 0) {
      const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      const violationRows = result.violations.map((v) => ({
        user_id: user.id,
        violation_type: v.type,
        severity: v.severity,
        details: v.details,
        content_snippet: textContent?.substring(0, 200),
        ai_confidence: v.confidence,
      }));

      const { error: insertError } = await supabaseAdmin
        .from("content_violations")
        .insert(violationRows);
      if (insertError) {
        console.error("Failed to log violations:", insertError);
      }
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Moderation error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
