const BASE_URL = 'https://introvertscapstone-productions.up.railway.app/api/pollution-data';

const request = async (url: string, options: RequestInit = {}) => {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    mode: 'cors',
    ...options,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Error ${res.status}: ${err}`);
  }

  return res.json();
};

export default request;
