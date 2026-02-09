'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function WelcomePage() {
  const router = useRouter();

  // 处理开始旅程按钮点击
  const handleStartJourney = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050A18] to-[#0A1929] text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* 增强的背景效果 */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] animate-pulse-slow" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] animate-pulse-slow" />
      <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-blue-900/5 rounded-full blur-[200px]" />
      
      {/* 主内容 */}
      <div className="z-10 text-center max-w-4xl px-6 py-20">
        {/* 标签 */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12"
        >
          <span className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white/70 font-medium tracking-wider">
            AI MENTAL WELLNESS COMPANION
          </span>
        </motion.div>
        
        {/* 标题 */}
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-7xl md:text-8xl font-serif mb-10 leading-tight text-white drop-shadow-lg"
        >
          DeepSoul
        </motion.h1>
        
        {/* 副标题 */}
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="text-xl md:text-2xl text-white/60 mb-20 max-w-2xl mx-auto leading-relaxed font-light"
        >
          The world is noisy. Your soul deserves a quiet place.
          <br />
          <span className="text-white/50">An AI sanctuary tailored to your inner state.</span>
        </motion.p>
        
        {/* 按钮 */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          whileHover={{ scale: 1.05, y: -4, boxShadow: "0 0 40px rgba(255, 255, 255, 0.2)" }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStartJourney}
          className="px-16 py-5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white font-medium transition-all duration-500 backdrop-blur-sm flex items-center gap-3 mx-auto"
        >
          <span className="text-lg">Start Journey</span>
          <span className="text-amber-300">✨</span>
        </motion.button>
        
        {/* 底部链接 */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          className="mt-24"
        >
          <Link 
            href="/dashboard" 
            className="text-sm text-white/40 hover:text-white transition-colors duration-300 underline-offset-4 hover:underline font-light"
          >
            Enter Dashboard
          </Link>
        </motion.div>
      </div>
      
      {/* 装饰性元素 */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
}
