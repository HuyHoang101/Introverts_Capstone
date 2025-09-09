// lib/chatApi.ts
const BASE_URL = "https://greensyncintroverts.online/api"; // thay bằng URL backend cậu

export const sendMessage = async (message: string) => {
  const response = await fetchWithTimeout(`${BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  const text = await response.text(); // đọc raw text
  try {
    const data = JSON.parse(text);
    return data;
  } catch (err) {
    console.error("Failed to parse JSON:", text);
    throw err;
  }
};


function fetchWithTimeout(resource: string, options: RequestInit = {}, timeout = 10000): Promise<Response> {
  return Promise.race([
    fetch(resource, options),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error('⏱ Request timed out')), timeout)
    ),
  ]);
}