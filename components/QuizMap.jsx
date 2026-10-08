import { View } from "react-native";
import Svg, { Path } from "react-native-svg";
import styles from "../assets/styles/quiz-map.styles";
import WorldMap from "./WorldMap";

const maps = {
  turkey: {
    viewBox: "0 0 1007.478 527.323",
    shapes: require("../assets/maps/turkeyProvinces.json"),
  },
};

export default function QuizMap({ mapId, highlightedId }) {
  if (mapId === "world") {
    return <WorldMap highlightedId={highlightedId} compact />;
  }
  const map = maps[mapId];
  if (!map) return null;

  return (
    <View style={styles.frame} accessibilityLabel="İl haritası">
      <Svg width="100%" height="100%" viewBox={map.viewBox}>
        {map.shapes.map((shape) => {
          const highlighted = String(shape.id) === String(highlightedId);
          return shape.paths.map((path, index) => (
            <Path
              key={`${shape.id}-${index}`}
              d={path}
              fill={highlighted ? "#F1A43A" : "#DDEAE3"}
              stroke={highlighted ? "#B96B16" : "#FFFFFF"}
              strokeWidth={highlighted ? 2 : 1.25}
              strokeLinejoin="round"
            />
          ));
        })}
      </Svg>
    </View>
  );
}
