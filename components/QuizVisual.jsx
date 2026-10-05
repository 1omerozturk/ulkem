import { Ionicons } from "@expo/vector-icons";
import { gunzipSync, strFromU8 } from "fflate";
import { useMemo } from "react";
import { View } from "react-native";
import { SvgXml } from "react-native-svg";
import { COLORS } from "../constants/Colors";
import { styles } from "../assets/styles/quiz.styles";

let localFlags;
const BASE64_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function decodeBase64(value) {
  const padding = value.endsWith("==") ? 2 : value.endsWith("=") ? 1 : 0;
  const output = new Uint8Array(Math.floor((value.length * 3) / 4) - padding);
  let accumulator = 0;
  let bits = 0;
  let offset = 0;

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    if (character === "=") break;
    const digit = BASE64_ALPHABET.indexOf(character);
    if (digit < 0) continue;

    accumulator = (accumulator << 6) | digit;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      output[offset] = (accumulator >> bits) & 0xff;
      offset += 1;
    }
  }

  return output;
}

function getLocalFlags() {
  if (!localFlags) {
    const compressed = require("../model/world/flags-compressed.json");
    const compressedBytes = decodeBase64(compressed);
    localFlags = JSON.parse(strFromU8(gunzipSync(compressedBytes)));
  }
  return localFlags;
}

export default function QuizVisual({ visual }) {
  const flagXml = useMemo(() => {
    if (visual?.type !== "flag" || !visual.key) return null;
    return getLocalFlags()[visual.key] ?? null;
  }, [visual?.key, visual?.type]);

  if (!visual) return null;

  return (
    <View accessible accessibilityLabel="Soru görseli" style={styles.quizVisualFrame}>
      {flagXml ? (
        <SvgXml xml={flagXml} width="100%" height="100%" />
      ) : (
        <Ionicons name="image-outline" size={34} color={COLORS.authTextMuted} />
      )}
    </View>
  );
}
