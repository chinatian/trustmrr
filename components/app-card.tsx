import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, getLocalizedField } from '@/lib/utils';
import { TrendingUp, TrendingDown, Star } from 'lucide-react';

interface AppCardProps {
  app: any;
  locale: string;
}

export function AppCard({ app, locale }: AppCardProps) {
  const name = getLocalizedField(app, 'name', locale);
  const shortDescription = getLocalizedField(app, 'shortDescription', locale);
  
  return (
    <Link href={`/${locale}/apps/${app.slug}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl mb-2">{name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {shortDescription}
              </CardDescription>
            </div>
            {app.ranking && (
              <div className="flex flex-col items-end ml-4">
                <span className="text-2xl font-bold text-primary">
                  #{app.ranking}
                </span>
                {app.rankingChange !== null && app.rankingChange !== 0 && (
                  <div className={`flex items-center text-sm ${
                    app.rankingChange > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {app.rankingChange > 0 ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    <span>{Math.abs(app.rankingChange)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            {/* 收入信息 */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">总收入</span>
              <span className="font-bold text-lg">
                {formatCurrency(Number(app.totalRevenue))}
              </span>
            </div>
            
            {app.mrr && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">MRR</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(Number(app.mrr))}
                </span>
              </div>
            )}
            
            {/* 推荐度 */}
            {app.developerAnalysis && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">推荐度</span>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < app.developerAnalysis.recommendationLevel
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* 分类和标签 */}
            <div className="flex flex-wrap gap-2 pt-2">
              {app.category && (
                <Badge variant="secondary">
                  {getLocalizedField(app.category, 'name', locale)}
                </Badge>
              )}
              {app.isFeatured && (
                <Badge variant="default">精选</Badge>
              )}
              {app.isNewApp && (
                <Badge variant="destructive">新应用</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

