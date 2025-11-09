# 什么值得做 - 数据库设计方案

## 🎯 数据库选型

**推荐：Vercel Postgres (Neon) + Prisma ORM**

---

## 📊 完整数据库 Schema

### 核心表结构

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==================== 应用主表 ====================
model App {
  id                String    @id @default(cuid())
  
  // 基本信息（多语言）
  name              String    // 应用名称（主要语言）
  nameEn            String?   // 英文名称
  nameJa            String?   // 日文名称
  nameFr            String?   // 法文名称
  nameZh            String?   // 中文名称
  
  slug              String    @unique // URL友好的标识符
  url               String?   // 官方网站
  logo              String?   // Logo URL
  
  // 描述信息（多语言）
  shortDescription     String    @db.Text // 简短描述（一句话）
  shortDescriptionEn   String?   @db.Text
  shortDescriptionJa   String?   @db.Text
  shortDescriptionFr   String?   @db.Text
  shortDescriptionZh   String?   @db.Text
  
  fullDescription      String    @db.Text // 完整描述
  fullDescriptionEn    String?   @db.Text
  fullDescriptionJa    String?   @db.Text
  fullDescriptionFr    String?   @db.Text
  fullDescriptionZh    String?   @db.Text
  
  // 核心功能（多语言，JSON格式）
  coreFeatures         Json?    // [{feature: "xxx", description: "xxx"}]
  coreFeaturesEn       Json?
  coreFeaturesJa       Json?
  coreFeaturesFr       Json?
  coreFeaturesZh       Json?
  
  // 财务数据
  totalRevenue      Decimal   @db.Decimal(12, 2) // 总收入
  mrr               Decimal?  @db.Decimal(12, 2) // 月经常性收入
  monthlyRevenue    Decimal?  @db.Decimal(12, 2) // 月收入
  currency          String    @default("USD")
  
  // 排名信息
  ranking           Int?      // 当前排名
  rankingChange     Int?      // 排名变化（+10表示上升10位）
  previousRanking   Int?      // 上一次排名
  
  // 分类和标签
  categoryId        String
  category          Category  @relation(fields: [categoryId], references: [id])
  tags              Tag[]     @relation("AppTags")
  
  // 商业模式
  businessModel     BusinessModel?
  
  // 技术信息
  techStack         TechStack?
  techDifficulty    Int       @default(3) // 1-5星难度
  
  // 独立开发者分析
  developerAnalysis DeveloperAnalysis?
  
  // MVP开发计划
  mvpPlan           MvpPlan?
  
  // 成本分析
  costAnalysis      CostAnalysis?
  
  // 营销策略
  marketingStrategies MarketingStrategy[]
  
  // 成功因素（多语言，JSON格式）
  successFactors       Json?    // [{factor: "xxx", description: "xxx"}]
  successFactorsEn     Json?
  successFactorsJa     Json?
  successFactorsFr     Json?
  successFactorsZh     Json?
  
  // 为什么值得做（多语言）
  whyWorthDoing        String?   @db.Text
  whyWorthDoingEn      String?   @db.Text
  whyWorthDoingJa      String?   @db.Text
  whyWorthDoingFr      String?   @db.Text
  whyWorthDoingZh      String?   @db.Text
  
  // 创始人信息
  founderId         String?
  founder           Founder?  @relation(fields: [founderId], references: [id])
  
  // 时间信息
  foundedDate       DateTime?
  launchedDate      DateTime?
  lastUpdated       DateTime  @default(now()) @updatedAt
  
  // SEO和元数据
  metaTitle         String?
  metaDescription   String?   @db.Text
  metaKeywords      String[]
  
  // 状态
  isPublished       Boolean   @default(true)
  isFeatured        Boolean   @default(false) // 是否精选
  isNewApp          Boolean   @default(false) // 是否新应用
  
  // 数据来源
  sourceUrl         String?   // TrustMRR等数据来源
  dataUpdatedAt     DateTime  @default(now())
  
  // 统计数据
  viewCount         Int       @default(0)
  favoriteCount     Int       @default(0)
  
  // 关联数据
  revenueHistory    RevenueHistory[]
  userFavorites     UserFavorite[]
  userReviews       UserReview[]
  comparisons       AppComparison[] @relation("ComparisonApps")
  
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  @@index([categoryId])
  @@index([ranking])
  @@index([totalRevenue])
  @@index([mrr])
  @@index([isPublished])
  @@index([isFeatured])
  @@fulltext([name, shortDescription, fullDescription])
}

// ==================== 分类表 ====================
model Category {
  id              String   @id @default(cuid())
  
  // 多语言名称
  name            String
  nameEn          String?
  nameJa          String?
  nameFr          String?
  nameZh          String?
  
  slug            String   @unique
  
  // 多语言描述
  description     String?  @db.Text
  descriptionEn   String?  @db.Text
  descriptionJa   String?  @db.Text
  descriptionFr   String?  @db.Text
  descriptionZh   String?  @db.Text
  
  icon            String?  // 图标名称或URL
  color           String?  // 主题色
  
  // 排序和显示
  order           Int      @default(0)
  isActive        Boolean  @default(true)
  
  // 统计数据
  appCount        Int      @default(0)
  
  apps            App[]
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([slug])
  @@index([order])
}

// ==================== 标签表 ====================
model Tag {
  id              String   @id @default(cuid())
  
  name            String   @unique
  nameEn          String?
  nameJa          String?
  nameFr          String?
  nameZh          String?
  
  slug            String   @unique
  type            String?  // 技术栈、商业模式、目标市场等
  
  apps            App[]    @relation("AppTags")
  
  usageCount      Int      @default(0)
  
  createdAt       DateTime @default(now())
  
  @@index([slug])
  @@index([type])
}

// ==================== 商业模式表 ====================
model BusinessModel {
  id              String   @id @default(cuid())
  appId           String   @unique
  app             App      @relation(fields: [appId], references: [id], onDelete: Cascade)
  
  // 定价模式
  pricingModel    String   // subscription, one-time, freemium, hybrid
  
  // 定价详情（多语言）
  pricingDetails     Json     // [{tier: "Basic", price: 99, period: "month", features: []}]
  pricingDetailsEn   Json?
  pricingDetailsJa   Json?
  pricingDetailsFr   Json?
  pricingDetailsZh   Json?
  
  // 目标客户（多语言）
  targetCustomers    String   @db.Text
  targetCustomersEn  String?  @db.Text
  targetCustomersJa  String?  @db.Text
  targetCustomersFr  String?  @db.Text
  targetCustomersZh  String?  @db.Text
  
  // 市场规模（多语言）
  marketSize         String?  @db.Text
  marketSizeEn       String?  @db.Text
  marketSizeJa       String?  @db.Text
  marketSizeFr       String?  @db.Text
  marketSizeZh       String?  @db.Text
  
  // 收入计算示例（JSON格式）
  revenueCalculation Json?    // {avgPrice: 299, users: 3455, calculation: "..."}
  
  // 利润率
  profitMargin    Int?     // 百分比
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

// ==================== 技术栈表 ====================
model TechStack {
  id              String   @id @default(cuid())
  appId           String   @unique
  app             App      @relation(fields: [appId], references: [id], onDelete: Cascade)
  
  // 技术栈详情（JSON格式）
  frontend        Json?    // {framework: "Next.js", ui: "Tailwind", ...}
  backend         Json?
  database        Json?
  infrastructure  Json?
  tools           Json?
  
  // 完整技术栈描述（多语言）
  fullStack          String?  @db.Text
  fullStackEn        String?  @db.Text
  fullStackJa        String?  @db.Text
  fullStackFr        String?  @db.Text
  fullStackZh        String?  @db.Text
  
  // 技术难度详解（多语言）
  difficultyDetails     String?  @db.Text
  difficultyDetailsEn   String?  @db.Text
  difficultyDetailsJa   String?  @db.Text
  difficultyDetailsFr   String?  @db.Text
  difficultyDetailsZh   String?  @db.Text
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

// ==================== 独立开发者分析表 ====================
model DeveloperAnalysis {
  id                    String   @id @default(cuid())
  appId                 String   @unique
  app                   App      @relation(fields: [appId], references: [id], onDelete: Cascade)
  
  // 推荐度（1-5星）
  recommendationLevel   Int      @default(3)
  
  // 推荐理由（多语言）
  recommendationReason     String   @db.Text
  recommendationReasonEn   String?  @db.Text
  recommendationReasonJa   String?  @db.Text
  recommendationReasonFr   String?  @db.Text
  recommendationReasonZh   String?  @db.Text
  
  // 优点（JSON数组，多语言）
  pros        Json     // ["高利润率", "快速启动", ...]
  prosEn      Json?
  prosJa      Json?
  prosFr      Json?
  prosZh      Json?
  
  // 缺点（JSON数组，多语言）
  cons        Json?
  consEn      Json?
  consJa      Json?
  consFr      Json?
  consZh      Json?
  
  // 适合人群（多语言）
  suitableFor     String?  @db.Text
  suitableForEn   String?  @db.Text
  suitableForJa   String?  @db.Text
  suitableForFr   String?  @db.Text
  suitableForZh   String?  @db.Text
  
  // 开发周期（周）
  developmentWeeks  Int?
  
  // 预期收入（JSON格式）
  expectedRevenue   Json?    // {month1: "1K-3K", month6: "5K-15K", year1: "20K-50K"}
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

// ==================== MVP开发计划表 ====================
model MvpPlan {
  id              String   @id @default(cuid())
  appId           String   @unique
  app             App      @relation(fields: [appId], references: [id], onDelete: Cascade)
  
  // 总体时间
  totalWeeks      Int?
  
  // 阶段计划（JSON格式，多语言）
  phases             Json     // [{phase: "Week 1-2", tasks: [...], deliverables: [...]}]
  phasesEn           Json?
  phasesJa           Json?
  phasesFr           Json?
  phasesZh           Json?
  
  // 核心功能列表（JSON格式，多语言）
  coreFeaturesNeeded    Json     // ["认证系统", "支付集成", ...]
  coreFeaturesNeededEn  Json?
  coreFeaturesNeededJa  Json?
  coreFeaturesNeededFr  Json?
  coreFeaturesNeededZh  Json?
  
  // 快速启动建议（多语言）
  quickStartGuide     String?  @db.Text
  quickStartGuideEn   String?  @db.Text
  quickStartGuideJa   String?  @db.Text
  quickStartGuideFr   String?  @db.Text
  quickStartGuideZh   String?  @db.Text
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

// ==================== 成本分析表 ====================
model CostAnalysis {
  id              String   @id @default(cuid())
  appId           String   @unique
  app             App      @relation(fields: [appId], references: [id], onDelete: Cascade)
  
  // 开发成本
  developmentCost    Decimal?  @db.Decimal(10, 2)
  
  // 月度运营成本（JSON格式）
  monthlyCosts       Json?     // {hosting: 20, database: 10, api: 50, ...}
  
  // 年度成本
  yearlyEstimate     Decimal?  @db.Decimal(10, 2)
  
  // 利润率
  profitMargin       Int?      // 百分比
  
  // 成本明细说明（多语言）
  costBreakdown     String?   @db.Text
  costBreakdownEn   String?   @db.Text
  costBreakdownJa   String?   @db.Text
  costBreakdownFr   String?   @db.Text
  costBreakdownZh   String?   @db.Text
  
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}

// ==================== 营销策略表 ====================
model MarketingStrategy {
  id              String   @id @default(cuid())
  appId           String
  app             App      @relation(fields: [appId], references: [id], onDelete: Cascade)
  
  channel         String   // Twitter, YouTube, SEO, ProductHunt, etc.
  
  // 策略描述（多语言）
  description     String   @db.Text
  descriptionEn   String?  @db.Text
  descriptionJa   String?  @db.Text
  descriptionFr   String?  @db.Text
  descriptionZh   String?  @db.Text
  
  priority        Int      @default(3) // 1-5，重要程度
  
  createdAt       DateTime @default(now())
  
  @@index([appId])
}

// ==================== 创始人表 ====================
model Founder {
  id              String   @id @default(cuid())
  
  name            String
  username        String?  @unique // Twitter等用户名
  
  bio             String?  @db.Text
  bioEn           String?  @db.Text
  bioJa           String?  @db.Text
  bioFr           String?  @db.Text
  bioZh           String?  @db.Text
  
  avatar          String?
  
  // 社交媒体
  twitterUrl      String?
  linkedinUrl     String?
  websiteUrl      String?
  
  // 统计
  totalRevenue    Decimal? @db.Decimal(12, 2) // 所有应用总收入
  appCount        Int      @default(0)
  
  apps            App[]
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

// ==================== 收入历史表 ====================
model RevenueHistory {
  id              String   @id @default(cuid())
  appId           String
  app             App      @relation(fields: [appId], references: [id], onDelete: Cascade)
  
  date            DateTime
  totalRevenue    Decimal  @db.Decimal(12, 2)
  mrr             Decimal? @db.Decimal(12, 2)
  monthlyRevenue  Decimal? @db.Decimal(12, 2)
  ranking         Int?
  
  createdAt       DateTime @default(now())
  
  @@unique([appId, date])
  @@index([appId])
  @@index([date])
}

// ==================== 用户表 ====================
model User {
  id              String   @id @default(cuid())
  
  email           String   @unique
  name            String?
  avatar          String?
  
  // 偏好设置
  preferredLocale String   @default("zh") // zh, en, ja, fr
  
  favorites       UserFavorite[]
  reviews         UserReview[]
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([email])
}

// ==================== 用户收藏表 ====================
model UserFavorite {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  appId           String
  app             App      @relation(fields: [appId], references: [id], onDelete: Cascade)
  
  createdAt       DateTime @default(now())
  
  @@unique([userId, appId])
  @@index([userId])
  @@index([appId])
}

// ==================== 用户评论表 ====================
model UserReview {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  appId           String
  app             App      @relation(fields: [appId], references: [id], onDelete: Cascade)
  
  rating          Int      // 1-5星
  comment         String?  @db.Text
  
  isPublished     Boolean  @default(false)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([userId])
  @@index([appId])
  @@index([isPublished])
}

// ==================== 应用对比表 ====================
model AppComparison {
  id              String   @id @default(cuid())
  
  name            String   // 对比名称
  nameEn          String?
  nameJa          String?
  nameFr          String?
  nameZh          String?
  
  description     String?  @db.Text
  
  apps            App[]    @relation("ComparisonApps")
  
  createdBy       String?  // 创建者
  viewCount       Int      @default(0)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

---

## 📋 数据示例

### 示例1：ShipFast 应用数据

```typescript
// App 数据
{
  name: "ShipFast",
  nameEn: "ShipFast",
  nameZh: "快速启航",
  nameJa: "シップファスト",
  nameFr: "ShipFast",
  
  slug: "shipfast",
  url: "https://shipfa.st",
  
  shortDescription: "为开发者提供的代码模板（Boilerplate），帮助快速启动项目",
  shortDescriptionEn: "Code template (Boilerplate) for developers to quickly start projects",
  shortDescriptionZh: "为开发者提供的代码模板（Boilerplate），帮助快速启动项目",
  
  fullDescription: "ShipFast 是一个完整的 Next.js 代码模板，包含认证、支付、数据库等所有功能...",
  
  coreFeatures: [
    {
      feature: "节省时间",
      description: "预配置好的认证、支付等"
    },
    {
      feature: "最佳实践",
      description: "遵循行业标准"
    },
    {
      feature: "持续更新",
      description: "跟进最新技术"
    }
  ],
  
  totalRevenue: 979833,
  mrr: null,
  monthlyRevenue: 18631,
  
  ranking: 19,
  rankingChange: 0,
  
  categoryId: "developer-tools",
  
  techDifficulty: 2,
  
  successFactors: [
    {
      factor: "技术栈选择",
      description: "跟随热门技术"
    },
    {
      factor: "完整性",
      description: "包含开发者需要的一切"
    },
    {
      factor: "文档质量",
      description: "详细的使用说明"
    }
  ],
  
  whyWorthDoing: "高利润率（近 $1M 收入，几乎零边际成本）、快速启动（1-2 个月开发）、可重复销售（一次开发，无限销售）、持续收入（不断有新开发者入门）",
  
  isFeatured: true,
  isNewApp: false
}

// BusinessModel 数据
{
  pricingModel: "one-time",
  
  pricingDetails: [
    {
      tier: "基础版",
      price: 99,
      period: "lifetime",
      features: ["Next.js", "认证", "支付"]
    },
    {
      tier: "专业版",
      price: 199,
      period: "lifetime",
      features: ["基础版+", "数据库", "邮件", "5个模板"]
    },
    {
      tier: "终极版",
      price: 299,
      period: "lifetime",
      features: ["专业版+", "源码访问", "终身更新", "Discord"]
    }
  ],
  
  targetCustomers: "独立开发者、初创公司、想快速构建 SaaS 的开发者",
  
  marketSize: "全球数百万开发者市场，每年都有新人入门",
  
  profitMargin: 90
}

// TechStack 数据
{
  frontend: {
    framework: "Next.js 14 App Router",
    styling: "TailwindCSS + daisyUI",
    typescript: true
  },
  backend: {
    auth: "NextAuth.js",
    api: "Next.js API Routes"
  },
  database: {
    options: ["MongoDB", "Supabase"],
    orm: "Prisma"
  },
  infrastructure: {
    payments: "Stripe",
    emails: "Mailgun/SendGrid",
    deployment: "Vercel"
  },
  
  fullStack: "前端使用 Next.js 14，样式用 Tailwind CSS，认证用 NextAuth.js，数据库可选 MongoDB 或 Supabase，支付集成 Stripe，部署在 Vercel",
  
  difficultyDetails: "本质上是组装现有技术，需要良好的代码架构和文档编写能力"
}

// DeveloperAnalysis 数据
{
  recommendationLevel: 5,
  
  recommendationReason: "这是独立开发者的金矿项目！接近 $1M 的收入，几乎零边际成本，1-2个月就能开发完成，一次开发可以无限次销售。市场需求稳定，每年都有新开发者入门学习。",
  
  pros: [
    "💰 高利润率：近 $1M 收入，几乎零边际成本",
    "⚡ 快速启动：1-2 个月开发",
    "🔄 可重复销售：一次开发，无限销售",
    "📈 持续收入：不断有新开发者入门"
  ],
  
  cons: [
    "需要跟进最新技术趋势",
    "文档编写工作量大",
    "市场竞争逐渐增加"
  ],
  
  suitableFor: "有2年以上开发经验的全栈开发者，熟悉 Next.js 等现代技术栈，擅长写文档和教程，有一定的内容营销能力",
  
  developmentWeeks: 6,
  
  expectedRevenue: {
    month1: "$1K-3K",
    month6: "$5K-15K",
    year1: "$20K-50K"
  }
}

// MvpPlan 数据
{
  totalWeeks: 6,
  
  phases: [
    {
      phase: "Week 1-2",
      title: "核心架构",
      tasks: [
        "Next.js 14 项目搭建",
        "TailwindCSS + shadcn/ui 配置",
        "TypeScript 严格模式",
        "ESLint + Prettier"
      ]
    },
    {
      phase: "Week 3-4",
      title: "核心功能",
      tasks: [
        "NextAuth.js 认证（Google, Email）",
        "Stripe 支付集成",
        "Supabase 数据库配置",
        "邮件服务（Resend）",
        "Landing Page 模板"
      ]
    },
    {
      phase: "Week 5-6",
      title: "文档与发布",
      tasks: [
        "详细文档（Mintlify/Nextra）",
        "视频教程（5-10个短视频）",
        "GitHub 私有仓库设置",
        "Gumroad/Lemon Squeezy 销售页面"
      ]
    }
  ],
  
  coreFeaturesNeeded: [
    "认证系统",
    "支付集成",
    "数据库配置",
    "邮件服务",
    "Landing Page模板",
    "SEO优化",
    "完整文档"
  ],
  
  quickStartGuide: "1. Fork Next.js template\n2. 添加认证、支付、数据库\n3. 2周后在 Gumroad 上架 $99\n4. ProductHunt 发布\n5. 目标：首月 $1K-3K 收入"
}

// CostAnalysis 数据
{
  developmentCost: 0, // 自己开发
  
  monthlyCosts: {
    hosting: 0, // Vercel Free
    gumroad: "8.5% + $0.30", // 按交易抽成
    domain: 1, // $12/年
    tools: 0
  },
  
  yearlyEstimate: 100,
  
  profitMargin: 90,
  
  costBreakdown: "几乎零成本！开发成本为 $0（自己开发），销售平台 Gumroad 抽成 8.5% + $0.30，托管使用 Vercel 免费版，总利润率约 90%"
}

// MarketingStrategy 数据（多条）
[
  {
    channel: "Twitter",
    description: "#buildinpublic 记录开发过程，分享收入数据，吸引同行关注",
    priority: 5
  },
  {
    channel: "YouTube",
    description: "制作技术教程吸引开发者，演示如何使用模板快速构建项目",
    priority: 5
  },
  {
    channel: "ProductHunt",
    description: "发布当天冲榜，争取进入前3获得大量曝光",
    priority: 4
  },
  {
    channel: "Reddit",
    description: "在 r/SaaS, r/webdev 等社区分享经验和产品",
    priority: 3
  },
  {
    channel: "Indie Hackers",
    description: "分享收入数据和开发经验，建立信任",
    priority: 3
  }
]
```

---

## 🔍 查询示例

### 1. 获取应用完整信息（含所有关联数据）

```typescript
// API: /api/apps/[slug]
const app = await prisma.app.findUnique({
  where: { slug: 'shipfast' },
  include: {
    category: true,
    tags: true,
    businessModel: true,
    techStack: true,
    developerAnalysis: true,
    mvpPlan: true,
    costAnalysis: true,
    marketingStrategies: true,
    founder: true,
    revenueHistory: {
      orderBy: { date: 'desc' },
      take: 12 // 最近12个月
    }
  }
});
```

### 2. 多语言查询

```typescript
// 根据用户语言返回相应字段
function getLocalizedApp(app: App, locale: string) {
  const nameField = `name${locale === 'zh' ? '' : locale.charAt(0).toUpperCase() + locale.slice(1)}`;
  
  return {
    name: app[nameField] || app.name,
    shortDescription: app[`shortDescription${getLocaleSuffix(locale)}`] || app.shortDescription,
    // ... 其他字段
  };
}
```

### 3. 搜索和筛选

```typescript
// 按分类、推荐度、收入筛选
const apps = await prisma.app.findMany({
  where: {
    categoryId: categoryId,
    isPublished: true,
    developerAnalysis: {
      recommendationLevel: {
        gte: 4 // 4星以上
      }
    },
    totalRevenue: {
      gte: 100000 // $100K以上
    }
  },
  include: {
    category: true,
    developerAnalysis: true
  },
  orderBy: {
    ranking: 'asc'
  }
});
```

### 4. 获取精选应用

```typescript
const featuredApps = await prisma.app.findMany({
  where: {
    isFeatured: true,
    isPublished: true
  },
  include: {
    category: true,
    developerAnalysis: true
  },
  take: 10
});
```

---

## 📈 数据迁移策略

### 从 Markdown 导入数据

```typescript
// scripts/import-from-markdown.ts
import { readFile } from 'fs/promises';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function importShipFast() {
  // 解析 Markdown 文件
  const content = await readFile('02_开发者工具与教育_Developer_Tools_Education.md', 'utf-8');
  
  // 创建应用
  const app = await prisma.app.create({
    data: {
      name: "ShipFast",
      nameEn: "ShipFast",
      slug: "shipfast",
      url: "https://shipfa.st",
      
      shortDescription: "为开发者提供的代码模板（Boilerplate），帮助快速启动项目",
      
      totalRevenue: 979833,
      ranking: 19,
      
      category: {
        connect: { slug: "developer-tools" }
      },
      
      techDifficulty: 2,
      
      isFeatured: true,
      
      // 创建关联数据
      businessModel: {
        create: {
          pricingModel: "one-time",
          pricingDetails: {
            tiers: [
              { tier: "基础版", price: 99, period: "lifetime" },
              { tier: "专业版", price: 199, period: "lifetime" },
              { tier: "终极版", price: 299, period: "lifetime" }
            ]
          },
          targetCustomers: "独立开发者、初创公司",
          profitMargin: 90
        }
      },
      
      techStack: {
        create: {
          frontend: {
            framework: "Next.js 14",
            styling: "TailwindCSS"
          },
          backend: {
            auth: "NextAuth.js"
          },
          database: {
            options: ["MongoDB", "Supabase"]
          }
        }
      },
      
      developerAnalysis: {
        create: {
          recommendationLevel: 5,
          recommendationReason: "这是独立开发者的金矿项目...",
          pros: ["高利润率", "快速启动", "可重复销售"],
          developmentWeeks: 6,
          expectedRevenue: {
            month1: "$1K-3K",
            month6: "$5K-15K",
            year1: "$20K-50K"
          }
        }
      },
      
      mvpPlan: {
        create: {
          totalWeeks: 6,
          phases: [
            {
              phase: "Week 1-2",
              title: "核心架构",
              tasks: ["Next.js 14 项目搭建", "TailwindCSS 配置"]
            }
          ]
        }
      },
      
      costAnalysis: {
        create: {
          developmentCost: 0,
          profitMargin: 90
        }
      },
      
      marketingStrategies: {
        create: [
          {
            channel: "Twitter",
            description: "#buildinpublic 记录开发过程",
            priority: 5
          },
          {
            channel: "YouTube",
            description: "技术教程吸引开发者",
            priority: 5
          }
        ]
      }
    }
  });
  
  console.log('Created app:', app.name);
}

importShipFast();
```

---

## 🚀 下一步

需要我帮您：

1. **生成完整的 Prisma Schema 文件**
2. **创建数据导入脚本**（从现有 MD 文件导入）
3. **创建 API 路由**（Next.js API）
4. **设计前端展示组件**

选择一个，我立即开始实现！

