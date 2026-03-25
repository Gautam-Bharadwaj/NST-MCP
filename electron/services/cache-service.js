import Store from 'electron-store';

const store = new Store();

export const getCachedData = (key, ttlMs = 300000) => {
  const cached = store.get(key);
  if (!cached) return null;

  const { timestamp, data } = cached;
  // If data is older than TTL, invalidate it
  if (Date.now() - timestamp > ttlMs) {
    store.delete(key);
    return null;
  }
  return data;
};

export const setCachedData = (key, data) => {
  store.set(key, { timestamp: Date.now(), data });
};

export const clearCache = (key) => {
  if (key) {
    store.delete(key);
  } else {
    store.clear();
  }
};
