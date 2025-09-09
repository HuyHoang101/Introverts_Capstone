// src/hooks/useCurrentUser.ts
import { useEffect, useState } from 'react';
// 👇 sửa import này cho khớp project của bạn
import { getUserInfo } from '@/service/authService';

export type CurrentUser = {
  id: string;
  name?: string;
  email?: string;
  role?: string;
};

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setErr] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const u = await getUserInfo(); // ví dụ trả { id, name, email, role, ... }
        if (mounted) setUser(u ?? null);
      } catch (e: any) {
        if (mounted) setErr(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return { user, loading, error };
}
