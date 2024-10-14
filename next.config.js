const envConfig = require("./env.js") // Load the generated config

module.exports = {
  reactStrictMode: true,

  // Set basePath and assetPrefix dynamically
  basePath: envConfig.basePath || "",
  assetPrefix: `${envConfig.basePath}/` || "",
  restSourceBackendEndpoint: `${envConfig.restSourceBackendEndpoint}/` || "",
  restSourceFrontendEndpoint: `${envConfig.restSourceFrontendEndpoint}/` || "",
  hydraPublicUrl: `${envConfig.hydraPublicUrl}/` || "",

  publicRuntimeConfig: {
    basePath: envConfig.basePath || "",
    frontEndClientId: "SEP",
    frontEndClientSecret: "secret",
    restSourceBackendEndpoint: envConfig.restSourceBackendEndpoint,
    restSourceFrontendEndpoint: envConfig.restSourceFrontendEndpoint,
    hydraPublicUrl: envConfig.hydraPublicUrl,
  },
}
