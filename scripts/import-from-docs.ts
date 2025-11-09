import { PrismaClient, Prisma } from '@prisma/client';
import { readFileSync, readdirSync } from 'fs';
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
  techDifficulty?: number;
  coreValue?: string;
  recommendation?: string;
  mvpPlan?: string;
  pricing?: string;
  marketing?: string;
  costAnalysis?: string;
  fullContent?: string;
}

// 解析应用名称和基本信息
function parseAppBasicInfo(appSection: string): {
  name: string;
  ranking?: number;
  totalRevenue?: number;
  mrr?: number;
} {
  const lines = appSection.split('\n');
  let name = '';
  let ranking: number | undefined;
  let totalRevenue: number | undefined;
  let mrr: number | undefined;

  // 提取应用名称（第一个 ## 标题）
  const nameMatch = appSection.match(/^##\s+\d+\.\s+(.+?)(?:\s+🥇|🥈|🥉|\*\*排名|$)/m);
  if (nameMatch) {
    name = nameMatch[1].trim();
  }

  // 提取排名和收入
  const infoLine = appSection.match(/\*\*排名：.*?\*\*/);
  if (infoLine) {
    const rankMatch = infoLine[0].match(/#(\d+)/);
    if (rankMatch) ranking = parseInt(rankMatch[1]);

    const revenueMatch = infoLine[0].match(/\$([0-9,]+)/);
    if (revenueMatch) {
      totalRevenue = parseFloat(revenueMatch[1].replace(/,/g, ''));
    }
  }

  // 查找 MRR
  const mrrMatch = appSection.match(/MRR[:\s]+\$([0-9,]+)/i);
  if (mrrMatch) {
    mrr = parseFloat(mrrMatch[1].replace(/,/g, ''));
  }

  return { name, ranking, totalRevenue, mrr };
}

// 提取星级难度
function extractDifficulty(text: string): number {
  const match = text.match(/技术难度[：:]\s*(⭐+)/);
  if (match) {
    return match[1].length;
  }
  return 3; // 默认中等难度
}

// 提取代码块内容
function extractCodeBlock(text: string, marker: string): string | undefined {
  const pattern = new RegExp(`${marker}[\\s\\S]*?\`\`\`[\\w]*\\n([\\s\\S]*?)\`\`\``, 'i');
  const match = text.match(pattern);
  return match ? match[1].trim() : undefined;
}

// 提取章节内容
function extractSection(text: string, sectionName: string): string | undefined {
  const pattern = new RegExp(
    `###\\s+${sectionName}[\\s\\S]*?\\n([\\s\\S]*?)(?=\\n###|\\n---\\n|$)`,
    'i'
  );
  const match = text.match(pattern);
  return match ? match[1].trim() : undefined;
}

// 解析单个应用数据
function parseAppData(appSection: string): AppData | null {
  const basicInfo = parseAppBasicInfo(appSection);
  
  if (!basicInfo.name || !basicInfo.totalRevenue) {
    return null;
  }

  return {
    name: basicInfo.name,
    ranking: basicInfo.ranking,
    totalRevenue: basicInfo.totalRevenue,
    mrr: basicInfo.mrr,
    coreFunction: extractSection(appSection, '核心功能'),
    businessModel: extractSection(appSection, '商业模式'),
    techStack: extractCodeBlock(appSection, '技术栈'),
    techDifficulty: extractDifficulty(appSection),
    coreValue: extractSection(appSection, '核心价值'),
    recommendation: extractSection(appSection, '独立开发者建议'),
    mvpPlan: extractSection(appSection, 'MVP 开发计划'),
    pricing: extractSection(appSection, '定价策略'),
    marketing: extractSection(appSection, '营销策略'),
    costAnalysis: extractSection(appSection, '成本分析'),
    fullContent: appSection,
  };
}

// 从 Markdown 文件中解析所有应用
function parseMarkdownFile(filePath: string): AppData[] {
  const content = readFileSync(filePath, 'utf-8');
  const apps: AppData[] = [];

  // 分割应用章节（每个应用以 ## 开头，后面跟数字和名称）
  const appSections = content.split(/(?=^## \d+\. )/m).filter((section) => {
    return section.trim().startsWith('## ') && /^## \d+\./.test(section);
  });

  console.log(`  找到 ${appSections.length} 个应用章节`);

  for (const section of appSections) {
    const appData = parseAppData(section);
    if (appData) {
      apps.push(appData);
      console.log(`    ✓ 解析: ${appData.name}`);
    }
  }

  return apps;
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

// 导入应用到数据库
async function importApp(appData: AppData, categorySlug: string, batchNumber: number) {
  try {
    // 查找分类
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });

    if (!category) {
      console.error(`  ❌ 找不到分类: ${categorySlug}`);
      return false;
    }

    const slug = generateSlug(appData.name);
    
    // 准备短描述和完整描述
    const shortDescription = appData.coreFunction || `${appData.name} - 创新应用`;
    const fullDescription = [
      appData.coreFunction,
      appData.coreValue,
      appData.recommendation,
    ]
      .filter(Boolean)
      .join('\n\n') || shortDescription;

    // 使用 upsert 避免重复
    await prisma.app.upsert({
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

    console.log(`  ✅ [批次${batchNumber}] 导入成功: ${appData.name} (${slug})`);
    return true;
  } catch (error) {
    console.error(`  ❌ [批次${batchNumber}] 导入失败: ${appData.name}`, error);
    return false;
  }
}

// 主函数：批量导入
async function main() {
  console.log('🚀 开始从 docs 文件夹导入数据...\n');

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

      // 批量处理，每批 5 个
      for (let i = 0; i < apps.length; i++) {
        const app = apps[i];
        const success = await importApp(app, categorySlug, currentBatch);
        if (success) successCount++;

        batchCount++;
        
        // 每处理 5 个应用，暂停一下
        if (batchCount === BATCH_SIZE) {
          console.log(`\n⏸️  已完成批次 ${currentBatch}（${BATCH_SIZE} 个应用）`);
          console.log(`📊 进度: ${successCount}/${totalApps} 成功\n`);
          
          // 等待用户确认是否继续
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
  console.log('✅ 导入完成！');
  console.log(`📊 总计: ${successCount}/${totalApps} 个应用导入成功`);
  console.log(`📦 总批次: ${currentBatch - 1}`);
  console.log('='.repeat(50));
  console.log('\n运行以下命令查看数据：');
  console.log('  npm run db:studio');
}

main()
  .catch((e) => {
    console.error('❌ 导入过程出错:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

