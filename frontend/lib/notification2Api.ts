// frontend/lib/notification2Api.ts
const BASES = [
  'https://greensyncintroverts.online/api/notification2',
];

async function tryFetch(url: string, init?: RequestInit) {
  for (const base of BASES) {
    try {
      const res = await fetch(`${base}${url}`, {
        headers: { 'Content-Type': 'application/json' },
        ...init,
      });
      if (res.ok) return await res.json();
      // nếu 404 hoặc 405 -> thử base tiếp theo
      if (res.status === 404 || res.status === 405) continue;
      // các lỗi khác: ném để nhìn rõ
      const txt = await res.text().catch(() => '');
      throw new Error(`Error ${res.status}: ${txt || res.statusText}`);
    } catch (e) {
      // thử base tiếp
      continue;
    }
  }
  // không có base nào tồn tại -> coi như chưa triển khai backend => trả rỗng/ok
  return null;
}

export async function getNotif2ByUser(userId: string) {
  if (!userId) return [];
  const data = await tryFetch(`/user/${encodeURIComponent(userId)}`, { method: 'GET' });
  return data ?? [];
}

export async function getNotif2All() {
  const data = await tryFetch(`/`, { method: 'GET' });
  return data ?? [];
}

export async function patchNotif2Read(id: string) {
  // ưu tiên /:id/read; fallback PUT /:id
  const ok1 = await tryFetch(`/${encodeURIComponent(id)}/read`, {
    method: 'PATCH',
    body: JSON.stringify({ read: true }),
  });
  if (ok1 !== null) return ok1;
  const ok2 = await tryFetch(`/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify({ readAt: new Date().toISOString() }),
  });
  return ok2 ?? { ok: false };
}

export async function markAllNotif2Read(userId?: string) {
  const ok = await tryFetch(`/mark-all-read`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
  return ok ?? { count: 0 };
}
