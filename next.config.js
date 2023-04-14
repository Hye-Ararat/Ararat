const caddyConfig = require("./caddyConfig.json");
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
          source: "/realms/Ararat/:path*",
          destination: "http://127.0.0.1:8080/realms/Ararat/:path*"
        },
        {
          source: "/resources/:path*",
          destination: "http://127.0.0.1:8080/resources/:path*"
        },
        {
          source: "/api/authentication/device/auth/:path*",
          destination: "http://127.0.0.1:3002/api/authentication/device/auth/:path*"
        },
        {
          source: "/api/authentication/device/:path*",
          destination: "http://127.0.0.1:3002/api/authentication/device/:path*"
        },
        {
          source: "/api/authentication/auth/:path*",
          destination: "http://127.0.0.1:3002/api/authentication/auth/:path*"
        },
        {
          source: "/api/authentication/token/:path*",
          destination: "http://127.0.0.1:3002/api/authentication/token:path*"
        },
        {
          source: "/api/authentication/jwks/:path*",
          destination: "http://127.0.0.1:3002/api/authentication/jwks:path*"
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
          destination: `https://${caddyConfig.apps.http.servers.ararat.routes[0].match[0].host}:8443/1.0/:path*`
        }
      ]
    }
  }
}