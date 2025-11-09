import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  {
    name: '营销与增长工具',
    nameEn: 'Marketing & Growth Tools',
    nameJa: 'マーケティング＆グロースツール',
    nameFr: 'Outils de Marketing et Croissance',
    nameZh: '营销与增长工具',
    slug: 'marketing-growth',
    description: '包含营销分析、转化优化、创作者平台等工具',
    descriptionEn: 'Marketing analytics, conversion optimization, creator platforms',
    icon: '📈',
    color: '#3B82F6',
    order: 1
  },
  {
    name: '开发者工具与教育',
    nameEn: 'Developer Tools & Education',
    nameJa: '開発者ツール＆教育',
    nameFr: 'Outils pour Développeurs et Éducation',
    nameZh: '开发者工具与教育',
    slug: 'developer-tools',
    description: '代码模板、在线课程、开发工具',
    descriptionEn: 'Code templates, online courses, development tools',
    icon: '👨‍💻',
    color: '#8B5CF6',
    order: 2
  },
  {
    name: 'AI与内容生成',
    nameEn: 'AI & Content Generation',
    nameJa: 'AI＆コンテンツ生成',
    nameFr: 'IA et Génération de Contenu',
    nameZh: 'AI与内容生成',
    slug: 'ai-content',
    description: 'SEO内容、AI工具、视频生成',
    descriptionEn: 'SEO content, AI tools, video generation',
    icon: '🤖',
    color: '#EC4899',
    order: 3
  },
  {
    name: '电商与支付',
    nameEn: 'E-commerce & Payments',
    nameJa: 'Eコマース＆決済',
    nameFr: 'E-commerce et Paiements',
    nameZh: '电商与支付',
    slug: 'ecommerce-payments',
    description: '礼品卡、订单系统、电商平台',
    descriptionEn: 'Gift cards, order systems, e-commerce platforms',
    icon: '🛒',
    color: '#10B981',
    order: 4
  },
  {
    name: '垂直细分市场',
    nameEn: 'Niche Vertical Markets',
    nameJa: 'ニッチ垂直市場',
    nameFr: 'Marchés Verticaux de Niche',
    nameZh: '垂直细分市场',
    slug: 'niche-markets',
    description: '教堂软件、特殊教育、行业专属工具',
    descriptionEn: 'Church software, special education, industry-specific tools',
    icon: '🎯',
    color: '#F59E0B',
    order: 5
  },
  {
    name: '商业服务平台',
    nameEn: 'Business Services',
    nameJa: 'ビジネスサービス',
    nameFr: 'Services aux Entreprises',
    nameZh: '商业服务平台',
    slug: 'business-services',
    description: '公司注册、业务买卖市场',
    descriptionEn: 'Company registration, business marketplaces',
    icon: '💼',
    color: '#6366F1',
    order: 6
  },
  {
    name: '社区与会员平台',
    nameEn: 'Community & Membership',
    nameJa: 'コミュニティ＆メンバーシップ',
    nameFr: 'Communauté et Adhésion',
    nameZh: '社区与会员平台',
    slug: 'community-membership',
    description: '付费社区、会员订阅',
    descriptionEn: 'Paid communities, membership subscriptions',
    icon: '👥',
    color: '#EF4444',
    order: 7
  },
  {
    name: '金融科技与交易',
    nameEn: 'Fintech & Trading',
    nameJa: 'フィンテック＆トレーディング',
    nameFr: 'Fintech et Trading',
    nameZh: '金融科技与交易',
    slug: 'fintech-trading',
    description: '金融工具、交易平台（高监管风险）',
    descriptionEn: 'Financial tools, trading platforms (high regulatory risk)',
    icon: '💰',
    color: '#14B8A6',
    order: 8
  },
  {
    name: '基础设施与技术服务',
    nameEn: 'Infrastructure & Technical Services',
    nameJa: 'インフラ＆技術サービス',
    nameFr: 'Infrastructure et Services Techniques',
    nameZh: '基础设施与技术服务',
    slug: 'infrastructure-technical',
    description: '代理服务、排名追踪、分析工具',
    descriptionEn: 'Proxy services, rank tracking, analytics',
    icon: '🔧',
    color: '#06B6D4',
    order: 9
  },
  {
    name: '其他应用',
    nameEn: 'Miscellaneous',
    nameJa: 'その他のアプリ',
    nameFr: 'Applications Diverses',
    nameZh: '其他应用',
    slug: 'miscellaneous',
    description: 'COSS模式、安静建设、混合模式',
    descriptionEn: 'COSS model, building in quiet, hybrid models',
    icon: '📦',
    color: '#64748B',
    order: 10
  }
];

async function main() {
  console.log('开始插入分类数据...');
  
  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category
    });
    
    console.log(`✅ 创建/更新分类: ${created.name} (${created.slug})`);
  }
  
  console.log('✅ 分类数据插入完成！');
}

main()
  .catch((e) => {
    console.error('❌ 错误:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

