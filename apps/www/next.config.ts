import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";
import type { NextConfig } from "next";
import { env } from "./src/env";

if (env.NODE_ENV === "development") {
	console.log("env", env);
}

const config: NextConfig = {
	webpack: (config, { isServer }) => {
		if (isServer) {
			config.plugins = [...config.plugins, new PrismaPlugin()];
		}

		return config;
	},
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
	async rewrites() {
		return [
			{
				source: "/rss",
				destination: "/feed.xml",
			},
			{
				source: "/rss.xml",
				destination: "/feed.xml",
			},
			{
				source: "/feed",
				destination: "/feed.xml",
			},
		];
	},
};

export default config;
