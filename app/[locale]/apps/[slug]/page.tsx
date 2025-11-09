import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, getLocalizedField } from '@/lib/utils';
import { ArrowLeft, ExternalLink, Star, TrendingUp, Calendar, DollarSign, Home, ChevronRight } from 'lucide-react';

interface AppDetailPageProps {
  params: {
    locale: string;
    slug: string;
  };
}

// 生成动态元数据（SEO 优化）
export async function generateMetadata({ params: { locale, slug } }: AppDetailPageProps): Promise<Metadata> {
  const app = await prisma.app.findUnique({
    where: { slug },
    include: {
      category: true,
      tags: true,
      developerAnalysis: true,
    },
  });

  if (!app || !app.isPublished) {
    return {
      title: 'Application Not Found',
      description: 'The requested application could not be found.',
    };
  }

  const name = getLocalizedField(app, 'name', locale);
  const shortDescription = getLocalizedField(app, 'shortDescription', locale);
  const categoryName = getLocalizedField(app.category, 'name', locale);
  const tags = app.tags.map(tag => getLocalizedField(tag, 'name', locale)).join(', ');
  
  // 构建完整的描述
  const metaDescription = `${name} - ${shortDescription}. 总收入: ${formatCurrency(Number(app.totalRevenue))}${app.mrr ? `, MRR: ${formatCurrency(Number(app.mrr))}` : ''}. ${app.developerAnalysis ? `推荐度: ${app.developerAnalysis.recommendationLevel}/5星` : ''} | TrustMRR 案例分析`;

  // 构建关键词
  const keywords = [
    name,
    categoryName,
    'SaaS',
    'indie hacker',
    '独立开发者',
    '创业',
    'startup',
    '盈利应用',
    ...app.metaKeywords,
    tags,
  ].filter(Boolean);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const appUrl = `${baseUrl}/${locale}/apps/${slug}`;

  return {
    title: `${name} - ${categoryName} | TrustMRR 案例分析`,
    description: metaDescription.slice(0, 160), // Google 推荐 150-160 字符
    keywords: keywords.join(', '),
    authors: [{ name: app.founder?.name || 'TrustMRR' }],
    creator: app.founder?.name || 'TrustMRR',
    publisher: 'TrustMRR',
    
    // Open Graph (Facebook, LinkedIn)
    openGraph: {
      type: 'website',
      locale: locale === 'zh' ? 'zh_CN' : locale,
      url: appUrl,
      title: `${name} - ${categoryName}`,
      description: shortDescription,
      siteName: 'TrustMRR - 独立开发者案例分析',
      images: [
        {
          url: app.logo || `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: name,
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: `${name} - ${categoryName}`,
      description: shortDescription,
      images: [app.logo || `${baseUrl}/og-image.png`],
      creator: app.founder?.twitterUrl ? `@${app.founder.twitterUrl.split('/').pop()}` : '@trustmrr',
    },

    // 额外的元数据
    alternates: {
      canonical: appUrl,
      languages: {
        'zh-CN': `${baseUrl}/zh/apps/${slug}`,
        'en': `${baseUrl}/en/apps/${slug}`,
        'ja': `${baseUrl}/ja/apps/${slug}`,
        'fr': `${baseUrl}/fr/apps/${slug}`,
      },
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // 其他元数据
    category: categoryName,
  };
}

export default async function AppDetailPage({ params: { locale, slug } }: AppDetailPageProps) {
  const app = await prisma.app.findUnique({
    where: { slug },
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
        take: 12,
      },
    },
  });

  if (!app || !app.isPublished) {
    notFound();
  }

  const name = getLocalizedField(app, 'name', locale);
  const fullDescription = getLocalizedField(app, 'fullDescription', locale);
  const whyWorthDoing = getLocalizedField(app, 'whyWorthDoing', locale);
  const categoryName = getLocalizedField(app.category, 'name', locale);
  const shortDescription = getLocalizedField(app, 'shortDescription', locale);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // JSON-LD 结构化数据（Schema.org）
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: name,
    description: shortDescription,
    applicationCategory: 'BusinessApplication',
    offers: {
      '@type': 'Offer',
      price: app.mrr ? Number(app.mrr) : Number(app.totalRevenue),
      priceCurrency: app.currency || 'USD',
    },
    aggregateRating: app.developerAnalysis ? {
      '@type': 'AggregateRating',
      ratingValue: app.developerAnalysis.recommendationLevel,
      bestRating: 5,
      ratingCount: 1,
    } : undefined,
    author: app.founder ? {
      '@type': 'Person',
      name: app.founder.name,
      url: app.founder.websiteUrl || app.founder.twitterUrl,
    } : undefined,
    url: app.url,
    operatingSystem: 'Web',
  };

  // 面包屑导航 JSON-LD
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '首页',
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '应用列表',
        item: `${baseUrl}/${locale}/apps`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: categoryName,
        item: `${baseUrl}/${locale}/apps?category=${app.category.slug}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: name,
        item: `${baseUrl}/${locale}/apps/${slug}`,
      },
    ],
  };

  return (
    <>
      {/* JSON-LD 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <article className="container mx-auto px-4 py-12">
        {/* 面包屑导航 */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
            <li>
              <Link href={`/${locale}`} className="hover:text-primary flex items-center">
                <Home className="w-4 h-4" />
              </Link>
            </li>
            <ChevronRight className="w-4 h-4" />
            <li>
              <Link href={`/${locale}/apps`} className="hover:text-primary">
                应用列表
              </Link>
            </li>
            <ChevronRight className="w-4 h-4" />
            <li>
              <Link 
                href={`/${locale}/apps?category=${app.category.slug}`}
                className="hover:text-primary"
              >
                {categoryName}
              </Link>
            </li>
            <ChevronRight className="w-4 h-4" />
            <li className="font-medium text-foreground" aria-current="page">
              {name}
            </li>
          </ol>
        </nav>

        {/* Back Button */}
        <Link href={`/${locale}/apps`}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回列表
          </Button>
        </Link>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2" itemProp="name">{name}</h1>
            <p className="text-xl text-muted-foreground" itemProp="description">
              {shortDescription}
            </p>
          </div>
          {app.ranking && (
            <div className="ml-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">#{app.ranking}</div>
                <div className="text-sm text-muted-foreground">排名</div>
              </div>
            </div>
          )}
        </div>

        {/* Badges and Meta Info */}
        <div className="flex flex-wrap gap-2" itemProp="keywords">
          {app.category && (
            <Badge variant="secondary">
              {getLocalizedField(app.category, 'name', locale)}
            </Badge>
          )}
          {app.isFeatured && <Badge>精选</Badge>}
          {app.isNewApp && <Badge variant="destructive">新应用</Badge>}
          {app.url && (
            <a href={app.url} target="_blank" rel="noopener noreferrer">
              <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                <ExternalLink className="w-3 h-3 mr-1" />
                访问官网
              </Badge>
            </a>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <section className="lg:col-span-2 space-y-8" itemScope itemType="https://schema.org/Article">
          {/* Revenue Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                收入数据
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">总收入</div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(Number(app.totalRevenue))}
                  </div>
                </div>
                {app.mrr && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">MRR</div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(Number(app.mrr))}
                    </div>
                  </div>
                )}
                {app.monthlyRevenue && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">月收入</div>
                    <div className="text-2xl font-bold">
                      {formatCurrency(Number(app.monthlyRevenue))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>应用介绍</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray max-w-none">
                <p className="whitespace-pre-wrap">{fullDescription}</p>
              </div>
            </CardContent>
          </Card>

          {/* Why Worth Doing */}
          {whyWorthDoing && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                  为什么值得做
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{whyWorthDoing}</p>
              </CardContent>
            </Card>
          )}

          {/* Developer Analysis */}
          {app.developerAnalysis && (
            <Card>
              <CardHeader>
                <CardTitle>独立开发者分析</CardTitle>
                <div className="flex items-center mt-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < app.developerAnalysis!.recommendationLevel
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                    推荐度: {app.developerAnalysis.recommendationLevel}/5
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">推荐理由</h4>
                  <p className="text-muted-foreground">
                    {getLocalizedField(app.developerAnalysis, 'recommendationReason', locale)}
                  </p>
                </div>

                {app.developerAnalysis.pros && (
                  <div>
                    <h4 className="font-semibold mb-2 text-green-600">优点</h4>
                    <ul className="space-y-1">
                      {(Array.isArray(app.developerAnalysis.pros) 
                        ? app.developerAnalysis.pros 
                        : []
                      ).map((pro: string, i: number) => (
                        <li key={i} className="text-sm text-muted-foreground">• {pro}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {app.developerAnalysis.cons && (
                  <div>
                    <h4 className="font-semibold mb-2 text-red-600">缺点</h4>
                    <ul className="space-y-1">
                      {(Array.isArray(app.developerAnalysis.cons) 
                        ? app.developerAnalysis.cons 
                        : []
                      ).map((con: string, i: number) => (
                        <li key={i} className="text-sm text-muted-foreground">• {con}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {app.developerAnalysis.suitableFor && (
                  <div>
                    <h4 className="font-semibold mb-2">适合人群</h4>
                    <p className="text-sm text-muted-foreground">
                      {getLocalizedField(app.developerAnalysis, 'suitableFor', locale)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Business Model */}
          {app.businessModel && (
            <Card>
              <CardHeader>
                <CardTitle>商业模式</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">定价模式</h4>
                  <Badge>{app.businessModel.pricingModel}</Badge>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">目标客户</h4>
                  <p className="text-sm text-muted-foreground">
                    {getLocalizedField(app.businessModel, 'targetCustomers', locale)}
                  </p>
                </div>

                {app.businessModel.profitMargin && (
                  <div>
                    <h4 className="font-semibold mb-2">利润率</h4>
                    <div className="text-2xl font-bold text-green-600">
                      {app.businessModel.profitMargin}%
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Tech Stack */}
          {app.techStack && (
            <Card>
              <CardHeader>
                <CardTitle>技术栈</CardTitle>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-muted-foreground">
                    技术难度:
                  </span>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ml-1 ${
                        i < app.techDifficulty
                          ? 'fill-orange-400 text-orange-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 技术栈详细信息 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {app.techStack.frontend && (
                    <div>
                      <h4 className="font-semibold mb-2 text-blue-600">前端</h4>
                      <div className="flex flex-wrap gap-2">
                        {(Array.isArray(app.techStack.frontend) 
                          ? app.techStack.frontend 
                          : (typeof app.techStack.frontend === 'object' ? Object.values(app.techStack.frontend) : [])
                        ).map((tech: any, i: number) => (
                          <Badge key={i} variant="outline">{tech}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {app.techStack.backend && (
                    <div>
                      <h4 className="font-semibold mb-2 text-green-600">后端</h4>
                      <div className="flex flex-wrap gap-2">
                        {(Array.isArray(app.techStack.backend) 
                          ? app.techStack.backend 
                          : (typeof app.techStack.backend === 'object' ? Object.values(app.techStack.backend) : [])
                        ).map((tech: any, i: number) => (
                          <Badge key={i} variant="outline">{tech}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {app.techStack.database && (
                    <div>
                      <h4 className="font-semibold mb-2 text-purple-600">数据库</h4>
                      <div className="flex flex-wrap gap-2">
                        {(Array.isArray(app.techStack.database) 
                          ? app.techStack.database 
                          : (typeof app.techStack.database === 'object' ? Object.values(app.techStack.database) : [])
                        ).map((tech: any, i: number) => (
                          <Badge key={i} variant="outline">{tech}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {app.techStack.infrastructure && (
                    <div>
                      <h4 className="font-semibold mb-2 text-orange-600">基础设施</h4>
                      <div className="flex flex-wrap gap-2">
                        {(Array.isArray(app.techStack.infrastructure) 
                          ? app.techStack.infrastructure 
                          : (typeof app.techStack.infrastructure === 'object' ? Object.values(app.techStack.infrastructure) : [])
                        ).map((tech: any, i: number) => (
                          <Badge key={i} variant="outline">{tech}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* 完整技术栈描述 */}
                {getLocalizedField(app.techStack, 'fullStack', locale) && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {getLocalizedField(app.techStack, 'fullStack', locale)}
                    </p>
                  </div>
                )}
                
                {/* 难度说明 */}
                {getLocalizedField(app.techStack, 'difficultyDetails', locale) && (
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-orange-800">难度说明</h4>
                    <p className="text-sm text-orange-700 whitespace-pre-wrap">
                      {getLocalizedField(app.techStack, 'difficultyDetails', locale)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* MVP Development Plan */}
          {app.mvpPlan && (
            <Card>
              <CardHeader>
                <CardTitle>MVP 开发计划</CardTitle>
                {app.mvpPlan.totalWeeks && (
                  <CardDescription>
                    预计开发时间：{app.mvpPlan.totalWeeks} 周
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 开发阶段 */}
                {app.mvpPlan.phases && (
                  <div>
                    <h4 className="font-semibold mb-3">开发阶段</h4>
                    <div className="space-y-3">
                      {(Array.isArray(app.mvpPlan.phases) 
                        ? app.mvpPlan.phases 
                        : []
                      ).map((phase: any, i: number) => (
                        <div key={i} className="border-l-4 border-blue-500 pl-4 py-2">
                          <div className="font-medium text-blue-700">
                            阶段 {i + 1}: {phase.name || phase.phase || phase.title}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {phase.description || phase.content}
                          </div>
                          {phase.weeks && (
                            <div className="text-xs text-muted-foreground mt-1">
                              ⏱️ {phase.weeks} 周
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* 核心功能 */}
                {app.mvpPlan.coreFeaturesNeeded && (
                  <div>
                    <h4 className="font-semibold mb-2">必需核心功能</h4>
                    <ul className="space-y-1">
                      {(Array.isArray(app.mvpPlan.coreFeaturesNeeded) 
                        ? app.mvpPlan.coreFeaturesNeeded 
                        : []
                      ).map((feature: any, i: number) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          ✓ {typeof feature === 'string' ? feature : feature.feature || feature.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* 快速启动指南 */}
                {getLocalizedField(app.mvpPlan, 'quickStartGuide', locale) && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-green-800">快速启动指南</h4>
                    <p className="text-sm text-green-700 whitespace-pre-wrap">
                      {getLocalizedField(app.mvpPlan, 'quickStartGuide', locale)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Cost Analysis */}
          {app.costAnalysis && (
            <Card>
              <CardHeader>
                <CardTitle>成本分析</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {app.costAnalysis.developmentCost && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">开发成本</div>
                      <div className="text-xl font-bold text-blue-600">
                        {formatCurrency(Number(app.costAnalysis.developmentCost))}
                      </div>
                    </div>
                  )}
                  
                  {app.costAnalysis.yearlyEstimate && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">年度运营成本</div>
                      <div className="text-xl font-bold text-orange-600">
                        {formatCurrency(Number(app.costAnalysis.yearlyEstimate))}
                      </div>
                    </div>
                  )}
                  
                  {app.costAnalysis.profitMargin && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">利润率</div>
                      <div className="text-xl font-bold text-green-600">
                        {app.costAnalysis.profitMargin}%
                      </div>
                    </div>
                  )}
                </div>
                
                {/* 月度成本明细 */}
                {app.costAnalysis.monthlyCosts && (
                  <div>
                    <h4 className="font-semibold mb-2">月度成本明细</h4>
                    <div className="space-y-2">
                      {Object.entries(
                        typeof app.costAnalysis.monthlyCosts === 'object' 
                          ? app.costAnalysis.monthlyCosts 
                          : {}
                      ).map(([key, value]: [string, any]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{key}</span>
                          <span className="font-medium">{typeof value === 'number' ? formatCurrency(value) : value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* 成本分解说明 */}
                {getLocalizedField(app.costAnalysis, 'costBreakdown', locale) && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-blue-800">成本说明</h4>
                    <p className="text-sm text-blue-700 whitespace-pre-wrap">
                      {getLocalizedField(app.costAnalysis, 'costBreakdown', locale)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Marketing Strategies */}
          {app.marketingStrategies && app.marketingStrategies.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>营销策略</CardTitle>
                <CardDescription>推荐的营销渠道和方法</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {app.marketingStrategies
                    .sort((a, b) => (b.priority || 0) - (a.priority || 0))
                    .map((strategy, i) => (
                      <div key={strategy.id} className="border-l-4 border-purple-500 pl-4 py-2">
                        <div className="flex items-start justify-between">
                          <div className="font-medium text-purple-700">
                            {strategy.channel}
                          </div>
                          {strategy.priority && (
                            <Badge variant={strategy.priority >= 4 ? 'default' : 'secondary'}>
                              优先级: {strategy.priority}/5
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {getLocalizedField(strategy, 'description', locale)}
                        </p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Revenue History Chart */}
          {app.revenueHistory && app.revenueHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  收入历史
                </CardTitle>
                <CardDescription>
                  最近 {app.revenueHistory.length} 个月的收入趋势
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {app.revenueHistory.map((history) => (
                    <div key={history.id} className="flex justify-between items-center py-2 border-b last:border-0">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">
                          {new Date(history.date).toLocaleDateString(locale, { 
                            year: 'numeric', 
                            month: 'short' 
                          })}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {formatCurrency(Number(history.totalRevenue))}
                        </div>
                        {history.mrr && (
                          <div className="text-xs text-green-600">
                            MRR: {formatCurrency(Number(history.mrr))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Sidebar */}
        <aside className="space-y-6" role="complementary">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">快速信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">推荐度</div>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        app.developerAnalysis && i < app.developerAnalysis.recommendationLevel
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {app.developerAnalysis?.developmentWeeks && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">开发周期</div>
                  <div className="font-semibold">
                    {app.developerAnalysis.developmentWeeks} 周
                  </div>
                </div>
              )}

              <div>
                <div className="text-sm text-muted-foreground mb-1">技术难度</div>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < app.techDifficulty
                          ? 'fill-orange-400 text-orange-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {app.founder && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">创始人</div>
                  <div className="font-semibold">{app.founder.name}</div>
                  {app.founder.username && (
                    <div className="text-xs text-muted-foreground">@{app.founder.username}</div>
                  )}
                </div>
              )}

              {app.launchedDate && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">上线时间</div>
                  <div className="font-semibold">
                    {new Date(app.launchedDate).toLocaleDateString(locale)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          {app.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">标签</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {app.tags.map((tag) => (
                    <Badge key={tag.id} variant="outline">
                      {getLocalizedField(tag, 'name', locale)}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Founder Details */}
          {app.founder && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">创始人信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="font-semibold text-lg">{app.founder.name}</div>
                  {app.founder.username && (
                    <div className="text-sm text-muted-foreground">@{app.founder.username}</div>
                  )}
                </div>

                {getLocalizedField(app.founder, 'bio', locale) && (
                  <p className="text-sm text-muted-foreground">
                    {getLocalizedField(app.founder, 'bio', locale)}
                  </p>
                )}

                {(app.founder.twitterUrl || app.founder.linkedinUrl || app.founder.websiteUrl) && (
                  <div className="space-y-2 pt-2 border-t">
                    {app.founder.twitterUrl && (
                      <a 
                        href={app.founder.twitterUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-blue-600 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Twitter
                      </a>
                    )}
                    {app.founder.linkedinUrl && (
                      <a 
                        href={app.founder.linkedinUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-blue-600 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        LinkedIn
                      </a>
                    )}
                    {app.founder.websiteUrl && (
                      <a 
                        href={app.founder.websiteUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-blue-600 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Website
                      </a>
                    )}
                  </div>
                )}

                {app.founder.totalRevenue && (
                  <div className="pt-2 border-t">
                    <div className="text-xs text-muted-foreground">总收入</div>
                    <div className="text-lg font-bold text-green-600">
                      {formatCurrency(Number(app.founder.totalRevenue))}
                    </div>
                  </div>
                )}

                {app.founder.appCount && app.founder.appCount > 1 && (
                  <div>
                    <div className="text-xs text-muted-foreground">项目数量</div>
                    <div className="font-semibold">{app.founder.appCount} 个</div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Detailed Business Model */}
          {app.businessModel && app.businessModel.pricingDetails && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">定价详情</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(Array.isArray(app.businessModel.pricingDetails) 
                    ? app.businessModel.pricingDetails 
                    : typeof app.businessModel.pricingDetails === 'object'
                    ? Object.entries(app.businessModel.pricingDetails).map(([key, value]) => ({
                        tier: key,
                        price: value
                      }))
                    : []
                  ).map((pricing: any, i: number) => (
                    <div key={i} className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-semibold text-sm">
                        {pricing.tier || pricing.name || `方案 ${i + 1}`}
                      </div>
                      <div className="text-lg font-bold text-primary mt-1">
                        {typeof pricing.price === 'number' 
                          ? formatCurrency(pricing.price)
                          : pricing.price || pricing.value
                        }
                      </div>
                      {pricing.description && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {pricing.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </aside>
      </div>
    </article>
    </>
  );
}

