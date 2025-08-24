const BASE_URL = 'https://greensyncintroverts.online/api/auth';

export const loginApi = async (email: string, password: string) => {
  const res = await fetchWithTimeout(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data; // { token, user }
};

export const registerApi = async (payload: {
  email: string;
  password: string;
  name: string;
}) => {
  const res = await fetchWithTimeout(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Register failed');
  return data; // { message, user }
};

function fetchWithTimeout(resource: string, options: RequestInit = {}, timeout = 10000): Promise<Response> {
  return Promise.race([
    fetch(resource, options),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error('⏱ Request timed out')), timeout)
    ),
  ]);
}
