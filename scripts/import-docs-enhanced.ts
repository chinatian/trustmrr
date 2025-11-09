import { PrismaClient, Prisma } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

// 分类映射
const CATEGORY_MAP: Record<string, string> = {
  '01_营销与增长工具_Marketing_Growth_Tools.md': 'marketing-growth',
  '02_开发者工具与教育_Developer_Tools_Education.md': 'developer-tools',
  '03_AI与内容生成_AI_Content_Generation.md': 'ai-content',
  '04_电商与支付_Ecommerce_Payments.md': 'ecommerce-payments',
  '05_垂直细分市场_Niche_Vertical_Markets.md': 'niche-markets',
  '06_商业服务平台_Business_Services.md': 'business-services',
  '07_社区与会员平台_Community_Membership.md': 'community-membership',
  '08_金融科技与交易_Fintech_Trading.md': 'fintech-trading',
  '09_基础设施与技术服务_Infrastructure_Technical.md': 'infrastructure-technical',
  '10_其他应用_Miscellaneous.md': 'miscellaneous',
};

interface AppData {
  name: string;
  ranking?: number;
  totalRevenue: number;
  mrr?: number;
  coreFunction?: string;
  businessModel?: string;
  techStack?: string;
  techStackJson?: any;
  techDifficulty?: number;
  techDifficultyDetails?: string;
  coreValue?: string;
  recommendation?: string;
  recommendationLevel?: number;
  pros?: string[];
  cons?: string[];
  suitableFor?: string;
  developmentWeeks?: number;
  mvpPlan?: string;
  mvpPhases?: any[];
  pricing?: string;
  pricingDetails?: any[];
  marketing?: string;
  marketingStrategies?: any[];
  costAnalysis?: string;
  developmentCost?: number;
  profitMargin?: number;
  fullContent?: string;
}

// 解析推荐星级
function parseRecommendationLevel(text: string): number {
  const match = text.match(/[⭐✅]{1,5}|推荐：[⭐✅]{1,5}|推荐度：[⭐✅]{1,5}/);
  if (match) {
    const stars = match[0].match(/[⭐✅]/g);
    return stars ? stars.length : 3;
  }
  return 3;
}

// 提取优缺点
function extractProsAndCons(text: string): { pros?: string[]; cons?: string[] } {
  const result: { pros?: string[]; cons?: string[] } = {};
  
  // 提取优点
  const prosMatch = text.match(/\*\*优点：?\*\*\n([\s\S]*?)(?=\n\*\*|$)/);
  if (prosMatch) {
    result.pros = prosMatch[1]
      .split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.replace(/^-\s*/, '').trim());
  }
  
  // 提取缺点
  const consMatch = text.match(/\*\*缺点：?\*\*\n([\s\S]*?)(?=\n\*\*|$)/);
  if (consMatch) {
    result.cons = consMatch[1]
      .split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.replace(/^-\s*/, '').trim());
  }
  
  return result;
}

// 解析 MVP 开发阶段
function parseMvpPhases(text: string): any[] {
  const phases: any[] = [];
  const phasePattern = /####\s+(Week|阶段)\s+(\d+-?\d*)[：:]\s*([^\n]+)\n```[a-z]*\n([\s\S]*?)```/gi;
  
  let match;
  while ((match = phasePattern.exec(text)) !== null) {
    phases.push({
      name: match[3].trim(),
      weeks: match[2],
      content: match[4].trim(),
    });
  }
  
  return phases;
}

// 解析定价详情
function parsePricingDetails(text: string): any[] {
  const pricing: any[] = [];
  const lines = text.split('\n');
  
  for (const line of lines) {
    const match = line.match(/(.+?)[:：]\s*\$(\d+(?:,\d{3})*(?:-\d+(?:,\d{3})*)?)\s*[-–]\s*(.+)/);
    if (match) {
      pricing.push({
        tier: match[1].trim(),
        price: match[2].replace(/,/g, ''),
        description: match[3].trim(),
      });
    }
  }
  
  return pricing;
}

// 解析营销策略
function parseMarketingStrategies(text: string): any[] {
  const strategies: any[] = [];
  const lines = text.split('\n');
  
  for (const line of lines) {
    const match = line.match(/^\d+\.\s*\*\*(.+?)\*\*[：:]\s*(.+)/);
    if (match) {
      strategies.push({
        channel: match[1].trim(),
        description: match[2].trim(),
        priority: 3,
      });
    }
  }
  
  return strategies;
}

// 解析成本信息
function parseCostInfo(text: string): { developmentCost?: number; profitMargin?: number } {
  const result: any = {};
  
  const devCostMatch = text.match(/开发[成本]?：?\s*\$?([\d,]+)/i);
  if (devCostMatch) {
    result.developmentCost = parseFloat(devCostMatch[1].replace(/,/g, ''));
  }
  
  const profitMatch = text.match(/利润率[：:]\s*~?(\d+)%/);
  if (profitMatch) {
    result.profitMargin = parseInt(profitMatch[1]);
  }
  
  return result;
}

// 解析技术栈 JSON
function parseTechStackJson(text: string): any {
  const codeBlockMatch = text.match(/```(?:javascript|typescript|json)?\n([\s\S]*?)```/);
  if (codeBlockMatch) {
    try {
      // 尝试解析为 JSON
      const jsonStr = codeBlockMatch[1]
        .replace(/\/\/.*/g, '')
        .replace(/^const\s+\w+\s*=\s*/, '')
        .replace(/;?\s*$/, '');
      return eval(`(${jsonStr})`);
    } catch (e) {
      // 解析失败，返回原文本
      return null;
    }
  }
  return null;
}

// 生成 slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// 解析单个应用章节
function parseAppSection(appSection: string): AppData | null {
  const nameMatch = appSection.match(/^##\s+\d+\.\s+(.+?)(?:\s+🥇|🥈|🥉|\*\*排名|$)/m);
  if (!nameMatch) return null;

  const name = nameMatch[1].trim();
  
  const infoLine = appSection.match(/\*\*排名：.*?\*\*/);
  let ranking: number | undefined;
  let totalRevenue: number | undefined;
  let mrr: number | undefined;

  if (infoLine) {
    const rankMatch = infoLine[0].match(/#(\d+)/);
    if (rankMatch) ranking = parseInt(rankMatch[1]);

    const revenueMatch = infoLine[0].match(/\$([0-9,]+)/);
    if (revenueMatch) {
      totalRevenue = parseFloat(revenueMatch[1].replace(/,/g, ''));
    }
  }

  const mrrMatch = appSection.match(/MRR[:\s]+\$([0-9,]+)/i);
  if (mrrMatch) {
    mrr = parseFloat(mrrMatch[1].replace(/,/g, ''));
  }

  if (!totalRevenue) return null;

  // 提取各个部分
  const coreFunctionMatch = appSection.match(/###\s+核心功能\n([\s\S]*?)(?=\n###|$)/);
  const businessModelMatch = appSection.match(/###\s+商业模式\n([\s\S]*?)(?=\n###|$)/);
  const techStackMatch = appSection.match(/###\s+技术栈[^\n]*\n([\s\S]*?)(?=\n###|$)/);
  const techDifficultyMatch = appSection.match(/###\s+技术难度[：:]\s*(⭐+)\n([\s\S]*?)(?=\n###|$)/);
  const coreValueMatch = appSection.match(/###\s+核心价值\n([\s\S]*?)(?=\n###|$)/);
  const recommendationMatch = appSection.match(/###\s+独立开发者建议\n([\s\S]*?)(?=\n###|$)/);
  const mvpMatch = appSection.match(/###\s+(?:MVP|最小化 MVP)[^\n]*\n([\s\S]*?)(?=\n###|$)/);
  const pricingMatch = appSection.match(/###\s+定价策略\n([\s\S]*?)(?=\n###|$)/);
  const marketingMatch = appSection.match(/###\s+(?:营销策略|内容营销策略)\n([\s\S]*?)(?=\n###|$)/);
  const costMatch = appSection.match(/###\s+成本分析\n([\s\S]*?)(?=\n###|$)/);

  const techDifficulty = techDifficultyMatch ? techDifficultyMatch[1].length : 3;
  const techDifficultyDetails = techDifficultyMatch ? techDifficultyMatch[2].trim() : undefined;
  
  const recommendationText = recommendationMatch ? recommendationMatch[1] : '';
  const recommendationLevel = parseRecommendationLevel(recommendationText);
  const { pros, cons } = extractProsAndCons(recommendationText);
  
  const suitableForMatch = recommendationText.match(/\*\*适合谁[：:]\*\*\n([\s\S]*?)(?=\n\*\*|$)/);
  const suitableFor = suitableForMatch ? suitableForMatch[1].trim() : undefined;
  
  const developmentWeeksMatch = mvpMatch 
    ? mvpMatch[1].match(/(\d+)[-–]\s*(\d+)\s*周/)
    : null;
  const developmentWeeks = developmentWeeksMatch 
    ? Math.ceil((parseInt(developmentWeeksMatch[1]) + parseInt(developmentWeeksMatch[2])) / 2)
    : undefined;

  const mvpPhases = mvpMatch ? parseMvpPhases(mvpMatch[1]) : [];
  const pricingDetails = pricingMatch ? parsePricingDetails(pricingMatch[1]) : [];
  const marketingStrategies = marketingMatch ? parseMarketingStrategies(marketingMatch[1]) : [];
  const costInfo = costMatch ? parseCostInfo(costMatch[1]) : {};
  const techStackJson = techStackMatch ? parseTechStackJson(techStackMatch[1]) : null;

  return {
    name,
    ranking,
    totalRevenue,
    mrr,
    coreFunction: coreFunctionMatch ? coreFunctionMatch[1].trim() : undefined,
    businessModel: businessModelMatch ? businessModelMatch[1].trim() : undefined,
    techStack: techStackMatch ? techStackMatch[1].trim() : undefined,
    techStackJson,
    techDifficulty,
    techDifficultyDetails,
    coreValue: coreValueMatch ? coreValueMatch[1].trim() : undefined,
    recommendation: recommendationText,
    recommendationLevel,
    pros,
    cons,
    suitableFor,
    developmentWeeks,
    mvpPlan: mvpMatch ? mvpMatch[1].trim() : undefined,
    mvpPhases,
    pricing: pricingMatch ? pricingMatch[1].trim() : undefined,
    pricingDetails,
    marketing: marketingMatch ? marketingMatch[1].trim() : undefined,
    marketingStrategies,
    costAnalysis: costMatch ? costMatch[1].trim() : undefined,
    ...costInfo,
    fullContent: appSection,
  };
}

// 从文件解析所有应用
function parseMarkdownFile(filePath: string): AppData[] {
  const content = readFileSync(filePath, 'utf-8');
  const appSections = content.split(/(?=^## \d+\. )/m).filter((section) => {
    return section.trim().startsWith('## ') && /^## \d+\./.test(section);
  });

  console.log(`  找到 ${appSections.length} 个应用章节`);

  const apps: AppData[] = [];
  for (const section of appSections) {
    const appData = parseAppSection(section);
    if (appData) {
      apps.push(appData);
      console.log(`    ✓ 解析: ${appData.name}`);
    }
  }

  return apps;
}

// 导入应用及关联数据
async function importAppWithDetails(appData: AppData, categorySlug: string, batchNumber: number) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });

    if (!category) {
      console.error(`  ❌ 找不到分类: ${categorySlug}`);
      return false;
    }

    const slug = generateSlug(appData.name);
    const shortDescription = appData.coreFunction || `${appData.name} - 创新应用`;
    const fullDescription = [
      appData.coreFunction,
      appData.coreValue,
      appData.recommendation,
    ].filter(Boolean).join('\n\n') || shortDescription;

    // 创建或更新应用
    const app = await prisma.app.upsert({
      where: { slug },
      update: {
        totalRevenue: new Prisma.Decimal(appData.totalRevenue),
        mrr: appData.mrr ? new Prisma.Decimal(appData.mrr) : null,
        ranking: appData.ranking,
        techDifficulty: appData.techDifficulty || 3,
      },
      create: {
        name: appData.name,
        nameEn: appData.name,
        nameZh: appData.name,
        slug,
        shortDescription,
        shortDescriptionEn: shortDescription,
        shortDescriptionZh: shortDescription,
        fullDescription,
        fullDescriptionEn: fullDescription,
        fullDescriptionZh: fullDescription,
        totalRevenue: new Prisma.Decimal(appData.totalRevenue),
        mrr: appData.mrr ? new Prisma.Decimal(appData.mrr) : null,
        ranking: appData.ranking,
        categoryId: category.id,
        techDifficulty: appData.techDifficulty || 3,
        isPublished: true,
        isFeatured: appData.ranking ? appData.ranking <= 10 : false,
        metaTitle: `${appData.name} - TrustMRR 案例分析`,
        metaDescription: shortDescription,
        metaKeywords: [appData.name, categorySlug, 'saas', 'indie-hacker'],
      },
    });

    // 创建商业模式
    if (appData.businessModel || appData.pricingDetails.length > 0) {
      await prisma.businessModel.upsert({
        where: { appId: app.id },
        update: {},
        create: {
          appId: app.id,
          pricingModel: appData.businessModel?.includes('订阅') ? '订阅制' : '一次性购买',
          pricingDetails: appData.pricingDetails,
          targetCustomers: appData.businessModel || '独立开发者',
          profitMargin: appData.profitMargin,
        },
      });
    }

    // 创建技术栈
    if (appData.techStack || appData.techStackJson) {
      await prisma.techStack.upsert({
        where: { appId: app.id },
        update: {},
        create: {
          appId: app.id,
          frontend: appData.techStackJson?.frontend ? [appData.techStackJson.frontend] : null,
          backend: appData.techStackJson?.backend ? [appData.techStackJson.backend] : null,
          database: appData.techStackJson?.database ? [appData.techStackJson.database] : null,
          infrastructure: appData.techStackJson?.deployment ? [appData.techStackJson.deployment] : null,
          fullStack: appData.techStack,
          difficultyDetails: appData.techDifficultyDetails,
        },
      });
    }

    // 创建开发者分析
    if (appData.recommendation) {
      await prisma.developerAnalysis.upsert({
        where: { appId: app.id },
        update: {},
        create: {
          appId: app.id,
          recommendationLevel: appData.recommendationLevel || 3,
          recommendationReason: appData.recommendation,
          pros: appData.pros || [],
          cons: appData.cons || [],
          suitableFor: appData.suitableFor,
          developmentWeeks: appData.developmentWeeks,
        },
      });
    }

    // 创建 MVP 计划
    if (appData.mvpPlan && appData.mvpPhases.length > 0) {
      await prisma.mvpPlan.upsert({
        where: { appId: app.id },
        update: {},
        create: {
          appId: app.id,
          totalWeeks: appData.developmentWeeks,
          phases: appData.mvpPhases,
          coreFeaturesNeeded: [],
          quickStartGuide: appData.mvpPlan,
        },
      });
    }

    // 创建成本分析
    if (appData.costAnalysis) {
      await prisma.costAnalysis.upsert({
        where: { appId: app.id },
        update: {},
        create: {
          appId: app.id,
          developmentCost: appData.developmentCost 
            ? new Prisma.Decimal(appData.developmentCost) 
            : null,
          profitMargin: appData.profitMargin,
          costBreakdown: appData.costAnalysis,
        },
      });
    }

    // 创建营销策略
    if (appData.marketingStrategies.length > 0) {
      // 先删除旧的
      await prisma.marketingStrategy.deleteMany({
        where: { appId: app.id },
      });
      
      // 创建新的
      for (const strategy of appData.marketingStrategies) {
        await prisma.marketingStrategy.create({
          data: {
            appId: app.id,
            channel: strategy.channel,
            description: strategy.description,
            priority: strategy.priority,
          },
        });
      }
    }

    console.log(`  ✅ [批次${batchNumber}] 导入成功（含详细数据）: ${appData.name}`);
    return true;
  } catch (error) {
    console.error(`  ❌ [批次${batchNumber}] 导入失败: ${appData.name}`, error);
    return false;
  }
}

// 主函数
async function main() {
  console.log('🚀 开始从 docs 文件夹导入详细数据...\n');

  const docsDir = join(process.cwd(), 'docs');
  const files = Object.keys(CATEGORY_MAP);

  let totalApps = 0;
  let successCount = 0;
  let currentBatch = 1;
  let batchCount = 0;
  const BATCH_SIZE = 5;

  for (const file of files) {
    const filePath = join(docsDir, file);
    const categorySlug = CATEGORY_MAP[file];

    console.log(`\n📁 处理文件: ${file}`);
    console.log(`📂 分类: ${categorySlug}`);

    try {
      const apps = parseMarkdownFile(filePath);
      totalApps += apps.length;

      for (let i = 0; i < apps.length; i++) {
        const app = apps[i];
        const success = await importAppWithDetails(app, categorySlug, currentBatch);
        if (success) successCount++;

        batchCount++;
        
        if (batchCount === BATCH_SIZE) {
          console.log(`\n⏸️  已完成批次 ${currentBatch}（${BATCH_SIZE} 个应用）`);
          console.log(`📊 进度: ${successCount}/${totalApps} 成功\n`);
          
          if (i < apps.length - 1 || files.indexOf(file) < files.length - 1) {
            console.log('等待 2 秒后继续下一批次...\n');
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
          
          currentBatch++;
          batchCount = 0;
        }
      }
    } catch (error) {
      console.error(`❌ 处理文件失败: ${file}`, error);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('✅ 详细数据导入完成！');
  console.log(`📊 总计: ${successCount}/${totalApps} 个应用导入成功`);
  console.log(`📦 总批次: ${currentBatch - 1}`);
  console.log('='.repeat(50));
  console.log('\n运行以下命令查看数据：');
  console.log('  npm run db:studio');
  console.log('\n访问应用详情页查看完整信息！');
}

main()
  .catch((e) => {
    console.error('❌ 导入过程出错:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

