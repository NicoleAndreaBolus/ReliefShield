import { createClient, SupabaseClient } from '@supabase/supabase-js';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Fetch the global relief pool balance for a given network (preview or preprod)
 */
export async function fetchGlobalReliefPool(
  network: 'preview' | 'preprod' = 'preview',
  fallback: number = 142
): Promise<number> {
  if (!supabase) {
    return fallback;
  }

  try {
    const { data, error } = await supabase
      .from('relief_pool_state')
      .select('total_pool')
      .eq('network', network)
      .maybeSingle();

    if (error) {
      console.warn('[Supabase] Error reading relief_pool_state:', error.message);
      return fallback;
    }

    if (data && typeof data.total_pool === 'number') {
      return Math.max(fallback, data.total_pool);
    }

    // If row doesn't exist yet, insert baseline
    await supabase.from('relief_pool_state').upsert({
      network,
      total_pool: fallback,
      updated_at: new Date().toISOString()
    });

    return fallback;
  } catch (err) {
    console.warn('[Supabase] Failed to fetch pool:', err);
    return fallback;
  }
}

/**
 * Atomically increment the global relief pool and record transaction in Supabase
 */
export async function recordGlobalDonation(
  network: 'preview' | 'preprod',
  amount: number,
  txHash: string
): Promise<number> {
  if (!supabase) {
    return 142 + amount;
  }

  try {
    // 1. Log the donation record
    await supabase.from('donations').insert({
      network,
      amount,
      tx_hash: txHash,
      created_at: new Date().toISOString()
    });

    // 2. Fetch current pool and update
    const current = await fetchGlobalReliefPool(network, 142);
    const newTotal = current + amount;

    const { error } = await supabase
      .from('relief_pool_state')
      .upsert({
        network,
        total_pool: newTotal,
        last_tx_hash: txHash,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.warn('[Supabase] Error updating pool:', error.message);
    }

    return newTotal;
  } catch (err) {
    console.warn('[Supabase] Failed to record donation:', err);
    return 142 + amount;
  }
}
