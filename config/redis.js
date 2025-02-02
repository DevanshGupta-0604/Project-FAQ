import redis from "redis";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env

let clientRedis;

(async () => {
  clientRedis = redis.createClient({
    url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${
      process.env.REDIS_HOST
    }:${process.env.REDIS_PORT || 6379}`,
  });

  clientRedis.on("error", (err) => console.log("Redis Client Error: " + err));
  await clientRedis.connect();
})();

export default clientRedis;