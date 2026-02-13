# Favicon 和 Open Graph 图片文件清单

## 需要创建的图片文件

### Favicon 文件
- `public/favicon.ico` (32x32)
- `public/favicon-16x16.png` (16x16)
- `public/favicon-32x32.png` (32x32)
- `public/apple-touch-icon.png` (180x180)
- `public/android-chrome-192x192.png` (192x192)
- `public/android-chrome-512x512.png` (512x512)

### Open Graph 图片
- `public/og-image.jpg` (1200x630) - 用于 Facebook/LinkedIn 分享
- `public/twitter-image.jpg` (1200x600) - 用于 Twitter 分享

### Logo 文件
- `public/logo.png` (建议 512x512) - 用于结构化数据

## 如何创建这些文件

### 使用在线工具
1. 访问 https://realfavicongenerator.net/
2. 上传你的 logo 图片
3. 下载生成的所有 favicon 文件
4. 将文件放入 `public/` 文件夹

### 使用设计工具
1. 使用 Figma、Canva 或 Adobe Illustrator
2. 创建 1200x630 的 Open Graph 图片
3. 添加品牌名称和简短描述
4. 导出为 JPG 格式

## 在 layout.tsx 中添加链接

创建完图片文件后，需要在 `app/layout.tsx` 的 `<head>` 标签中添加以下链接：

```typescript
<link rel="icon" href="/favicon.ico" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#050A18" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
```

## 设计建议

### Favicon 设计
- 使用品牌主色调
- 简洁的图标或首字母
- 在小尺寸下清晰可见

### Open Graph 图片设计
- 尺寸：1200x630 像素
- 包含品牌 logo
- 添加吸引人的标题
- 使用品牌主色调
- 确保文字清晰可读

### Logo 设计
- 简洁、专业
- 适合深色和浅色背景
- 可缩放到不同尺寸