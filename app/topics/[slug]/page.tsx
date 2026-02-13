'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ArticleHero from '@/app/components/ArticleHero';
import ArticleCTA from '@/app/components/ArticleCTA';
import ReactMarkdown from 'react-markdown';
import { articles } from '@/data/articles';

// 辅助函数：标准化字符串以进行匹配
const normalizeString = (str: string) => {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '-');
};

export default function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const { slug } = use(params);
  
  // 1. 获取文章数据
  const articleKey = Object.keys(articles).find(
    (key) => normalizeString(key) === normalizeString(slug)
  );

  if (!articleKey || !articles[articleKey]) {
    return notFound();
  }

  const article = articles[articleKey as keyof typeof articles];

  return (
    <main className="min-h-screen bg-[#050A18] relative">
      <ArticleHero category={article.category} />
      
      {/* AI对话按钮 */}
      <ArticleCTA />
      
      {/* 2. 核心阅读容器 - 关键修改 */}
      {/* mt-24 拉开与圆圈的距离, max-w-4xl 限制宽度为 800px+, mx-auto 居中 */}
      <article className="max-w-4xl mx-auto px-6 md:px-8 pt-24 pb-[100px]">
      
        
        {/* SEO Schema - BreadcrumbList */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              'itemListElement': [
                {
                  '@type': 'ListItem',
                  'position': 1,
                  'name': 'Home',
                  'item': 'http://localhost:3000'
                },
                {
                  '@type': 'ListItem',
                  'position': 2,
                  'name': article.category,
                  'item': `http://localhost:3000/category/${normalizeString(article.category)}`
                },
                {
                  '@type': 'ListItem',
                  'position': 3,
                  'name': article.title,
                  'item': `http://localhost:3000/topics/${slug}`
                }
              ]
            })
          }}
        />
        
        {/* 面包屑导航 */}
        <nav className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-10">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link
            href={`/category/${normalizeString(article.category)}`}
            className="hover:text-white transition-colors"
          >
            {article.category}
          </Link>
          <span>/</span>
          <span className="text-gray-400">{article.title}</span>
        </nav>
        
        {/* 文章大标题 - 居中 */}
        <h1 className="text-3xl md:text-4xl font-bold text-center leading-tight tracking-tight mb-16 text-white">
          {article.title}
        </h1>
        
        {/* 文章正文 - 这里的 prose 类会自动美化 Markdown */}
        {/* prose-invert 让文字在黑底上变白, prose-lg 增加字号 */}
        <div className="prose prose-invert prose-lg max-w-none text-gray-300">
          <ReactMarkdown
            components={{
              // 不渲染 Markdown 中的 h1 标题（避免重复）
              h1: ({node, ...props}) => null,
              // 自定义 h2 样式
              h2: ({node, ...props}) => <h2 className="text-2xl font-semibold text-white mt-12 mb-6" {...props} />,
              // 自定义段落样式
              p: ({node, ...props}) => <p className="leading-relaxed mb-6 text-gray-300" {...props} />,
              // 自定义列表样式
              ul: ({node, ...props}) => <ul className="list-disc pl-6 space-y-2 mb-6 text-gray-300" {...props} />,
              li: ({node, ...props}) => <li className="pl-1" {...props} />,
              // 自定义加粗样式
              strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>
      </article>
    </main>
  );
}