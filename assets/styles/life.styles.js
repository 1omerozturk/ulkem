import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/Colors";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.authBackground,
  },
  content: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 38,
    paddingBottom: 30,
  },
  heading: {
    width: "100%",
    maxWidth: 480,
    marginTop: 44,
    marginBottom: 22,
  },
  eyebrow: {
    color: COLORS.authPrimary,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  title: {
    color: COLORS.authText,
    fontSize: 30,
    lineHeight: 38,
    fontWeight: "800",
    marginTop: 4,
  },
  subtitle: {
    color: COLORS.authTextMuted,
    fontSize: 15,
    lineHeight: 23,
    marginTop: 5,
  },
  note: {
    width: "100%",
    maxWidth: 480,
    borderRadius: 16,
    backgroundColor: COLORS.authSurfaceTint,
    padding: 15,
    marginTop: 16,
  },
  noteText: {
    color: COLORS.authTextMuted,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
  },
  timerCard: {
    width: "100%",
    maxWidth: 480,
    minHeight: 78,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: COLORS.authSurface,
    borderWidth: 1,
    borderColor: COLORS.authBorder,
  },
  timerIcon: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: COLORS.authPrimarySoft,
  },
  timerCopy: { flex: 1, marginLeft: 11 },
  timerTitle: {
    color: COLORS.authText,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "800",
  },
  timerSubtitle: {
    color: COLORS.authTextMuted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 1,
  },
  timerValue: {
    color: COLORS.menuWorldAccent,
    fontSize: 19,
    lineHeight: 25,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },
  timerValueFull: { color: COLORS.authSuccess, fontSize: 16 },
});

export default styles;
