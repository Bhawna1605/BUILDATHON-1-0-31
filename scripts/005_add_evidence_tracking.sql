-- Evidence and methodology tracking tables
CREATE TABLE IF NOT EXISTS evidence_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fraud_check_id TEXT,
  evidence_type TEXT NOT NULL, -- 'url', 'phone', 'qr', 'whatsapp', 'message'
  input_value TEXT NOT NULL,
  fraud_score DECIMAL NOT NULL,
  risk_level TEXT NOT NULL,
  detected_indicators JSONB NOT NULL,
  methodology_explanation TEXT NOT NULL,
  ai_analysis TEXT,
  report_generated_at TIMESTAMP DEFAULT NOW(),
  exported_at TIMESTAMP,
  export_format TEXT, -- 'pdf', 'json', 'text'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE evidence_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own evidence reports"
  ON evidence_reports FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own evidence reports"
  ON evidence_reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_evidence_reports_user_id ON evidence_reports(user_id);
CREATE INDEX idx_evidence_reports_created_at ON evidence_reports(created_at DESC);
