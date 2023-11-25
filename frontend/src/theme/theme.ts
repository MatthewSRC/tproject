import { createTheme } from "@shopify/restyle";

const palette = {
  black: "#1E1E1E",
  darkGray: "#404040",
  white: "#FFFFFF",
  green: "#0AB634",
  red: "#FF2F08",
} as const;

export const theme = createTheme({
  colors: {
    contrast: palette.white,
    primary: palette.black,
    secondary: palette.darkGray,
    background: palette.white,
    textDark: palette.black,
    textLight: palette.white,
    green: palette.green,
    red: palette.red,
  },
  spacing: {
    zero: 0,
    xs: 4,
    s: 8,
    sm: 12,
    m: 16,
    l: 24,
    lxl: 32,
    xl: 40,
  },
  textVariants: {
    title: {
      fontFamily: "InterBlack",
      fontSize: 24,
      lineHeight: 32,
      color: "textDark",
    },
    subtitle: {
      fontFamily: "InterMedium",
      fontSize: 16,
      lineHeight: 24,
      color: "textDark",
    },
    button: {
      fontFamily: "InterBold",
      fontSize: 20,
      lineHeight: 28,
      color: "textLight",
    },
    common: {
      fontFamily: "InterSemiBold",
      fontSize: 20,
      lineHeight: 28,
      color: "secondary",
    },
  },
});

export type Theme = typeof theme;
