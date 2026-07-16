import { Palette } from '../tokens';
import type { Theme } from './types';

export const lightTheme: Theme = {
  background: Palette.common.white,

  surface: Palette.common.white,
  surfaceAlt: Palette.neutral[50],
  surfaceSecondary: Palette.neutral[100],

  text: Palette.common.black,
  textSecondary: Palette.neutral[600],
  textDisabled: Palette.neutral[400],

  primary: Palette.common.black,
  primaryForeground: Palette.common.white,

  border: Palette.neutral[300],
  divider: Palette.neutral[200],

  success: Palette.green[500],
  warning: Palette.yellow[500],
  error: Palette.red[500],

  icon: Palette.neutral[800],

  tabBarBackground: Palette.common.white,
  tabBarInactive: Palette.neutral[500],
  tabBarActive: Palette.common.black,

  overlay: 'rgba(0,0,0,0.5)',
};
