import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getLocalizedField } from '@/lib/utils';

export default async function CategoriesPage({ params: { locale } }: { params: { locale: string } }) {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    include: {
      _count: {
        select: { apps: { where: { isPublished: true } } },
      },
    },
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">应用分类</h1>
        <p className="text-muted-foreground">
          按行业和类型探索应用，找到适合你的方向
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link key={category.id} href={`/${locale}/categories/${category.slug}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center mb-2">
                  <span className="text-4xl mr-3">{category.icon || '📦'}</span>
                  <CardTitle className="text-xl">
                    {getLocalizedField(category, 'name', locale)}
                  </CardTitle>
                </div>
                <CardDescription className="line-clamp-3">
                  {getLocalizedField(category, 'description', locale)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {category._count.apps} 个应用
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

