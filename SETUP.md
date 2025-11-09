# 🚀 完整部署指南

## 📋 前置要求

- Node.js 18+ 
- npm/yarn/pnpm
- PostgreSQL 数据库（本地或云端）

## 🛠️ 本地开发设置

### 步骤 1: 安装依赖

```bash
npm install
```

### 步骤 2: 配置环境变量

创建 `.env` 文件（参考 `.env.example`）：

```env
# 数据库连接
DATABASE_URL="postgresql://username:password@localhost:5432/whatworthdoing?schema=public"

# 应用 URL（用于 SEO 和 Open Graph，生产环境必须配置）
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**重要**: 
- 本地开发可以使用 `http://localhost:3000`
- 生产环境必须配置正确的域名，如 `https://yourdomain.com`
- 这个 URL 用于 SEO 元数据、Open Graph、Twitter Card 等

### 步骤 3: 配置数据库

#### 选项 A: 本地 PostgreSQL

1. 安装 PostgreSQL (如果还没有)
2. 创建数据库:

```sql
CREATE DATABASE whatworthdoing;
```

#### 选项 B: Vercel Postgres (推荐用于生产)

1. 在 Vercel 创建项目
2. 添加 Postgres 存储:
   ```bash
   vercel postgres create
   ```
3. 复制连接字符串到 `.env`

#### 选项 C: Neon (免费且慷慨)

1. 访问 [Neon.tech](https://neon.tech)
2. 创建新项目
3. 复制连接字符串到 `.env`

### 步骤 3: 初始化数据库

```bash
# 推送数据库结构
npm run db:push

# 查看数据库 (可选)
npm run db:studio
```

### 步骤 4: 初始化数据

```bash
# 创建分类
npm run db:seed

# 导入示例应用数据
npm run import:data
```

### 步骤 5: 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000/zh](http://localhost:3000/zh)

## 🌐 部署到 Vercel

### 方法 1: 通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel

# 部署到生产环境
vercel --prod
```

### 方法 2: 通过 GitHub

1. 推送代码到 GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
3. 点击 "Import Project"
4. 选择你的 GitHub 仓库
5. 配置环境变量:
   - `DATABASE_URL`: 你的 PostgreSQL 连接字符串
   - `NEXT_PUBLIC_APP_URL`: 你的域名 (例如: https://yourapp.vercel.app)
6. 点击 "Deploy"

### 配置 Vercel Postgres

1. 在 Vercel 项目中，进入 "Storage" 标签
2. 点击 "Create Database" → "Postgres"
3. 连接会自动添加到环境变量
4. 在本地运行数据库迁移:

```bash
# 拉取环境变量
vercel env pull .env.local

# 推送数据库结构
npm run db:push

# 初始化数据
npm run db:seed
npm run import:data
```

## 📊 数据管理

### 查看数据库

```bash
npm run db:studio
```

这会启动 Prisma Studio 在 http://localhost:5555

### 备份数据

```bash
# 导出数据
pg_dump $DATABASE_URL > backup.sql

# 恢复数据
psql $DATABASE_URL < backup.sql
```

### 添加新应用

编辑 `scripts/import-data.ts` 文件，添加类似 `importShipFast()` 的函数，然后运行:

```bash
npm run import:data
```

## 🔧 常见问题

### Q: 数据库连接失败

**A:** 检查：
1. `DATABASE_URL` 格式是否正确
2. 数据库是否在运行
3. 用户名和密码是否正确
4. 防火墙是否允许连接

### Q: Prisma 客户端未生成

**A:** 运行:
```bash
npm run db:generate
```

### Q: 部署后页面空白

**A:** 检查：
1. 环境变量是否正确设置
2. 数据库是否初始化
3. Vercel 构建日志

### Q: 多语言路由不工作

**A:** 确保：
1. URL 包含语言代码 (例如: `/zh/apps`)
2. `middleware.ts` 配置正确
3. 清除浏览器缓存

## 🎨 自定义

### 修改主题色

编辑 `app/globals.css`:

```css
:root {
  --primary: 221.2 83.2% 53.3%; /* 修改主色 */
}
```

### 添加新语言

1. 在 `messages/` 创建新的 JSON 文件 (例如: `de.json`)
2. 在 `i18n.ts` 添加语言代码:
   ```typescript
   export const locales = ['zh', 'en', 'ja', 'fr', 'de'] as const;
   ```
3. 更新数据库模型添加相应字段

### 修改 Logo

编辑 `components/navbar.tsx`:

```tsx
<div className="text-2xl font-bold">
  你的 Logo
</div>
```

## 📈 性能优化

### 图片优化

使用 Next.js Image 组件:

```tsx
import Image from 'next/image';

<Image 
  src="/logo.png" 
  alt="Logo" 
  width={200} 
  height={50}
  priority
/>
```

### 数据库查询优化

1. 使用索引 (已在 schema.prisma 配置)
2. 限制查询数量:
   ```typescript
   take: 50, // 限制50条
   skip: 0,  // 分页偏移
   ```

### 缓存策略

Next.js 14 App Router 自动缓存:

```typescript
// 设置重新验证时间
export const revalidate = 3600; // 1小时
```

## 🔍 SEO 优化

本项目已内置完整的 SEO 优化功能：

### 已实现的 SEO 功能

✅ **动态元数据生成**
- 每个页面自动生成优化的 title 和 description
- 支持多语言元数据
- 自动包含关键词

✅ **Open Graph 标签**
- Facebook、LinkedIn 等社交媒体分享优化
- 自动生成预览图和描述

✅ **Twitter Card**
- Twitter 分享优化
- 大图卡片支持

✅ **结构化数据 (JSON-LD)**
- Schema.org SoftwareApplication 标记
- 面包屑导航标记
- 有助于 Google 富媒体搜索结果

✅ **语义化 HTML**
- 使用 `<article>`, `<section>`, `<aside>` 等语义标签
- 正确的 heading 层级
- Microdata 属性支持

✅ **多语言支持**
- hreflang 标签
- 规范 URL (canonical)
- 四种语言版本 (中英日法)

✅ **面包屑导航**
- 改善用户体验
- 提升 SEO 效果

### SEO 配置清单

在部署到生产环境前，请确保：

1. ✅ 设置正确的 `NEXT_PUBLIC_APP_URL` 环境变量
2. ✅ 为每个应用添加 logo 图片
3. ✅ 配置应用的 metaTitle 和 metaDescription
4. ✅ 添加 robots.txt 文件
5. ✅ 添加 sitemap.xml (可以使用 Next.js 自动生成)
6. ✅ 配置 Google Analytics 或其他分析工具
7. ✅ 提交到 Google Search Console
8. ✅ 生成并上传 favicon 和各种尺寸的应用图标

### 创建 Sitemap

在 `app/sitemap.ts` 创建动态 sitemap：

```typescript
import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  const apps = await prisma.app.findMany({
    where: { isPublished: true },
    select: { slug: true, updatedAt: true },
  });

  const appUrls = apps.flatMap((app) => [
    {
      url: `${baseUrl}/zh/apps/${app.slug}`,
      lastModified: app.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/apps/${app.slug}`,
      lastModified: app.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]);

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/zh/apps`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...appUrls,
  ];
}
```

### 创建 robots.txt

在 `app/robots.ts` 创建：

```typescript
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

## 🔒 安全建议

1. **环境变量**: 永远不要提交 `.env` 文件
2. **数据库**: 使用强密码和 SSL 连接
3. **API 限流**: 考虑添加 rate limiting
4. **CORS**: 生产环境配置适当的 CORS 策略

## 📚 更多资源

- [Next.js 文档](https://nextjs.org/docs)
- [Prisma 文档](https://www.prisma.io/docs)
- [Vercel 文档](https://vercel.com/docs)
- [next-intl 文档](https://next-intl-docs.vercel.app/)
- [shadcn/ui 文档](https://ui.shadcn.com/)

## 🆘 获取帮助

如果遇到问题：

1. 查看错误日志
2. 搜索 GitHub Issues
3. 提交新的 Issue
4. 加入开发者社区

---

祝你部署顺利！🎉

