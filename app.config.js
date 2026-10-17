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

  if (!plugins.some((plugin) =>
    plugin === "react-native-google-mobile-ads" ||
    (Array.isArray(plugin) && plugin[0] === "react-native-google-mobile-ads")
  )) {
    plugins.push([
      "react-native-google-mobile-ads",
      {
        // Google test app IDs are safe defaults until the app's AdMob IDs are configured.
        androidAppId: process.env.ADMOB_ANDROID_APP_ID || "ca-app-pub-3940256099942544~3347511713",
        iosAppId: process.env.ADMOB_IOS_APP_ID || "ca-app-pub-3940256099942544~1458002511",
        delayAppMeasurementInit: true,
      },
    ]);
  }

  return {
    ...config,
    // The native Gradle script also reads this root-level key from app.json.
    // Keep it in sync with the Expo config plugin values above, including EAS env overrides.
    "react-native-google-mobile-ads": {
      android_app_id: process.env.ADMOB_ANDROID_APP_ID || "ca-app-pub-3940256099942544~3347511713",
      ios_app_id: process.env.ADMOB_IOS_APP_ID || "ca-app-pub-3940256099942544~1458002511",
      delay_app_measurement_init: true,
    },
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
