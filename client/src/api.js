export async function api(path, options = {}) {
  const response = await fetch(`/api${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...options.headers }, signal: options.signal || AbortSignal.timeout(12000) });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data) throw new Error(data?.message || 'The service is unavailable. Please try again.');
  return data;
}
