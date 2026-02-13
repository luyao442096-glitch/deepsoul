'use server';

import { getCategoryPosts } from '@/lib/posts';

export async function getRecentArticles() {
  const CATEGORIES = ["Burnout", "Can't Sleep", "Invisible", "Spiraling", "Stuck in Overwhelm"];
  const allPosts: any[] = [];
  
  // 从所有分类中获取文章
  for (const category of CATEGORIES) {
    const posts = await getCategoryPosts(category.toLowerCase().replace(/[^a-z0-9]/g, '-'));
    allPosts.push(...posts);
  }
  
  // 按日期排序，取最新的 3 篇
  const sortedPosts = allPosts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
  
  return sortedPosts;
}