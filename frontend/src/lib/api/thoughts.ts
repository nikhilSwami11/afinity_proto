import type { ThoughtCreate, ThoughtUpdate, ThoughtResponse } from '@/types/thought';

const BASE_URL = 'http://localhost:8000';

export async function createThought(payload: ThoughtCreate): Promise<ThoughtResponse> {
  const res = await fetch(`${BASE_URL}/thoughts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create thought');
  return res.json();
}

export async function listMyThoughts(): Promise<ThoughtResponse[]> {
  const res = await fetch(`${BASE_URL}/thoughts/me`);
  if (!res.ok) throw new Error('Failed to fetch thoughts');
  return res.json();
}

export async function getThought(id: number): Promise<ThoughtResponse> {
  const res = await fetch(`${BASE_URL}/thoughts/${id}`);
  if (!res.ok) throw new Error('Failed to fetch thought');
  return res.json();
}

export async function updateThought(id: number, payload: ThoughtUpdate): Promise<ThoughtResponse> {
  const res = await fetch(`${BASE_URL}/thoughts/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update thought');
  return res.json();
}

export async function deleteThought(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/thoughts/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete thought');
}
