import "server-only";
import { createClient } from "@supabase/supabase-js";
import { publicEnv } from "@/env";

/**
 * Strictly server-only Supabase admin client.
 * Protected by `import "server-only"` so Next.js build fails if ever imported into client code.
 */
export function createSupabaseAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (
    !publicEnv.NEXT_PUBLIC_SUPABASE_URL ||
    !serviceRoleKey ||
    serviceRoleKey.length < 20
  ) {
    return null;
  }

  return createClient(publicEnv.NEXT_PUBLIC_SUPABASE_URL, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
