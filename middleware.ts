// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  // const supabase = createMiddlewareClient({ req, res });

  // const {
  //   data: { session },
  // } = await supabase.auth.getSession();

  // // Protect admin routes
  // if (req.nextUrl.pathname.startsWith('/admin')) {
  //   if (!session) {
  //     return NextResponse.redirect(new URL('/login', req.url));
  //   }

  //   // Check user role
  //   const { data: profile } = await supabase
  //     .from('profiles')
  //     .select('role')
  //     .eq('id', session.user.id)
  //     .single();

  //   if (profile?.role !== 'admin') {
  //     return NextResponse.redirect(new URL('/unauthorized', req.url));
  //   }
  // }

  // // Protect user dashboard
  // if (req.nextUrl.pathname.startsWith('/dashboard')) {
  //   if (!session) {
  //     return NextResponse.redirect(new URL('/login', req.url));
  //   }
  // }

  return res;
}

export const config = {
  // matcher: ['/admin/:path*', '/dashboard/:path*']
};