import { createClient } from "@supabase/supabase-js";

const supabaseUrl:string = process.env.SUPABASE_URL!;
const supabaseKey:string = process.env.SUPABASE_KEY!;
const SUPABASE_SERVICE_ROLE_KEY:string = process.env.SUPABASE_SERVICE_ROLE_KEY!;
// const supabaseUrl = process.env.SUPABASE_URL!;
// const supabaseKey:string = process.env.SUPABASE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
export const supabaseAdmin=createClient(supabaseUrl,SUPABASE_SERVICE_ROLE_KEY)