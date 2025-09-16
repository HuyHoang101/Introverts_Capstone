const BASE_URL = 'https://greensyncintroverts.online';
// Tạo report mới
// ví dụ
export type AddReportPayload = {
  problem: string;
  location: string;
  description: string;
  title: string;      // category/selected
  content: string | null;
  published: boolean;
  userId: string;     // ✅ quan trọng
};

export type AddReportResponse = {
  report: { id: string; /* ...các field khác của Post*/ };
  suggestion?: string;
};

export async function addReport(payload: AddReportPayload, token?: string): Promise<AddReportResponse> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`; // nếu có auth
  }
  const res = await fetch(`${BASE_URL}/api/reports`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    // đẩy thông điệp backend ra cho dễ debug (vd: {"error":"Missing userId"})
    throw new Error(`Error ${res.status}: ${text || res.statusText}`);
  }

  const data = await res.json();
  // backend trả { report, suggestion }
  return {
    report: data?.report,
    suggestion: data?.suggestion,
  };
}


