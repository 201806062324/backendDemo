# Next.js + Prisma + Supabase 全栈模板

一个基于 Next.js 14 (App Router)、TypeScript、Prisma ORM 和 Supabase 的前后端不分离全栈项目模板。

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Next.js | 14.2.x | 框架 + SSR + API 路由 |
| TypeScript | 5.6.x | 类型安全 |
| Prisma | 5.22.x | ORM + 数据库管理 |
| Supabase | 2.47.x | 认证 + 存储 (可选) |
| SQLite | - | 开发环境数据库 |

## 项目结构

```
backendDemo/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API 路由
│   │   │   └── users/
│   │   │       ├── route.ts    # GET /api/users, POST /api/users
│   │   │       └── [id]/
│   │   │           └── route.ts  # GET/PUT/DELETE /api/users/[id]
│   │   ├── globals.css         # 全局样式
│   │   ├── layout.tsx          # 根布局
│   │   └── page.tsx            # 首页
│   └── lib/
│       ├── prisma.ts           # Prisma 客户端单例
│       └── supabase.ts         # Supabase 客户端
├── prisma/
│   ├── schema.prisma           # 数据库 Schema
│   └── dev.db                  # SQLite 数据库文件
├── .env                        # 环境变量
├── .env.example                # 环境变量示例
├── next.config.js              # Next.js 配置
├── tsconfig.json               # TypeScript 配置
└── package.json                # 依赖配置
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# SQLite (开发环境)
DATABASE_URL="file:./dev.db"

# Supabase (可选，后续需要时配置)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

### 3. 同步数据库

```bash
npm run db:push
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 可用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run start` | 启动生产服务器 |
| `npm run lint` | 代码检查 |
| `npm run db:push` | 同步数据库 Schema |
| `npm run db:generate` | 生成 Prisma Client |
| `npm run db:studio` | 打开 Prisma Studio (数据库可视化) |

## 数据库切换

### SQLite → PostgreSQL

1. 修改 `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
   ```

2. 修改 `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

3. 重新生成并同步:
   ```bash
   npx prisma generate
   npm run db:push
   ```

### 使用 Supabase 托管数据库

1. 从 Supabase 仪表板获取连接字符串
2. 按照上述步骤切换到 PostgreSQL
3. 配置 Supabase 客户端环境变量

## API 路由示例

### 用户管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/users` | 获取用户列表 |
| POST | `/api/users` | 创建用户 |
| GET | `/api/users/[id]` | 获取单个用户 |
| PUT | `/api/users/[id]` | 更新用户 |
| DELETE | `/api/users/[id]` | 删除用户 |

### 使用示例

```bash
# 获取用户列表
curl http://localhost:3000/api/users

# 创建用户
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test","password":"123456"}'
```

## 数据库 Schema

### User 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 主键 (CUID) |
| email | String | 邮箱 (唯一) |
| name | String? | 用户名 (可选) |
| password | String | 密码 |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

### Post 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 主键 (CUID) |
| title | String | 标题 |
| content | String? | 内容 (可选) |
| published | Boolean | 发布状态 |
| authorId | String | 作者 ID |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

## 开发规范

- 使用 TypeScript 进行类型检查
- 遵循 ESLint 配置进行代码规范
- Prisma Client 使用单例模式 (`src/lib/prisma.ts`)
- API 路由统一错误处理

## 许可证

MIT
