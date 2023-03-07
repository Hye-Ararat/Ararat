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
        },
        {
          source: "/api/authentication/auth/:path*",
          destination: "http://127.0.0.1:3002/api/authentication/auth:path*"
        },
        {
          source: "/interaction/:path*",
          destination: "http://127.0.0.1:3002/interaction/:path*"
        },
        {
          source: "/api/authentication/:path*",
          destination: "http://127.0.0.1:3002/:path*"
        },
        {
          source: "/candid/:path*",
          destination: "http://127.0.0.1:8082/:path*"
        },
        {
          source: "/1.0/:path*",
          destination: "https://us-dal-1.hye.gg:8443/1.0/:path*"
        }
      ]
    }
  }
}