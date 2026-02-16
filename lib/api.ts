// lib/api.ts
export const apiFetch = async (endpoint: string, options: any = {}) => {
  const res = await fetch(`http://localhost:8085${endpoint}`, {
    ...options,
    // REQUIRED: This tells the browser to include the JSESSIONID cookie
    credentials: 'include', 
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  // Handle the 401 as a "not logged in" state
  if (res.status === 401) return null; 
  
  if (!res.ok) throw new Error('API request failed');
  return res.json();
};