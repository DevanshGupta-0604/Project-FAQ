import redisClient from "../config/redis";

/**
 * Set cached translation to Redis.
 *
 * @param {String} key - The Redis key for the translation.
 * @param {Object} value - The translation object to cache.
 * @param {Number} expiry - Cache expiry time in seconds (optional, default 1 day).
 * @returns {Promise<void>} - Resolves when the translation is cached.
 */
export const setCachedTranslation = (key, value) => {
  return new Promise(async (resolve, reject) => {
    await redisClient
      .hSet(key, value)
      .then(() => resolve())
      .catch((err) => {
        console.log(`Redis Cache setting error: ${err.message}`);
        reject();
      });
  });
};

/**
 * Get cached translation from Redis.
 *
 * @param {String} key - The Redis key for the translation.
 * @param {Object} value - The translation object to cache.
 * @param {Number} expiry - Cache expiry time in seconds (optional, default 1 day).
 * @returns {Object} - Resolves when the translation is cached.
 */
export const getCachedTranslation = async (key) => {
  const cachedTranslation = await redisClient.hGetAll(key);
  return cachedTranslation;
};
