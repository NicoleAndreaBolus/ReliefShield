-- =========================================================================
-- RELIEFSHIELD GLOBAL POSTGRESQL SCHEMA FOR SUPABASE
-- Run this in your Supabase Dashboard -> SQL Editor -> Click 'Run'
-- =========================================================================

-- 1. Create table for persisting global relief pool state
CREATE TABLE IF NOT EXISTS public.relief_pool_state (
    network TEXT PRIMARY KEY,
    total_pool NUMERIC NOT NULL DEFAULT 142,
    last_tx_hash TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create table for recording on-chain donations
CREATE TABLE IF NOT EXISTS public.donations (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    network TEXT NOT NULL DEFAULT 'preview',
    amount NUMERIC NOT NULL,
    tx_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Seed initial baseline pool for Midnight Preview and Preprod
INSERT INTO public.relief_pool_state (network, total_pool, last_tx_hash, updated_at)
VALUES 
    ('preview', 142, '0x5366e3165d29369d3cbc1e118e6429901e7a6f4521823a32414d2ac974b5aa1b', NOW()),
    ('preprod', 142, '0x5e2a1b9c8d7f0e3a4b6c8d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a', NOW())
ON CONFLICT (network) DO UPDATE
SET updated_at = NOW();

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.relief_pool_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- 5. Set Public Access Policies (Allow read and insert for the frontend client)
CREATE POLICY "Allow public read on relief_pool_state"
    ON public.relief_pool_state FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow public insert and update on relief_pool_state"
    ON public.relief_pool_state FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow public read on donations"
    ON public.donations FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow public insert on donations"
    ON public.donations FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);
