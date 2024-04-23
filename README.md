<div align="center">

<h1>X-Hiring</h1>
🤗 每日最新招聘信息，使用 Google AI 提取摘要
<br/>

![image](https://github.com/hehehai/h-blog/assets/12692552/9853bc8b-9988-4bc4-8075-88c3a35147a2)
![image](https://github.com/hehehai/h-blog/assets/12692552/6d83d836-2134-4c83-bd9b-d51702978bfe)

</div>

> [!TIP]
> 如果有合适的职位数据源，欢迎👏提 [issues](https://github.com/hehehai/x-hiring/issues/new), 我们将视情况开发。

## 当前已支持

- [x] [V2EX](https://www.v2ex.com/go/jobs)
- [x] [电鸭社区](https://eleduck.com)
- [x] [阮一峰 谁在招人](https://github.com/ruanyf/weekly/issues?q=%E8%B0%81%E5%9C%A8%E6%8B%9B%E4%BA%BA)

## ⌨️ 安装&运行

项目使用 Monorepo、turbo、pnpm 管理

```shell
pnpm install
```

```txt
.
├── apps
│   ├── jobs
│   └── www
├── package.json
├── packages
│   ├── db
│   ├── eslint-config
│   └── tsconfig
├── pnpm-workspace.yaml
└── turbo.json
```

- jobs: 抓取任务
- www： 网站
- db： 公共数据服务

> 数据抓取独立服务（和 `apps/jobs` 同步-支持 node 16）， [x-hiring grab](https://github.com/hehehai/x-hiring-grab)

- `apps/jobs` 下 `.env.example` 文件复制，名称修改为 `.env` 内容自行修改
- `apps/www` 下 `.env.example` 文件复制，名称修改为 `.env` 内容自行修改
- `packages/db` 下 `.env.example` 文件复制，名称修改为 `.env` 内容自行修改(为了 `prisma migrate`)

```txt
# Prisma postgresql 数据库
DATABASE_URL="postgresql://x-hiring:password@0.0.0.0:5432/x-hiring"

# Google Gemini AI
GEMINI_AI_API_KEY="api_token"

# GithubToken
GITHUB_TOKEN="ghp_xxx"

# 本地代理 （可选）
LOCAL_FETCH_PROXY="http://127.0.0.1:7890"

# Redis Upstash
# https://upstash.com/blog/nextjs-ratelimiting
UPSTASH_REDIS_REST_URL="https://xxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="xxx"
```

```shell
pnpm run dev:web
pnpm run dev:jobs
```

打开 `http://localhost:3000`

## Q&A

> 网站和抓取分析，为什么分为了两个服务？

1. 抓取是长时运行任务，
@vercel 免费版最大运行时长 10s, cron 的是每日一次，最小单位为小时，任务运行时长也有最大限制
2. #Gemini 有地域限制，且未直接在业务中使用，所以结合抓取实现摘要保存更合适

> 接下来的计划是什么？

1. [x] RSS 服务: [`https://x-hiring.hehehai.cn/feed.xml`](https://x-hiring.hehehai.cn/feed.xml)
2. [ ] 相关职位推荐 - 每个职位详情下方暂时最新 6 个类似职位
3. [ ] 上次查看标识 - 下一次打开时，列表滚动到上次打开时的第一条数据时，标记上次查看标识
4. [ ] 新增 team 入口， 展示中文社区开发团队和独立开发者列表
5. [ ] 支持登录 - 使用 clerk 登录账号
6. [ ] 支持职位信息发布 - 发布职位后默认状态为待审核， 审核成功或失败将发送邮件到发布人邮箱

## 反馈建议/职位交流 📢

- 群二维码失效，请加我的微信

|                   职位群                    |              |                     我的 WX                    |
|:---------------------------------------:|:------------:|:-------------------------------------------:|
| <img src="https://pub-d9291d6d3a90468cb78bfd59b5ac6e8c.r2.dev/WechatIMG3887.jpg" width="220"> |              | <img src="https://pub-d9291d6d3a90468cb78bfd59b5ac6e8c.r2.dev/me-wx.png" width="240"> |
