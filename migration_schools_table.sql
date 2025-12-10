-- ============================================
-- VABOK School Marquee Migration
-- ============================================
-- This migration adds a schools table to store
-- the list of schools shown in the landing page marquee
--
-- Date: December 10, 2025
-- ============================================

-- Create schools table
CREATE TABLE IF NOT EXISTS public.schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add index for ordering
CREATE INDEX IF NOT EXISTS idx_schools_display_order 
  ON public.schools(display_order);

-- Enable Row Level Security (RLS)
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view schools
CREATE POLICY "Schools are viewable by everyone"
  ON public.schools
  FOR SELECT
  USING (true);

-- Policy: Only admin and landingpage_editor can insert schools
CREATE POLICY "Only admins and landingpage editors can insert schools"
  ON public.schools
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'landingpage_editor')
    )
  );

-- Policy: Only admin and landingpage_editor can update schools
CREATE POLICY "Only admins and landingpage editors can update schools"
  ON public.schools
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'landingpage_editor')
    )
  );

-- Policy: Only admin and landingpage_editor can delete schools
CREATE POLICY "Only admins and landingpage editors can delete schools"
  ON public.schools
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'landingpage_editor')
    )
  );

-- Insert some example schools (optional - remove if not needed)
INSERT INTO public.schools (name, display_order) VALUES
  ('ROC Friese Poort', 0),
  ('NHL Stenden Hogeschool', 1),
  ('Firda', 2),
  ('Van Hall Larenstein', 3),
  ('Nordwin College', 4)
ON CONFLICT DO NOTHING;

-- ============================================
-- End of migration
-- ============================================

COMMIT;
