if (!process.env.GEMINI_AI_API_KEY) {
  throw new Error("GEMINI_AI_API_KEY is not set");
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  GITHUB_TOKEN: process.env.GITHUB_TOKEN ?? "",
  GEMINI_AI_API_KEY: process.env.GEMINI_AI_API_KEY ?? "",
  DATABASE_URL: process.env.DATABASE_URL ?? "",
  LOCAL_FETCH_PROXY: process.env.LOCAL_FETCH_PROXY ?? "",
};

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// 生成指定范围的随机整数
export const randomInt = (start: number, end: number) => {
  return Math.floor(Math.random() * (end - start + 1) + start);
};
