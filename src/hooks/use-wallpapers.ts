import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface DbWallpaper {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string;
  resolution: string;
  type: "mobile" | "desktop" | "4k";
  tags: string[];
  downloads: number;
  featured: boolean;
  trending: boolean;
  created_at: string;
  likes_count?: number;
  avg_rating?: number;
  user_liked?: boolean;
  user_rating?: number;
  creator_name?: string;
  creator_avatar?: string;
}

export function useWallpapers(filters?: {
  category?: string;
  type?: string;
  search?: string;
  sortBy?: string;
}) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["wallpapers", filters, user?.id],
    queryFn: async () => {
      // Fetch wallpapers
      let query = supabase.from("wallpapers").select("*");

      if (filters?.category && filters.category !== "All") {
        query = query.eq("category", filters.category);
      }
      if (filters?.type && filters.type !== "All") {
        query = query.eq("type", filters.type);
      }
      if (filters?.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
        );
      }

      switch (filters?.sortBy) {
        case "newest":
          query = query.order("created_at", { ascending: false });
          break;
        case "most-downloaded":
          query = query.order("downloads", { ascending: false });
          break;
        default:
          query = query.order("created_at", { ascending: false });
      }

      const { data: wallpapers, error } = await query;
      if (error) throw error;
      if (!wallpapers?.length) return [];

      const ids = wallpapers.map((w) => w.id);

      // Fetch like counts
      const { data: likeCounts } = await supabase
        .from("wallpaper_likes")
        .select("wallpaper_id")
        .in("wallpaper_id", ids);

      // Fetch ratings
      const { data: ratings } = await supabase
        .from("wallpaper_ratings")
        .select("wallpaper_id, rating")
        .in("wallpaper_id", ids);

      // Fetch user's likes & ratings
      let userLikes: string[] = [];
      let userRatings: Record<string, number> = {};
      if (user) {
        const { data: ul } = await supabase
          .from("wallpaper_likes")
          .select("wallpaper_id")
          .eq("user_id", user.id)
          .in("wallpaper_id", ids);
        userLikes = (ul || []).map((l) => l.wallpaper_id);

        const { data: ur } = await supabase
          .from("wallpaper_ratings")
          .select("wallpaper_id, rating")
          .eq("user_id", user.id)
          .in("wallpaper_id", ids);
        (ur || []).forEach((r) => {
          userRatings[r.wallpaper_id] = r.rating;
        });
      }

      // Fetch creator profiles
      const userIds = [...new Set(wallpapers.map((w) => w.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, username, avatar_url")
        .in("user_id", userIds);
      const profileMap: Record<string, { username: string; avatar_url: string | null }> = {};
      (profiles || []).forEach((p) => {
        profileMap[p.user_id] = p;
      });

      // Aggregate
      const likeMap: Record<string, number> = {};
      (likeCounts || []).forEach((l) => {
        likeMap[l.wallpaper_id] = (likeMap[l.wallpaper_id] || 0) + 1;
      });

      const ratingMap: Record<string, { sum: number; count: number }> = {};
      (ratings || []).forEach((r) => {
        if (!ratingMap[r.wallpaper_id]) ratingMap[r.wallpaper_id] = { sum: 0, count: 0 };
        ratingMap[r.wallpaper_id].sum += r.rating;
        ratingMap[r.wallpaper_id].count += 1;
      });

      return wallpapers.map((w) => ({
        ...w,
        type: w.type as "mobile" | "desktop" | "4k",
        tags: w.tags || [],
        likes_count: likeMap[w.id] || 0,
        avg_rating: ratingMap[w.id]
          ? Math.round((ratingMap[w.id].sum / ratingMap[w.id].count) * 10) / 10
          : 0,
        user_liked: userLikes.includes(w.id),
        user_rating: userRatings[w.id] || 0,
        creator_name: profileMap[w.user_id]?.username || "Unknown",
        creator_avatar: profileMap[w.user_id]?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${w.user_id}`,
      })) as DbWallpaper[];
    },
  });
}

export function useWallpaper(id: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["wallpaper", id, user?.id],
    enabled: !!id,
    queryFn: async () => {
      const { data: w, error } = await supabase
        .from("wallpapers")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;

      const { data: likes } = await supabase
        .from("wallpaper_likes")
        .select("id")
        .eq("wallpaper_id", id!);

      const { data: ratings } = await supabase
        .from("wallpaper_ratings")
        .select("rating")
        .eq("wallpaper_id", id!);

      let userLiked = false;
      let userRating = 0;
      if (user) {
        const { data: ul } = await supabase
          .from("wallpaper_likes")
          .select("id")
          .eq("wallpaper_id", id!)
          .eq("user_id", user.id)
          .maybeSingle();
        userLiked = !!ul;

        const { data: ur } = await supabase
          .from("wallpaper_ratings")
          .select("rating")
          .eq("wallpaper_id", id!)
          .eq("user_id", user.id)
          .maybeSingle();
        userRating = ur?.rating || 0;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("user_id", w.user_id)
        .maybeSingle();

      const avgRating = ratings?.length
        ? Math.round((ratings.reduce((s, r) => s + r.rating, 0) / ratings.length) * 10) / 10
        : 0;

      return {
        ...w,
        type: w.type as "mobile" | "desktop" | "4k",
        tags: w.tags || [],
        likes_count: likes?.length || 0,
        avg_rating: avgRating,
        user_liked: userLiked,
        user_rating: userRating,
        creator_name: profile?.username || "Unknown",
        creator_avatar: profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${w.user_id}`,
      } as DbWallpaper;
    },
  });
}

export function useToggleLike() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ wallpaperId, liked }: { wallpaperId: string; liked: boolean }) => {
      if (!user) throw new Error("Must be signed in");
      if (liked) {
        await supabase
          .from("wallpaper_likes")
          .delete()
          .eq("wallpaper_id", wallpaperId)
          .eq("user_id", user.id);
      } else {
        await supabase
          .from("wallpaper_likes")
          .insert({ wallpaper_id: wallpaperId, user_id: user.id });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallpapers"] });
      queryClient.invalidateQueries({ queryKey: ["wallpaper"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useRateWallpaper() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ wallpaperId, rating }: { wallpaperId: string; rating: number }) => {
      if (!user) throw new Error("Must be signed in");
      await supabase
        .from("wallpaper_ratings")
        .upsert(
          { wallpaper_id: wallpaperId, user_id: user.id, rating },
          { onConflict: "wallpaper_id,user_id" }
        );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallpapers"] });
      queryClient.invalidateQueries({ queryKey: ["wallpaper"] });
      toast.success("Rating saved!");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUploadWallpaper() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      file,
      title,
      description,
      category,
      type,
      tags,
      resolution,
    }: {
      file: File;
      title: string;
      description: string;
      category: string;
      type: "mobile" | "desktop" | "4k";
      tags: string[];
      resolution: string;
    }) => {
      if (!user) throw new Error("Must be signed in");

      // Convert image to base64 for moderation
      const reader = new FileReader();
      const imageBase64: string = await new Promise((resolve) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });

      // Run AI moderation check
      const { data: modResult, error: modError } = await supabase.functions.invoke(
        "moderate-content",
        {
          body: { title, description, tags, imageBase64 },
        }
      );

      if (modError) {
        console.error("Moderation error:", modError);
        // Don't block on moderation service failure
      } else if (modResult && !modResult.approved) {
        const violationDetails = modResult.violations
          .map((v: any) => `• ${v.details} (${v.type})`)
          .join("\n");
        throw new Error(
          `Your upload was rejected by our content moderation system:\n${violationDetails}`
        );
      }

      const ext = file.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("wallpapers")
        .upload(path, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("wallpapers")
        .getPublicUrl(path);

      const { error: insertError } = await supabase.from("wallpapers").insert({
        user_id: user.id,
        title,
        description,
        image_url: urlData.publicUrl,
        category,
        type,
        tags,
        resolution,
      });
      if (insertError) throw insertError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallpapers"] });
      toast.success("Wallpaper uploaded!");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
