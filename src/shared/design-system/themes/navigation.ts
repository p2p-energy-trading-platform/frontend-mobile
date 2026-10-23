import { DarkTheme, DefaultTheme, type Theme } from 'expo-router';

import { darkTheme } from './dark';
import { lightTheme } from './light';

export const NavigationLightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: lightTheme.accent,
    background: lightTheme.background,
    card: lightTheme.surface,
    text: lightTheme.text,
    border: lightTheme.border,
    notification: lightTheme.error,
  },
};

export const NavigationDarkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: darkTheme.accent,
    background: darkTheme.background,
    card: darkTheme.surface,
    text: darkTheme.text,
    border: darkTheme.border,
    notification: darkTheme.error,
  },
};
