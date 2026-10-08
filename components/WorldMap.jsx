import { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import Svg, { G, Path } from "react-native-svg";
import { WORLD_CONTINENTS } from "../model/world/continents";

const colors = { "North America": "#5DA9A2", "South America": "#E7A65C", Europe: "#8A7AC3", Africa: "#D87668", Asia: "#5D91C9", Oceania: "#6EAD75" };
const continentCodes = { "North America": "NA", "South America": "SA", Europe: "EU", Africa: "AF", Asia: "AS", Oceania: "OC" };
const codeColors = Object.fromEntries(Object.entries(continentCodes).map(([continent, code]) => [code, colors[continent]]));
const shapes = require("../assets/maps/worldCountries.json");

function getViewBox(selectedContinent, highlightedId) {
  const focus = highlightedId
    ? shapes.filter((shape) => shape.id === String(highlightedId))
    : selectedContinent === "all"
      ? []
      : shapes.filter((shape) => continentCodes[shape.continent] === selectedContinent);
  if (!focus.length) return "0 0 1000 500";

  const bounds = focus.reduce((result, shape) => {
    const shapeBounds = highlightedId ? shape.focusBounds || shape.bounds : shape.bounds;
    return {
      minX: Math.min(result.minX, shapeBounds.minX),
      minY: Math.min(result.minY, shapeBounds.minY),
      maxX: Math.max(result.maxX, shapeBounds.maxX),
      maxY: Math.max(result.maxY, shapeBounds.maxY),
    };
  }, { minX: 1000, minY: 500, maxX: 0, maxY: 0 });
  const width = highlightedId
    ? Math.min(1000, Math.max((bounds.maxX - bounds.minX) * 7, (bounds.maxY - bounds.minY) * 14, 260))
    : Math.min(1000, Math.max((bounds.maxX - bounds.minX) * 1.16, (bounds.maxY - bounds.minY) * 2.32));
  const height = width / 2;
  const centerX = (bounds.minX + bounds.maxX) / 2;
  const centerY = (bounds.minY + bounds.maxY) / 2;
  const left = Math.min(1000 - width, Math.max(0, centerX - width / 2));
  const top = Math.min(500 - height, Math.max(0, centerY - height / 2));
  return `${left} ${top} ${width} ${height}`;
}

export default function WorldMap({ selectedContinent = "all", highlightedId, onSelectContinent, compact = false }) {
  const baseViewBox = useMemo(() => getViewBox(selectedContinent, highlightedId), [selectedContinent, highlightedId]);

  return (
    <Animated.View key={`${selectedContinent}-${highlightedId || ""}`} entering={FadeIn.duration(240)} style={[styles.frame, compact && styles.compact]}>
      <Svg width="100%" height={compact ? "100%" : 190} viewBox={baseViewBox} accessibilityLabel="Dünya kıtalar haritası">
        <G>
        {shapes.map(({ id, continent, paths }) => {
          const code = continentCodes[continent];
          const selected = selectedContinent === "all" || selectedContinent === code;
          const highlighted = String(id) === String(highlightedId);
          return paths.map((d, index) => <Path key={`${id}-${index}`} d={d} fill={highlighted ? "#F7C65B" : selected ? colors[continent] || "#A7B6AD" : "#D8E1DC"} fillOpacity={highlighted ? 1 : selected ? 0.88 : 0.56} stroke={highlighted ? "#B96B16" : "#FFFFFF"} strokeWidth={highlighted ? 1.6 : 0.8} strokeLinejoin="round" onPress={onSelectContinent && code ? () => onSelectContinent(code) : undefined} />);
        })}
        </G>
      </Svg>
      {!!onSelectContinent && <View style={styles.legend}>
        {WORLD_CONTINENTS.map(({ code, name }) => {
          const active = selectedContinent === code;
          return <TouchableOpacity key={code} onPress={() => onSelectContinent(code)} style={[styles.chip, active && styles.activeChip]} accessibilityRole="button" accessibilityState={{ selected: active }}>
            {code !== "all" && <View style={[styles.dot, { backgroundColor: codeColors[code] }]} />}
            <Text style={[styles.chipText, active && styles.activeText]}>{name}</Text>
          </TouchableOpacity>;
        })}
      </View>}
      {!!highlightedId && <View pointerEvents="none" style={styles.markerLabel}><Text style={styles.markerText}>İŞARETLİ ÜLKE</Text></View>}
    </Animated.View>
  );
}

const styles = {
  frame: { width: "100%", height: 330, backgroundColor: "#F5F8F5", borderRadius: 24, borderWidth: 1, borderColor: "#E1E9E3", padding: 8, marginBottom: 15, overflow: "hidden" },
  compact: { height: 235, padding: 3, marginBottom: 12 },
  legend: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 7, paddingTop: 5 },
  chip: { minHeight: 29, borderRadius: 15, paddingHorizontal: 9, flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E4EBE6" },
  activeChip: { backgroundColor: "#174E43", borderColor: "#174E43" },
  chipText: { color: "#66766E", fontSize: 10, fontWeight: "800" },
  activeText: { color: "#FFFFFF" },
  dot: { width: 7, height: 7, borderRadius: 4 },
  markerLabel: { position: "absolute", right: 13, top: 12, backgroundColor: "#174E43", paddingHorizontal: 9, paddingVertical: 5, borderRadius: 9 },
  markerText: { color: "#FFFFFF", fontSize: 8, letterSpacing: 0.8, fontWeight: "900" },
};
