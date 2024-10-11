const envConfig = require("./env.js") // Load the generated config

module.exports = {
  reactStrictMode: true,

  // Set basePath and assetPrefix dynamically
  basePath: envConfig.basePath || "",
  assetPrefix: `${envConfig.basePath}/` || "",

  publicRuntimeConfig: {
    basePath: envConfig.basePath || "",
  },
}
