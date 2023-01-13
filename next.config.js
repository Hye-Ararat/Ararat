module.exports = {
  reactStrictMode: true,
  webpack: (config, { dev }) => {
    return {
      ...config,
      experiments: {
        asyncWebAssembly: true,
        layers: true
      }
    }
  },
  experimental: {
    appDir: true
  },
  async rewrites() {
    return {
      fallback: [
        {
          source: "/api/v1/:path*",
          destination: "http://localhost:3001/api/v1/:path*"
        }
      ]
    }
  }
}