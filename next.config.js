const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // sassOptions: {
  //   includePaths: [path.join(__dirname, "styles")],
  //   prependData: `@import "~@styles/variables.scss"; @import "~@styles/mixins.scss";`,
  // },
};

module.exports = nextConfig;
