import { PrismaClient, Prisma } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

// ShipFast 示例数据
async function importShipFast() {
  console.log('导入 ShipFast...');

  // 1. 查找或创建分类
  const category = await prisma.category.upsert({
    where: { slug: 'developer-tools' },
    update: {},
    create: {
      name: '开发者工具与教育',
      nameEn: 'Developer Tools & Education',
      nameJa: '開発者ツール＆教育',
      nameFr: 'Outils pour Développeurs et Éducation',
      slug: 'developer-tools',
      description: '代码模板、在线课程、开发工具',
      descriptionEn: 'Code templates, online courses, development tools',
      icon: '👨‍💻',
      color: '#8B5CF6',
      order: 2,
      isActive: true,
    },
  });

  // 2. 创建或更新应用
  const app = await prisma.app.upsert({
    where: { slug: 'shipfast' },
    update: {},
    create: {
      name: 'ShipFast',
      nameEn: 'ShipFast',
      nameZh: '快速启航',
      nameJa: 'シップファスト',
      nameFr: 'ShipFast',
      slug: 'shipfast',
      url: 'https://shipfa.st',

      shortDescription: '为开发者提供的 Next.js 代码模板（Boilerplate），帮助快速启动 SaaS 项目',
      shortDescriptionEn:
        'Next.js code template (Boilerplate) for developers to quickly start SaaS projects',
      shortDescriptionZh: '为开发者提供的 Next.js 代码模板（Boilerplate），帮助快速启动 SaaS 项目',

      fullDescription: `ShipFast 是一个完整的 Next.js 14 代码模板，包含认证、支付、数据库等所有功能。

由 Marc Lou (@marc_louvion) 开发，这个模板已经帮助数千名开发者快速启动他们的 SaaS 项目，节省了几个月的开发时间。

核心价值：
• 节省 40+ 小时的开发时间
• 预配置好的认证系统（Google、Email）
• Stripe 支付集成
• 数据库设置（MongoDB/Supabase）
• 邮件服务集成
• SEO 优化
• Landing Page 模板
• 完整的文档和视频教程

一次购买，终身更新，加入 Discord 社区。`,
      fullDescriptionEn: `ShipFast is a complete Next.js 14 code template with authentication, payments, database, and all features included.

Developed by Marc Lou (@marc_louvion), this template has helped thousands of developers quickly launch their SaaS projects, saving months of development time.

Core Value:
• Save 40+ hours of development time
• Pre-configured authentication system (Google, Email)
• Stripe payment integration
• Database setup (MongoDB/Supabase)
• Email service integration
• SEO optimization
• Landing Page templates
• Complete documentation and video tutorials

One-time purchase, lifetime updates, join Discord community.`,

      totalRevenue: new Prisma.Decimal(979833),
      monthlyRevenue: new Prisma.Decimal(18631),
      ranking: 19,
      rankingChange: 0,

      categoryId: category.id,
      techDifficulty: 2,

      isFeatured: true,
      isPublished: true,

      coreFeatures: [
        { feature: '节省时间', description: '预配置好的认证、支付等' },
        { feature: '最佳实践', description: '遵循行业标准' },
        { feature: '持续更新', description: '跟进最新技术' },
        { feature: '社区支持', description: 'Discord 社区答疑' },
      ],

      successFactors: [
        { factor: '技术栈选择', description: '跟随热门技术 Next.js' },
        { factor: '完整性', description: '包含开发者需要的一切' },
        { factor: '文档质量', description: '详细的使用说明和视频' },
        { factor: '社区营销', description: '在 Twitter 上持续分享' },
      ],

      whyWorthDoing: `这是独立开发者的金矿项目！

💰 高利润率：近 $1M 收入，几乎零边际成本
⚡ 快速启动：1-2 个月开发
🔄 可重复销售：一次开发，无限销售
📈 持续收入：不断有新开发者入门
🎯 市场需求稳定：每年都有新人学习 SaaS 开发

创始人 Marc Lou 通过 Twitter #buildinpublic 积累了大量粉丝，每次更新都能带来新的销售。`,

      whyWorthDoingEn: `This is a goldmine project for indie developers!

💰 High profit margin: Nearly $1M revenue, almost zero marginal cost
⚡ Quick start: 1-2 months development
🔄 Repeatable sales: Develop once, sell infinitely
📈 Continuous income: New developers entering constantly
🎯 Stable market demand: New learners every year

Founder Marc Lou built a large following through Twitter #buildinpublic, each update brings new sales.`,

      businessModel: {
        create: {
          pricingModel: 'one-time',

          pricingDetails: [
            {
              tier: '基础版',
              price: 99,
              currency: 'USD',
              period: 'lifetime',
              features: ['Next.js 模板', '认证系统', 'Stripe 集成', '基础文档'],
            },
            {
              tier: '专业版',
              price: 199,
              currency: 'USD',
              period: 'lifetime',
              features: [
                '基础版所有功能',
                '数据库集成',
                '邮件服务',
                '5个 Landing Page',
                'Discord 访问',
              ],
            },
            {
              tier: '终极版',
              price: 299,
              currency: 'USD',
              period: 'lifetime',
              features: [
                '专业版所有功能',
                '源码访问',
                '终身更新',
                '优先支持',
                '所有未来模板',
              ],
            },
          ],

          targetCustomers:
            '独立开发者、初创公司创始人、想快速构建 SaaS 的开发者、技术创业者',
          targetCustomersEn:
            'Indie developers, startup founders, developers wanting to quickly build SaaS, tech entrepreneurs',

          marketSize:
            '全球数百万开发者市场，每年都有新人入门，SaaS 创业持续火热。根据 GitHub 数据，Next.js 有 100K+ stars，潜在用户群体庞大。',
          marketSizeEn:
            'Millions of developers worldwide, new learners every year, SaaS entrepreneurship continues to boom. According to GitHub data, Next.js has 100K+ stars, huge potential user base.',

          revenueCalculation: {
            avgPrice: 199,
            totalSales: 4920,
            calculation: '$199 × 4,920 销售 ≈ $979,833',
          },

          profitMargin: 90,
        },
      },

      techStack: {
        create: {
          frontend: {
            framework: 'Next.js 14 App Router',
            styling: 'TailwindCSS + daisyUI',
            typescript: true,
          },
          backend: {
            auth: 'NextAuth.js',
            api: 'Next.js API Routes',
          },
          database: {
            options: ['MongoDB', 'Supabase', 'PostgreSQL'],
            orm: 'Prisma',
          },
          infrastructure: {
            payments: 'Stripe',
            emails: 'Mailgun / SendGrid / Resend',
            deployment: 'Vercel',
            analytics: 'Google Analytics / Plausible',
          },

          fullStack: `前端：Next.js 14 App Router + TypeScript + TailwindCSS
后端：Next.js API Routes + NextAuth.js
数据库：MongoDB / Supabase / PostgreSQL (with Prisma)
支付：Stripe
邮件：Mailgun / SendGrid / Resend
部署：Vercel
分析：Google Analytics / Plausible`,

          fullStackEn: `Frontend: Next.js 14 App Router + TypeScript + TailwindCSS
Backend: Next.js API Routes + NextAuth.js
Database: MongoDB / Supabase / PostgreSQL (with Prisma)
Payments: Stripe
Email: Mailgun / SendGrid / Resend
Deployment: Vercel
Analytics: Google Analytics / Plausible`,

          difficultyDetails: `技术难度：⭐⭐ (简单)

本质上是组装现有技术，不需要深度定制。需要：
• 熟悉 Next.js 和 React
• 了解 TypeScript 基础
• 会使用 Stripe API
• 基本的数据库知识

关键是代码架构和文档质量，而不是技术复杂度。`,

          difficultyDetailsEn: `Tech Difficulty: ⭐⭐ (Simple)

Essentially assembling existing technologies, no deep customization needed. Requires:
• Familiar with Next.js and React
• Understanding TypeScript basics
• Can use Stripe API
• Basic database knowledge

The key is code architecture and documentation quality, not technical complexity.`,
        },
      },

      developerAnalysis: {
        create: {
          recommendationLevel: 5,

          recommendationReason: `这是独立开发者的金矿项目！接近 $1M 的收入，几乎零边际成本，1-2 个月就能开发完成，一次开发可以无限次销售。市场需求稳定，每年都有新开发者入门学习。创始人通过 Twitter 分享开发过程积累了大量粉丝，这是可复制的营销策略。`,

          recommendationReasonEn: `This is a goldmine project for indie developers! Nearly $1M in revenue, almost zero marginal cost, 1-2 months to develop, sell infinitely after one-time development. Stable market demand, new developers learning every year. Founder built large following by sharing development process on Twitter, this is a replicable marketing strategy.`,

          pros: [
            '💰 高利润率：近 $1M 收入，几乎零边际成本',
            '⚡ 快速启动：1-2 个月开发',
            '🔄 可重复销售：一次开发，无限销售',
            '📈 持续收入：不断有新开发者入门',
            '🎯 低技术门槛：主要是整合现有技术',
            '📚 文档驱动：好文档比代码更重要',
          ],

          prosEn: [
            '💰 High profit margin: Nearly $1M revenue, almost zero marginal cost',
            '⚡ Quick start: 1-2 months development',
            '🔄 Repeatable sales: Develop once, sell infinitely',
            '📈 Continuous income: New developers entering constantly',
            '🎯 Low technical barrier: Mainly integrating existing tech',
            '📚 Documentation-driven: Good docs matter more than code',
          ],

          cons: [
            '需要跟进最新技术趋势（Next.js 更新快）',
            '文档编写工作量大',
            '市场竞争逐渐增加',
            '需要一定的营销能力',
          ],

          consEn: [
            'Need to keep up with latest tech trends (Next.js updates fast)',
            'Documentation work is significant',
            'Market competition gradually increasing',
            'Requires some marketing skills',
          ],

          suitableFor: `有 2 年以上开发经验的全栈开发者，熟悉 Next.js 等现代技术栈，擅长写文档和教程，有一定的内容营销能力，愿意在社交媒体上分享开发过程。`,

          suitableForEn: `Full-stack developers with 2+ years experience, familiar with Next.js and modern tech stacks, good at writing documentation and tutorials, some content marketing ability, willing to share development process on social media.`,

          developmentWeeks: 6,

          expectedRevenue: {
            month1: '$1K-3K',
            month3: '$3K-10K',
            month6: '$5K-15K',
            year1: '$20K-50K',
            year2: '$50K-150K',
          },
        },
      },

      mvpPlan: {
        create: {
          totalWeeks: 6,

          phases: [
            {
              phase: 'Week 1-2',
              title: '核心架构',
              tasks: [
                'Next.js 14 项目搭建',
                'TailwindCSS + shadcn/ui 配置',
                'TypeScript 严格模式',
                'ESLint + Prettier 配置',
                '基础项目结构',
              ],
              deliverables: ['可运行的 Next.js 项目', '基础 UI 组件库'],
            },
            {
              phase: 'Week 3-4',
              title: '核心功能',
              tasks: [
                'NextAuth.js 认证（Google + Email）',
                'Stripe 支付集成',
                'Supabase 数据库配置',
                'Resend 邮件服务',
                'Landing Page 模板（3个不同风格）',
              ],
              deliverables: [
                '完整的认证流程',
                '可用的支付系统',
                '数据库连接',
                '邮件发送功能',
              ],
            },
            {
              phase: 'Week 5-6',
              title: '文档与发布',
              tasks: [
                '详细文档编写（使用 Mintlify）',
                '视频教程录制（5-10 个短视频）',
                'GitHub 私有仓库设置',
                'Gumroad 销售页面制作',
                'ProductHunt 发布准备',
              ],
              deliverables: ['完整文档站点', '视频教程', '销售页面', 'ProductHunt 发布'],
            },
          ],

          coreFeaturesNeeded: [
            '认证系统（Google + Email）',
            'Stripe 支付集成',
            '数据库配置（Supabase/MongoDB）',
            '邮件服务集成',
            'Landing Page 模板',
            'SEO 优化',
            'TypeScript 支持',
            'Tailwind CSS + UI 组件',
            '完整文档',
            '视频教程',
          ],

          quickStartGuide: `快速启动指南：

1. 技术准备（Week 1）
   - 选择技术栈（推荐 Next.js 14 + Supabase）
   - 搭建基础项目
   - 配置 Tailwind CSS

2. 核心功能（Week 2-3）
   - 集成 NextAuth.js
   - 连接 Stripe
   - 设置数据库
   - 创建 3 个 Landing Page 模板

3. 文档和营销（Week 4-5）
   - 编写详细文档
   - 录制视频教程
   - 设计销售页面

4. 发布（Week 6）
   - Gumroad 上架（$99-299）
   - ProductHunt 发布
   - Twitter 宣传

目标：首月 $1K-3K 收入，Year 1 达到 $20K+`,

          quickStartGuideEn: `Quick Start Guide:

1. Technical Setup (Week 1)
   - Choose tech stack (Recommended Next.js 14 + Supabase)
   - Setup base project
   - Configure Tailwind CSS

2. Core Features (Week 2-3)
   - Integrate NextAuth.js
   - Connect Stripe
   - Setup database
   - Create 3 Landing Page templates

3. Documentation & Marketing (Week 4-5)
   - Write detailed docs
   - Record video tutorials
   - Design sales page

4. Launch (Week 6)
   - List on Gumroad ($99-299)
   - ProductHunt launch
   - Twitter promotion

Goal: $1K-3K first month revenue, reach $20K+ Year 1`,
        },
      },

      costAnalysis: {
        create: {
          developmentCost: new Prisma.Decimal(0),

          monthlyCosts: {
            hosting: 0,
            gumroad: '8.5% + $0.30 per transaction',
            domain: 1,
            tools: 0,
            total: '< $20/month (主要是交易费)',
          },

          yearlyEstimate: new Prisma.Decimal(100),

          profitMargin: 90,

          costBreakdown: `成本分析（几乎零成本！）：

开发成本：$0（自己开发）
销售平台：Gumroad 抽成 8.5% + $0.30
托管：Vercel 免费版（足够用）
域名：$12/年
工具：基本免费

总利润率：约 90%

如果月收入 $5K：
- Gumroad 费用：约 $440
- 其他成本：< $10
- 净利润：约 $4,550

这就是数字产品的魅力！`,

          costBreakdownEn: `Cost Analysis (Almost Zero Cost!):

Development cost: $0 (self-developed)
Sales platform: Gumroad 8.5% + $0.30 commission
Hosting: Vercel free tier (sufficient)
Domain: $12/year
Tools: Mostly free

Total profit margin: ~90%

If monthly revenue $5K:
- Gumroad fees: ~$440
- Other costs: < $10
- Net profit: ~$4,550

That's the magic of digital products!`,
        },
      },

      marketingStrategies: {
        createMany: {
          data: [
            {
              channel: 'Twitter',
              description:
                '#buildinpublic 记录开发过程，分享收入数据，吸引同行关注。Marc Lou 通过持续分享积累了大量粉丝，这是最有效的营销渠道。',
              descriptionEn:
                '#buildinpublic document development process, share revenue data, attract peer attention. Marc Lou built large following through consistent sharing, this is the most effective marketing channel.',
              priority: 5,
            },
            {
              channel: 'YouTube',
              description:
                '制作技术教程吸引开发者，演示如何使用模板快速构建项目。视频内容也可以作为产品文档的一部分。',
              descriptionEn:
                'Create tech tutorials to attract developers, demonstrate how to use template to quickly build projects. Video content also serves as part of product documentation.',
              priority: 5,
            },
            {
              channel: 'ProductHunt',
              description:
                '发布当天冲榜，争取进入前 3 获得大量曝光。准备好 demo、视频和详细介绍。',
              descriptionEn:
                'Push for rankings on launch day, aim for top 3 to get massive exposure. Prepare demo, video and detailed introduction.',
              priority: 4,
            },
            {
              channel: 'Reddit',
              description:
                '在 r/SaaS、r/webdev、r/nextjs 等社区分享经验和产品，注意遵守社区规则。',
              descriptionEn:
                'Share experience and product in r/SaaS, r/webdev, r/nextjs communities, follow community rules.',
              priority: 3,
            },
            {
              channel: 'Indie Hackers',
              description:
                '分享收入数据和开发经验，建立信任。这个社区的用户正是目标客户。',
              descriptionEn:
                'Share revenue data and development experience, build trust. This community users are exactly target customers.',
              priority: 3,
            },
          ],
        },
      },
    },
  });

  console.log('✅ ShipFast 导入完成');
  return app;
}

// 主函数
async function main() {
  console.log('🚀 开始导入数据...');

  try {
    // 导入示例应用
    await importShipFast();

    console.log('✅ 所有数据导入完成！');
    console.log('\n可以运行以下命令查看数据：');
    console.log('  npm run db:studio');
  } catch (error) {
    console.error('❌ 导入失败:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

