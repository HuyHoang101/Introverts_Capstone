const BASE_URL = 'https://greensyncintroverts.online/api/tables';

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

export default request;

function fetchWithTimeout(resource: string, options: RequestInit = {}, timeout = 10000): Promise<Response> {
  return Promise.race([
    fetch(resource, options),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error('⏱ Request timed out')), timeout)
    ),
  ]);
}
