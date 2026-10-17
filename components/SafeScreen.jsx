import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "../hooks/useAppTheme";

// SafeScreen bileşeni
export default function SafeScreen({ children }) {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: colors.background }}>
        {children}
      </View>
    </GestureHandlerRootView>
  );
}
