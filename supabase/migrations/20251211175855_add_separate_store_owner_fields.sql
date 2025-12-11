/*
  # Adicionar campos separados para lojas Play Store e App Store

  1. Alterações
    - Remove o campo único `store_owner` da tabela `app_forms`
    - Adiciona campo `play_store_owner` (text) para indicar se a Play Store será da Tilary ou do cliente
    - Adiciona campo `app_store_owner` (text) para indicar se a App Store será da Tilary ou do cliente
  
  2. Notas
    - Valores possíveis: 'tilary', 'client', ou NULL
    - Permite configuração independente para cada loja
    - Mantém compatibilidade com dados existentes
*/

DO $$
BEGIN
  -- Adiciona campo play_store_owner se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'app_forms' AND column_name = 'play_store_owner'
  ) THEN
    ALTER TABLE app_forms ADD COLUMN play_store_owner text;
  END IF;

  -- Adiciona campo app_store_owner se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'app_forms' AND column_name = 'app_store_owner'
  ) THEN
    ALTER TABLE app_forms ADD COLUMN app_store_owner text;
  END IF;

  -- Migra dados existentes do campo store_owner para os novos campos
  UPDATE app_forms 
  SET 
    play_store_owner = store_owner,
    app_store_owner = store_owner
  WHERE store_owner IS NOT NULL;

  -- Remove o campo antigo store_owner se existir
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'app_forms' AND column_name = 'store_owner'
  ) THEN
    ALTER TABLE app_forms DROP COLUMN store_owner;
  END IF;
END $$;