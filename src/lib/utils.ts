import { type ClassValue, clsx } from "clsx";
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
