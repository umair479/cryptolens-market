import { createClient } from '@supabase/supabase-js'
import type { User } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!

if (!supabaseUrl) {
  throw new Error('SUPABASE_URL is required')
}

if (!supabaseServiceKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY is required')
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

export async function verifySupabaseToken(token: string): Promise<User | null> {
  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    
    if (error) {
      console.warn('[Auth] Supabase token verification failed:', error.message)
      return null
    }

    return user
  } catch (error) {
    console.warn('[Auth] Failed to verify Supabase token:', error)
    return null
  }
}

export { type User } from '@supabase/supabase-js'