'use client';
import React from 'react';
import Link from "next/link";
import { articles } from '../../data/articles';

// 辅助函数：标准化字符串以进行匹配
const normalizeString = (str: string) => {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '-');
};

// 辅助函数：根据分类获取文章
const getArticlesByCategory = (category: string) => {
  // 特殊处理 Can't Sleep 分类
  if (category === 'cant-sleep') {
    return Object.entries(articles)
      .filter(([_, article]) => article.category === "Can't Sleep")
      .slice(0, 5);
  }
  
  // 通用匹配
  return Object.entries(articles)
    .filter(([_, article]) => normalizeString(article.category) === normalizeString(category))
    .slice(0, 5); // 只取前5篇
};

interface KeywordSectionProps {
  initialKeyword: string;
}

export default function KeywordSection({ initialKeyword }: KeywordSectionProps) {
  // 核心关键词数据
  const coreKeywords = [
    { id: 'burnout', label: 'Burnout' },
    { id: 'cant-sleep', label: "Can't Sleep" },
    { id: 'invisible', label: 'Invisible' },
    { id: 'spiraling', label: 'Spiraling' },
    { id: 'stuck-in-overwhelm', label: 'Stuck in Overwhelm' }
  ];

  // 获取当前关键词的显示名称
  const currentKeywordLabel = coreKeywords.find(k => k.id === initialKeyword)?.label || initialKeyword;

  return (
    <div className="py-24 px-6">
      {/* 文章列表 */}
      <div className="max-w-3xl mx-auto">
        <h4 className="text-lg font-medium text-white mb-6">Articles for {currentKeywordLabel}</h4>
        <div className="space-y-4">
          {getArticlesByCategory(initialKeyword).length > 0 ? (
            getArticlesByCategory(initialKeyword).map(([articleSlug, article]) => (
              <Link
                key={articleSlug}
                href={`/topics/${articleSlug}`}
                className="group block p-4 border-b border-white/5 hover:border-white/20 transition-all"
              >
                <div className="flex justify-between items-baseline">
                  <h2 className="text-lg text-gray-300 group-hover:text-white transition-colors">
                    {article.title}
                  </h2>
                  <span className="text-xs text-gray-600 group-hover:text-gray-400 ml-4">
                    Read &rarr;
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500 mt-10">No articles found in this category yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}