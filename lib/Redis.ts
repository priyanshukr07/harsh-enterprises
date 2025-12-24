import { Redis } from "ioredis";

export const client = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  tls: {
    rejectUnauthorized: false,
  },
});
if (process.env.REDIS_URL) {
  client.on("connect", () => {
    console.log("Redis client successfully connected");
  });

  client.on("error", (error) => {
    console.error("Redis client encountered an error:", error);
  });
}
