const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push("wasm");

config.resolver.unstable_conditionNames = ["require", "default", "node"];

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "pg-hstore") {
    return { type: "empty" };
  }
  return context.resolveRequest(context, moduleName, platform);
};

config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
      res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
      middleware(req, res, next);
    };
  },
};

module.exports = config;
