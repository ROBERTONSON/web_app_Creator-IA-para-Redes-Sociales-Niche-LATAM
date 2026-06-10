-- Run this in Supabase SQL Editor

-- Table to track user plans and usage
CREATE TABLE public.user_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  plan text NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'premium')),
  generations_used int NOT NULL DEFAULT 0,
  images_used int NOT NULL DEFAULT 0,
  period_start timestamptz NOT NULL DEFAULT date_trunc('month', now()),
  mp_subscription_id text,
  mp_payment_id text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Index for fast user lookups
CREATE INDEX idx_user_plans_user_id ON public.user_plans (user_id);

-- RLS
ALTER TABLE public.user_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_plan_select"
  ON public.user_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users_own_plan_update"
  ON public.user_plans FOR UPDATE
  USING (auth.uid() = user_id);

-- Auto-insert free plan on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_plans (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to safely increment generation counter
CREATE OR REPLACE FUNCTION public.increment_generations(p_user_id uuid)
RETURNS void AS $$
DECLARE
  current_period timestamptz;
BEGIN
  current_period := date_trunc('month', now());
  
  INSERT INTO public.user_plans (user_id, generations_used, period_start)
  VALUES (p_user_id, 1, current_period)
  ON CONFLICT (user_id) DO UPDATE SET
    generations_used = CASE
      WHEN date_trunc('month', user_plans.period_start) < current_period
      THEN 1  -- Reset counter for new month
      ELSE user_plans.generations_used + 1
    END,
    period_start = CASE
      WHEN date_trunc('month', user_plans.period_start) < current_period
      THEN current_period
      ELSE user_plans.period_start
    END,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to upgrade user to premium
CREATE OR REPLACE FUNCTION public.upgrade_to_premium(p_user_id uuid, p_payment_id text)
RETURNS void AS $$
BEGIN
  INSERT INTO public.user_plans (user_id, plan, mp_payment_id)
  VALUES (p_user_id, 'premium', p_payment_id)
  ON CONFLICT (user_id) DO UPDATE SET
    plan = 'premium',
    mp_payment_id = p_payment_id,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
