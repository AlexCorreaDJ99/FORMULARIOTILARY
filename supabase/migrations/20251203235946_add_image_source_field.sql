/*
  # Add Image Source Selection Field

  ## Changes Made
  
  1. New Column in `app_forms` table:
    - `image_source` (text) - Source of images: 'tilary' or 'custom'
  
  ## Purpose
  Allow clients to choose between using Tilary's default images or uploading their own custom images.
*/

-- Add image_source column to app_forms table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'app_forms' AND column_name = 'image_source'
  ) THEN
    ALTER TABLE app_forms ADD COLUMN image_source text CHECK (image_source IN ('tilary', 'custom')) DEFAULT 'custom';
  END IF;
END $$;