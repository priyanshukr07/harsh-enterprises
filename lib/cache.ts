import { client } from "./Redis";

export const getCache = async (key: string) => {
  if (!client) return null;
  try {
    return await client.get(key);
  } catch {
    console.warn("[Redis] Cache read failed for key:", key);
    return null;
  }
};

export const setCache = async (key: string, value: string, ttl = 3600) => {
  if (!client) return;
  try {
    await client.setex(key, ttl, value);
  } catch {
    console.warn("[Redis] Cache write failed for key:", key);
  }
};

export const deleteCache = async (...keys: string[]) => {
  if (!client) return;
  try {
    await client.del(...keys);
  } catch {
    console.warn("[Redis] Cache delete failed for keys:", keys);
  }
};

export const deleteCacheByPattern = async (pattern: string) => {
  if (!client) return;
  try {
    const keys = await client.keys(pattern);
    if (keys.length > 0) await client.del(...keys);
  } catch {
    console.warn("[Redis] Cache pattern delete failed:", pattern);
  }
};