import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/Colors";

const styles = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 480,
    backgroundColor: COLORS.authSurface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.authBorder,
    padding: 20,
    shadowColor: COLORS.authShadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 3,
  },
  cardHeading: {
    flexDirection: "row",
    alignItems: "center",
  },
  heartBadge: {
    width: 50,
    height: 50,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9E9E7",
  },
  headingCopy: {
    flex: 1,
    marginLeft: 13,
  },
  title: {
    color: COLORS.authText,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "800",
  },
  description: {
    color: COLORS.authTextMuted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 22,
    marginBottom: 18,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: COLORS.authInput,
  },
  balanceItem: {
    flex: 1,
    alignItems: "center",
  },
  balanceLabel: {
    color: COLORS.authTextMuted,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 4,
  },
  balanceValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  balanceValue: {
    color: COLORS.authText,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },
  balanceDivider: {
    width: 1,
    height: 36,
    backgroundColor: COLORS.authBorder,
  },
  button: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: COLORS.authPrimary,
  },
  buttonDisabled: {
    backgroundColor: "#A7B9B1",
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "800",
  },
  helperText: {
    color: COLORS.authTextMuted,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 12,
  },
  successMessage: {
    color: COLORS.authSuccess,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 10,
  },
  errorMessage: {
    color: COLORS.authError,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 10,
  },
});

export default styles;
