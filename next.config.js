/** @type {import('next').NextConfig} */
const nextConfig = {
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
      }
}

module.exports = nextConfig
