
-- Wallpapers table
CREATE TABLE public.wallpapers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  image_url text NOT NULL,
  category text NOT NULL DEFAULT 'Other',
  resolution text NOT NULL DEFAULT '1920x1080',
  type text NOT NULL DEFAULT 'desktop' CHECK (type IN ('mobile', 'desktop', '4k')),
  tags text[] DEFAULT '{}',
  downloads integer NOT NULL DEFAULT 0,
  featured boolean NOT NULL DEFAULT false,
  trending boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Wallpaper likes table
CREATE TABLE public.wallpaper_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallpaper_id uuid NOT NULL REFERENCES public.wallpapers(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(wallpaper_id, user_id)
);

-- Wallpaper ratings table
CREATE TABLE public.wallpaper_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallpaper_id uuid NOT NULL REFERENCES public.wallpapers(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(wallpaper_id, user_id)
);

-- Enable RLS
ALTER TABLE public.wallpapers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallpaper_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallpaper_ratings ENABLE ROW LEVEL SECURITY;

-- Wallpapers policies
CREATE POLICY "Wallpapers are viewable by everyone" ON public.wallpapers FOR SELECT USING (true);
CREATE POLICY "Authenticated users can upload wallpapers" ON public.wallpapers FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own wallpapers" ON public.wallpapers FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own wallpapers" ON public.wallpapers FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Likes policies
CREATE POLICY "Likes are viewable by everyone" ON public.wallpaper_likes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can like" ON public.wallpaper_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike" ON public.wallpaper_likes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Ratings policies
CREATE POLICY "Ratings are viewable by everyone" ON public.wallpaper_ratings FOR SELECT USING (true);
CREATE POLICY "Authenticated users can rate" ON public.wallpaper_ratings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their rating" ON public.wallpaper_ratings FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Storage bucket for wallpaper images
INSERT INTO storage.buckets (id, name, public) VALUES ('wallpapers', 'wallpapers', true);

-- Storage policies
CREATE POLICY "Anyone can view wallpaper images" ON storage.objects FOR SELECT USING (bucket_id = 'wallpapers');
CREATE POLICY "Authenticated users can upload wallpaper images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'wallpapers');
CREATE POLICY "Users can delete their own wallpaper images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'wallpapers' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Enable realtime for likes/ratings counts
ALTER PUBLICATION supabase_realtime ADD TABLE public.wallpaper_likes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.wallpaper_ratings;
