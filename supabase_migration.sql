-- =====================================================
-- PROJECT IMAGES TABLE
-- =====================================================
-- Tabel voor het opslaan van afbeeldingen per project
-- Afbeeldingen worden gebruikt in de uitgebreide beschrijving

CREATE TABLE IF NOT EXISTS project_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  filename TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Index voor snellere queries
CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON project_images(project_id);
CREATE INDEX IF NOT EXISTS idx_project_images_display_order ON project_images(project_id, display_order);

-- RLS policies voor project_images
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;

-- Iedereen kan afbeeldingen van gepubliceerde projecten lezen
CREATE POLICY "Public can view images of published projects" ON project_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_images.project_id 
      AND projects.is_published = true
    )
  );

-- Eigenaren en admins kunnen afbeeldingen van hun eigen projecten lezen
CREATE POLICY "Owners can view their project images" ON project_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      JOIN profiles ON profiles.id = projects.owner_id
      WHERE projects.id = project_images.project_id 
      AND (
        profiles.id = auth.uid() 
        OR profiles.role = 'admin'
      )
    )
  );

-- Eigenaren en admins kunnen afbeeldingen uploaden
CREATE POLICY "Owners can upload images" ON project_images
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      JOIN profiles ON profiles.id = projects.owner_id
      WHERE projects.id = project_images.project_id 
      AND (
        profiles.id = auth.uid() 
        OR profiles.role = 'admin'
      )
    )
  );

-- Eigenaren en admins kunnen afbeeldingen verwijderen
CREATE POLICY "Owners can delete images" ON project_images
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM projects 
      JOIN profiles ON profiles.id = projects.owner_id
      WHERE projects.id = project_images.project_id 
      AND (
        profiles.id = auth.uid() 
        OR profiles.role = 'admin'
      )
    )
  );

-- =====================================================
-- STORAGE BUCKET VOOR PROJECT IMAGES
-- =====================================================
-- Maak storage bucket aan voor project afbeeldingen

INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies voor project-images bucket
CREATE POLICY "Public can view project images" ON storage.objects
  FOR SELECT USING (bucket_id = 'project-images');

CREATE POLICY "Authenticated users can upload project images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'project-images' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can delete their own project images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'project-images' 
    AND auth.role() = 'authenticated'
  );
