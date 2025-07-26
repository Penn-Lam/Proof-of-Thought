# PoT Landing Page

基于React和Next.js的现代化landing page，专为Proof of Thought项目设计。

## 特性

- 🎬 **滚动展开Hero**: 使用framer-motion实现的沉浸式滚动体验
- 📱 **响应式设计**: 完美适配移动端和桌面端
- 🎨 **现代化UI**: 使用Tailwind CSS和shadcn设计系统
- ⚡ **高性能**: Next.js 14 App Router优化
- 🎯 **PoT主题**: 专为"人类思考证明"概念定制

## 技术栈

- **框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **图标**: Lucide React
- **语言**: TypeScript

## 快速开始

### 1. 安装依赖

```bash
cd landing
npm install
# 或
yarn install
```

### 2. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看页面。

### 3. 构建生产版本

```bash
npm run build
npm start
# 或
yarn build
yarn start
```

## 项目结构

```
landing/
├── app/                    # Next.js App Router
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页
├── components/            # React组件
│   ├── ui/               # UI组件
│   │   └── scroll-expansion-hero.tsx
│   └── hero-content.tsx  # Hero内容
├── lib/                  # 工具函数
└── public/              # 静态资源
```

## 自定义内容

### 修改Hero内容

编辑 `components/hero-content.tsx` 文件来自定义PoT的介绍内容。

### 更换媒体资源

在 `app/page.tsx` 中修改以下props：

```tsx
<ScrollExpandMedia
  mediaSrc="你的视频URL"
  posterSrc="视频封面图"
  bgImageSrc="背景图"
  title="你的标题"
  date="副标题"
  scrollToExpand="滚动提示文字"
/>
```

### 自定义样式

- 全局样式: `app/globals.css`
- Tailwind配置: `tailwind.config.js`
- 颜色主题: 基于CSS变量，支持明暗模式

## 部署

支持多种部署方式：

### Vercel (推荐)

```bash
npm i -g vercel
vercel --prod
```

### Netlify

```bash
npm run build
# 上传build文件夹到Netlify
```

### 自建服务器

```bash
npm run build
npm start
```

## 注意事项

1. **图片域名**: 确保在 `next.config.js` 中添加你的图片CDN域名
2. **响应式**: 组件已优化移动端体验
3. **性能**: 使用Next.js Image组件优化图片加载
4. **SEO**: 已配置基础SEO，可根据需要调整

## 许可证

MIT License - 详见项目根目录LICENSE文件
