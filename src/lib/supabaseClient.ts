import { createClient } from '@supabase/supabase-js';

// 환경 변수로부터 Supabase URL과 키를 가져옵니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Supabase 클라이언트를 한 번만 생성하여 다른 파일에서 사용할 수 있도록 export 합니다.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
