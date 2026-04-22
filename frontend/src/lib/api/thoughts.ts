import type { ThoughtCreate, ThoughtUpdate, ThoughtResponse } from '@/types/thought';

const BASE_URL = 'http://localhost:8000';

function authHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const token = localStorage.getItem('affinity_token');
  return {
    ...extra,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function createThought(payload: ThoughtCreate): Promise<ThoughtResponse> {
  const res = await fetch(`${BASE_URL}/thoughts`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Failed to create thought (${res.status})`);
  return res.json();
}

export async function listMyThoughts(): Promise<ThoughtResponse[]> {
  const res = await fetch(`${BASE_URL}/thoughts/me`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch thoughts');
  return res.json();
}

export async function getThought(id: number): Promise<ThoughtResponse> {
  const res = await fetch(`${BASE_URL}/thoughts/${id}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch thought');
  return res.json();
}

export async function updateThought(id: number, payload: ThoughtUpdate): Promise<ThoughtResponse> {
  const res = await fetch(`${BASE_URL}/thoughts/${id}`, {
    method: 'PATCH',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update thought');
  return res.json();
}

export async function recalculatePosition(): Promise<{ x: number; y: number }> {
  const res = await fetch('http://localhost:8000/api/v1/map/recalculate', {
    method: 'POST',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to recalculate position (${res.status})`);
  return res.json();
}

export async function deleteThought(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/thoughts/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete thought');
}
