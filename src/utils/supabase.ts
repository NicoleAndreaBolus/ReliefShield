import { createClient, SupabaseClient } from '@supabase/supabase-js';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Record donation metadata in Supabase for UI history & application activity.
 * Supabase does NOT store or manufacture authoritative blockchain state;
 * the authoritative totalReliefPool is read directly from the Midnight contract indexer.
 */
export async function recordGlobalDonation(
  network: 'preview' | 'preprod',
  amount: number,
  txHash: string
): Promise<void> {
  if (!supabase) return;

  try {
    await supabase.from('donations').insert({
      network,
      amount,
      tx_hash: txHash,
      created_at: new Date().toISOString()
    });
  } catch (err) {
    console.warn('[Supabase] Failed to log donation metadata:', err);
  }
}

export interface GlobalDonation {
  id?: string;
  network: string;
  amount: number;
  tx_hash: string;
  created_at: string;
}

/**
 * Fetch the list of recent on-chain donations from Supabase
 */
export async function fetchRecentDonations(
  network: 'preview' | 'preprod' = 'preview',
  limit: number = 10
): Promise<GlobalDonation[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('network', network)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.warn('[Supabase] Error reading donations:', error.message);
      return [];
    }

    return (data || []) as GlobalDonation[];
  } catch (err) {
    console.warn('[Supabase] Failed to fetch donations:', err);
    return [];
  }
}
