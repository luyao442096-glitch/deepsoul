'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function FooterWrapper() {
  const pathname = usePathname();
  
  // 检查是否为聊天页面
  const isChatPage = pathname === '/dashboard/chat';
  
  if (isChatPage) {
    return null;
  }
  
  return <Footer />;
}