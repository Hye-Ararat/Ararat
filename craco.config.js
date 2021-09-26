const path = require("path")

module.exports = {
    webpack: {
        alias: {
            'vscode': require.resolve('monaco-languageclient/lib/vscode-compatibility')
        }
    }
}