export const homeStats = [
  { value: '142.85 MWh', label: 'Energy traded' },
  { value: '2,418', label: 'Market orders' },
  { value: '98.7%', label: 'Grid sync health' },
] as const;

export const homeFeatures = [
  {
    title: 'Live Energy Market',
    description:
      'Track buy and sell activity across local energy pools in one focused view.',
    accent: 'trade',
  },
  {
    title: 'Smart Meter Ready',
    description:
      'Keep the screen aligned with verified production, usage, and settlement events.',
    accent: 'meter',
  },
  {
    title: 'Battery & Solar Aware',
    description:
      'Surface storage, generation, and grid state together for quick operational checks.',
    accent: 'energy',
  },
  {
    title: 'Feature Driven',
    description:
      'Route-first screens stay thin while feature modules own the actual UI and data.',
    accent: 'structure',
  },
] as const;

export const projectStructure = [
  {
    path: 'src/app/',
    description: 'Expo Router route entry points stay small and navigation-focused.',
  },
  {
    path: 'src/features/home/',
    description: 'Home screen data, components, and layout live together here.',
  },
  {
    path: 'src/components/',
    description: 'Reusable UI primitives continue to power multiple features.',
  },
  {
    path: 'src/constants/',
    description: 'Theme tokens and shared values remain centralized.',
  },
] as const;
