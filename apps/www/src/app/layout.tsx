import "@/styles/globals.css";

import { type Metadata } from "next";
import { TRPCReactProvider } from "@/trpc/react";
import { GoogleAnalytics } from "@next/third-parties/google";
import ReactDOM from "react-dom";

import { siteMeta } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  metadataBase: new URL(siteMeta.url),
  title: {
    default: siteMeta.title,
    template: `%s | ${siteMeta.title}`,
  },
  description: siteMeta.description,
  keywords: siteMeta.keywords,
  icons: [{ rel: "icon", url: "/favicon.svg", type: "image/svg+xml" }],
  authors: [{ name: siteMeta.title, url: siteMeta.url }],
  openGraph: {
    title: siteMeta.title,
    description: siteMeta.description,
    url: siteMeta.url,
    images: [
      {
        url: siteMeta.ogImage,
        width: 1200,
        height: 630,
        alt: "X-Hiring",
      },
    ],
  },
  alternates: {
    canonical: siteMeta.url,
    types: {
      "application/rss+xml": [{ url: "feed.xml", title: "RSS 订阅" }],
    },
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
    <html lang={siteMeta.language} suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased")}>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
      <GoogleAnalytics gaId={siteMeta.ga} />
    </html>
  );
}
