'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import Link from 'next/link';

// 1. 定义准确的映射关系 (Display Name -> Folder Slug)
const CATEGORY_SLUGS: Record<string, string> = {
  "Burnout": "burnout",
  "Can't Sleep": "cant-sleep",
  "Invisible": "invisible",
  "Spiraling": "spiraling",
  "Stuck in Overwhelm": "stuck-in-overwhelm"
};

const CATEGORIES = Object.keys(CATEGORY_SLUGS);

export default function HomePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasCompletedTest, setHasCompletedTest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [recentArticles, setRecentArticles] = useState<any[]>([]);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setIsLoggedIn(true);
          const testCompleted = localStorage.getItem('testCompleted');
          setHasCompletedTest(!!testCompleted);
          router.push('/welcome');
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
    loadRecentArticles();
  }, [supabase, router]);

  const loadRecentArticles = async () => {
    try {
      const response = await fetch('/api/recent-articles');
      const data = await response.json();
      setRecentArticles(data);
    } catch (error) {
      console.error('Error loading recent articles:', error);
    }
  };

  const stateOptions = [
    {
      id: 'burnout',
      label: 'Burnout',
      bgColor: 'bg-amber-900/30',
      borderColor: 'border-amber-700/40',
      shadow: 'shadow-[0_0_15px_rgba(146,64,14,0.4)]',
      hoverBg: 'bg-amber-800/40',
      hoverShadow: 'shadow-[0_0_25px_rgba(146,64,14,0.6)]',
      description: 'Feeling exhausted and overwhelmed',
      href: '/category/burnout'
    },
    {
      id: 'cant-sleep',
      label: 'Can\'t Sleep',
      bgColor: 'bg-blue-900/30',
      borderColor: 'border-blue-700/40',
      shadow: 'shadow-[0_0_15px_rgba(30,64,175,0.4)]',
      hoverBg: 'bg-blue-800/40',
      hoverShadow: 'shadow-[0_0_25px_rgba(30,64,175,0.6)]',
      description: 'Insomnia or sleep disturbances',
      href: '/category/cant-sleep'
    },
    {
      id: 'invisible',
      label: 'Invisible',
      bgColor: 'bg-purple-900/30',
      borderColor: 'border-purple-700/40',
      shadow: 'shadow-[0_0_15px_rgba(91,33,182,0.4)]',
      hoverBg: 'bg-purple-800/40',
      hoverShadow: 'shadow-[0_0_25px_rgba(91,33,182,0.6)]',
      description: 'Feeling unseen or unheard',
      href: '/category/invisible'
    },
    {
      id: 'spiraling',
      label: 'Spiraling',
      bgColor: 'bg-teal-900/30',
      borderColor: 'border-teal-700/40',
      shadow: 'shadow-[0_0_15px_rgba(17,94,89,0.4)]',
      hoverBg: 'bg-teal-800/40',
      hoverShadow: 'shadow-[0_0_25px_rgba(17,94,89,0.6)]',
      description: 'Anxious thoughts and worry',
      href: '/category/spiraling'
    },
    {
      id: 'stuck-in-overwhelm',
      label: 'Stuck in Overwhelm',
      bgColor: 'bg-slate-800/30',
      borderColor: 'border-slate-600/40',
      shadow: 'shadow-[0_0_15px_rgba(51,65,85,0.4)]',
      hoverBg: 'bg-slate-700/40',
      hoverShadow: 'shadow-[0_0_25px_rgba(51,65,85,0.6)]',
      description: 'Unable to move forward',
      href: '/category/stuck-in-overwhelm'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050A18] flex items-center justify-center">
        <div className="text-white/60">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050A18] text-white relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
      
      <div className="z-10 min-h-screen flex flex-col items-center justify-center px-6 relative">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-serif mb-8 leading-tight"
        >
          How is your energy?
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg text-white/60 mb-16"
        >
          Select light that resonates with you.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8 max-w-3xl mx-auto"
        >
          {stateOptions.map((option, index) => (
            <motion.div
              key={option.id}
              className="flex flex-col items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Link href={option.href}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-32 sm:w-36 md:w-40 h-32 sm:h-36 md:h-40 rounded-full ${option.bgColor} border border-white/10 ${option.borderColor} ${option.shadow} hover:${option.hoverBg} hover:${option.hoverShadow} transition-all duration-500 ease-in-out flex items-center justify-center backdrop-blur-sm relative overflow-hidden group cursor-pointer`}
                >
                  <span className="text-sm sm:text-base font-medium text-white text-center px-3 z-10 group-hover:text-white/90 transition-colors duration-300">
                    {option.label}
                  </span>
                  <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse-slow" />
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* 第二屏：修正后的列表逻辑 */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-8">
          {CATEGORIES.map((category) => {
            const slug = CATEGORY_SLUGS[category]; // 获取正确的文件夹名 (如 cant-sleep)
            
            return (
              <div key={category} className="flex flex-col space-y-6">
                <h3 className="text-xs font-bold tracking-widest text-gray-500 uppercase">
                  {category}
                </h3>
                <div className="flex flex-col space-y-3">
                  {recentArticles
                    // 修正筛选：同时匹配分类名 OR 文件夹名，确保万无一失
                    .filter((article) => 
                      article.category === category || 
                      article.category === slug
                    )
                    .slice(0, 5)
                    .map((post) => (
                      <Link
                        key={post.slug}
                        // 修正链接：使用正确的 slug，不再使用正则表达式瞎猜
                        href={`/category/${slug}/${post.slug}`}
                        className="text-sm text-gray-400 hover:text-white transition-colors duration-200 line-clamp-2 leading-relaxed"
                      >
                        {post.title}
                      </Link>
                    ))}
                  
                  <Link
                    href={`/category/${slug}`}
                    className="text-xs text-blue-400/60 hover:text-blue-300 mt-2"
                  >
                    View all &rarr;
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}