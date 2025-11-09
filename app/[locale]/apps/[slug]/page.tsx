import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, getLocalizedField } from '@/lib/utils';
import { ArrowLeft, ExternalLink, Star, TrendingUp, Calendar, DollarSign } from 'lucide-react';

interface AppDetailPageProps {
  params: {
    locale: string;
    slug: string;
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

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Back Button */}
      <Link href={`/${locale}/apps`}>
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回列表
        </Button>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{name}</h1>
            <p className="text-xl text-muted-foreground">
              {getLocalizedField(app, 'shortDescription', locale)}
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

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
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
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {getLocalizedField(app.techStack, 'fullStack', locale)}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
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
        </div>
      </div>
    </div>
  );
}

