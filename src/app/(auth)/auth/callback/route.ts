import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Ensures the redirect target is a relative internal path (prevents Open Redirect attacks)
 */
function sanitizeRedirectPath(nextParam: string | null): string {
  if (!nextParam || !nextParam.startsWith("/") || nextParam.startsWith("//")) {
    return "/profile";
  }
  return nextParam;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type") as EmailOtpType | null;
  const safeNext = sanitizeRedirectPath(requestUrl.searchParams.get("next"));

  const supabase = await createSupabaseServerClient();

  if (supabase) {
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(new URL(safeNext, requestUrl.origin));
      }
    } else if (tokenHash && type) {
      const { error } = await supabase.auth.verifyOtp({
        type,
        token_hash: tokenHash,
      });
      if (!error) {
        const dest = type === "recovery" ? "/reset-password" : safeNext;
        return NextResponse.redirect(new URL(dest, requestUrl.origin));
      }
    }
  }

  return NextResponse.redirect(new URL(safeNext, requestUrl.origin));
}
