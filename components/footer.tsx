import { useTranslations } from 'next-intl';

export function Footer() {
  return (
    <footer className="border-t bg-background mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4">什么值得做</h3>
            <p className="text-sm text-muted-foreground">
              为全球独立开发者提供基于真实收入数据的项目分析和启发
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">快速链接</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  关于我们
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  数据来源
                </a>
              </li>
              <li>
                <a href="https://trustmrr.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                  TrustMRR
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">联系我们</h3>
            <p className="text-sm text-muted-foreground">
              如有建议或合作请联系我们
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© 2025 什么值得做 (WhatWorthDoing). All rights reserved.</p>
          <p className="mt-2">Built with Next.js, Tailwind CSS, and Prisma</p>
        </div>
      </div>
    </footer>
  );
}

