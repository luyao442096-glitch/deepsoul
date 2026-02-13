'use server';

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter'; // 使用专业的解析库，不再手动正则匹配

const POSTS_DIR = path.join(process.cwd(), 'posts');

// 保持接口定义不变，防止报错
export interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
  category: string;
  content: string;
}

export interface PostMetadata {
  title: string;
  date: string;
  description: string;
  category: string;
  slug: string;
}

// 获取指定分类下的所有文章
export async function getCategoryPosts(category: string): Promise<Post[]> {
  try {
    const categoryPath = path.join(POSTS_DIR, category);
    
    // 检查文件夹是否存在
    if (!fs.existsSync(categoryPath)) {
      return [];
    }
    
    const files = fs.readdirSync(categoryPath);
    const mdFiles = files.filter(file => file.endsWith('.md'));
    
    const posts: Post[] = [];
    
    for (const file of mdFiles) {
      const filePath = path.join(categoryPath, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      
      try {
        // 关键修改：使用 gray-matter 自动解析，它能忽略 BOM 和换行符差异
        const { data, content } = matter(fileContent);
        const slug = file.replace('.md', '');
        
        posts.push({
          slug,
          title: data.title || slug,
          date: data.date || new Date().toISOString(),
          description: data.description || '',
          category: data.category || category, // 优先用 metadata 里的，没有就用文件夹名
          content
        });
      } catch (error) {
        console.error(`⚠️ 跳过损坏文件: ${file}`, error);
        // 跳过坏文件，不让整个页面崩溃
      }
    }
    
    // 按日期降序排列
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error(`Error reading category ${category}:`, error);
    return [];
  }
}

// 获取指定文章的完整数据
export async function getPostData(category: string, slug: string): Promise<Post | null> {
  try {
    const filePath = path.join(POSTS_DIR, category, `${slug}.md`);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    // 关键修改：使用 gray-matter 解析
    const { data, content } = matter(fileContent);
    
    return {
      slug,
      title: data.title || slug,
      date: data.date || new Date().toISOString(),
      description: data.description || '',
      category: data.category || category,
      content
    };
  } catch (error) {
    console.error(`Error reading post ${category}/${slug}:`, error);
    return null;
  }
}

// 获取所有分类
export async function getAllCategories(): Promise<string[]> {
  try {
    if (!fs.existsSync(POSTS_DIR)) {
      return [];
    }
    
    const items = fs.readdirSync(POSTS_DIR);
    const categories = items.filter(item => {
      const itemPath = path.join(POSTS_DIR, item);
      return fs.statSync(itemPath).isDirectory();
    });
    
    return categories;
  } catch (error) {
    console.error('Error reading categories:', error);
    return [];
  }
}