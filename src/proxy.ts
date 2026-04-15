import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { ALLOWED_EMAIL, isPublicApiPath, isValidBearer } from '@/lib/auth-config';

const PUBLIC_PAGE_PATHS = ['/signin'];

function isPublicPagePath(pathname: string): boolean {
  return PUBLIC_PAGE_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith('/api/');

  if (isApi && isPublicApiPath(pathname)) {
    return NextResponse.next();
  }

  if (isApi && isValidBearer(request.headers.get('authorization'))) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const authorized = !!user && user.email === ALLOWED_EMAIL;

  if (authorized) {
    if (isPublicPagePath(pathname)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return response;
  }

  if (isApi) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  if (isPublicPagePath(pathname)) {
    return response;
  }

  const loginUrl = new URL('/signin', request.url);
  if (user && user.email !== ALLOWED_EMAIL) {
    await supabase.auth.signOut();
    loginUrl.searchParams.set('error', 'unauthorized');
  } else {
    loginUrl.searchParams.set('redirect', pathname + request.nextUrl.search);
  }
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|ttf|map)$).*)',
  ],
};
