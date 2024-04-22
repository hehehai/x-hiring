import { RUANYF_OWNER, RUANYF_REPO, RUANYF_TITLE_PREFIX } from "../constants";
import logger from "../../lib/logger";
import { Octokit } from "@octokit/core";
import { env } from "../../lib/utils";

export interface User {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
}

export interface Reactions {
  url: string;
  total_count: number;
  "+1": number;
  "-1": number;
  laugh: number;
  hooray: number;
  confused: number;
  heart: number;
  rocket: number;
  eyes: number;
}

export interface RuanyfComment {
  id: number;
  html_url: string;
  user: User;
  created_at: string;
  updated_at: string;
  body: string;
}

export interface RuanyfIssue {
  html_url: string;
  id: number;
  number: number;
  title: string;
  user: User;
  comments: RuanyfComment[];
}

// Octokit.js
// https://github.com/octokit/core.js#readme
const octokit = new Octokit({
  auth: env.GITHUB_TOKEN,
});

export async function ruanyfListRoute() {
  try {
    const data = await octokit.request("GET /repos/{owner}/{repo}/issues", {
      owner: RUANYF_OWNER,
      repo: RUANYF_REPO,
      state: "open",
      creator: RUANYF_OWNER,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (data.status !== 200) {
      throw new Error(`列表页面请求失败: ${data.status}`);
    }

    // 找到 最新的 “谁在招人”
    const [pointIssue] = data.data.filter((issue) =>
      issue.title.startsWith(RUANYF_TITLE_PREFIX)
    );
    if (!pointIssue) {
      throw new Error(`列表页面内容为空`);
    }

    // 评论数
    const comments = await octokit.request(
      "GET /repos/{owner}/{repo}/issues/{issue_number}/comments",
      {
        owner: RUANYF_OWNER,
        repo: RUANYF_REPO,
        issue_number: pointIssue.number,
        per_page: 100, // max 100
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    const issue = {
      ...pointIssue,
      comments: comments.data,
    } as RuanyfIssue;

    return issue;
  } catch (err) {
    logger.error("[RUANYF] 列表 error", err);
    return null;
  }
}
