# 什么值得做 (WhatWorthDoing)

> 为全球独立开发者提供基于真实收入数据的项目分析和启发

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.7-brightgreen)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8)](https://tailwindcss.com/)

## 📋 项目简介

这是一个专注于独立开发者的项目分析平台，基于 TrustMRR 等平台的真实收入数据，为全球开发者提供：

- ✅ 深度的商业模式分析
- ✅ 技术栈建议和难度评估
- ✅ MVP 开发计划
- ✅ 成本分析和收入预期
- ✅ 适合独立开发者的推荐度

支持 **中文、英文、日文、法文** 四种语言。

## 🚀 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS + shadcn/ui
- **数据库**: PostgreSQL (Vercel Postgres)
- **ORM**: Prisma
- **国际化**: next-intl
- **部署**: Vercel

## 📦 快速开始

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd whatworthdoing
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制 `.env.example` 到 `.env` 并填写数据库连接：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
DATABASE_URL="postgresql://user:password@localhost:5432/whatworthdoing"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. 初始化数据库

```bash
# 推送数据库结构
npm run db:push

# 初始化分类数据
npm run db:seed

# 导入示例应用数据
npm run import:data
```

### 5. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📁 项目结构

```
whatworthdoing/
├── app/                    # Next.js App Router
│   ├── [locale]/          # 多语言路由
│   │   ├── page.tsx       # 首页
│   │   ├── apps/          # 应用列表和详情
│   │   ├── categories/    # 分类页面
│   │   └── layout.tsx     # 布局
│   ├── api/               # API 路由
│   └── globals.css        # 全局样式
├── components/            # React 组件
│   ├── ui/               # shadcn/ui 组件
│   ├── app-card.tsx      # 应用卡片
│   ├── navbar.tsx        # 导航栏
│   └── footer.tsx        # 页脚
├── lib/                   # 工具函数
│   ├── prisma.ts         # Prisma 客户端
│   └── utils.ts          # 工具函数
├── messages/              # 国际化翻译
│   ├── zh.json           # 中文
│   ├── en.json           # 英文
│   ├── ja.json           # 日文
│   └── fr.json           # 法文
├── prisma/               # Prisma 配置
│   └── schema.prisma     # 数据库模型
├── scripts/              # 脚本
│   ├── seed-categories.ts # 初始化分类
│   └── import-data.ts    # 导入数据
└── README.md
```

## 🗄️ 数据库设计

核心数据表：

- **App** - 应用主表（包含所有基本信息和多语言字段）
- **Category** - 分类表
- **Tag** - 标签表
- **BusinessModel** - 商业模式分析
- **TechStack** - 技术栈信息
- **DeveloperAnalysis** - 独立开发者分析
- **MvpPlan** - MVP开发计划
- **CostAnalysis** - 成本分析
- **MarketingStrategy** - 营销策略
- **Founder** - 创始人信息
- **RevenueHistory** - 收入历史记录

详细设计请查看 `database-schema.md` 和 `prisma/schema.prisma`。

## 🌍 国际化

本项目使用 `next-intl` 实现多语言支持：

- **中文 (zh)**: 默认语言
- **英文 (en)**
- **日文 (ja)**
- **法文 (fr)**

翻译文件位于 `messages/` 目录。

## 🎨 UI 组件

使用 shadcn/ui 组件库，包括：

- Button
- Card
- Badge
- Input
- Select
- Dialog
- Tabs

所有组件都支持暗色模式。

## 📊 数据导入

### 导入分类

```bash
npm run db:seed
```

### 导入示例应用数据

```bash
npm run import:data
```

### 自定义导入

编辑 `scripts/import-data.ts` 文件，添加您自己的应用数据。

## 🚢 部署

### 部署到 Vercel

1. 推送代码到 GitHub
2. 在 Vercel 导入项目
3. 配置环境变量：
   - `DATABASE_URL`: Vercel Postgres 连接字符串
   - `NEXT_PUBLIC_APP_URL`: 您的域名
4. 部署！

### 数据库设置

推荐使用 Vercel Postgres 或 Neon：

```bash
# Vercel Postgres
vercel postgres create

# 或使用 Neon
# https://neon.tech/
```

## 🛠️ 开发命令

```bash
# 开发服务器
npm run dev

# 构建
npm run build

# 启动生产服务器
npm start

# 数据库相关
npm run db:push      # 推送数据库结构
npm run db:seed      # 初始化数据
npm run db:studio    # 打开 Prisma Studio
npm run db:generate  # 生成 Prisma Client

# 代码检查
npm run lint
```

## 📈 功能路线图

- [x] 基础架构
- [x] 多语言支持
- [x] 应用列表和详情
- [x] 分类浏览
- [x] 搜索和筛选
- [ ] 用户系统
- [ ] 收藏功能
- [ ] 评论系统
- [ ] 应用对比
- [ ] 数据可视化
- [ ] 高级搜索（Algolia）
- [ ] PWA 支持

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📝 License

MIT License

## 🙏 致谢

- 数据来源: [TrustMRR](https://trustmrr.com)
- UI 组件: [shadcn/ui](https://ui.shadcn.com/)
- 图标: [Lucide](https://lucide.dev/)

---

Made with ❤️ for Indie Hackers

