const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper for resilient fetching with retries (max 3 attempts)
const fetchWithRetry = async (url: string, options: any, retries = 3, backoff = 3000) => {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    if (retries > 0) {
      console.warn(`Fetch failed, retrying in ${backoff}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff + 2000);
    }
    throw err;
  }
};

export const fetchJournalEntries = async () => {
  return fetchWithRetry(`${API_URL}/journal`, { cache: 'no-store' });
};

export const fetchJournalEntry = async (id: string) => {
  return fetchWithRetry(`${API_URL}/journal/${id}`, { cache: 'no-store' });
};

export const fetchVerses = async () => {
  return fetchWithRetry(`${API_URL}/verses`, { cache: 'no-store' });
};

export const fetchArt = async () => {
  return fetchWithRetry(`${API_URL}/art`, { cache: 'no-store' });
};
