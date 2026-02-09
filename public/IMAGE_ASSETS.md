# 图片资源清单

## 必需的图片文件

请将以下图片文件放入 `public` 文件夹中：

### 1. 背景图片
- **文件名**: `bg-zen-room.jpg`
- **用途**: 全屏禅房背景图
- **要求**:
  - 分辨率: 至少 1920x1080
  - 内容: 明亮的日式茶室、榻榻米、透过窗户的自然光
  - 风格: 温暖、阳光明媚、禅意氛围
  - 格式: JPG 或 PNG

### 2. 木鱼图片
- **文件名**: `wood-block-real.png`
- **用途**: 高清木鱼抠图（透明背景）
- **要求**:
  - 分辨率: 至少 800x640
  - 内容: 实木材质的木鱼，有细腻的木纹和反光
  - 背景: 透明背景（PNG 格式）
  - 风格: 真实的木质质感，有光泽感

### 3. 念珠图片
- **文件名**: `beads-real.png`
- **用途**: 高清念珠抠图（透明背景）
- **要求**:
  - 分辨率: 至少 560x1040
  - 内容: 垂直排列的念珠，每颗珠子都有光泽
  - 材质: 檀木或核桃材质
  - 背景: 透明背景（PNG 格式）
  - 风格: 真实的珠子质感，有反光和阴影

## 可选的图片文件

### 4. 木槌图片（可选）
- **文件名**: `mallet.png`
- **用途**: 敲击用的木槌（跟随鼠标移动）
- **要求**:
  - 分辨率: 适中大小
  - 内容: 木质木槌
  - 背景: 透明背景（PNG 格式）

## 备用方案

如果暂时没有真实图片，组件已经内置了 SVG 备用方案：
- 木鱼会显示为木质渐变的椭圆形
- 念珠会显示为带有光泽感的圆形珠子
- 背景会显示为温暖的米色渐变

## 图片获取建议

### 背景图片推荐
- 搜索关键词: "Japanese tea room", "Zen meditation room", "Tatami room with natural light"
- 推荐网站: Unsplash, Pexels, Pixabay
- 注意: 选择明亮、温暖、有自然光的照片

### 木鱼图片推荐
- 搜索关键词: "Wooden fish instrument PNG", "Muyu wooden block transparent"
- 推荐网站: PNGEgg, PNGWing, CleanPNG
- 注意: 选择透明背景、高分辨率的图片

### 念珠图片推荐
- 搜索关键词: "Prayer beads PNG", "Mala beads transparent", "Wooden beads necklace"
- 推荐网站: PNGEgg, PNGWing, CleanPNG
- 注意: 选择透明背景、垂直排列的念珠

## 文件放置位置

将所有图片文件放入以下目录：
```
d:\healing-site\public\
├── bg-zen-room.jpg
├── wood-block-real.png
├── beads-real.png
└── mallet.png (可选)
```

## 图片优化建议

1. **压缩图片**: 使用工具如 TinyPNG 或 Squoosh 压缩图片大小
2. **保持质量**: 确保压缩后的图片仍然保持高质量
3. **WebP 格式**: 可以考虑使用 WebP 格式以获得更好的压缩率
4. **响应式图片**: 如果需要支持不同屏幕尺寸，可以准备多个尺寸的图片

## 测试

放置图片后，访问 http://localhost:3001/pet 查看效果。如果图片加载失败，组件会自动显示 SVG 备用方案。
