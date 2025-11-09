'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function Navbar() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1];

  const handleLocaleChange = (locale: string) => {
    const newPath = pathname.replace(/^\/[^\/]+/, `/${locale}`);
    window.location.href = newPath;
  };

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={`/${currentLocale}`} className="flex items-center space-x-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              什么值得做
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href={`/${currentLocale}`}>
              <Button variant="ghost">{t('home')}</Button>
            </Link>
            <Link href={`/${currentLocale}/apps`}>
              <Button variant="ghost">{t('apps')}</Button>
            </Link>
            <Link href={`/${currentLocale}/categories`}>
              <Button variant="ghost">{t('categories')}</Button>
            </Link>
            <Link href={`/${currentLocale}/about`}>
              <Button variant="ghost">{t('about')}</Button>
            </Link>
          </div>

          {/* Language Selector */}
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <Select value={currentLocale} onValueChange={handleLocaleChange}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="zh">中文</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ja">日本語</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </nav>
  );
}

