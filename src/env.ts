import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().optional().default(""),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional().default(""),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z
    .string()
    .default("1x00000000000000000000AA"),
  NEXT_PUBLIC_ENABLE_AI_ASSISTANT: z
    .enum(["true", "false"])
    .optional()
    .default("false"),
});

const parsedPublic = publicEnvSchema.safeParse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  NEXT_PUBLIC_TURNSTILE_SITE_KEY:
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA",
  NEXT_PUBLIC_ENABLE_AI_ASSISTANT:
    (process.env.NEXT_PUBLIC_ENABLE_AI_ASSISTANT as "true" | "false") || "false",
});

export const publicEnv = parsedPublic.success
  ? parsedPublic.data
  : {
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
      NEXT_PUBLIC_SUPABASE_URL: "",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "",
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: "1x00000000000000000000AA",
      NEXT_PUBLIC_ENABLE_AI_ASSISTANT: "false" as const,
    };

export function isSupabaseConfigured(): boolean {
  return Boolean(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL &&
      publicEnv.NEXT_PUBLIC_SUPABASE_URL.startsWith("https://") &&
      publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 20
  );
}
