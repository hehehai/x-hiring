<div align="center">

<h1>X-Hiring</h1>
🤗 每日最新招聘信息，使用 Google AI 提取摘要
<br/>

![image](https://github.com/hehehai/h-blog/assets/12692552/ae50f16c-a61a-4c3d-a8fa-63b5912818b2)

</div>

## ⌨️ 安装&运行

> 数据抓取为独立服务， [x-hiring grab]（<https://github.com/hehehai/x-hiring-grab>>

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
