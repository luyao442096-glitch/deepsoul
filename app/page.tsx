'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';

export default function HomePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasCompletedTest, setHasCompletedTest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 检查登录状态并进行重定向
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setIsLoggedIn(true);
          // 检查是否完成过测试（从本地存储或其他地方获取）
          const testCompleted = localStorage.getItem('testCompleted');
          const completed = !!testCompleted;
          setHasCompletedTest(completed);
          
          // 重定向到欢迎页面
          router.push('/welcome');
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, [supabase, router]);

  // 处理按钮点击
  const handleButtonClick = (state: string) => {
    if (isLoggedIn) {
      router.push('/dashboard');
    } else {
      // 跳转到对应的关键词页面
      router.push(`/${state}`);
    }
  };

  // 处理第二次访问时的按钮点击
  const handleStartJourney = () => {
    if (isLoggedIn) {
      router.push('/dashboard');
    } else {
      // 未登录时跳转到测试流程
      router.push('/burnout');
    }
  };

  // 状态选项数据 - 更新为柔和、暗淡的深海生物发光样式
  const stateOptions = [
    {
      id: 'burnout',
      label: 'Burnout',
      bgColor: 'bg-amber-900/30',
      borderColor: 'border-amber-700/40',
      shadow: 'shadow-[0_0_10px_rgba(146,64,14,0.3)]',
      hoverBg: 'bg-amber-800/40',
      hoverShadow: 'shadow-[0_0_15px_rgba(146,64,14,0.4)]',
      description: 'Feeling exhausted and overwhelmed'
    },
    {
      id: 'cant-sleep',
      label: 'Can\'t Sleep',
      bgColor: 'bg-blue-900/30',
      borderColor: 'border-blue-700/40',
      shadow: 'shadow-[0_0_10px_rgba(30,64,175,0.3)]',
      hoverBg: 'bg-blue-800/40',
      hoverShadow: 'shadow-[0_0_15px_rgba(30,64,175,0.4)]',
      description: 'Insomnia or sleep disturbances'
    },
    {
      id: 'invisible',
      label: 'Invisible',
      bgColor: 'bg-purple-900/30',
      borderColor: 'border-purple-700/40',
      shadow: 'shadow-[0_0_10px_rgba(91,33,182,0.3)]',
      hoverBg: 'bg-purple-800/40',
      hoverShadow: 'shadow-[0_0_15px_rgba(91,33,182,0.4)]',
      description: 'Feeling unseen or unheard'
    },
    {
      id: 'spiraling',
      label: 'Spiraling',
      bgColor: 'bg-teal-900/30',
      borderColor: 'border-teal-700/40',
      shadow: 'shadow-[0_0_10px_rgba(17,94,89,0.3)]',
      hoverBg: 'bg-teal-800/40',
      hoverShadow: 'shadow-[0_0_15px_rgba(17,94,89,0.4)]',
      description: 'Anxious thoughts and worry'
    },
    {
      id: 'stuck',
      label: 'Stuck in Overwhelm',
      bgColor: 'bg-slate-800/30',
      borderColor: 'border-slate-600/40',
      shadow: 'shadow-[0_0_10px_rgba(51,65,85,0.3)]',
      hoverBg: 'bg-slate-700/40',
      hoverShadow: 'shadow-[0_0_15px_rgba(51,65,85,0.4)]',
      description: 'Unable to move forward'
    }
  ];

  // 显示加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050A18] flex items-center justify-center">
        <div className="text-white/60">Loading...</div>
      </div>
    );
  }

  // 首次访问或未完成测试的用户，显示原始页面
  return (
    <div className="min-h-screen bg-[#050A18] text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* 背景效果 */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
      
      {/* 主内容 */}
      <div className="z-10 text-center max-w-4xl px-6 py-12">
        {/* 标题 */}
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-serif mb-8 leading-tight"
        >
          How is your energy?
        </motion.h1>
        
        {/* 副标题 */}
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg text-white/60 mb-16"
        >
          Select the light that resonates with you.
        </motion.p>
        
        {/* 发光球体网格 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8 max-w-3xl mx-auto"
        >
          {stateOptions.map((option, index) => (
            <motion.div
              key={option.id}
              className="flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleButtonClick(option.id)}
                className={`w-24 sm:w-28 md:w-32 h-24 sm:h-28 md:h-32 rounded-full ${option.bgColor} border border-white/10 ${option.borderColor} ${option.shadow} hover:${option.hoverBg} hover:${option.hoverShadow} transition-all duration-500 ease-in-out flex items-center justify-center backdrop-blur-sm`}
              >
                {/* 球体内部为空白，柔和发光效果 */}
              </motion.button>
              {/* 文本标签在球体下方 */}
              <motion.p
                whileHover={{ scale: 1.05 }}
                className="text-sm sm:text-sm md:text-base text-gray-100 tracking-wide text-center max-w-[100px] sm:max-w-[120px] md:max-w-[140px]"
              >
                {option.label}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>
        
        {/* 底部链接 */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16"
        >
          {isLoggedIn && (
            <button
              onClick={() => router.push('/dashboard')}
              className="text-sm text-white/40 hover:text-white transition-colors underline-offset-4 hover:underline"
            >
              Enter Dashboard
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}