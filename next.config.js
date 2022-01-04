const withTM = require('next-transpile-modules')(['monaco-editor', '@monaco-editor/loader']);

module.exports = withTM({
  reactStrictMode: true,
})
