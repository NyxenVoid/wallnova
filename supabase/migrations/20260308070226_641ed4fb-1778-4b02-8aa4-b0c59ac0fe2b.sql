
CREATE TABLE public.content_violations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  wallpaper_id uuid REFERENCES public.wallpapers(id) ON DELETE SET NULL,
  violation_type text NOT NULL,
  severity text NOT NULL DEFAULT 'warning',
  details text,
  content_snippet text,
  ai_confidence numeric,
  reviewed boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.content_violations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own violations" ON public.content_violations
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert violations" ON public.content_violations
  FOR INSERT WITH CHECK (true);

CREATE INDEX idx_violations_user ON public.content_violations(user_id);
CREATE INDEX idx_violations_created ON public.content_violations(created_at DESC);
