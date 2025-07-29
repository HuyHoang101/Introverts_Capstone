const BASE_URL = 'http://3.1.196.234:5000/api/electricity-data';

const request = async (url: string, options: RequestInit = {}) => {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Error ${res.status}: ${err}`);
  }

  return res.json();
};

export default request;
