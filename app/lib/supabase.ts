import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pdeiasnybwxexppinvhc.supabase.co";

const supabaseKey =
  "sb_publishable_9o-QiDWs2aE0lFqkKgRz4w_jhMKF3LM";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);