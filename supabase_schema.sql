-- ============================================
-- OmniFlow Cloud Database Schema
-- Supabase SQL Editor'da çalıştırın
-- ============================================

-- 1. BLUEPRINTS TABLE
CREATE TABLE IF NOT EXISTS blueprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  master_goal TEXT,
  nodes JSONB NOT NULL DEFAULT '[]',
  base_knowledge TEXT,
  category TEXT DEFAULT 'custom',
  version INTEGER DEFAULT 1,
  test_config JSONB,
  
  -- Cloud özellikleri
  is_active BOOLEAN DEFAULT true,
  schedule_cron TEXT,
  notify_on TEXT[] DEFAULT ARRAY['error'],
  last_run TIMESTAMPTZ,
  last_result TEXT,
  run_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. EXECUTION LOGS TABLE
CREATE TABLE IF NOT EXISTS execution_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blueprint_id UUID REFERENCES blueprints(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  status TEXT DEFAULT 'running', -- 'running', 'success', 'error'
  node_results JSONB,
  error_message TEXT,
  duration_ms INTEGER
);

-- 3. NOTIFICATION SETTINGS TABLE
CREATE TABLE IF NOT EXISTS notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  channel TEXT NOT NULL, -- 'telegram', 'whatsapp', 'email', 'discord', 'slack'
  config JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. INDEXES
CREATE INDEX IF NOT EXISTS idx_blueprints_user ON blueprints(user_id);
CREATE INDEX IF NOT EXISTS idx_blueprints_active ON blueprints(is_active);
CREATE INDEX IF NOT EXISTS idx_execution_logs_blueprint ON execution_logs(blueprint_id);
CREATE INDEX IF NOT EXISTS idx_execution_logs_status ON execution_logs(status);

-- 5. ROW LEVEL SECURITY (RLS)
ALTER TABLE blueprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE execution_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Herkes okuyabilir/yazabilir (demo için)
-- Prod'da user_id kontrolü ekleyin!
CREATE POLICY "Allow all for blueprints" ON blueprints
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for execution_logs" ON execution_logs
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for notification_settings" ON notification_settings
  FOR ALL USING (true) WITH CHECK (true);

-- 6. UPDATED_AT TRIGGER
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blueprints_updated_at
  BEFORE UPDATE ON blueprints
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 7. SAMPLE DATA (Test için)
-- Aşağıdaki satırları kaldırabilirsiniz
INSERT INTO blueprints (id, name, description, master_goal, nodes, category, is_active)
VALUES (
  'demo-001',
  'Demo Otomasyon',
  'Test amaçlı demo blueprint',
  'Sistem testlerini çalıştır',
  '[{"id": "node-1", "type": "planner", "title": "Test Planner", "role": "Koordinatör", "task": "Test görevlerini planla", "connections": [], "status": "idle"}]'::jsonb,
  'demo',
  true
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- SETUP COMPLETE!
-- ============================================
