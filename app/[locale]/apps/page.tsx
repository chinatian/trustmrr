import { Suspense } from 'react';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { AppCard } from '@/components/app-card';
import { AppsFilter } from '@/components/apps-filter';
import { getLocalizedField } from '@/lib/utils';

interface AppsPageProps {
  params: { locale: string };
  searchParams: { 
    category?: string; 
    search?: string;
    sort?: string;
    revenueMin?: string;
    revenueMax?: string;
  };
}

// 生成动态元数据
export async function generateMetadata({ params: { locale }, searchParams }: AppsPageProps): Promise<Metadata> {
  const { category } = searchParams;
  
  let title = '应用列表 - 独立开发者盈利案例分析';
  let description = '浏览所有盈利的独立开发者应用案例，包含收入数据、技术栈、商业模式和开发建议。';

  if (category && category !== 'all') {
    const categoryData = await prisma.category.findUnique({
      where: { slug: category },
    });
    
    if (categoryData) {
      const categoryName = getLocalizedField(categoryData, 'name', locale);
      const categoryDesc = getLocalizedField(categoryData, 'description', locale);
      title = `${categoryName} - 应用案例 | TrustMRR`;
      description = categoryDesc || `浏览 ${categoryName} 分类下的所有盈利应用案例，了解收入数据、技术实现和商业模式。`;
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return {
    title,
    description,
    keywords: 'SaaS, 独立开发者, indie hacker, 创业, 盈利应用, 收入数据, 技术栈, 商业模式',
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/apps`,
      siteName: 'TrustMRR - 独立开发者案例分析',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/apps${category ? `?category=${category}` : ''}`,
      languages: {
        'zh-CN': `${baseUrl}/zh/apps`,
        'en': `${baseUrl}/en/apps`,
        'ja': `${baseUrl}/ja/apps`,
        'fr': `${baseUrl}/fr/apps`,
      },
    },
  };
}

export default async function AppsPage({ params: { locale }, searchParams }: AppsPageProps) {
  const { category, search, sort = 'ranking', revenueMin, revenueMax } = searchParams;

  // 构建查询条件
  const where: any = {
    isPublished: true,
  };

  if (category && category !== 'all') {
    where.category = {
      slug: category,
    };
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { shortDescription: { contains: search, mode: 'insensitive' } },
    ];
  }

  // 收入范围筛选
  if (revenueMin || revenueMax) {
    where.totalRevenue = {};
    if (revenueMin) {
      where.totalRevenue.gte = parseFloat(revenueMin);
    }
    if (revenueMax) {
      where.totalRevenue.lte = parseFloat(revenueMax);
    }
  }

  // 构建排序条件
  const orderBy: any = {};
  switch (sort) {
    case 'revenue-desc':
      orderBy.totalRevenue = 'desc';
      break;
    case 'mrr-desc':
      orderBy.mrr = 'desc';
      break;
    case 'recommendation-desc':
      orderBy.developerAnalysis = { recommendationLevel: 'desc' };
      break;
    default:
      orderBy.ranking = 'asc';
  }

  // 获取应用列表和分类列表
  const [apps, categories] = await Promise.all([
    prisma.app.findMany({
      where,
      include: {
        category: true,
        developerAnalysis: true,
      },
      orderBy,
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    }),
  ]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">应用列表</h1>
        <p className="text-muted-foreground">
          浏览所有经过深度分析的独立开发项目
        </p>
      </div>

      {/* Filters and Search */}
      <AppsFilter
        categories={categories}
        locale={locale}
        initialSearch={search}
        initialCategory={category}
        initialSort={sort}
        initialRevenueMin={revenueMin}
        initialRevenueMax={revenueMax}
      />

      {/* Apps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.length > 0 ? (
          apps.map((app) => (
            <AppCard key={app.id} app={app} locale={locale} />
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            没有找到符合条件的应用
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="mt-12 text-center text-muted-foreground">
        共找到 {apps.length} 个应用
      </div>
    </div>
  );
}

