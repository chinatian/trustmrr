import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  // 获取所有已发布的应用
  const apps = await prisma.app.findMany({
    where: { isPublished: true },
    select: { slug: true, updatedAt: true },
  });

  // 获取所有分类
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });

  const locales = ['zh', 'en', 'ja', 'fr'];

  // 生成应用页面的 URL（所有语言）
  const appUrls = apps.flatMap((app) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/apps/${app.slug}`,
      lastModified: app.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  );

  // 生成分类页面的 URL（所有语言）
  const categoryUrls = categories.flatMap((category) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/categories/${category.slug}`,
      lastModified: category.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  );

  // 静态页面
  const staticPages = locales.flatMap((locale) => [
    {
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/${locale}/apps`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/${locale}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/${locale}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ]);

  return [...staticPages, ...appUrls, ...categoryUrls];
}

