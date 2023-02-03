module.exports = {
  reactStrictMode: false,
  experimental: {
    appDir: true,
  },
  modularizeImports: {
    "@mui/material": {
      transform: "@mui/material/{{member}}"
    },
    "@mui/icons-material": {
      transform: "@mui/icons-material/{{member}}"
    },
    "@mui/styles": {
      transform: "@mui/styles/{{member}}"
    },
    "@mui/lab": {
      transform: "@mui/lab/{{member}}"
    },
    "@mui/system": {
      transform: "@mui/system/{{member}}"
    }
  },
  async rewrites() {
    return {
      fallback: [
        {
          source: "/api/v1/:path*",
          destination: "http://127.0.0.1:3001/api/v1/:path*"
        }
      ]
    }
  }
}