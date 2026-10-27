export const dashboardData = {
  userName: 'Sara',
  initials: 'SA',
  unreadCount: 3,
  property: 'Villa 47 · JLT Zone 4',
  meterStatus: 'Meter online',

  position: {
    title: "Today's energy position",
    badge: 'Surplus',
    value: '+12.4',
    unit: 'kWh',
    stats: [
      { label: 'Generated', value: '42.6 kWh', highlight: true },
      { label: 'Consumed', value: '30.2 kWh' },
      { label: 'Exported', value: '8.4 kWh' },
      { label: 'Imported', value: '0 kWh' },
    ],
  },

  summary: [
    { key: 'wallet', icon: 'account-balance-wallet', label: 'Wallet balance', value: 'AED 284.50' },
    { key: 'battery', icon: 'battery-charging-full', label: 'Battery SoC', value: '94%' },
  ],

  slot: {
    label: 'Current 30-min slot',
    time: '14:30 – 15:00',
    remaining: '18:19 remaining',
    price: 'AED 0.38',
    unit: 'per kWh · zone price',
  },
} as const;
