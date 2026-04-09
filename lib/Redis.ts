import { Redis } from "ioredis";

const createRedisClient = () => {
  if (!process.env.REDIS_URL) {
    console.warn("[Redis] REDIS_URL not set, skipping Redis connection.");
    return null;
  }

  const redis = new Redis(process.env.REDIS_URL, {
    tls: { rejectUnauthorized: false },
    retryStrategy(times) {
      if (times >= 3) {
        console.warn("[Redis] Max retries reached. Running without cache.");
        return null; // stop retrying
      }
      return Math.min(times * 500, 2000); // wait before retry
    },
    lazyConnect: true, // don't connect until first command
    enableOfflineQueue: false, // don't queue commands when disconnected
  });

  redis.on("connect", () => console.log("[Redis] Connected successfully."));
  
  redis.on("error", (error) => {
    console.warn("[Redis] Connection error:", error.message); // warn, not error
  });

  return redis;
};

export const client = createRedisClient();