import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (code) {
    try {
      // 处理 Supabase OAuth 回调
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('OAuth callback error:', error);
        return NextResponse.redirect('http://localhost:3000/?error=auth');
      }
      
      // 登录成功，重定向到 dashboard
      return NextResponse.redirect('http://localhost:3000/dashboard');
    } catch (error) {
      console.error('Callback error:', error);
      return NextResponse.redirect('http://localhost:3000/?error=auth');
    }
  }
  
  return NextResponse.redirect('http://localhost:3000/?error=auth');
}
