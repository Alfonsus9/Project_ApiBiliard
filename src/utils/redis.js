import Redis from 'ioredis';
import 'dotenv/config';

const redis = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
        if (times > 5) {
            return null;
        }
        return Math.min(times * 100, 2000);
    }
});

redis.on('error', (err) => {
    console.error('Redis error:', err.message);
});

export default redis;
