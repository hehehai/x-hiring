import { load } from "cheerio";
import fetch from "node-fetch";
import {
  ELE_DUCK_DETAIL_URL,
  ELE_DUCK_LIST_URL,
  grabHeaders,
} from "../constants";
import logger from "../../lib/logger";

function extractContentFromScriptTag(html: string) {
  const regex =
    /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/;
  const match = html.match(regex);
  if (match && match.length >= 2) {
    return match[1];
  } else {
    return null;
  }
}

export interface EleDuckArticle {
  href: string;
  id: string;
  title: string;
  authorName: string;
  authorAvatar: string;
  createdAt: string;
  category: string;
}

export async function eleDuckListRoute(page: string) {
  try {
    const res = await fetch(`${ELE_DUCK_LIST_URL}${page}`, {
      headers: grabHeaders,
    });
    if (!res.ok) {
      throw new Error(`列表页面请求失败: ${res.status}`);
    }
    const text = await res.text();
    if (!text) {
      throw new Error(`列表页面内容为空`);
    }
    const pageData = extractContentFromScriptTag(text);
    if (!pageData) {
      throw new Error(`列表页面内容为空`);
    }
    const dataProps = JSON.parse(pageData);
    const articles: any[] =
      dataProps?.props?.initialProps?.pageProps?.postList?.posts ?? [];
    if (!articles?.length) {
      throw new Error(`列表文章查询失败: 文章元素未找到`);
    }
    return articles.map((article) => {
      return {
        href: `${ELE_DUCK_DETAIL_URL}${article.id}`,
        id: article.id,
        title: article.title,
        authorName: article.user.nickname,
        authorAvatar: article.user.avatar_url,
        createdAt: article.published_at,
        category: article.category.code,
      } as EleDuckArticle;
    });
  } catch (err) {
    logger.error("[ELE_DUCK] 列表 error", err);
    return [];
  }
}

export async function eleDuckDetailRoute(detailId: string) {
  try {
    const res = await fetch(`${ELE_DUCK_DETAIL_URL}${detailId}`, {
      headers: grabHeaders,
    });
    if (!res.ok) {
      throw new Error(`详情页面请求失败: ${res.status}`);
    }
    const text = await res.text();
    if (!text) {
      throw new Error(`详情页面内容为空`);
    }
    const pageData = extractContentFromScriptTag(text);
    if (!pageData) {
      throw new Error(`详情页面内容为空`);
    }
    const dataProps = JSON.parse(pageData);
    const article: Record<string, any> =
      dataProps?.props?.initialProps?.pageProps?.post ?? {};
    if (!article) {
      throw new Error(`详情页面内容为空`);
    }

    const contentMain = article.raw_content
      ? load(article.raw_content as string).text()
      : "";

    const contentTags: string[] = (article.tags as any[])?.map((tag: any) => {
      return `${tag.tag_group.name}: ${tag.name}`;
    });
    const content = `${contentMain}\n${contentTags.join("\n")}`;

    return { content };
  } catch (err) {
    logger.error("[ELE_DUCK] 详情 error", err);
    return null;
  }
}
