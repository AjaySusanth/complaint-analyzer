/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
      // Exclude .node files from being processed by Webpack
      config.module.rules.push({
        test: /\.node$/,
        use: 'raw-loader',
      });
  
      return config;
    },
  };
  
  module.exports = nextConfig;