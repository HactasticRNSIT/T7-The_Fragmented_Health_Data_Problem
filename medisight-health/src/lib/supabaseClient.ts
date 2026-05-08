/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const isPlaceholder = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === '';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

if (isPlaceholder) {
  const hasRawUrl = !!(import.meta.env as any).SUPABASE_URL;
  console.error('❌ CRITICAL: Supabase credentials are missing in the build!');
  if (hasRawUrl) {
    console.warn('HINT: It looks like you added variables without the VITE_ prefix. Vite requires variables to start with VITE_ to be exposed to the browser.');
  }
  console.warn('Action Required: \n1. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to Vercel Settings > Environment Variables.\n2. You MUST go to the "Deployments" tab and click "Redeploy" on your latest build for changes to take effect.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
