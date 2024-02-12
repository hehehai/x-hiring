import "@/styles/globals.css";

import { TRPCReactProvider } from "@/trpc/react";

import "@/lib/with-proxy";
import { cn } from "@/lib/utils";
import Head from "next/head";
import Script from "next/script";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "X-Hiring",
    template: "%s | X-Hiring",
  },
  description: "每日最新招聘信息，使用 Google AI 提取摘要",
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <link
          rel="stylesheet"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/npm/misans@4.0.0/lib/Normal/MiSans-Regular.min.css"
        />
      </Head>
      <Script id="ms_clarity" strategy="afterInteractive">
        {`(function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "kzm7tmjkn1");`}
      </Script>
      <body className={cn("min-h-screen bg-background font-sans antialiased")}>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
