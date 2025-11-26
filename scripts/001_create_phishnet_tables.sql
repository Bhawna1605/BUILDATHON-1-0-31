-- PhishNet Sentinel Database Schema

-- 1. Profiles table (User Management)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  organization TEXT,
  phone TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  subscription_tier TEXT DEFAULT 'free', -- free, pro, enterprise
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Threat Activity Log table
CREATE TABLE IF NOT EXISTS public.threat_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  threat_type TEXT NOT NULL, -- phishing, malware, social-engineering, qr-scam, call-fraud, credential-theft
  severity_level TEXT NOT NULL, -- low, medium, high, critical
  description TEXT,
  detected_url TEXT,
  detected_email TEXT,
  source TEXT, -- browser-extension, web-form, api-call
  status TEXT DEFAULT 'pending', -- pending, verified, false-positive, blocked
  action_taken TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Blocked URLs/Domains table
CREATE TABLE IF NOT EXISTS public.blocked_urls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  domain TEXT NOT NULL,
  threat_type TEXT,
  reason TEXT,
  blocked_at TIMESTAMP DEFAULT NOW(),
  reports_count INT DEFAULT 1
);

-- 4. Browser Extension Events table
CREATE TABLE IF NOT EXISTS public.browser_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  extension_version TEXT,
  event_type TEXT, -- site-scanned, threat-detected, user-blocked, extension-installed
  event_data JSONB,
  detected_at TIMESTAMP DEFAULT NOW()
);

-- 5. Call Fraud Detection table
CREATE TABLE IF NOT EXISTS public.call_fraud_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  caller_number TEXT NOT NULL,
  caller_name TEXT,
  call_duration INT, -- in seconds
  transcript TEXT,
  fraud_score DECIMAL(3,2), -- 0.00 to 1.00
  threat_indicators TEXT[], -- array of detected threats
  verification_status TEXT DEFAULT 'unverified', -- unverified, verified, spoofed, legitimate
  authorization_code TEXT,
  authorized_by TEXT,
  authorized_at TIMESTAMP,
  user_action TEXT, -- reported, allowed, blocked
  created_at TIMESTAMP DEFAULT NOW()
);

-- 6. QR Code Scam Detection table
CREATE TABLE IF NOT EXISTS public.qr_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  qr_content TEXT NOT NULL,
  decoded_url TEXT,
  mascrow_hash TEXT, -- Hash for QR authentication
  is_verified BOOLEAN DEFAULT FALSE,
  risk_level TEXT, -- safe, warning, dangerous
  scanner_location TEXT,
  threat_detected TEXT,
  action_taken TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 7. Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL, -- threat-alert, verification-needed, system-update, info
  title TEXT NOT NULL,
  message TEXT,
  threat_log_id UUID REFERENCES public.threat_logs(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT FALSE,
  priority TEXT DEFAULT 'normal', -- low, normal, high, critical
  action_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  read_at TIMESTAMP
);

-- 8. Authorization Tokens table
CREATE TABLE IF NOT EXISTS public.auth_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token_type TEXT NOT NULL, -- call-verification, call-authorization, device-authorization
  token_value TEXT NOT NULL UNIQUE,
  phone_number TEXT,
  verified_by TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 9. User Activity History table
CREATE TABLE IF NOT EXISTS public.user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- login, logout, threat-scan, report-fraud, authorize-call, block-url
  activity_details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  status TEXT DEFAULT 'success',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 10. Browser Extension Config table
CREATE TABLE IF NOT EXISTS public.extension_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  extension_id TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  version TEXT,
  settings JSONB DEFAULT '{"auto_scan": true, "block_suspicious": true, "notifications_enabled": true}',
  last_synced_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_urls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.browser_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_fraud_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auth_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.extension_configs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- RLS Policies for threat_logs
CREATE POLICY "threat_logs_select_own" ON public.threat_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "threat_logs_insert_own" ON public.threat_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "threat_logs_update_own" ON public.threat_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "threat_logs_delete_own" ON public.threat_logs FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for blocked_urls
CREATE POLICY "blocked_urls_select_own" ON public.blocked_urls FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "blocked_urls_insert_own" ON public.blocked_urls FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "blocked_urls_update_own" ON public.blocked_urls FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "blocked_urls_delete_own" ON public.blocked_urls FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for browser_events
CREATE POLICY "browser_events_select_own" ON public.browser_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "browser_events_insert_own" ON public.browser_events FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for call_fraud_logs
CREATE POLICY "call_fraud_select_own" ON public.call_fraud_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "call_fraud_insert_own" ON public.call_fraud_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "call_fraud_update_own" ON public.call_fraud_logs FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for qr_scans
CREATE POLICY "qr_scans_select_own" ON public.qr_scans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "qr_scans_insert_own" ON public.qr_scans FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for notifications
CREATE POLICY "notifications_select_own" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notifications_insert_own" ON public.notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notifications_update_own" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for auth_tokens
CREATE POLICY "auth_tokens_select_own" ON public.auth_tokens FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "auth_tokens_insert_own" ON public.auth_tokens FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "auth_tokens_update_own" ON public.auth_tokens FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user_activity
CREATE POLICY "user_activity_select_own" ON public.user_activity FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_activity_insert_own" ON public.user_activity FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for extension_configs
CREATE POLICY "extension_configs_select_own" ON public.extension_configs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "extension_configs_insert_own" ON public.extension_configs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "extension_configs_update_own" ON public.extension_configs FOR UPDATE USING (auth.uid() = user_id);

-- Create profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
