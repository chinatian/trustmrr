# SEO 优化指南

本文档详细说明了 TrustMRR 项目的 SEO 优化实现和最佳实践。

## 📋 目录

1. [已实现的 SEO 功能](#已实现的-seo-功能)
2. [技术实现](#技术实现)
3. [配置指南](#配置指南)
4. [SEO 检查清单](#seo-检查清单)
5. [性能优化](#性能优化)
6. [监控和分析](#监控和分析)

---

## ✅ 已实现的 SEO 功能

### 1. 动态元数据生成 (Dynamic Metadata)

每个页面都使用 Next.js 14 的 `generateMetadata` 函数动态生成优化的元数据：

- **Title Tags**: 包含应用名称、分类和品牌
- **Meta Descriptions**: 160 字符以内，包含关键信息
- **Keywords**: 自动聚合相关关键词
- **Authors & Creator**: 标注内容创建者

**实现文件**:
- `app/[locale]/apps/[slug]/page.tsx` - 应用详情页
- `app/[locale]/apps/page.tsx` - 应用列表页

### 2. Open Graph 标签

完整的 Open Graph 标签支持，优化社交媒体分享：

```typescript
openGraph: {
  type: 'website',
  locale: 'zh_CN',
  url: appUrl,
  title: '应用名称',
  description: '应用描述',
  siteName: 'TrustMRR',
  images: [{
    url: logoUrl,
    width: 1200,
    height: 630,
    alt: '应用名称',
  }],
}
```

**支持平台**: Facebook, LinkedIn, Discord, WhatsApp 等

### 3. Twitter Card

专门优化的 Twitter 卡片：

```typescript
twitter: {
  card: 'summary_large_image',
  title: '应用名称',
  description: '应用描述',
  images: [logoUrl],
  creator: '@username',
}
```

### 4. JSON-LD 结构化数据

实现了 Schema.org 标准的结构化数据：

#### SoftwareApplication Schema

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "应用名称",
  "description": "应用描述",
  "applicationCategory": "BusinessApplication",
  "offers": {
    "@type": "Offer",
    "price": "99.00",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": 5,
    "bestRating": 5
  }
}
```

#### BreadcrumbList Schema

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [...]
}
```

**好处**: 
- Google 富媒体搜索结果
- 显示评分、价格等信息
- 提高点击率

### 5. 语义化 HTML

使用正确的 HTML5 语义标签：

- `<article>` - 主要内容
- `<section>` - 内容分区
- `<aside>` - 侧边栏
- `<header>` - 页头
- `<nav>` - 导航
- `<h1>` ~ `<h6>` - 正确的标题层级

### 6. 多语言支持

完整的多语言 SEO 支持：

```typescript
alternates: {
  canonical: appUrl,
  languages: {
    'zh-CN': '/zh/apps/...',
    'en': '/en/apps/...',
    'ja': '/ja/apps/...',
    'fr': '/fr/apps/...',
  },
}
```

### 7. 面包屑导航

可见的面包屑导航 + JSON-LD 标记：

```
首页 > 应用列表 > 分类 > 应用名称
```

**好处**:
- 改善用户体验
- 帮助搜索引擎理解网站结构
- Google 搜索结果中显示面包屑

### 8. Sitemap 和 Robots

自动生成的动态 sitemap 和 robots.txt：

- `app/sitemap.ts` - 动态生成所有页面 URL
- `app/robots.ts` - 控制搜索引擎爬虫

---

## 🔧 技术实现

### Next.js 14 App Router

利用 Next.js 14 的最新 SEO 特性：

```typescript
// generateMetadata 函数
export async function generateMetadata({ params }): Promise<Metadata> {
  const data = await fetchData(params);
  return {
    title: data.title,
    description: data.description,
    // ...
  };
}
```

### 服务端渲染 (SSR)

所有页面都是服务端渲染，确保搜索引擎能够抓取完整内容。

### 静态优化

- 使用 `revalidate` 进行 ISR (Incremental Static Regeneration)
- 缓存策略优化
- 图片懒加载

---

## ⚙️ 配置指南

### 1. 环境变量配置

在 `.env` 文件中设置：

```env
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
DATABASE_URL="postgresql://..."
```

**重要**: `NEXT_PUBLIC_APP_URL` 在生产环境必须配置正确的域名。

### 2. 应用数据配置

确保每个应用都有完整的 SEO 字段：

```typescript
{
  metaTitle: "应用名称 - 分类 | TrustMRR",
  metaDescription: "应用描述...",
  metaKeywords: ["keyword1", "keyword2"],
  logo: "https://...", // 用于 Open Graph
}
```

### 3. 分类数据配置

确保分类有完整的描述：

```typescript
{
  name: "分类名称",
  description: "分类描述，包含关键词...",
}
```

---

## ✅ SEO 检查清单

### 部署前检查

- [ ] 配置 `NEXT_PUBLIC_APP_URL` 环境变量
- [ ] 为所有应用添加 logo 图片
- [ ] 检查所有页面的 title 和 description
- [ ] 验证 sitemap.xml 正常生成
- [ ] 验证 robots.txt 配置正确
- [ ] 添加 favicon 和应用图标
- [ ] 配置 Google Analytics
- [ ] 配置 Google Search Console

### 内容检查

- [ ] 每个应用都有唯一的 meta title
- [ ] Meta description 在 150-160 字符之间
- [ ] 关键词自然融入内容
- [ ] 图片都有 alt 标签
- [ ] 内部链接使用描述性文本
- [ ] URL 友好（使用 slug）

### 技术检查

- [ ] 所有页面响应时间 < 3 秒
- [ ] 移动端适配良好
- [ ] HTTPS 配置正确
- [ ] 无死链接
- [ ] 无重复内容
- [ ] XML sitemap 提交到搜索引擎

---

## 🚀 性能优化

### Core Web Vitals

优化三大核心指标：

1. **LCP (Largest Contentful Paint)**: < 2.5s
   - 使用 Next.js Image 优化
   - 预加载关键资源

2. **FID (First Input Delay)**: < 100ms
   - 最小化 JavaScript
   - 使用服务端渲染

3. **CLS (Cumulative Layout Shift)**: < 0.1
   - 设置图片尺寸
   - 避免动态插入内容

### 图片优化

```tsx
import Image from 'next/image';

<Image
  src={app.logo}
  alt={app.name}
  width={200}
  height={200}
  loading="lazy"
/>
```

### 字体优化

使用 Next.js Font Optimization：

```typescript
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
```

---

## 📊 监控和分析

### Google Search Console

1. 添加网站验证
2. 提交 sitemap
3. 监控索引状态
4. 检查搜索性能
5. 修复发现的问题

### Google Analytics

跟踪关键指标：
- 页面浏览量
- 跳出率
- 平均停留时间
- 转化率

### 其他工具

- **Google PageSpeed Insights**: 性能分析
- **GTmetrix**: 综合性能测试
- **Ahrefs/SEMrush**: SEO 审计
- **Schema Markup Validator**: 验证结构化数据

---

## 📈 SEO 最佳实践

### 内容策略

1. **原创内容**: 每个应用都有独特的描述
2. **定期更新**: 保持内容新鲜度
3. **长尾关键词**: 针对具体用户需求
4. **内部链接**: 相关应用推荐

### 技术策略

1. **移动优先**: 响应式设计
2. **快速加载**: 优化性能
3. **安全连接**: HTTPS
4. **清晰结构**: 逻辑导航

### 外部优化

1. **社交媒体**: 分享优化
2. **反向链接**: 高质量外链
3. **本地 SEO**: 如果适用
4. **内容营销**: 博客、案例研究

---

## 🔍 常见 SEO 问题解决

### 问题 1: 页面未被索引

**原因**:
- robots.txt 阻止
- noindex 标签
- 新页面未提交

**解决**:
```typescript
export const metadata = {
  robots: {
    index: true,
    follow: true,
  },
};
```

### 问题 2: 重复内容

**原因**:
- 多个 URL 指向相同内容
- 缺少 canonical 标签

**解决**:
```typescript
alternates: {
  canonical: correctUrl,
}
```

### 问题 3: Open Graph 图片不显示

**原因**:
- 图片尺寸不正确（推荐 1200x630）
- 图片 URL 不可访问
- 缺少必需属性

**解决**:
- 使用正确尺寸的图片
- 确保图片公开可访问
- 包含 width 和 height

---

## 📚 参考资源

- [Next.js SEO](https://nextjs.org/learn/seo/introduction-to-seo)
- [Google Search Central](https://developers.google.com/search)
- [Schema.org](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards)
- [Web.dev SEO](https://web.dev/learn/seo/)

---

## 🎯 总结

本项目已实现完整的 SEO 优化，包括：

✅ 动态元数据生成  
✅ Open Graph 和 Twitter Card  
✅ JSON-LD 结构化数据  
✅ 语义化 HTML  
✅ 多语言支持  
✅ Sitemap 和 Robots  
✅ 性能优化  

只需正确配置环境变量和应用数据，即可享受完整的 SEO 优化效果！

---

**最后更新**: 2025-11-09  
**版本**: 1.0.0

