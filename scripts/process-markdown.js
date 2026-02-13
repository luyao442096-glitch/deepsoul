const fs = require('fs');
const path = require('path');

// 配置
const POSTS_DIR = path.join(__dirname, '..', 'posts');
const OUTPUT_DIR = path.join(__dirname, '..', 'posts-processed');

// 获取当前日期 (YYYY-MM-DD)
function getCurrentDate() {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

// 从标题生成 SEO 友好的 slug
function generateSlug(title) {
  // 移除标题开头的 #
  const cleanTitle = title.replace(/^#\s*/, '');
  
  // 转换为小写
  let slug = cleanTitle.toLowerCase();
  
  // 移除特殊字符，保留字母、数字、空格和连字符
  slug = slug.replace(/[^\w\s-]/g, '');
  
  // 将空格和多个连字符替换为单个连字符
  slug = slug.replace(/[\s_]+/g, '-');
  slug = slug.replace(/-+/g, '-');
  
  // 移除开头和结尾的连字符
  slug = slug.replace(/^-+|-+$/g, '');
  
  // 限制为最多 4 个单词
  const words = slug.split('-');
  if (words.length > 4) {
    slug = words.slice(0, 4).join('-');
  }
  
  // 限制长度（最多 60 个字符）
  if (slug.length > 60) {
    slug = slug.substring(0, 60).replace(/-+$/, '');
  }
  
  return slug;
}

// 生成 SEO 描述 (130-160 字符)
function generateSEODescription(content) {
  // 移除标题行
  const lines = content.split('\n').filter(line => !line.trim().startsWith('#'));
  
  // 查找包含关键词的句子
  const keywords = ['you', 'your', 'learn', 'discover', 'guide', 'help', 'why', 'how', 'what'];
  let bestSentence = '';
  
  for (const line of lines) {
    if (line.trim().length > 50 && line.trim().length < 200) {
      const hasKeyword = keywords.some(kw => line.toLowerCase().includes(kw));
      if (hasKeyword && line.trim().length > bestSentence.length) {
        bestSentence = line.trim();
      }
    }
  }
  
  // 如果没有找到合适的句子，使用第一段
  if (!bestSentence) {
    const firstParagraph = lines.find(line => line.trim().length > 30);
    if (firstParagraph) {
      bestSentence = firstParagraph.trim();
    }
  }
  
  // 清理句子
  bestSentence = bestSentence
    .replace(/\*\*/g, '') // 移除 Markdown 加粗标记
    .replace(/\*/g, '')   // 移除 Markdown 斜体标记
    .replace(/`/g, '')    // 移除代码标记
    .replace(/\s+/g, ' ') // 合并多个空格
    .trim();
  
  // 限制长度为 130-160 字符
  if (bestSentence.length > 160) {
    bestSentence = bestSentence.substring(0, 157) + '...';
  } else if (bestSentence.length < 130 && bestSentence.length > 0) {
    // 如果太短，尝试添加更多内容
    const nextSentence = lines.find(line => 
      line.trim().length > 30 && 
      line.trim() !== bestSentence
    );
    if (nextSentence) {
      const combined = bestSentence + ' ' + nextSentence.trim().substring(0, 160 - bestSentence.length - 4);
      bestSentence = combined + '...';
    }
  }
  
  return bestSentence || 'A comprehensive guide to help you understand and navigate this topic.';
}

// 处理单个 Markdown 文件
function processMarkdownFile(filePath, category) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    // 提取标题（第一行）
    const titleLine = lines.find(line => line.trim().startsWith('#'));
    if (!titleLine) {
      console.log(`  ⚠️  跳过：未找到标题 - ${path.basename(filePath)}`);
      return null;
    }
    
    const title = titleLine.replace(/^#\s*/, '').trim();
    
    // 生成 slug
    const slug = generateSlug(title);
    
    // 生成 SEO 描述
    const seoDescription = generateSEODescription(content);
    
    // 移除标题行，保留正文
    const bodyLines = lines.filter(line => !line.trim().startsWith('#'));
    const bodyContent = bodyLines.join('\n').trim();
    
    // 生成 Frontmatter
    const frontmatter = `---
title: "${title}"
date: ${getCurrentDate()}
description: "${seoDescription}"
category: "${category}"
slug: "${slug}"
---

`;
    
    // 组合最终内容
    const finalContent = frontmatter + bodyContent;
    
    return {
      originalPath: filePath,
      slug,
      title,
      seoDescription,
      content: finalContent
    };
  } catch (error) {
    console.error(`  ❌ 处理文件失败：${filePath}`, error.message);
    return null;
  }
}

// 递归扫描文件夹
function scanDirectory(dir, category = '') {
  const results = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // 如果是子文件夹，使用文件夹名作为分类
      const subCategory = item;
      const subResults = scanDirectory(fullPath, subCategory);
      results.push(...subResults);
    } else if (item.endsWith('.md')) {
      // 处理 Markdown 文件
      const processed = processMarkdownFile(fullPath, category);
      if (processed) {
        results.push(processed);
      }
    }
  }
  
  return results;
}

// 主函数
function main() {
  console.log('🚀 开始处理 Markdown 文件...\n');
  
  // 创建输出目录
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true });
  }
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  
  // 扫描并处理所有文件
  const processedFiles = scanDirectory(POSTS_DIR);
  
  console.log(`\n📁 找到 ${processedFiles.length} 个 Markdown 文件\n`);
  
  // 写入处理后的文件
  let successCount = 0;
  const categoryMap = {};
  
  for (const file of processedFiles) {
    try {
      // 按分类组织文件
      const categoryDir = path.join(OUTPUT_DIR, file.slug.split('-')[0]); // 使用 slug 的第一部分作为子文件夹
      if (!fs.existsSync(categoryDir)) {
        fs.mkdirSync(categoryDir, { recursive: true });
      }
      
      // 或者使用原始分类
      const originalCategoryDir = path.join(OUTPUT_DIR, file.content.match(/category:\s*"([^"]+)"/)?.[1] || 'uncategorized');
      if (!fs.existsSync(originalCategoryDir)) {
        fs.mkdirSync(originalCategoryDir, { recursive: true });
      }
      
      const outputPath = path.join(originalCategoryDir, `${file.slug}.md`);
      fs.writeFileSync(outputPath, file.content, 'utf-8');
      
      console.log(`✅ ${file.slug}.md`);
      console.log(`   标题: ${file.title}`);
      console.log(`   描述: ${file.seoDescription}`);
      console.log(`   分类: ${file.content.match(/category:\s*"([^"]+)"/)?.[1] || 'uncategorized'}`);
      console.log('');
      
      successCount++;
      
      // 统计分类
      const category = file.content.match(/category:\s*"([^"]+)"/)?.[1] || 'uncategorized';
      if (!categoryMap[category]) {
        categoryMap[category] = 0;
      }
      categoryMap[category]++;
    } catch (error) {
      console.error(`❌ 写入文件失败：${file.slug}`, error.message);
    }
  }
  
  // 输出统计信息
  console.log('📊 处理完成统计：\n');
  console.log(`   总文件数: ${processedFiles.length}`);
  console.log(`   成功处理: ${successCount}`);
  console.log(`   失败: ${processedFiles.length - successCount}`);
  console.log('\n📂 按分类统计：\n');
  for (const [category, count] of Object.entries(categoryMap)) {
    console.log(`   ${category}: ${count} 篇文章`);
  }
  console.log(`\n📂 处理后的文件保存在: ${OUTPUT_DIR}`);
}

// 运行脚本
main();