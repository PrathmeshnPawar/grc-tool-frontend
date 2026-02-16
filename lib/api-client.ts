// lib/api-client.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8085';

export async function fetcher<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    credentials: 'include', // Mandatory for session cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (res.status === 401) {
    // If the backend returns 401, the user is unauthenticated
    throw new Error('UNAUTHORIZED');
  }

  if (!res.ok) throw new Error('API_ERROR');
  return res.json();
}