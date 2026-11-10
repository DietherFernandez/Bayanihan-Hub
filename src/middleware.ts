import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isSupabaseConfigured, publicEnv } from "@/env";

const PRIVATE_NO_CACHE_PREFIXES = [
  "/profile",
  "/bookmarks",
  "/history",
  "/admin",
  "/reset-password",
];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const pathname = request.nextUrl.pathname;
  const isPrivateRoute = PRIVATE_NO_CACHE_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isSupabaseConfigured()) {
    const supabase = createServerClient(
      publicEnv.NEXT_PUBLIC_SUPABASE_URL,
      publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(
            cookiesToSet: {
              name: string;
              value: string;
              options?: Record<string, unknown>;
            }[]
          ) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(
                name,
                value,
                options as Record<string, unknown>
              )
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Server-side guard for /admin when Supabase Auth is active
    if (pathname.startsWith("/admin") && !user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Prevent public/CDN caching of private account & administrative pages
  if (isPrivateRoute) {
    response.headers.set(
      "Cache-Control",
      "private, no-store, no-cache, must-revalidate"
    );
  }

  // Hardened HTTP security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
