// lib/supabaseAdmin.ts
import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,           // NEXT_PUBLIC 로도 OK
  process.env.SUPABASE_SERVICE_ROLE_KEY!,          // 반드시 서비스롤 키를 환경변수에 세팅
  {
    auth: { persistSession: false, detectSessionInUrl: false },
  }
);
