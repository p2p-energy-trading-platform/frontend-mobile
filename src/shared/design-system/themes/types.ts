export interface FeedbackColors {
  background: string;
  border: string;
  text: string;
  title: string;
  icon: string;
}

export interface Theme {
  /* Background */

  background: string;

  surface: string;
  surfaceAlt: string;
  surfaceSecondary: string;
  popover: string;
  fill: string;

  /* Text */

  text: string;
  textSecondary: string;
  textTertiary: string;
  textPlaceholder: string;
  textDisabled: string;
  textInverse: string;

  /* Actions */

  primary: string;
  primaryForeground: string;

  accent: string;
  accentForeground: string;

  secondary: string;
  secondaryForeground: string;

  /* Border */

  border: string;
  borderSubtle: string;
  borderStrong: string;
  borderInput: string;
  divider: string;

  /* Form */

  inputBackground: string;
  switchBackground: string;
  focusRing: string;

  /* Status */

  success: string;
  warning: string;
  error: string;
  errorForeground: string;

  feedback: {
    success: FeedbackColors;
    warning: FeedbackColors;
    error: FeedbackColors;
    info: FeedbackColors;
  };

  /* Trade */

  trade: {
    buyBackground: string;
    buyText: string;
    sellBackground: string;
    sellText: string;
    zoneBackground: string;
    zoneText: string;
    amberBackground: string;
    amberText: string;
  };

  /* Charts */

  chart: readonly [string, string, string, string, string];

  /* Misc */

  icon: string;

  skeletonFrom: string;
  skeletonVia: string;

  walletHeroBackground: string;

  tabBarBackground: string;
  tabBarInactive: string;
  tabBarActive: string;

  overlay: string;
}
