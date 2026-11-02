import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = 'https://bjkdyjfydfhobyukrldo.supabase.co';
const supabasePublishableKey = 'sb_publishable_wAnInr_hJj24w0yHEBBnUQ_8UUYaRSw';

export const theaterSupabase = createClient(supabaseUrl, supabasePublishableKey);
export const theaterAdminEmail = 'danielfigueira01@gmail.com';
