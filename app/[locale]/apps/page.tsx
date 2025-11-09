import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import { AppCard } from '@/components/app-card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';

interface AppsPageProps {
  params: { locale: string };
  searchParams: { 
    category?: string; 
    search?: string;
    sort?: string;
  };
}

export default async function AppsPage({ params: { locale }, searchParams }: AppsPageProps) {
  const { category, search, sort = 'ranking' } = searchParams;

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
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="搜索应用..."
            className="pl-10"
            defaultValue={search}
            name="search"
          />
        </div>

        {/* Category Filter */}
        <Select defaultValue={category || 'all'}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="选择分类" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">所有分类</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.slug}>
                {locale === 'zh' ? cat.name : cat.nameEn || cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select defaultValue={sort}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="排序方式" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ranking">排名升序</SelectItem>
            <SelectItem value="revenue-desc">收入降序</SelectItem>
            <SelectItem value="mrr-desc">MRR降序</SelectItem>
            <SelectItem value="recommendation-desc">推荐度降序</SelectItem>
          </SelectContent>
        </Select>
      </div>

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

