import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SITE_URL = "https://wallnova.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const type = url.searchParams.get("type") || "pages";

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (type === "images") {
      // Image sitemap
      const { data: wallpapers } = await supabase
        .from("wallpapers")
        .select("id, title, image_url, category, created_at")
        .order("created_at", { ascending: false })
        .limit(1000);

      let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

      for (const w of wallpapers || []) {
        xml += `
  <url>
    <loc>${SITE_URL}/wallpaper/${w.id}</loc>
    <image:image>
      <image:loc>${w.image_url}</image:loc>
      <image:title>${escapeXml(w.title)}</image:title>
      <image:caption>${escapeXml(w.title)} - ${escapeXml(w.category)} wallpaper</image:caption>
    </image:image>
    <lastmod>${new Date(w.created_at).toISOString().split("T")[0]}</lastmod>
  </url>`;
      }

      xml += "\n</urlset>";

      return new Response(xml, {
        headers: { ...corsHeaders, "Content-Type": "application/xml; charset=utf-8" },
      });
    }

    // Regular sitemap
    const staticPages = [
      { loc: "/", priority: "1.0", changefreq: "daily" },
      { loc: "/explore", priority: "0.9", changefreq: "daily" },
      { loc: "/categories", priority: "0.8", changefreq: "weekly" },
      { loc: "/leaderboard", priority: "0.7", changefreq: "daily" },
      { loc: "/privacy-policy", priority: "0.3", changefreq: "monthly" },
      { loc: "/terms-of-service", priority: "0.3", changefreq: "monthly" },
      { loc: "/content-policy", priority: "0.3", changefreq: "monthly" },
      { loc: "/dmca-copyright-policy", priority: "0.3", changefreq: "monthly" },
    ];

    const { data: wallpapers } = await supabase
      .from("wallpapers")
      .select("id, created_at")
      .order("created_at", { ascending: false })
      .limit(1000);

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    for (const page of staticPages) {
      xml += `
  <url>
    <loc>${SITE_URL}${page.loc}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    }

    for (const w of wallpapers || []) {
      xml += `
  <url>
    <loc>${SITE_URL}/wallpaper/${w.id}</loc>
    <lastmod>${new Date(w.created_at).toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
    }

    xml += "\n</urlset>";

    return new Response(xml, {
      headers: { ...corsHeaders, "Content-Type": "application/xml; charset=utf-8" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
