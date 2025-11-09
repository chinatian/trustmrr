import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AppCard } from '@/components/app-card';
import { prisma } from '@/lib/prisma';
import { ArrowRight, TrendingUp, Users, DollarSign } from 'lucide-react';

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  // 获取统计数据
  const [totalApps, totalCategories, featuredApps, categories] = await Promise.all([
    prisma.app.count({ where: { isPublished: true } }),
    prisma.category.count({ where: { isActive: true } }),
    prisma.app.findMany({
      where: {
        isPublished: true,
        isFeatured: true,
      },
      include: {
        category: true,
        developerAnalysis: true,
      },
      orderBy: {
        ranking: 'asc',
      },
      take: 6,
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      take: 6,
    }),
  ]);

  // 计算总收入
  const totalRevenueResult = await prisma.app.aggregate({
    where: { isPublished: true },
    _sum: {
      totalRevenue: true,
    },
  });

  const totalRevenue = totalRevenueResult._sum.totalRevenue || 0;

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          发现值得做的独立项目
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          基于真实收入数据，为全球独立开发者提供深度分析和启发
        </p>
        <Link href={`/${locale}/apps`}>
          <Button size="lg" className="text-lg px-8">
            探索应用
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
              {totalApps}
            </CardTitle>
            <CardDescription>应用项目</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Users className="w-6 h-6 mr-2 text-purple-600" />
              {totalCategories}
            </CardTitle>
            <CardDescription>应用分类</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <DollarSign className="w-6 h-6 mr-2 text-green-600" />
              {(Number(totalRevenue) / 1000000).toFixed(1)}M
            </CardTitle>
            <CardDescription>累计总收入</CardDescription>
          </CardHeader>
        </Card>
      </section>

      {/* Featured Apps Section */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">精选应用</h2>
            <p className="text-muted-foreground">
              最值得独立开发者学习和参考的项目
            </p>
          </div>
          <Link href={`/${locale}/apps`}>
            <Button variant="outline">
              查看全部
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredApps.map((app) => (
            <AppCard key={app.id} app={app} locale={locale} />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">浏览分类</h2>
          <p className="text-muted-foreground">
            按行业和类型探索应用
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/${locale}/categories/${category.slug}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <span className="text-3xl mr-3">{category.icon || '📦'}</span>
                    {locale === 'zh' ? category.name : category.nameEn || category.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {locale === 'zh' 
                      ? category.description 
                      : category.descriptionEn || category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {category.appCount} 个应用
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

