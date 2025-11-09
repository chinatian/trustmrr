import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'ranking';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where clause
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
        { nameEn: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Build orderBy clause
    let orderBy: any = {};
    switch (sort) {
      case 'revenue-desc':
        orderBy = { totalRevenue: 'desc' };
        break;
      case 'mrr-desc':
        orderBy = { mrr: 'desc' };
        break;
      case 'recommendation-desc':
        orderBy = { developerAnalysis: { recommendationLevel: 'desc' } };
        break;
      default:
        orderBy = { ranking: 'asc' };
    }

    // Get apps
    const [apps, total] = await Promise.all([
      prisma.app.findMany({
        where,
        include: {
          category: true,
          developerAnalysis: true,
        },
        orderBy,
        take: limit,
        skip: offset,
      }),
      prisma.app.count({ where }),
    ]);

    return NextResponse.json({
      apps,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching apps:', error);
    return NextResponse.json(
      { error: 'Failed to fetch apps' },
      { status: 500 }
    );
  }
}

