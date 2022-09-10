function defineNextConfig(config) {
  return config;
}

export default defineNextConfig({
  reactStrictMode: true,
  swcMinify: true,
  images:{
    domains: ["cdn.discordapp.com"]
  }
});
