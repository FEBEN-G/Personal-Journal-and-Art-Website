const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const fetchJournalEntries = async () => {
  const res = await fetch(`${API_URL}/journal`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch journal entries');
  return res.json();
};

export const fetchJournalEntry = async (id: string) => {
  const res = await fetch(`${API_URL}/journal/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch journal entry');
  return res.json();
};

export const fetchVerses = async () => {
  const res = await fetch(`${API_URL}/verses`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch verses');
  return res.json();
};

export const fetchArt = async () => {
  const res = await fetch(`${API_URL}/art`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch art pieces');
  return res.json();
};
