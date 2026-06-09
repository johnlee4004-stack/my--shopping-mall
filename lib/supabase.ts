import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase 환경변수가 설정되지 않았습니다.');
  _client = createClient(url, key);
  return _client;
}

export async function uploadQuoteImage(file: File, quoteId: string): Promise<string | null> {
  try {
    const supabase = getClient();
    const ext  = file.name.split('.').pop() ?? 'jpg';
    const path = `quotes/${quoteId}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from('quote-images')
      .upload(path, file, { cacheControl: '3600', upsert: false });

    if (error) return null;

    const { data } = supabase.storage.from('quote-images').getPublicUrl(path);
    return data.publicUrl;
  } catch {
    return null;
  }
}
