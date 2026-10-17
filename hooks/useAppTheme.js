import { useMemo } from "react";
import { THEMES } from "../constants/Colors";
import { useGameSettingsStore } from "../store/gameSettingsStore";

export function useAppTheme(createStyles) {
  const themeId = useGameSettingsStore((state) => state.themeId);
  const theme = THEMES[themeId] || THEMES.explorer;
  const styles = useMemo(
    () => (createStyles ? createStyles(theme.colors) : undefined),
    [createStyles, theme],
  );

  return { theme, colors: theme.colors, styles };
}
