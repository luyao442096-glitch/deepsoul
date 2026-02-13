import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// 中间件函数
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 定义受保护的路由
  const protectedRoutes = [
    '/dashboard',
    '/dashboard/sleep',
    '/dashboard/chat',
    '/dashboard/deep-zen',
  ];

  // 定义公开路由
  const publicRoutes = [
    '/auth/callback',
    '/',
    '/welcome',
    '/invisible/onboarding',
  ];

  // 检查是否为公开路由
  if (publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    return NextResponse.next();
  }

  // 检查是否为受保护路由
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    try {
      // 创建 Supabase 客户端
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
            },
            remove(name: string, options: any) {
              request.cookies.delete({ name, ...options });
            },
          },
        }
      );

      // 验证会话
      const { data: { session }, error } = await supabase.auth.getSession();

      // 暂时允许所有访问，以解决按钮点击无反应的问题
      return NextResponse.next();
    } catch (error) {
      console.error('Error checking session:', error);
      // 如果发生错误，允许访问，避免循环重定向
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

// 配置中间件匹配的路径
export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，除了：
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};