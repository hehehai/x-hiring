import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "../generative-ai-js";
import { env } from "../utils";
import logger from "../logger";

const genAI = new GoogleGenerativeAI(env.GEMINI_AI_API_KEY);

const hiringAbstractPrompt = `## 角色 
你是一个中文招聘信息分析助手，可以根据雇佣者发布的招聘信息的需求和情况，按照给定的要求进行信息分析提取。

## 预设 
### 不同项使用“|”分隔，如未提取到信息，则输出“无” 
- 工作类型： 全职（全天候、全日制、全日工作）/兼职（仅特定时间段或特定条件下从事的工作）/外包（雇佣者将某些业务活动委托给外部公司或个人） 
- 工作方式： 线下（工作需要在某个地方工作）/远程（工作需要在线上，使用计算机远程办公）/混合（部分时间线下，部分时间远程） 
- 工作地点： 位置（具体到位置，仅在工作方式为“线下”或“混合”是有效）- 工作岗位： 岗位名称（一条信息可有多个岗位信息，岗位信息要具体到岗位名称，名称要精简，最少 2 个字，最多 8 个字，多个岗位使用 / 分隔，岗位可以从公司的业务类型中分析） 
- 工作薪资： 薪资（薪资具体金额范围）/面议（在面试时商议）  
- 工作年限要求：年限（某岗位或技能的使用时长，单位为年） 
- 工作语言要求：语言（如：英文 或 日文）
- 职位学历要求：学历（教育经历、毕业的院校、学习专业学位等） 

## 技能 
### 1 提取： 提取有效招聘信息，格式要求 
1. 提取招聘摘要标题，长度在 10~25 字之间，格式为： [招聘工作类型]<摘要标题> 
2. 提取招聘企业信息，长度在 30~120 字之间，提取企业或雇主信息（非企业关键信息不要提取，如 企业增长，企业业务等）
3. 提取招聘职位名称，长度在 3~20 字之间，提取职位名称
4. 提取招聘职位内容：长度在 30~240 之间，要提取职位必要的要求，如某一项已包含其他项，则不提取已包含项 。
5. 提取招聘职位标签，标签按顺序提取格式为“标签名称：值”，每个标签开始前请换行，按预设顺序。
6. 提取联系方式，若联系方式是 base64 则解析后输出， 其它的原样输出（“VX”或者“WX” 代表联系方式为“微信”）。

### 2 输出： 格式化 
## 标题：
[工作类型]摘要标题

## 企业信息：
<企业信息> 

(说明：每个职位都要按以下格式输出)
## 职位名称：
<职位名称> 
## 职位要求：
<职位内容>

## 职位标签：
- <信息标签> 

## 联系方式：
<联系方式>

## 限制
- 只讨论与求职相关的内容，拒绝回答与求职无关的话题。 
- 所输出的内容必须按照给定的格式进行组织，不能偏离框架要求。 
- 输出内容必须在给定长度限制内，不能超出或少于要求。
- 请使用 Markdown 的格式进行输出。 
- 格式化中的 “<>” 不需要输出，仅为变量的标识。 
- 若有多个岗位，每个岗位使用 “----” 分隔 。
- 如为找到任何招聘相关的信息，请输出“无”

## 招聘内容
`;

const formatResult = (content = "") => {
  const result = {
    title: "",
    tags: new Set<string>(),
    content,
  };
  if (!content) {
    return result;
  }
  const lines = content.split("\n");
  let blockType = "";
  while (lines.length) {
    const line = lines.shift()?.trim();
    if (!line) {
      continue;
    }
    if (line.startsWith("##")) {
      blockType = line;
      continue;
    }
    if (blockType.trim() && blockType.includes("标题")) {
      result.title = line;
      continue;
    }
    if (blockType.trim() && blockType.includes("职位标签")) {
      if (line.startsWith("-")) {
        const tagValue = getTagValue(line);
        if (tagValue && tagValue !== "无") {
          result.tags.add(tagValue);
          continue;
        }
      }
    }
  }

  return result;
};

export async function withAiAnalysis(content: string) {
  try {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel(
      {
        model: "gemini-pro",
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0,
          topP: 1,
        },
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
          },
        ],
      },
    );

    const prompt = hiringAbstractPrompt + content;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    if (!text) {
      throw new Error(`招聘摘要生成失败, 响应内容为空`);
    }
    const abstract = formatResult(text);
    return {
      ...abstract,
      tags: Array.from(abstract.tags),
    };
  } catch (err) {
    logger.error("AI analysis error", err);
    return null;
  }
}

function getTagValue(str: string) {
  const colonIndex = str.indexOf("："); // 查找冒号的索引位置
  const value = str.substring(colonIndex + 1).trim(); // 提取冒号后面的值，并去除前后空格

  return value;
}
