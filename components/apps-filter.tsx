'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';

interface AppsFilterProps {
  categories: Array<{
    id: string;
    slug: string;
    name: string;
    nameEn?: string | null;
  }>;
  locale: string;
  initialSearch?: string;
  initialCategory?: string;
  initialSort?: string;
  initialRevenueMin?: string;
  initialRevenueMax?: string;
}

export function AppsFilter({
  categories,
  locale,
  initialSearch = '',
  initialCategory = 'all',
  initialSort = 'ranking',
  initialRevenueMin = '',
  initialRevenueMax = '',
}: AppsFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState(initialSort);
  const [revenueRange, setRevenueRange] = useState('all');

  const handleFilter = () => {
    const params = new URLSearchParams();
    
    if (search.trim()) {
      params.set('search', search.trim());
    }
    
    if (category && category !== 'all') {
      params.set('category', category);
    }
    
    if (sort && sort !== 'ranking') {
      params.set('sort', sort);
    }

    // 处理收入范围
    if (revenueRange && revenueRange !== 'all') {
      const ranges: Record<string, { min: string; max: string }> = {
        '0-200k': { min: '0', max: '200000' },
        '200k-500k': { min: '200000', max: '500000' },
        '500k-1m': { min: '500000', max: '1000000' },
        '1m-5m': { min: '1000000', max: '5000000' },
        '5m+': { min: '5000000', max: '' },
      };
      
      const range = ranges[revenueRange];
      if (range) {
        if (range.min) params.set('revenueMin', range.min);
        if (range.max) params.set('revenueMax', range.max);
      }
    }

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    startTransition(() => {
      router.push(newUrl);
    });
  };

  const handleClearSearch = () => {
    setSearch('');
    const params = new URLSearchParams();
    
    if (category && category !== 'all') {
      params.set('category', category);
    }
    
    if (sort && sort !== 'ranking') {
      params.set('sort', sort);
    }

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    startTransition(() => {
      router.push(newUrl);
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleFilter();
    }
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="搜索应用名称或描述..."
            className="pl-10 pr-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isPending}
          />
          {search && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              disabled={isPending}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <Select
          value={category}
          onValueChange={(value) => {
            setCategory(value);
            // 立即应用筛选
            const params = new URLSearchParams();
            if (search.trim()) params.set('search', search.trim());
            if (value && value !== 'all') params.set('category', value);
            if (sort && sort !== 'ranking') params.set('sort', sort);
            
            const queryString = params.toString();
            const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
            startTransition(() => router.push(newUrl));
          }}
          disabled={isPending}
        >
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
        <Select
          value={sort}
          onValueChange={(value) => {
            setSort(value);
            // 立即应用排序
            const params = new URLSearchParams();
            if (search.trim()) params.set('search', search.trim());
            if (category && category !== 'all') params.set('category', category);
            if (value && value !== 'ranking') params.set('sort', value);
            
            const queryString = params.toString();
            const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
            startTransition(() => router.push(newUrl));
          }}
          disabled={isPending}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="排序方式" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ranking">排名升序</SelectItem>
            <SelectItem value="revenue-desc">收入降序</SelectItem>
            <SelectItem value="mrr-desc">MRR 降序</SelectItem>
            <SelectItem value="recommendation-desc">推荐度降序</SelectItem>
          </SelectContent>
        </Select>

        {/* Revenue Range Filter */}
        <Select
          value={revenueRange}
          onValueChange={(value) => setRevenueRange(value)}
          disabled={isPending}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="收入范围" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">所有收入</SelectItem>
            <SelectItem value="0-200k">$0 - $200K</SelectItem>
            <SelectItem value="200k-500k">$200K - $500K</SelectItem>
            <SelectItem value="500k-1m">$500K - $1M</SelectItem>
            <SelectItem value="1m-5m">$1M - $5M</SelectItem>
            <SelectItem value="5m+">$5M+</SelectItem>
          </SelectContent>
        </Select>

        {/* Search Button */}
        <Button 
          onClick={handleFilter} 
          disabled={isPending}
          className="w-full md:w-auto"
        >
          {isPending ? (
            <>
              <span className="mr-2">搜索中...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              搜索
            </>
          )}
        </Button>
      </div>

      {/* Active Filters Display */}
      {(search || (category && category !== 'all') || (revenueRange && revenueRange !== 'all')) && (
        <div className="mt-4 flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">当前筛选：</span>
          {search && (
            <div className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              <span>关键词: {search}</span>
              <button
                onClick={handleClearSearch}
                className="hover:text-primary-foreground"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          {category && category !== 'all' && (
            <div className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              <span>
                分类: {categories.find(c => c.slug === category)?.[locale === 'zh' ? 'name' : 'nameEn'] || category}
              </span>
              <button
                onClick={() => {
                  setCategory('all');
                  const params = new URLSearchParams();
                  if (search.trim()) params.set('search', search.trim());
                  if (sort && sort !== 'ranking') params.set('sort', sort);
                  const queryString = params.toString();
                  const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
                  startTransition(() => router.push(newUrl));
                }}
                className="hover:text-primary-foreground"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          {revenueRange && revenueRange !== 'all' && (
            <div className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              <span>
                收入范围: {
                  revenueRange === '0-200k' ? '$0-$200K' :
                  revenueRange === '200k-500k' ? '$200K-$500K' :
                  revenueRange === '500k-1m' ? '$500K-$1M' :
                  revenueRange === '1m-5m' ? '$1M-$5M' :
                  revenueRange === '5m+' ? '$5M+' : revenueRange
                }
              </span>
              <button
                onClick={() => {
                  setRevenueRange('all');
                  const params = new URLSearchParams();
                  if (search.trim()) params.set('search', search.trim());
                  if (category && category !== 'all') params.set('category', category);
                  if (sort && sort !== 'ranking') params.set('sort', sort);
                  const queryString = params.toString();
                  const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
                  startTransition(() => router.push(newUrl));
                }}
                className="hover:text-primary-foreground"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

