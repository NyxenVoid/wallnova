
-- Drop all restrictive policies on wallpapers and recreate as permissive
DROP POLICY IF EXISTS "Wallpapers are viewable by everyone" ON public.wallpapers;
DROP POLICY IF EXISTS "Authenticated users can upload wallpapers" ON public.wallpapers;
DROP POLICY IF EXISTS "Users can update their own wallpapers" ON public.wallpapers;
DROP POLICY IF EXISTS "Users can delete their own wallpapers" ON public.wallpapers;

CREATE POLICY "Wallpapers are viewable by everyone" ON public.wallpapers FOR SELECT USING (true);
CREATE POLICY "Authenticated users can upload wallpapers" ON public.wallpapers FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own wallpapers" ON public.wallpapers FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own wallpapers" ON public.wallpapers FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Fix profiles too
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Fix wallpaper_likes too
DROP POLICY IF EXISTS "Likes are viewable by everyone" ON public.wallpaper_likes;
DROP POLICY IF EXISTS "Authenticated users can like" ON public.wallpaper_likes;
DROP POLICY IF EXISTS "Users can unlike" ON public.wallpaper_likes;

CREATE POLICY "Likes are viewable by everyone" ON public.wallpaper_likes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can like" ON public.wallpaper_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike" ON public.wallpaper_likes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Fix wallpaper_ratings too
DROP POLICY IF EXISTS "Ratings are viewable by everyone" ON public.wallpaper_ratings;
DROP POLICY IF EXISTS "Authenticated users can rate" ON public.wallpaper_ratings;
DROP POLICY IF EXISTS "Users can update their rating" ON public.wallpaper_ratings;

CREATE POLICY "Ratings are viewable by everyone" ON public.wallpaper_ratings FOR SELECT USING (true);
CREATE POLICY "Authenticated users can rate" ON public.wallpaper_ratings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their rating" ON public.wallpaper_ratings FOR UPDATE TO authenticated USING (auth.uid() = user_id);
