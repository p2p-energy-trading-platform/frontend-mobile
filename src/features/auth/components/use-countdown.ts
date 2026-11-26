import { useEffect, useState } from 'react';

/** Counts down in whole seconds. `secondsLeft` is 0 when no countdown is running. */
export function useCountdown() {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setTimeout(() => setSecondsLeft((seconds) => seconds - 1), 1000);

    return () => clearTimeout(timer);
  }, [secondsLeft]);

  return { secondsLeft, start: setSecondsLeft };
}