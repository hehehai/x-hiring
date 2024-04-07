<div align="center">

<h1>X-Hiring</h1>
🤗 每日最新招聘信息，使用 Google AI 提取摘要
<br/>

![image](https://github.com/hehehai/h-blog/assets/12692552/9853bc8b-9988-4bc4-8075-88c3a35147a2)
![image](https://github.com/hehehai/h-blog/assets/12692552/6d83d836-2134-4c83-bd9b-d51702978bfe)

</div>

> [!TIP]
> 如果有合适的职位数据源，欢迎👏提 [issues](https://github.com/hehehai/x-hiring/issues/new), 我们将视情况开发。

## ⌨️ 安装&运行

> 数据抓取为独立服务， [x-hiring grab](https://github.com/hehehai/x-hiring-grab)

配置环境变量。 在根目录创建 `.env` 文件(参考 `.env.example`)， 之后复制下面内容

```txt
# Prisma postgresql 数据库
DATABASE_URL="postgresql://x-hiring:password@0.0.0.0:5432/x-hiring"

# Next Auth
# You can generate a new secret on the command line with:
# openssl rand -base64 32
NEXTAUTH_SECRET="xxx"
NEXTAUTH_URL="http://localhost:3000"

# Google Gemini AI
GEMINI_AI_API_KEY="api_token"

# 本地代理 （可选）
LOCAL_FETCH_PROXY="http://127.0.0.1:7890"
```

```shell
npm install
npm run dev
```

打开 `http://localhost:3000`

## Q&A

> 网站和抓取分析，为什么分为了两个服务？

1. 抓取是长时运行任务，
@vercel 免费版最大运行时长 10s, cron 的是每日一次，最小单位为小时，任务运行时长也有最大限制
2. #Gemini 有地域限制，且未直接在业务中使用，所以结合抓取实现摘要保存更合适

> 接下来的计划是什么？

1. [ ] 新增 team 入口， 展示中文社区开发团队和独立开发者列表
2. [x] RSS 服务: [`https://x-hiring.hehehai.cn/feed.xml`](https://x-hiring.hehehai.cn/feed.xml)
3. [ ] 账号登录，订阅职位关键词，有效职位发布后，将第一时间收到邮件

## 反馈建议/职位交流 📢

- 群二维码失效，请加我的微信

|                   职位群                    |              |                     我的 WX                    |
|:---------------------------------------:|:------------:|:-------------------------------------------:|
| <img src="https://pub-d9291d6d3a90468cb78bfd59b5ac6e8c.r2.dev/WechatIMG3743.jpg" width="220"> |              | <img src="https://pub-d9291d6d3a90468cb78bfd59b5ac6e8c.r2.dev/me-wx.png" width="240"> |
