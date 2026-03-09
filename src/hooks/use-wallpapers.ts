import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
}

export function useWallpapers(filters?: {
  category?: string;
  type?: string;
  search?: string;
  sortBy?: string;
}) {
  return useQuery({
    queryKey: ["wallpapers", filters],
    queryFn: async () => {
      let query = supabase.from("wallpapers").select("*");

      if (filters?.category && filters.category !== "All") {
        query = query.eq("category", filters.category);
      }
      if (filters?.type && filters.type !== "All") {
        query = query.eq("type", filters.type);
      }
      if (filters?.search) {
        const q = `%${filters.search}%`;
        query = query.or(`title.ilike.${q},description.ilike.${q}`);
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

      return (wallpapers || []).map((w) => ({
        ...w,
        type: w.type as "mobile" | "desktop" | "4k",
        tags: w.tags || [],
      })) as DbWallpaper[];
    },
  });
}

export function useWallpaper(id: string | undefined) {
  return useQuery({
    queryKey: ["wallpaper", id],
    enabled: !!id,
    queryFn: async () => {
      const { data: w, error } = await supabase
        .from("wallpapers")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;

      return {
        ...w,
        type: w.type as "mobile" | "desktop" | "4k",
        tags: w.tags || [],
      } as DbWallpaper;
    },
  });
}

export function useAdminUploadWallpaper() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file,
      title,
      description,
      category,
      type,
      tags,
      resolution,
      adminEmail,
      adminPassword,
    }: {
      file: File;
      title: string;
      description: string;
      category: string;
      type: "mobile" | "desktop" | "4k";
      tags: string[];
      resolution: string;
      adminEmail: string;
      adminPassword: string;
    }) => {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: adminPassword,
      });
      if (authError || !authData.user) throw new Error("Admin authentication failed");

      const ext = file.name.split(".").pop();
      const path = `${authData.user.id}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("wallpapers")
        .upload(path, file, { contentType: file.type });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("wallpapers")
        .getPublicUrl(path);

      const { error: insertError } = await supabase.from("wallpapers").insert({
        user_id: authData.user.id,
        title,
        description,
        image_url: urlData.publicUrl,
        category,
        type,
        tags,
        resolution,
      });
      if (insertError) throw insertError;

      await supabase.auth.signOut();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallpapers"] });
      toast.success("Wallpaper uploaded!");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
