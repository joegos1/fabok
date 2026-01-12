-- Migratie: Social media links toevoegen aan projects tabel
-- Voer dit script uit in de Supabase SQL Editor

ALTER TABLE projects
ADD COLUMN IF NOT EXISTS website_url TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS linkedin_url TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS facebook_url TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS instagram_url TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS x_url TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS youtube_url TEXT DEFAULT NULL;

-- Optioneel: Voeg commentaar toe aan de kolommen voor documentatie
COMMENT ON COLUMN projects.website_url IS 'Project website URL';
COMMENT ON COLUMN projects.linkedin_url IS 'LinkedIn pagina URL';
COMMENT ON COLUMN projects.facebook_url IS 'Facebook pagina URL';
COMMENT ON COLUMN projects.instagram_url IS 'Instagram account URL';
COMMENT ON COLUMN projects.x_url IS 'X/Twitter account URL';
COMMENT ON COLUMN projects.youtube_url IS 'YouTube kanaal URL';
