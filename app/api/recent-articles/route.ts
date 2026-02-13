import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// 定义需要扫描的文件夹（对应你硬盘上的真实文件夹名）
const FOLDERS = ['burnout', 'cant-sleep', 'invisible', 'spiraling', 'stuck-in-overwhelm'];

// 定义文件夹名到显示名的映射
const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  'burnout': 'Burnout',
  'cant-sleep': "Can't Sleep",
  'invisible': 'Invisible',
  'spiraling': 'Spiraling',
  'stuck-in-overwhelm': 'Stuck in Overwhelm'
};

export async function GET() {
  try {
    const postsDirectory = path.join(process.cwd(), 'posts');
    let allArticles: any[] = [];

    // 遍历每个分类文件夹
    for (const folder of FOLDERS) {
      const folderPath = path.join(postsDirectory, folder);
      
      // 检查文件夹是否存在
      if (fs.existsSync(folderPath)) {
        const fileNames = fs.readdirSync(folderPath);

        // 遍历该文件夹下的 md 文件
        const folderArticles = fileNames
          .filter(fileName => fileName.endsWith('.md'))
          .map(fileName => {
            try {
              const fullPath = path.join(folderPath, fileName);
              const fileContents = fs.readFileSync(fullPath, 'utf8');
              const { data } = matter(fileContents); // 读取 frontmatter

              return {
                title: data.title || fileName.replace(/-/g, ' ').replace('.md', ''),
                category: CATEGORY_DISPLAY_NAMES[folder], 
                slug: fileName.replace(/\.md$/, ''),
                date: data.date || new Date().toISOString(),
                description: data.description || ''
              };
            } catch (err) {
              // 关键修改：如果某个文件读取失败，打印错误但不崩溃
              console.error(`⚠️ 警告: 文件 ${folder}/${fileName} 格式有误，已跳过。错误信息:`, err);
              return null;
            }
          })
          // 过滤掉读取失败的 null 文件
          .filter(article => article !== null);

        allArticles = [...allArticles, ...folderArticles];
      }
    }

    // 按日期排序
    allArticles.sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));

    return NextResponse.json(allArticles);
  } catch (error) {
    console.error('Error fetching recent articles:', error);
    // 即使发生严重错误，也返回空数组，防止前端白屏
    return NextResponse.json([], { status: 200 });
  }
}