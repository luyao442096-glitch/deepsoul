'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function ArticleCTA() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/invisible/onboarding?source=bed_rotting_article');
  };

  return (
    <div className="fixed right-6 bottom-6 md:right-8 md:bottom-8 z-50 flex flex-col items-end">
      {/* 长条形胶囊按钮 */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className="flex items-center gap-3 px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-medium shadow-lg transition-all duration-300 ease-in-out max-w-xs"
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          boxShadow: [
            '0 0 10px rgba(139, 92, 246, 0.3)',
            '0 0 20px rgba(139, 92, 246, 0.5)',
            '0 0 10px rgba(139, 92, 246, 0.3)'
          ]
        }}
        transition={{ 
          opacity: { duration: 0.5 },
          y: { duration: 0.5 },
          boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        {/* AI图标 */}
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M8 12h.01" />
          <path d="M12 12h.01" />
          <path d="M16 12h.01" />
          <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3z" />
          <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3z" />
          <path d="M3 12a9 9 0 0 0 9 9 9 9 0 0 0 9-9" />
        </svg>
        
        {/* 文字内容 */}
        <span className="text-sm md:text-base">感到心累？和我聊聊 (Chat now)</span>
      </motion.button>
    </div>
  );
}
