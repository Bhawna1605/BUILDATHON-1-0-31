-- Create cyber_fraud_fir table for FIR reporting
CREATE TABLE IF NOT EXISTS public.cyber_fraud_fir (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  complaint_type VARCHAR(50) NOT NULL, -- phishing, malware, call_fraud, qr_scam, etc
  description TEXT NOT NULL,
  incident_date TIMESTAMP WITH TIME ZONE NOT NULL,
  fraudster_contact VARCHAR(255),
  fraudster_details TEXT,
  evidence_url TEXT,
  check_history_id UUID,
  fir_status VARCHAR(20) DEFAULT 'submitted', -- submitted, acknowledged, investigating, resolved
  cyber_police_reference TEXT, -- Reference number from cyber police
  cyber_police_name VARCHAR(255),
  cyber_police_email VARCHAR(255),
  cyber_police_phone VARCHAR(20),
  cyber_police_website TEXT,
  fir_document_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.cyber_fraud_fir ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own FIR reports"
  ON public.cyber_fraud_fir
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own FIR reports"
  ON public.cyber_fraud_fir
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own FIR reports"
  ON public.cyber_fraud_fir
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create cyber_police_contacts table for reference
CREATE TABLE IF NOT EXISTS public.cyber_police_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  country VARCHAR(100),
  state_city VARCHAR(100),
  organization_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  website TEXT,
  complaint_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add some sample cyber police contacts (India)
INSERT INTO public.cyber_police_contacts (country, state_city, organization_name, email, phone, website, complaint_url)
VALUES
  ('India', 'National', 'Cyber Crime Complaint Cell (CCCC)', 'ccpheld@gmail.com', '+91-11-2671-6013', 'https://www.cybercrime.gov.in', 'https://cybercrime.gov.in/'),
  ('India', 'Delhi', 'Delhi Police - Cyber Cell', 'delhipolice@delhipolice.gov.in', '+91-11-4343-9080', 'https://delhipolice.gov.in', 'https://delhipolice.gov.in/'),
  ('India', 'Mumbai', 'Mumbai Police - Cyber Cell', 'cybercell.mumbai@police.gov.in', '+91-22-2653-6969', 'https://mumbaipolice.gov.in', 'https://mumbaipolice.gov.in/'),
  ('India', 'Bangalore', 'Bangalore Police - Cyber Crime', 'cybercrime@bcp.gov.in', '+91-80-2223-3333', 'https://bangalorepolice.gov.in', 'https://bangalorepolice.gov.in/');
