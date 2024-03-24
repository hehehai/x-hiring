import { type ClassValue, clsx } from "clsx";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  format,
} from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
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
  const now = utcToZonedTime(new Date(), "Asia/Shanghai");

  const readStr = format(val, "MM/dd HH:mm");

  // 如果时间在 5 分钟内，显示 刚刚
  const minutesDiff = differenceInMinutes(now, val);
  if (minutesDiff <= 5) {
    return `刚刚 | ${readStr}`;
  }

  // 如果时间在 1 小时内，显示 xx 分钟前
  if (minutesDiff <= 60) {
    return `${minutesDiff} 分钟前 | ${readStr}`;
  }

  // 如果时间在 12 小时内，显示 xx 小时前
  const hoursDiff = differenceInHours(now, val);
  if (hoursDiff <= 24) {
    return `${hoursDiff} 小时前 | ${readStr}`;
  }

  // 如果时间在 5 天内，显示 xx 天前
  const daysDiff = differenceInDays(now, val);
  if (daysDiff <= 5) {
    return `${daysDiff} 天前 | ${readStr}`;
  }

  // 如果时间大于 5 天，显示时间
  return format(val, "MM/dd HH:mm");
};
