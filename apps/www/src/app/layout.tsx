import "@/styles/globals.css";

import { TRPCReactProvider } from "@/trpc/react";
import { OpenpanelProvider } from "@openpanel/nextjs";
import type { Metadata } from "next";
import { ViewTransitions } from "next-view-transitions";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import ReactDOM from "react-dom";

import { env } from "@/env";
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
		<ViewTransitions>
			<html lang={siteMeta.language} suppressHydrationWarning>
				<body
					className={cn("min-h-screen bg-background font-sans antialiased")}
				>
					<TRPCReactProvider>
						<NuqsAdapter>{children}</NuqsAdapter>
					</TRPCReactProvider>
				</body>
				{env.NODE_ENV === "production" && (
					<OpenpanelProvider
						clientId="0d1c25b1-c43a-45c2-880e-f6f57643093f"
						trackScreenViews={true}
						trackAttributes={true}
						trackOutgoingLinks={true}
					/>
				)}
			</html>
		</ViewTransitions>
	);
}
