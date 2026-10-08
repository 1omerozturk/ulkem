const { BRAND } = require("./constants/GameConfig");

module.exports = ({ config }) => {
  const plugins = (config.plugins || []).map((plugin) => {
    if (Array.isArray(plugin) && plugin[0] === "expo-splash-screen") {
      return [
        plugin[0],
        {
          ...plugin[1],
          image: BRAND.assets.logo,
          backgroundColor: BRAND.splashBackground,
        },
      ];
    }
    return plugin;
  });

  if (!plugins.some((plugin) => plugin === "expo-audio" || (Array.isArray(plugin) && plugin[0] === "expo-audio"))) {
    plugins.push([
      "expo-audio",
      {
        microphonePermission: false,
        recordAudioAndroid: false,
        enableBackgroundPlayback: false,
        enableBackgroundRecording: false,
      },
    ]);
  }

  return {
    ...config,
    name: BRAND.name,
    icon: BRAND.assets.appIcon,
    android: {
      ...config.android,
      adaptiveIcon: {
        ...config.android?.adaptiveIcon,
        foregroundImage: BRAND.assets.logo,
        backgroundColor: BRAND.splashBackground,
      },
    },
    web: { ...config.web, favicon: BRAND.assets.appIcon },
    plugins,
  };
};
