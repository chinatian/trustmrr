import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { AppCard } from '@/components/app-card';
import { getLocalizedField } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';

interface CategoryPageProps {
  params: {
    locale: string;
    slug: string;
  };
}

export default async function CategoryPage({ params: { locale, slug } }: CategoryPageProps) {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      apps: {
        where: { isPublished: true },
        include: {
          category: true,
          developerAnalysis: true,
        },
        orderBy: {
          ranking: 'asc',
        },
      },
    },
  });

  if (!category || !category.isActive) {
    notFound();
  }

  const name = getLocalizedField(category, 'name', locale);
  const description = getLocalizedField(category, 'description', locale);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Back Button */}
      <Link href={`/${locale}/categories`}>
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回分类列表
        </Button>
      </Link>

      {/* Category Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <span className="text-5xl mr-4">{category.icon || '📦'}</span>
          <div>
            <h1 className="text-4xl font-bold mb-2">{name}</h1>
            <p className="text-xl text-muted-foreground">{description}</p>
          </div>
        </div>

        <div className="mt-4 text-muted-foreground">
          共 {category.apps.length} 个应用
        </div>
      </div>

      {/* Apps Grid */}
      {category.apps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {category.apps.map((app) => (
            <AppCard key={app.id} app={app} locale={locale} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          该分类暂无应用
        </div>
      )}
    </div>
  );
}

