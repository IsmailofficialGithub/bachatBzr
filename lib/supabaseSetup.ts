import { createClient } from "@supabase/supabase-js";

const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yahxogqrdtrczorjcvrb.supabase.co';
const supabaseKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaHhvZ3FyZHRyY3pvcmpjdnRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxNDQ2ODEsImV4cCI6MjA1MjcyMDY4MX0.D23xfPewwhfXPHB3m7LplIozOHzeU5WXQMe5xV1dkwU';
const SUPABASE_SERVICE_ROLE_KEY: string = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaHhvZ3FyZHRyY3pvcmpjdnRrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzE0NDY4MSwiZXhwIjoyMDUyNzIwNjgxfQ.XTmw998WoMMUcLsNbHip47hYEpTUx3RESwxvJtIn3L4';

export const supabase = createClient(supabaseUrl, supabaseKey);
export const supabaseAdmin = createClient(supabaseUrl, SUPABASE_SERVICE_ROLE_KEY);
