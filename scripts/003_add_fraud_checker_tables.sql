-- Create fraud_checker_history table to store all checks
CREATE TABLE IF NOT EXISTS fraud_checker_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  check_type VARCHAR(50) NOT NULL, -- 'url', 'phone', 'qr', 'whatsapp'
  input_value TEXT NOT NULL,
  fraud_score DECIMAL(3,2) NOT NULL,
  risk_level VARCHAR(20) NOT NULL, -- 'safe', 'low', 'medium', 'high', 'critical'
  indicators TEXT[] NOT NULL,
  ai_analysis TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE fraud_checker_history ENABLE ROW LEVEL SECURITY;

-- Create policy so users can only see their own checks
CREATE POLICY "Users can view own fraud checks" ON fraud_checker_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create fraud checks" ON fraud_checker_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_fraud_checker_user_id ON fraud_checker_history(user_id);
CREATE INDEX idx_fraud_checker_created_at ON fraud_checker_history(created_at DESC);
