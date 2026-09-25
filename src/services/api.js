const BASE_URL = import.meta.env.VITE_API_URL || '/api/library';

async function handleResponse(response) {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = data?.message || data?.error || (typeof data === 'string' ? data : `HTTP ${response.status}`);
    throw new Error(message);
  }

  return data;
}

export async function getLibrary() {
  const response = await fetch(BASE_URL);
  return handleResponse(response);
}

export async function addGameToLibrary(gameData) {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(gameData),
  });
  return handleResponse(response);
}
