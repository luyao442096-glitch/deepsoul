'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface CategoryPageUIProps {
  currentSlug: string;
  categoryPosts: any[];
  displayTitle: string;
  content: {
    title: string;
    subtitle: string;
    color: string;
    buttonText: string;
    seoTitle: string;
    seoDesc: string;
  };
}

const CategoryPageUI = ({ currentSlug, categoryPosts, displayTitle, content }: CategoryPageUIProps) => {
  return (
    <main className="min-h-screen bg-[#050A18] text-slate-200 relative overflow-hidden">
      {/* --- 第一屏：主题内容 (Banner) --- */}
      <div className="min-h-screen flex flex-col items-center justify-center px-6 relative">
        {/* 这里的隐藏文本作为 SEO 双重保险 */}
        <div className="sr-only">
          <h1>{content.seoTitle}</h1>
          <p>{content.seoDesc}</p>
          <article>
            <h2>{content.title}</h2>
            <p>{content.subtitle}</p>
          </article>
        </div>

        {/* 320px 聚焦光球 */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] ${content.color} rounded-full blur-[90px] opacity-40 animate-pulse-slow pointer-events-none`}></div>

        <div className="z-10 max-w-2xl text-center space-y-10 animate-fade-in-up">
          {/* 标题：衬线体，大字号 */}
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-serif text-white tracking-wide leading-tight drop-shadow-2xl"
          >
            {content.title}
          </motion.h2>
          
          {/* 副标题：轻盈的无衬线体 */}
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-slate-300/80 font-light leading-relaxed max-w-lg mx-auto"
          >
            {content.subtitle}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-8"
          >
            {/* 链接指向嵌套的测试页 */}
            <Link href={`/${currentSlug}/onboarding`}> 
              <button className="group relative px-10 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500 backdrop-blur-sm">
                <span className="text-sm tracking-[0.2em] uppercase text-white/90 group-hover:text-white flex items-center gap-3">
                  {content.buttonText} <ArrowRight className="w-4 h-4 opacity-70" />
                </span>
              </button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* --- 第二屏：文章列表 (SEO List) --- */}
      <section className="max-w-3xl mx-auto px-6 py-24 min-h-[50vh]">
        
        {/* 1. 顶部导航/面包屑 */}
        <div className="flex items-center space-x-2 text-xs text-white/40 mb-12 uppercase tracking-widest">
           <Link href="/" className="hover:text-white transition-colors">Home</Link>
           <span>/</span>
           <span className="text-white">{displayTitle}</span>
        </div>

        {/* 2. 列表区域 */}
        <div className="flex flex-col space-y-1">
          {/* 列表标题 */}
          <h2 className="text-xl md:text-2xl font-light mb-8 text-white/90">
            Articles for <span className="font-bold text-white">{displayTitle}</span>
          </h2>

          {/* 文章遍历 */}
          {categoryPosts.length > 0 ? (
            categoryPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/category/${currentSlug}/${post.slug}`}
                className="group block py-5 border-b border-white/10 hover:border-white/40 transition-all duration-300"
              >
                <div className="flex justify-between items-center">
                  <div className="pr-4">
                    {/* 文章标题 */}
                    <h3 className="text-lg text-gray-300 group-hover:text-white font-normal transition-colors">
                      {post.title}
                    </h3>
                    {/* 简短描述 (SEO Description) */}
                    <p className="text-sm text-gray-600 mt-2 line-clamp-1 group-hover:text-gray-500 transition-colors">
                      {post.description}
                    </p>
                  </div>
                  
                  {/* 右侧箭头 */}
                  <span className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all">
                    &rarr;
                  </span>
                </div>
              </Link>
            ))
          ) : (
            // 空状态处理
            <div className="py-12 text-center border-t border-b border-white/5">
              <p className="text-gray-500 mb-4">Content is incubating...</p>
              <Link href="/" className="text-sm text-white/60 hover:text-white underline">
                Return Home
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* --- 底部温馨提示 (保持全站统一) --- */}
      <footer className="py-12 text-center">
        <p className="text-[10px] text-white/20">
          DeepSoul AI • Companion for {displayTitle}
        </p>
      </footer>
    </main>
  );
};

export default CategoryPageUI;