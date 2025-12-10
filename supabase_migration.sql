-- Add account_status column to profiles
ALTER TABLE public.profiles 
ADD COLUMN account_status text NOT NULL DEFAULT 'pending' 
CHECK (account_status IN ('pending', 'approved', 'rejected'));

-- Remove NOT NULL constraint from role and remove default value
ALTER TABLE public.profiles 
ALTER COLUMN role DROP NOT NULL,
ALTER COLUMN role DROP DEFAULT;

-- Update existing users to approved
UPDATE public.profiles 
SET account_status = 'approved' 
WHERE account_status = 'pending'; -- This ensures we only update if we just added the column (though default is pending, so all existing rows get pending initially)

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_account_status ON public.profiles(account_status);
