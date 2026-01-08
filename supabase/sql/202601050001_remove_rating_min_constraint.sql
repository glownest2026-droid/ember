-- Remove any minimum rating constraint if it exists
-- This migration ensures rating can be 0-5 (no minimum >= 4 requirement)

-- Check if there's a constraint requiring rating >= 4 and drop it
DO $$
DECLARE
    constraint_name TEXT;
BEGIN
    -- Find any check constraints on products.rating that require >= 4
    SELECT conname INTO constraint_name
    FROM pg_constraint
    WHERE conrelid = 'public.products'::regclass
    AND contype = 'c'
    AND pg_get_constraintdef(oid) LIKE '%rating%>=%4%';
    
    IF constraint_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.products DROP CONSTRAINT IF EXISTS ' || quote_ident(constraint_name);
        RAISE NOTICE 'Dropped constraint: %', constraint_name;
    ELSE
        RAISE NOTICE 'No constraint found requiring rating >= 4';
    END IF;
END $$;

-- Ensure the rating check constraint allows 0-5 (idempotent)
-- Drop existing constraint if it exists and recreate
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_rating_check;
ALTER TABLE public.products ADD CONSTRAINT products_rating_check 
    CHECK (rating IS NULL OR (rating >= 0 AND rating <= 5));

