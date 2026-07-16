import { Palette } from '../tokens';
import type { Theme } from './types';

export const darkTheme: Theme = {
  background: Palette.common.black,

  surface: Palette.neutral[950],
  surfaceAlt: Palette.neutral[800],
  surfaceSecondary: Palette.neutral[900],

  text: Palette.common.white,
  textSecondary: Palette.neutral[400],
  textDisabled: Palette.neutral[600],

  primary: Palette.common.white,
  primaryForeground: Palette.common.black,

  border: Palette.neutral[800],
  divider: Palette.neutral[900],

  success: Palette.green[500],
  warning: Palette.yellow[500],
  error: Palette.red[500],

  icon: Palette.neutral[300],

  tabBarBackground: Palette.common.black,
  tabBarInactive: Palette.neutral[500],
  tabBarActive: Palette.common.white,

  overlay: 'rgba(0,0,0,0.7)',
};