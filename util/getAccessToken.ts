
import { supabase } from '@/lib/supabaseSetup'
export const getAccessToken = async (): Promise<string | null> => {
  const {
    data: { session },
    error
  } = await supabase.auth.getSession()

  

  if (error || !session) return null

  return session.access_token
}
