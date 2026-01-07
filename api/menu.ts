import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_PIN = process.env.ADMIN_PIN;

function getSupabase() {
 if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
 }
 return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
 });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
 try {
  const supabase = getSupabase();

  if (req.method === 'GET') {
   const { data, error } = await supabase
    .from('site_config')
    .select('value')
    .eq('key', 'menu')
    .maybeSingle();

   if (error) {
    return res.status(500).json({ error: error.message });
   }

   return res.status(200).json({ menu: data?.value ?? null });
  }

  if (req.method === 'POST') {
   const pin = (req.headers['x-admin-pin'] as string | undefined) ?? (req.query.pin as string | undefined);
   if (!ADMIN_PIN || pin !== ADMIN_PIN) {
    return res.status(401).json({ error: 'Unauthorized' });
   }

   const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
   const menu = body?.menu;
   if (!menu || typeof menu !== 'object') {
    return res.status(400).json({ error: 'Invalid body. Expected { menu: {...} }' });
   }

   const { error } = await supabase.from('site_config').upsert(
    {
     key: 'menu',
     value: menu,
     updated_at: new Date().toISOString(),
    },
    { onConflict: 'key' }
   );

   if (error) {
    return res.status(500).json({ error: error.message });
   }

   return res.status(200).json({ ok: true });
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method Not Allowed' });
 } catch (e) {
  const msg = e instanceof Error ? e.message : 'Unknown error';
  return res.status(500).json({ error: msg });
 }
}
