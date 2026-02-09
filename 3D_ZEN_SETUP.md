# 3D 禅意空间 - 安装和使用说明

## 📦 需要安装的 npm 包

请运行以下命令安装所需的依赖：

```bash
npm install @react-three/fiber @react-three/drei three framer-motion howler
```

或者使用 yarn：

```bash
yarn add @react-three/fiber @react-three/drei three framer-motion howler
```

## 📁 需要准备的资源文件

### 1. 背景图片
**文件路径**: `public/bg-zen-room.jpg`
- **要求**: 温暖、明亮的日式禅房图片
- **分辨率**: 至少 1920x1080
- **用途**: 全屏背景图

### 2. 3D 模型文件
**文件路径**: `public/models/wooden-fish.glb`
- **要求**: 高质量的木鱼 3D 模型
- **格式**: GLB (GL Transmission Format)
- **用途**: 木鱼敲击模式的主要交互对象

**文件路径**: `public/models/prayer-beads.glb`
- **要求**: 高质量的念珠 3D 模型
- **格式**: GLB (GL Transmission Format)
- **用途**: 念珠拨动模式的主要交互对象

### 3. 音频文件
**文件路径**: `public/sounds/wooden-fish.mp3`
- **要求**: 真实的木鱼敲击声音
- **格式**: MP3
- **用途**: 木鱼敲击时的音效

**文件路径**: `public/sounds/bead-click.mp3`
- **要求**: 真实的珠子碰撞声音
- **格式**: MP3
- **用途**: 念珠拨动时的音效

## 📂 完整的文件结构

```
d:\healing-site\
├── public\
│   ├── bg-zen-room.jpg              # 禅房背景图
│   ├── models\
│   │   ├── wooden-fish.glb          # 木鱼 3D 模型
│   │   └── prayer-beads.glb         # 念珠 3D 模型
│   └── sounds\
│       ├── wooden-fish.mp3           # 木鱼音效
│       └── bead-click.mp3            # 珠子音效
├── components\
│   └── ZenSpace3D.tsx              # 3D 禅意空间组件
└── app\
    └── pet\
        └── page.tsx                  # Pet 页面
```

## 🎨 组件功能说明

### 1. 选择大厅 (Selection View)
- **功能**: 显示两个磨砂玻璃卡片供用户选择
- **交互**: 
  - 悬停时卡片上浮发光
  - 点击时切换到对应的 3D 模式
- **视觉**: 
  - 左卡片: Echo Block (木鱼)
  - 右卡片: Infinity Loop (念珠)

### 2. 木鱼 3D 交互 (Wooden Fish Mode)
- **功能**: 3D 木鱼模型，支持点击交互
- **交互**:
  - 点击时模型瞬间缩放 (scale: 0.9) 并回弹
  - 播放木鱼敲击音效
  - 记录敲击次数
- **视觉**:
  - 使用 HDR 环境光 (sunset preset)
  - 真实的木质材质反光
  - 3D 投影效果

### 3. 念珠 3D 交互 (Prayer Beads Mode)
- **功能**: 3D 念珠模型，支持拖拽交互
- **交互**:
  - 上下拖拽时模型跟随旋转
  - 旋转速度超过阈值时触发音效
  - 移动端震动反馈 (navigator.vibrate)
  - 记录拨动次数
- **视觉**:
  - 使用 HDR 环境光 (sunset preset)
  - 真实的珠子材质反光
  - 3D 投影效果

### 4. UI 控制器
- **左上角**: 返回按钮
- **右上角**: 静音控制按钮
- **底部**: 返回选择大厅按钮

## 🔧 技术栈说明

### React Three Fiber (R3F)
- **作用**: 在 React 中使用 Three.js
- **版本**: 最新版本
- **主要组件**: Canvas, primitive

### React Three Drei
- **作用**: 提供常用的 3D 组件和工具
- **版本**: 最新版本
- **主要组件**: 
  - Environment (环境光)
  - OrbitControls (相机控制)
  - useGLTF (加载 GLB 模型)

### Framer Motion
- **作用**: 提供 UI 动画效果
- **版本**: 最新版本
- **主要组件**: motion, AnimatePresence

### Howler.js
- **作用**: 提供无延迟的音频播放
- **版本**: 最新版本
- **主要功能**: Howl 音频对象

## 🎯 使用说明

### 1. 安装依赖
```bash
npm install @react-three/fiber @react-three/drei three framer-motion howler
```

### 2. 准备资源文件
将以下文件放入对应目录：
- `public/bg-zen-room.jpg` - 禅房背景图
- `public/models/wooden-fish.glb` - 木鱼 3D 模型
- `public/models/prayer-beads.glb` - 念珠 3D 模型
- `public/sounds/wooden-fish.mp3` - 木鱼音效
- `public/sounds/bead-click.mp3` - 珠子音效

### 3. 启动开发服务器
```bash
npm run dev
```

### 4. 访问页面
打开浏览器访问: `http://localhost:3001/pet`

## 🎨 备用方案

如果模型加载失败，组件会自动显示几何体备用方案：
- 木鱼: 棕色球体
- 念珠: 棕色球体组成的串

## 📱 响应式设计

组件已针对不同设备进行优化：
- **桌面端**: 完整的 3D 交互体验
- **移动端**: 触摸友好的交互方式
- **平板端**: 自适应的布局和尺寸

## 🎵 音频说明

### 木鱼音效
- **触发**: 点击木鱼模型
- **音量**: 0.8
- **格式**: MP3
- **延迟**: 无延迟 (Howler.js)

### 珠子音效
- **触发**: 拖拽念珠模型
- **音量**: 0.6
- **格式**: MP3
- **延迟**: 无延迟 (Howler.js)

## 🔄 模式切换

用户可以在三种模式之间切换：
1. **Selection**: 选择大厅
2. **Wooden Fish**: 木鱼敲击模式
3. **Prayer Beads**: 念珠拨动模式

切换时有平滑的过渡动画。

## 🎯 下一步

1. 准备高质量的 3D 模型文件
2. 准备真实的音效文件
3. 准备温暖的禅房背景图
4. 测试所有交互功能
5. 优化性能和用户体验

## 🐛 故障排除

### 模型加载失败
- 检查模型文件路径是否正确
- 确认模型文件格式为 GLB
- 检查模型文件是否损坏

### 音频播放失败
- 检查音频文件路径是否正确
- 确认音频文件格式为 MP3
- 检查浏览器音频权限

### 页面白屏
- 检查是否安装了所有依赖
- 查看浏览器控制台错误信息
- 确认 Next.js 开发服务器正在运行

## 📞 支持

如有问题，请查看：
- React Three Fiber 文档: https://docs.pmnd.rs/react-three-fiber
- React Three Drei 文档: https://docs.pmnd.rs/drei
- Framer Motion 文档: https://www.framer.com/motion
- Howler.js 文档: https://howlerjs.com/
