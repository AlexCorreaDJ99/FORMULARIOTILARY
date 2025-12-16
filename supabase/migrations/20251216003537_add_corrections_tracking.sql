/*
  # Add Corrections Tracking System

  1. New Fields in app_forms
    - `corrections_completed` (boolean) - Marca se o cliente completou as correções solicitadas
    - `corrections_completed_at` (timestamptz) - Quando o cliente marcou como feito
    - `admin_notified_of_changes` (boolean) - Se o admin foi notificado das mudanças
    - `last_client_update` (timestamptz) - Última vez que o cliente atualizou o formulário

  2. Changes
    - Adiciona campos para rastreamento de correções
    - Permite sistema detectar quando cliente fez mudanças
    - Permite admin ser notificado de atualizações

  3. Security
    - RLS já está habilitado na tabela app_forms
    - Campos acessíveis tanto por cliente quanto admin
*/

-- Add new columns to app_forms
ALTER TABLE app_forms 
ADD COLUMN IF NOT EXISTS corrections_completed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS corrections_completed_at timestamptz,
ADD COLUMN IF NOT EXISTS admin_notified_of_changes boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS last_client_update timestamptz DEFAULT now();

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_corrections_completed ON app_forms(corrections_completed);
CREATE INDEX IF NOT EXISTS idx_admin_notified ON app_forms(admin_notified_of_changes);