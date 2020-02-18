/* styles.js */

export const SPACING_XXS = 4;
export const SPACING_XS = 6;
export const SPACING_S = 12;
// ... more spacing constants

export const COLOR_DARK_BLUE = "#06171d";
export const COLOR_GRAY_BLUE = "#b2c3d0";
export const COLOR_TEAL = "#437f92";
// ... more colour constants

export default StyleSheet.create({
  ma0: { margin: SPACING_XXS },
  ma1: { margin: SPACING_XS },
  ma2: { margin: SPACING_S },
  mt0: { marginTop: SPACING_XXS },
  mt1: { marginTop: SPACING_XS },
  mt2: { marginTop: SPACING_S },
  // ...
  flex1: { flex: 1 },
  flex2: { flex: 2 },
  flex3: { flex: 3 },
  // ...
  dark_blue: { color: COLOR_DARK_BLUE },
  gray_blue: { color: COLOR_GRAY_BLUE },
  teal: { color: COLOR_TEAL },
  // ...
  bg_dark_blue: { backgroundColor: COLOR_DARK_BLUE },
  bg_gray_blue: { backgroundColor: COLOR_GRAY_BLUE },
  bg_teal: { backgroundColor: COLOR_TEAL },
  // ...
  o_100: { opacity: 1 },
  o_90: { opacity: 0.9 },
  o_80: { opacity: 0.8 },
  // ...
});