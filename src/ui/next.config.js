/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const nextImageLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg"),
    );

    nextImageLoaderRule.resourceQuery = {
      not: [...nextImageLoaderRule.resourceQuery.not, /icon/],
    };

    config.module.rules.push({
      issuer: nextImageLoaderRule.issuer,
      resourceQuery: /icon/, // *.svg?icon
      use: ["@svgr/webpack"],
    });

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xfluencer.s3.eu-west-2.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        port: "",
        pathname: "/**",
      }
    ],
  },
};

module.exports = nextConfig;
