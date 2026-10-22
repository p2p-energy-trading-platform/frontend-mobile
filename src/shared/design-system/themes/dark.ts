import { Palette } from '../tokens';
import type { Theme } from './types';

export const darkTheme: Theme = {
  /* Background */

  background: '#0C1424',

  surface: '#152035',
  surfaceAlt: Palette.navy[800],
  surfaceSecondary: '#1C2E48',
  popover: '#1A2C47',
  fill: '#1A2840',

  /* Text */

  text: '#E2EAF4',
  textSecondary: '#A8BDD4',
  textTertiary: Palette.navy[400],
  textPlaceholder: '#6B7686',
  textDisabled: Palette.navy[600],
  textInverse: Palette.common.white,

  /* Actions */

  primary: Palette.common.white,
  primaryForeground: Palette.navy[900],

  accent: Palette.teal[600],
  accentForeground: Palette.common.white,

  secondary: '#1C2E48',
  secondaryForeground: '#C8D6E8',

  /* Border */

  border: '#94B4DC19',
  borderSubtle: '#94B4DC0F',
  borderStrong: '#94B4DC2D',
  borderInput: '#94B4DC23',
  divider: '#94B4DC0F',

  /* Form */

  inputBackground: '#1C2E48',
  switchBackground: '#374151',
  focusRing: Palette.teal[600],

  /* Status */

  success: Palette.green[500],
  warning: Palette.amber[500],
  error: Palette.red[500],
  errorForeground: Palette.common.white,

  feedback: {
    success: {
      background: '#10B9811E',
      border: '#10B98147',
      text: '#6EE7B7',
      title: Palette.green[200],
      icon: Palette.green[500],
    },
    warning: {
      background: '#F59E0B1E',
      border: '#F59E0B47',
      text: '#FCD34D',
      title: Palette.amber[200],
      icon: Palette.amber[500],
    },
    error: {
      background: '#EF44441E',
      border: '#EF444447',
      text: '#FCA5A5',
      title: Palette.red[200],
      icon: Palette.red[500],
    },
    info: {
      background: '#3B82F61E',
      border: '#3B82F647',
      text: '#93C5FD',
      title: Palette.blue[200],
      icon: Palette.blue[500],
    },
  },

  /* Trade */

  trade: {
    buyBackground: '#3B82F623',
    buyText: '#93C5FD',
    sellBackground: '#10B98123',
    sellText: '#6EE7B7',
    zoneBackground: '#94B4DC19',
    zoneText: '#C8D6E8',
    amberBackground: '#F59E0B23',
    amberText: '#FCD34D',
  },

  /* Charts */

  chart: [
    Palette.teal[600],
    Palette.blue[400],
    Palette.amber[400],
    Palette.purple[400],
    Palette.red[400],
  ],

  /* Misc */

  icon: '#A8BDD4',

  skeletonFrom: '#162032',
  skeletonVia: '#1C2A42',

  walletHeroBackground: Palette.navy[800],

  tabBarBackground: '#080F1E',
  tabBarInactive: Palette.navy[400],
  tabBarActive: Palette.teal[500],

  overlay: '#040914A5',
};
