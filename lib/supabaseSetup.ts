import { createClient } from "@supabase/supabase-js";

const supabaseUrl:string = 'https://yahxogqrdtrczorjcvrb.supabase.co';
const supabaseKey:string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaHhvZ3FyZHRyY3pvcmpjdnJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxNDQ2ODEsImV4cCI6MjA1MjcyMDY4MX0.D23xfPewwhfXPHB3m7LplIozOHzeU5WXQMe5xV1dkwU';
const SUPABASE_SERVICE_ROLE_KEY:string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaHhvZ3FyZHRyY3pvcmpjdnJiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzE0NDY4MSwiZXhwIjoyMDUyNzIwNjgxfQ.XTmw998WoMMUcLsNbHip47hYEpTUx3RESwxvJtIn3L4';
// const supabaseUrl:string = process.env.SUPABASE_URL!;
// const supabaseKey:string = process.env.SUPABASE_KEY!
// const SUPABASE_SERVICE_ROLE_KEY:string = process.env.SUPABASE_SERVICE_ROLE_KEY!

// const supabaseUrl = process.env.SUPABASE_URL!;
// const supabaseKey:string = process.env.SUPABASE_KEY!;



export const supabase = createClient(supabaseUrl, supabaseKey);
export const supabaseAdmin=createClient(supabaseUrl,SUPABASE_SERVICE_ROLE_KEY)
