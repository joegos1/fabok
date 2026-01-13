-- Update schools table with location fields
ALTER TABLE public.schools 
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS province TEXT,
ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add comment for documentation
COMMENT ON COLUMN public.schools.province IS 'Dutch province for filtering (e.g., Friesland, Groningen, Drenthe)';
