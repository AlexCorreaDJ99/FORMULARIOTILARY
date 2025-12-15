/*
  # Sistema de Revisão de Formulários

  1. Novos Campos
    - `review_status` (text): Status da revisão - 'pending', 'approved', 'rejected'
    - `review_feedback` (text): Comentários sobre o que precisa ser corrigido
    - `reviewed_at` (timestamptz): Data e hora da revisão
    - `reviewed_by` (uuid): ID do administrador que fez a revisão
    - `images_uploaded` (boolean): Flag indicando se as imagens foram enviadas

  2. Funcionalidade
    - Permite admin revisar e invalidar formulários
    - Cliente recebe feedback sobre o que precisa corrigir
    - Progresso é recalculado quando formulário é rejeitado
*/

-- Adiciona campos de revisão na tabela app_forms
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'app_forms' AND column_name = 'review_status'
  ) THEN
    ALTER TABLE app_forms ADD COLUMN review_status text DEFAULT 'pending';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'app_forms' AND column_name = 'review_feedback'
  ) THEN
    ALTER TABLE app_forms ADD COLUMN review_feedback text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'app_forms' AND column_name = 'reviewed_at'
  ) THEN
    ALTER TABLE app_forms ADD COLUMN reviewed_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'app_forms' AND column_name = 'reviewed_by'
  ) THEN
    ALTER TABLE app_forms ADD COLUMN reviewed_by uuid REFERENCES profiles(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'app_forms' AND column_name = 'images_uploaded'
  ) THEN
    ALTER TABLE app_forms ADD COLUMN images_uploaded boolean DEFAULT false;
  END IF;
END $$;

-- Adiciona índice para melhorar performance de queries
CREATE INDEX IF NOT EXISTS idx_app_forms_review_status ON app_forms(review_status);
CREATE INDEX IF NOT EXISTS idx_app_forms_reviewed_by ON app_forms(reviewed_by);