// hooks/useCountdown.ts
import { useEffect, useState } from 'react';

export function useCountdown(target: Date) {
  const [sec, setSec] = useState(() =>
    Math.max(0, Math.floor((target.getTime() - Date.now()) / 1000))
  );
  useEffect(() => {
    const t = setInterval(() => setSec((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = String(Math.floor(sec / 60)).padStart(2, '0');
  const ss = String(sec % 60).padStart(2, '0');
  return { sec, label: `${mm}:${ss}` };
}
