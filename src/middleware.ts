import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for api, _next, static files
  if (pathname.match(/^\/(api|_next|_vercel)\/|\.\w+$/)) {
    return NextResponse.next();
  }

  // Run Supabase session refresh
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  await supabase.auth.getUser();

  // Run next-intl middleware
  const intlResponse = intlMiddleware(request);

  if (intlResponse) {
    // Merge cookies from supabase response into intl response
    const supabaseCookies = supabaseResponse.cookies
      .getAll()
      .reduce((acc: Record<string, string>, c: { name: string; value: string }) => {
        acc[c.name] = c.value;
        return acc;
      }, {});

    Object.entries(supabaseCookies).forEach(([name, value]) => {
      intlResponse.cookies.set(name, value);
    });

    return intlResponse;
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
};
