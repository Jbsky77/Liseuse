// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://lzqfeyqgybojensgbjtr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6cWZleXFneWJvamVuc2dianRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NDU0MTUsImV4cCI6MjA2NTMyMTQxNX0.8w1JCnu4s-PF7za3aYK93XZgv-j_FmP2rfMkWCkphGk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);