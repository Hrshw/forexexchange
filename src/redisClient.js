const redis = require('redis');
const redisUrl = "redis://192.168.30.192:6379"
const redisClient = redis.createClient(redisUrl);

redisClient.on('connect', () => {
  console.log('Redis client connected');
});

redisClient.on('error', (error) => {
  console.error('Redis client error:', error);
});

module.exports = redisClient;
