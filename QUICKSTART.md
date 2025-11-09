# ⚡ 快速启动指南

5分钟让应用运行起来！

## 🚀 快速开始

### 1️⃣ 安装依赖 (1分钟)

```bash
npm install
```

### 2️⃣ 配置环境 (1分钟)

创建 `.env` 文件：

```bash
# 复制示例文件
cp .env.example .env
```

**如果你有 PostgreSQL 数据库**，编辑 `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/whatworthdoing"
```

**如果没有数据库**，推荐使用 [Neon](https://neon.tech) 免费版:
1. 访问 https://neon.tech
2. 注册并创建项目
3. 复制连接字符串到 `.env`

### 3️⃣ 初始化数据库 (2分钟)

```bash
# 创建数据库表
npm run db:push

# 初始化分类数据
npm run db:seed

# 导入示例应用 (ShipFast)
npm run import:data
```

### 4️⃣ 启动应用 (10秒)

```bash
npm run dev
```

🎉 打开浏览器访问: **http://localhost:3000/zh**

## 📱 你应该看到

- ✅ 首页展示精选应用
- ✅ 应用列表页面
- ✅ ShipFast 应用详情
- ✅ 多语言切换 (中/英/日/法)
- ✅ 分类浏览

## 🎯 下一步

### 添加更多应用

编辑 `scripts/import-data.ts`，参考 `importShipFast()` 函数添加新应用。

### 自定义样式

- 修改主题色: `app/globals.css`
- 修改组件: `components/` 目录
- 修改翻译: `messages/` 目录

### 查看数据库

```bash
npm run db:studio
```

在浏览器打开 http://localhost:5555 查看和编辑数据。

## 🐛 遇到问题？

### 数据库连接失败

```bash
# 检查 PostgreSQL 是否运行
psql --version

# 或使用 Neon 免费数据库
# https://neon.tech (推荐)
```

### 端口被占用

```bash
# 使用其他端口
PORT=3001 npm run dev
```

### Prisma 客户端未找到

```bash
npm run db:generate
```

## 📚 完整文档

- [README.md](./README.md) - 项目概览
- [SETUP.md](./SETUP.md) - 详细设置指南
- [database-schema.md](./database-schema.md) - 数据库设计

## 🎨 演示功能

### 多语言切换
点击右上角的语言选择器，切换中/英/日/法四种语言。

### 搜索和筛选
在应用列表页面，可以按分类筛选和搜索应用。

### 查看应用详情
点击任意应用卡片，查看完整的分析信息，包括：
- 收入数据
- 商业模式
- 技术栈
- 开发建议
- 成本分析

## 🚀 部署到 Vercel

最简单的部署方式:

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

或者推送到 GitHub，然后在 Vercel 网站导入。

详见 [SETUP.md](./SETUP.md#部署到-vercel)

---

🎉 恭喜！现在你有一个运行中的应用了！

