-- Create fraud_alerts table for incoming call/email/message fraud detection
CREATE TABLE IF NOT EXISTS fraud_alerts (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  alert_type VARCHAR(50) NOT NULL CHECK (alert_type IN ('call', 'email', 'message')),
  sender VARCHAR(255) NOT NULL,
  content TEXT,
  risk_level VARCHAR(50) NOT NULL CHECK (risk_level IN ('safe', 'warning', 'dangerous')),
  indicators TEXT[] DEFAULT '{}',
  ai_analysis TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_fraud_alerts_user_id ON fraud_alerts(user_id);
CREATE INDEX idx_fraud_alerts_created_at ON fraud_alerts(created_at DESC);
CREATE INDEX idx_fraud_alerts_risk_level ON fraud_alerts(risk_level);

-- Create extension_settings table for browser extension configuration
CREATE TABLE IF NOT EXISTS extension_settings (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  extension_enabled BOOLEAN DEFAULT TRUE,
  auto_scan BOOLEAN DEFAULT TRUE,
  block_suspicious BOOLEAN DEFAULT TRUE,
  notifications BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index
CREATE INDEX idx_extension_settings_user_id ON extension_settings(user_id);

-- Enable RLS for fraud_alerts
ALTER TABLE fraud_alerts ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for fraud_alerts (users can only see their own alerts)
CREATE POLICY fraud_alerts_rls ON fraud_alerts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY fraud_alerts_insert ON fraud_alerts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Enable RLS for extension_settings
ALTER TABLE extension_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for extension_settings
CREATE POLICY extension_settings_rls ON extension_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY extension_settings_update ON extension_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY extension_settings_insert ON extension_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);
