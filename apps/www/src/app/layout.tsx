import "@/styles/globals.css";

import { type Metadata } from "next";
import { TRPCReactProvider } from "@/trpc/react";
import { GoogleAnalytics } from "@next/third-parties/google";
import ReactDOM from "react-dom";

import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  metadataBase: new URL("https://x-hiring.hehehai.cn"),
  title: {
    default: "X-Hiring",
    template: "%s | X-Hiring",
  },
  description: "每日最新招聘信息， 使用 Google AI 提取摘要",
  keywords: [
    "招聘",
    "程序员招聘",
    "招聘信息",
    "远程工作",
    "远程开发",
    "兼职开发",
    "远程兼职",
  ],
  icons: [{ rel: "icon", url: "/favicon.svg", type: "image/svg+xml" }],
  authors: [{ name: "X-Hiring", url: "https://x-hiring.hehehai.cn" }],
  openGraph: {
    title: "X-Hiring",
    description: "每日最新招聘信息， 使用 Google AI 提取摘要",
    url: "https://x-hiring.hehehai.cn",
    images: [
      {
        url: "https://x-hiring.hehehai.cn/og.png",
        width: 1200,
        height: 630,
        alt: "X-Hiring",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  ReactDOM.preload(
    "https://cdn.jsdelivr.net/npm/misans@4.0.0/lib/Normal/MiSans-Regular.min.css",
    { as: "style" },
  );

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased")}>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
      <GoogleAnalytics gaId="G-TZXQXXK3C2" />
    </html>
  );
}
