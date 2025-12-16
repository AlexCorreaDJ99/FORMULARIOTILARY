/*
  # Create Admin Activity Logs System

  1. New Tables
    - `admin_activity_logs` - Registra todas as ações dos administradores
      - `id` (uuid, primary key)
      - `admin_id` (uuid) - Referência ao admin que fez a ação
      - `admin_name` (text) - Nome do admin (denormalizado para histórico)
      - `admin_email` (text) - Email do admin (denormalizado para histórico)
      - `action_type` (text) - Tipo de ação realizada
      - `action_description` (text) - Descrição detalhada da ação
      - `target_type` (text) - Tipo de entidade afetada (client, form, admin, etc)
      - `target_id` (uuid) - ID da entidade afetada
      - `target_name` (text) - Nome da entidade afetada
      - `metadata` (jsonb) - Dados adicionais da ação
      - `created_at` (timestamptz) - Quando a ação foi realizada

  2. Security
    - Enable RLS on `admin_activity_logs` table
    - Only admins can read logs
    - Logs are inserted automatically via triggers

  3. Indexes
    - Index on admin_id for fast lookups
    - Index on created_at for date filtering
    - Index on action_type for filtering by type
*/

-- Create admin_activity_logs table
CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL,
  admin_name text NOT NULL,
  admin_email text NOT NULL,
  action_type text NOT NULL,
  action_description text NOT NULL,
  target_type text,
  target_id uuid,
  target_name text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_activity_logs
CREATE POLICY "Admins can view all activity logs"
  ON admin_activity_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "System can insert activity logs"
  ON admin_activity_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_admin_id ON admin_activity_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_created_at ON admin_activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_action_type ON admin_activity_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_target_id ON admin_activity_logs(target_id);

-- Create function to log admin actions
CREATE OR REPLACE FUNCTION log_admin_action(
  p_action_type text,
  p_action_description text,
  p_target_type text DEFAULT NULL,
  p_target_id uuid DEFAULT NULL,
  p_target_name text DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_admin_id uuid;
  v_admin_name text;
  v_admin_email text;
  v_log_id uuid;
BEGIN
  -- Get current user info
  SELECT id INTO v_admin_id FROM auth.users WHERE id = auth.uid();
  
  IF v_admin_id IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;

  -- Get admin profile info
  SELECT name, email INTO v_admin_name, v_admin_email
  FROM profiles
  WHERE id = v_admin_id;

  -- Insert log
  INSERT INTO admin_activity_logs (
    admin_id,
    admin_name,
    admin_email,
    action_type,
    action_description,
    target_type,
    target_id,
    target_name,
    metadata
  ) VALUES (
    v_admin_id,
    v_admin_name,
    v_admin_email,
    p_action_type,
    p_action_description,
    p_target_type,
    p_target_id,
    p_target_name,
    p_metadata
  )
  RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$$;