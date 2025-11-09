import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Users, TrendingUp, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            关于我们
          </h1>
          <p className="text-xl text-muted-foreground">
            为全球独立开发者提供基于真实收入数据的项目分析和启发
          </p>
        </div>

        {/* Mission */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Target className="w-6 h-6 mr-2 text-blue-600" />
              我们的使命
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              什么值得做（WhatWorthDoing）是一个专注于独立开发者的项目分析平台。我们相信，真实的数据和深度的分析能够帮助开发者做出更明智的决策。
            </p>
            <p className="text-muted-foreground leading-relaxed">
              基于 TrustMRR 等平台的公开收入数据，我们为每个项目提供全方位的分析，包括商业模式、技术栈、开发难度、预期收入等，帮助独立开发者找到真正值得投入的方向。
            </p>
          </CardContent>
        </Card>

        {/* What We Offer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-purple-600" />
                为谁服务
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• 想要开始副业的全栈开发者</li>
                <li>• 寻找创业方向的技术人员</li>
                <li>• 希望验证想法的产品经理</li>
                <li>• 研究商业模式的学习者</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                我们提供
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• 基于真实收入的项目分析</li>
                <li>• 技术栈和开发难度评估</li>
                <li>• MVP 开发计划和建议</li>
                <li>• 成本分析和收入预期</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Data Source */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">数据来源</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              我们的数据主要来源于：
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                • <a href="https://trustmrr.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  TrustMRR
                </a> - 公开透明的收入数据平台
              </li>
              <li>• Twitter #buildinpublic 社区 - 创始人分享的真实数据</li>
              <li>• Indie Hackers - 独立开发者社区</li>
              <li>• 各项目的官方公开信息</li>
            </ul>
            <p className="text-sm text-muted-foreground italic mt-4">
              注：所有数据仅供参考，实际情况可能有所不同。我们尊重原创者的知识产权，本平台不鼓励抄袭，而是学习成功者的思路和策略。
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="w-6 h-6 mr-2 text-red-600" />
              联系我们
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              如果您有任何建议、合作意向，或者想要分享您的项目数据，欢迎联系我们！
            </p>
            <p className="text-sm text-muted-foreground">
              本项目开源在 GitHub，欢迎贡献代码和想法。
            </p>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>Built with ❤️ for Indie Hackers</p>
          <p className="mt-2">使用 Next.js 14, Tailwind CSS, Prisma 构建</p>
        </div>
      </div>
    </div>
  );
}

