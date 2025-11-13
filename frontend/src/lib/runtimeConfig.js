let runtimeConfig = null;

export async function loadRuntimeConfig() {
  if (runtimeConfig) return runtimeConfig;
  try {
    const r = await fetch('/runtime-config.json', { cache: 'no-store' });
    runtimeConfig = await r.json();
  } catch (e) {
    runtimeConfig = { API_BASE_URL: '' };
  }
  return runtimeConfig;
}

export function getApiBaseUrl() {
  return runtimeConfig?.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || '';
}
