import { createClient } from '@supabase/supabase-js';
import { SUPABASE_PUBLIC_TOKEN, SUPABASE_URL } from '~/config/env';

// Create a single supabase client for interacting with your database
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_TOKEN);
