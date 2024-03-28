import { type ClassValue, clsx } from "clsx";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  format,
} from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// 生成指定范围的随机整数
export const randomInt = (start: number, end: number) => {
  return Math.floor(Math.random() * (end - start + 1) + start);
};

export const formatPosDate = (val: Date) => {
  const now = new Date();
  const nowShanghai = convertToShanghaiTime(now);
  const valShanghai = convertToShanghaiTime(val);

  const readStr = format(valShanghai, "MM/dd HH:mm");

  // 如果时间在 5 分钟内，显示 刚刚
  const minutesDiff = differenceInMinutes(nowShanghai, valShanghai);
  if (minutesDiff <= 5) {
    return `刚刚 | ${readStr}`;
  }

  // 如果时间在 1 小时内，显示 xx 分钟前
  if (minutesDiff <= 60) {
    return `${minutesDiff} 分钟前 | ${readStr}`;
  }

  // 如果时间在 12 小时内，显示 xx 小时前
  const hoursDiff = differenceInHours(nowShanghai, valShanghai);
  if (hoursDiff <= 24) {
    return `${hoursDiff} 小时前 | ${readStr}`;
  }

  // 如果时间在 5 天内，显示 xx 天前
  const daysDiff = differenceInDays(nowShanghai, valShanghai);
  if (daysDiff <= 5) {
    return `${daysDiff} 天前 | ${readStr}`;
  }

  // 如果时间大于 5 天，显示时间
  return format(valShanghai, "MM/dd HH:mm");
};

const convertToShanghaiTime = (date: Date): Date => {
  const shanghaiOffset = 8 * 60; // Shanghai is UTC+8
  const utcOffset = date.getTimezoneOffset();
  const convertedDate = new Date(
    date.getTime() + (utcOffset + shanghaiOffset) * 60 * 1000,
  );
  return convertedDate;
};
