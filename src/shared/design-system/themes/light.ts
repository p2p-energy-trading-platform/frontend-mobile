import { Palette } from '../tokens';
import type { Theme } from './types';

export const lightTheme: Theme = {
  /* Background */

  background: '#F6F8FB',

  surface: Palette.common.white,
  surfaceAlt: Palette.navy[50],
  surfaceSecondary: Palette.navy[100],
  popover: Palette.common.white,
  fill: Palette.navy[50],

  /* Text */

  text: Palette.navy[900],
  textSecondary: Palette.navy[700],
  textTertiary: Palette.navy[500],
  textPlaceholder: Palette.navy[300],
  textDisabled: Palette.navy[300],
  textInverse: Palette.common.white,

  /* Actions */

  primary: Palette.navy[900],
  primaryForeground: Palette.common.white,

  accent: Palette.teal[600],
  accentForeground: Palette.common.white,

  secondary: Palette.navy[100],
  secondaryForeground: Palette.navy[900],

  /* Border */

  border: '#0D1B3619',
  borderSubtle: '#0D1B360F',
  borderStrong: '#0D1B362D',
  borderInput: '#0D1B361E',
  divider: '#0D1B360F',

  /* Form */

  inputBackground: Palette.common.white,
  switchBackground: '#C5CEDC',
  focusRing: Palette.teal[600],

  /* Status */

  success: Palette.green[500],
  warning: Palette.amber[500],
  error: Palette.red[600],
  errorForeground: Palette.common.white,

  feedback: {
    success: {
      background: Palette.green[50],
      border: Palette.green[200],
      text: Palette.green[800],
      title: '#064E3B',
      icon: Palette.green[500],
    },
    warning: {
      background: Palette.amber[50],
      border: Palette.amber[200],
      text: Palette.amber[800],
      title: '#78350F',
      icon: Palette.amber[500],
    },
    error: {
      background: Palette.red[50],
      border: Palette.red[200],
      text: Palette.red[800],
      title: '#7F1D1D',
      icon: Palette.red[500],
    },
    info: {
      background: Palette.blue[50],
      border: Palette.blue[200],
      text: Palette.blue[800],
      title: '#1E3A8A',
      icon: Palette.blue[500],
    },
  },

  /* Trade */

  trade: {
    buyBackground: Palette.blue[50],
    buyText: Palette.blue[800],
    sellBackground: Palette.green[50],
    sellText: Palette.green[800],
    zoneBackground: Palette.navy[50],
    zoneText: Palette.navy[900],
    amberBackground: Palette.amber[50],
    amberText: Palette.amber[800],
  },

  /* Charts */

  chart: [
    Palette.teal[600],
    Palette.navy[900],
    Palette.amber[500],
    Palette.blue[500],
    Palette.purple[500],
  ],

  /* Misc */

  icon: Palette.navy[700],

  skeletonFrom: Palette.navy[100],
  skeletonVia: '#E0EAF4',

  walletHeroBackground: Palette.navy[900],

  tabBarBackground: Palette.common.white,
  tabBarInactive: Palette.navy[500],
  tabBarActive: Palette.teal[600],

  overlay: '#0D1B3672',
};
