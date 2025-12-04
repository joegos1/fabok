-- =====================================================
-- VABOK Database Schema
-- =====================================================
-- Voer dit script uit in de Supabase SQL Editor
-- Ga naar: Supabase Dashboard > SQL Editor > New Query
-- =====================================================

-- Enable UUID extensie (meestal al ingeschakeld)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. ENUM TYPES
-- =====================================================

-- User roles enum
CREATE TYPE user_role AS ENUM ('admin', 'landingpage_editor', 'project_editor', 'viewer');

-- Project status enum
CREATE TYPE project_status AS ENUM ('active', 'archived');

-- =====================================================
-- 2. PROFILES TABLE
-- =====================================================
-- Uitbreiding op auth.users met extra metadata en rollen

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    role user_role NOT NULL DEFAULT 'viewer',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index voor snelle lookups
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);

-- Trigger om updated_at automatisch te updaten
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Automatisch profiel aanmaken bij nieuwe auth.users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        'viewer'  -- Standaard rol
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- 3. PROJECTS TABLE
-- =====================================================
-- VABOK projecten

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    short_description TEXT,
    full_description TEXT,
    goals TEXT,
    target_audience TEXT,
    contact_person TEXT,
    tags TEXT[] DEFAULT '{}',
    status project_status NOT NULL DEFAULT 'active',
    owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_owner_id ON projects(owner_id);
CREATE INDEX idx_projects_tags ON projects USING GIN(tags);

-- Updated at trigger
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 4. LANDING PAGE CONTENT TABLE
-- =====================================================
-- Enkele rij voor de landingspagina content

CREATE TABLE landing_page_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL DEFAULT 'VABOK',
    intro TEXT,
    body TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES profiles(id)
);

-- Trigger voor updated_at
CREATE TRIGGER update_landing_page_updated_at
    BEFORE UPDATE ON landing_page_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default content
INSERT INTO landing_page_content (title, intro, body)
VALUES (
    'VABOK - Versterken van de Aansluiting in de Beroepskolom',
    'Welkom bij VABOK, het platform voor informatie over onderwijsprojecten die de aansluiting in de beroepskolom versterken.',
    'VABOK staat voor "Versterken van de Aansluiting in de Beroepskolom". Op deze site vindt u informatie over lopende projecten, hun doelen en resultaten. Docenten, projectleiders en beleidsmakers kunnen hier terecht voor actuele informatie en documentatie over VABOK-projecten.'
);

-- =====================================================
-- 5. PDF FILES TABLE
-- =====================================================
-- Referenties naar geüploade PDF's

CREATE TABLE pdf_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    is_landing_page BOOLEAN NOT NULL DEFAULT FALSE,
    url TEXT NOT NULL,
    filename TEXT NOT NULL,
    file_size BIGINT,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    uploaded_by UUID NOT NULL REFERENCES profiles(id)
);

-- Indexes
CREATE INDEX idx_pdf_files_project_id ON pdf_files(project_id);
CREATE INDEX idx_pdf_files_is_landing_page ON pdf_files(is_landing_page);
CREATE INDEX idx_pdf_files_uploaded_at ON pdf_files(uploaded_at DESC);

-- Constraint: een PDF is of voor een project of voor de landingpage
ALTER TABLE pdf_files 
ADD CONSTRAINT check_pdf_context 
CHECK (
    (project_id IS NOT NULL AND is_landing_page = FALSE) OR
    (project_id IS NULL AND is_landing_page = TRUE)
);

-- =====================================================
-- 6. AUDIT LOG TABLE
-- =====================================================
-- Optionele audit logging voor belangrijke acties

CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index voor snelle queries
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_table_name ON audit_log(table_name);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at DESC);

-- =====================================================
-- 7. HELPER FUNCTIONS
-- =====================================================

-- Functie om de rol van een gebruiker op te halen
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS user_role AS $$
DECLARE
    user_role_val user_role;
BEGIN
    SELECT role INTO user_role_val
    FROM profiles
    WHERE id = user_id;
    
    RETURN COALESCE(user_role_val, 'viewer');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Functie om te checken of gebruiker admin is
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_user_role(user_id) = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Functie om te checken of gebruiker project eigenaar is
CREATE OR REPLACE FUNCTION is_project_owner(user_id UUID, proj_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    owner UUID;
BEGIN
    SELECT owner_id INTO owner FROM projects WHERE id = proj_id;
    RETURN owner = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 8. ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS op alle tabellen
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdf_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- ----- PROFILES POLICIES -----

-- Iedereen kan profielen lezen (nodig voor weergave contactpersonen etc.)
CREATE POLICY "Profiles zijn leesbaar voor geauthenticeerde gebruikers"
ON profiles FOR SELECT
TO authenticated
USING (true);

-- Gebruikers kunnen alleen hun eigen profiel updaten (behalve rol)
CREATE POLICY "Gebruikers kunnen eigen profiel updaten"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Alleen admins kunnen rollen wijzigen (via supabaseAdmin in de app)

-- ----- PROJECTS POLICIES -----

-- Iedereen (ook anoniem) kan actieve projecten lezen
CREATE POLICY "Actieve projecten zijn publiek leesbaar"
ON projects FOR SELECT
USING (status = 'active');

-- Gearchiveerde projecten zijn alleen zichtbaar voor admins
CREATE POLICY "Gearchiveerde projecten zichtbaar voor admins"
ON projects FOR SELECT
TO authenticated
USING (
    status = 'archived' AND is_admin(auth.uid())
);

-- Alleen admins kunnen projecten aanmaken
CREATE POLICY "Alleen admins kunnen projecten aanmaken"
ON projects FOR INSERT
TO authenticated
WITH CHECK (is_admin(auth.uid()));

-- Admins kunnen alle projecten updaten, project_editors alleen hun eigen
CREATE POLICY "Project update door admin of eigenaar"
ON projects FOR UPDATE
TO authenticated
USING (
    is_admin(auth.uid()) OR 
    (get_user_role(auth.uid()) = 'project_editor' AND owner_id = auth.uid())
)
WITH CHECK (
    is_admin(auth.uid()) OR 
    (get_user_role(auth.uid()) = 'project_editor' AND owner_id = auth.uid())
);

-- Alleen admins kunnen projecten verwijderen
CREATE POLICY "Alleen admins kunnen projecten verwijderen"
ON projects FOR DELETE
TO authenticated
USING (is_admin(auth.uid()));

-- ----- LANDING PAGE CONTENT POLICIES -----

-- Iedereen kan landingpage lezen
CREATE POLICY "Landingpage is publiek leesbaar"
ON landing_page_content FOR SELECT
USING (true);

-- Alleen admins en landingpage_editors kunnen updaten
CREATE POLICY "Landingpage update door admin of landingpage_editor"
ON landing_page_content FOR UPDATE
TO authenticated
USING (
    is_admin(auth.uid()) OR 
    get_user_role(auth.uid()) = 'landingpage_editor'
)
WITH CHECK (
    is_admin(auth.uid()) OR 
    get_user_role(auth.uid()) = 'landingpage_editor'
);

-- ----- PDF FILES POLICIES -----

-- Iedereen kan PDF's van actieve projecten en landingpage lezen
CREATE POLICY "PDF's zijn publiek leesbaar"
ON pdf_files FOR SELECT
USING (
    is_landing_page = true OR
    EXISTS (
        SELECT 1 FROM projects 
        WHERE projects.id = pdf_files.project_id 
        AND projects.status = 'active'
    )
);

-- PDF upload voor landingpage door admin of landingpage_editor
CREATE POLICY "PDF upload landingpage"
ON pdf_files FOR INSERT
TO authenticated
WITH CHECK (
    (is_landing_page = true AND (
        is_admin(auth.uid()) OR 
        get_user_role(auth.uid()) = 'landingpage_editor'
    )) OR
    (is_landing_page = false AND project_id IS NOT NULL AND (
        is_admin(auth.uid()) OR 
        (get_user_role(auth.uid()) = 'project_editor' AND is_project_owner(auth.uid(), project_id))
    ))
);

-- PDF verwijderen volgt zelfde regels als upload
CREATE POLICY "PDF verwijderen"
ON pdf_files FOR DELETE
TO authenticated
USING (
    (is_landing_page = true AND (
        is_admin(auth.uid()) OR 
        get_user_role(auth.uid()) = 'landingpage_editor'
    )) OR
    (is_landing_page = false AND project_id IS NOT NULL AND (
        is_admin(auth.uid()) OR 
        (get_user_role(auth.uid()) = 'project_editor' AND is_project_owner(auth.uid(), project_id))
    ))
);

-- ----- AUDIT LOG POLICIES -----

-- Alleen admins kunnen audit log lezen
CREATE POLICY "Audit log leesbaar voor admins"
ON audit_log FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));

-- Audit log entries worden aangemaakt via de app (service role)

-- =====================================================
-- 9. STORAGE BUCKET
-- =====================================================
-- Voer dit uit om een storage bucket voor PDF's aan te maken

INSERT INTO storage.buckets (id, name, public)
VALUES ('pdfs', 'pdfs', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies voor PDF bucket
CREATE POLICY "PDF's zijn publiek downloadbaar"
ON storage.objects FOR SELECT
USING (bucket_id = 'pdfs');

CREATE POLICY "Geauthenticeerde gebruikers kunnen PDF's uploaden"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'pdfs' AND
    (storage.extension(name) = 'pdf')
);

CREATE POLICY "Geauthenticeerde gebruikers kunnen hun uploads verwijderen"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'pdfs');

-- =====================================================
-- DONE!
-- =====================================================
-- Na het uitvoeren van dit script:
-- 1. Maak een admin gebruiker aan via Supabase Auth
-- 2. Update de rol in profiles naar 'admin':
--    UPDATE profiles SET role = 'admin' WHERE email = 'admin@example.com';
