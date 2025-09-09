const BASE_URL = 'https://greensyncintroverts.online/api/auth/verify'; // URL cho verify API

const request = async (url: string, options: RequestInit = {}) => {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}${url}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Error ${res.status}: ${err}`);
    }

    return res.json();
  } catch (error) {
    console.error("❌ Request error:", error);
    throw error;
  }
};

// Gửi yêu cầu xác nhận email
export const requestVerifyApi = async (email: string) => {
  const res = await request('/request', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
  return res;
};

// Tiêu thụ token xác nhận
export const consumeVerifyApi = async (token: string) => {
  const res = await request(`/consume?token=${token}`, {
    method: 'GET',
  });
  return res;
};

// fetch với timeout như bạn đã có
function fetchWithTimeout(resource: string, options: RequestInit = {}, timeout = 10000): Promise<Response> {
  return Promise.race([
    fetch(resource, options),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error('⏱ Request timed out')), timeout)
    ),
  ]);
}
