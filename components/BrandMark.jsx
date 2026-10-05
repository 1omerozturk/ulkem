import { Image } from "react-native";

export default function BrandMark({ style, resizeMode = "contain" }) {
  return <Image source={require("../assets/brand/yurtpusula-mark.png")} style={style} resizeMode={resizeMode} accessibilityIgnoresInvertColors />;
}
