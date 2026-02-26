import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. 初始化 response 对象（Next.js 和 Supabase 配合需要用它来刷新 Cookie）
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 2. 无论访问什么路由，我们都先创建 Supabase 客户端并获取 Session
  // 把创建客户端的逻辑提到最前面，这样全站都能拿到用户的登录状态
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          request.cookies.delete({ name, ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.delete({ name, ...options });
        },
      },
    }
  );

  // 验证会话状态
  const { data: { session } } = await supabase.auth.getSession();

  // 定义受保护的路由和公开路由
  const protectedRoutes = [
    '/dashboard',
    '/dashboard/sleep',
    '/dashboard/chat',
    '/dashboard/deep-zen',
  ];

  // 3. 核心路由拦截逻辑

  // 场景 A：如果用户【已登录】，且正在访问【首页】，强制跳转到 '/welcome'
  if (session && pathname === '/') {
    return NextResponse.redirect(new URL('/welcome', request.url));
  }

  // 场景 B：如果用户【未登录】，且试图访问【受保护的路由】，强制踢回首页
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 其他情况（比如未登录访问首页，或已登录访问 dashboard），正常放行
  return response;
}

// 配置中间件匹配的路径
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};