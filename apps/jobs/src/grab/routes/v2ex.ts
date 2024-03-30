import { load } from "cheerio";
import fetch from "node-fetch";
import { V2EX_DETAIL_URL, V2EX_LIST_URL, grabHeaders } from "../constants";
import logger from "../../lib/logger";

export interface V2EXArticle {
  href: string;
  id: string;
  title: string;
  authorName: string;
  authorAvatar: string;
  createdAt?: string;
  content?: string;
}

export async function v2exListRoute(page: string) {
  // 获取列表数据
  const baseUrl = new URL(V2EX_LIST_URL);
  try {
    const res = await fetch(`${V2EX_LIST_URL}${page}`, {
      headers: grabHeaders,
    });
    if (!res.ok) {
      throw new Error(`列表页面请求失败: ${res.status}`);
    }
    const text = await res.text();
    if (!text) {
      throw new Error(`列表页面内容为空`);
    }
    const doc$ = load(text);
    // 获取列表数据
    // 遍历查询数据是否存在， 如有存在数据， 停止遍历
    // 将不存在数据， 创建
    // 添加详情 抓取
    const articles$ = doc$("#TopicsNode .cell");
    if (!articles$?.length) {
      throw new Error(`列表文章查询失败: 文章元素未找到`);
    }
    const articles: V2EXArticle[] = [];
    articles$.each((idx, article) => {
      const article$ = doc$(article);
      const articleLinkHref =
        article$.find("span.item_title a").attr("href") ?? "";
      const articleUrl = new URL(articleLinkHref, baseUrl.origin);
      const articleId = articleUrl.pathname.split("/").pop();
      const articleTitle = article$.find("span.item_title a").text();
      const authorName = article$.find("span.topic_info strong a").text();
      const authorAvatar = article$.find("img.avatar").attr("src");

      if (!articleId || !articleTitle || !authorName || !authorAvatar) {
        logger.error("文章信息缺失", articleId);
        return;
      }

      articles.push({
        href: articleUrl.href,
        id: articleId,
        title: articleTitle,
        authorName,
        authorAvatar,
      });
    });
    return articles;
  } catch (err) {
    logger.error("[V2EX] 列表 error", err);
    return [];
  }
}

export async function v2exDetailRoute(detailId: string) {
  try {
    const res = await fetch(`${V2EX_DETAIL_URL}${detailId}`, {
      headers: grabHeaders,
    });
    if (!res.ok) {
      throw new Error(`详情页面请求失败: ${res.status}`);
    }
    const text = await res.text();
    if (!text) {
      throw new Error(`详情页面内容为空`);
    }
    const doc$ = load(text);
    const createdAt = doc$("#Main small.gray span").attr("title");
    const contents: string[] = [];
    doc$("#Main .topic_content").each((idx, content) => {
      contents.push(doc$(content).text() ?? "");
    });
    const content = contents.join("\n");

    if (!createdAt || !content) {
      throw new Error(`详情页面内容为空`);
    }

    return { createdAt, content };
  } catch (err) {
    logger.error("[V2EX] 详情 error", err);
    return null;
  }
}
