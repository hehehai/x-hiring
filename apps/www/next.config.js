/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
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
