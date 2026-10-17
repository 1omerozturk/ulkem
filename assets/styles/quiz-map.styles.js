import { StyleSheet } from "react-native";
import { COLORS as BASE_COLORS } from "../../constants/Colors";

export const createStyles = (COLORS = BASE_COLORS) => StyleSheet.create({
  frame: {
    width: "100%",
    height: 205,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    marginBottom: 15,
    borderRadius: 22,
    backgroundColor: COLORS.authSurface,
    borderWidth: 1,
    borderColor: COLORS.authBorder,
    overflow: "hidden",
  },
});

export default createStyles;
