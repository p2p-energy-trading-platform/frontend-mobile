export function getGreeting(date = new Date()) {
  const hour = date.getHours();

  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function formatDateTime(date = new Date()) {
  const day = date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const time = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  return `${day} · ${time}`;
}
