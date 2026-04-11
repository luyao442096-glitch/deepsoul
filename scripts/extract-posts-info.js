const fs = require('fs');
const path = require('path');

// 读取目录下所有 Markdown 文件
function getAllMarkdownFiles(dir) {
  let files = [];
  
  function traverse(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        traverse(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

// 提取 Frontmatter 信息
function extractFrontmatter(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 检查文件是否以 --- 开头
    if (!content.startsWith('---')) {
      return null;
    }
    
    // 找到结束的 ---
    const endIndex = content.indexOf('---', 3);
    if (endIndex === -1) {
      return null;
    }
    
    const frontmatter = content.substring(3, endIndex).trim();
    const lines = frontmatter.split('\n');
    
    const data = {};
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine) {
        const colonIndex = trimmedLine.indexOf(':');
        if (colonIndex !== -1) {
          const key = trimmedLine.substring(0, colonIndex).trim();
          let value = trimmedLine.substring(colonIndex + 1).trim();
          // 移除引号
          value = value.replace(/^["']|['"]$/g, '');
          data[key] = value;
        }
      }
    }
    
    return data;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return null;
  }
}

// 主函数
function main() {
  const postsDir = path.join(__dirname, '..', 'posts');
  const markdownFiles = getAllMarkdownFiles(postsDir);
  
  const posts = [];
  const filesWithoutFrontmatter = [];
  
  for (const file of markdownFiles) {
    const frontmatter = extractFrontmatter(file);
    
    if (frontmatter && frontmatter.title && frontmatter.slug && frontmatter.category && frontmatter.date) {
      posts.push({
        filePath: file,
        title: frontmatter.title,
        slug: frontmatter.slug,
        category: frontmatter.category,
        date: frontmatter.date
      });
    } else {
      filesWithoutFrontmatter.push(file);
    }
  }
  
  // 按日期从新到旧排序
  posts.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
  
  // 生成 Markdown 表格
  console.log('# 博客文章信息\n');
  console.log('| 标题 | 分类 | 发布日期 | Slug | 链接 |');
  console.log('| --- | --- | --- | --- | --- |');
  
  for (const post of posts) {
    // 处理分类名称，确保 URL 格式正确
    let categorySlug = post.category.toLowerCase();
    categorySlug = categorySlug.replace(/\s+/g, '-'); // 替换空格为连字符
    categorySlug = categorySlug.replace(/[^a-z0-9-]/g, ''); // 移除特殊字符
    
    const fullUrl = `https://www.deepsoullab.com/category/${categorySlug}/${post.slug}`;
    console.log(`| ${post.title} | ${post.category} | ${post.date} | ${post.slug} | [${fullUrl}](${fullUrl}) |`);
  }
  
  // 列出缺少 Frontmatter 的文件
  if (filesWithoutFrontmatter.length > 0) {
    console.log('\n# 缺少 Frontmatter 的文件\n');
    for (const file of filesWithoutFrontmatter) {
      console.log(`- ${file}`);
    }
  }
}

main();
