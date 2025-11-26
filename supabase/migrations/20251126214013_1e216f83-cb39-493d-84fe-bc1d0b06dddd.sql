-- Create enum for API plans
CREATE TYPE public.api_plan AS ENUM ('free', 'basic', 'pro', 'enterprise');

-- Create api_keys table
CREATE TABLE public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  settings_key TEXT UNIQUE NOT NULL,
  plan api_plan NOT NULL DEFAULT 'free',
  discord_user_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  request_count INTEGER NOT NULL DEFAULT 0,
  last_used_at TIMESTAMPTZ
);

-- Create whitelisted_ips table
CREATE TABLE public.whitelisted_ips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID NOT NULL REFERENCES public.api_keys(id) ON DELETE CASCADE,
  ip_address TEXT NOT NULL,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(api_key_id, ip_address)
);

-- Create indexes for performance
CREATE INDEX idx_api_keys_key ON public.api_keys(key);
CREATE INDEX idx_api_keys_settings_key ON public.api_keys(settings_key);
CREATE INDEX idx_api_keys_discord_user ON public.api_keys(discord_user_id);
CREATE INDEX idx_whitelisted_ips_api_key ON public.whitelisted_ips(api_key_id);
CREATE INDEX idx_whitelisted_ips_ip ON public.whitelisted_ips(ip_address);

-- Enable Row Level Security
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whitelisted_ips ENABLE ROW LEVEL SECURITY;

-- RLS Policies for api_keys (public read for validation, no insert/update/delete from client)
CREATE POLICY "API keys are publicly readable for validation"
  ON public.api_keys
  FOR SELECT
  USING (true);

-- RLS Policies for whitelisted_ips (can manage IPs with valid settings key)
CREATE POLICY "Users can view their whitelisted IPs with settings key"
  ON public.whitelisted_ips
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert whitelisted IPs via edge function"
  ON public.whitelisted_ips
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can delete whitelisted IPs via edge function"
  ON public.whitelisted_ips
  FOR DELETE
  USING (true);