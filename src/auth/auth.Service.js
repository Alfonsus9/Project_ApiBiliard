import crypto from 'crypto';
import { findUserByUsernameOrEmail } from './auth.Repository.js';
import { hash, hash_compare } from '../utils/hasing.js';
import redis from '../utils/redis.js';

const SESSION_TTL_SECONDS = 86400;

export const loginUser = async ({ identifier, password, tenant }) => {
    if (!identifier || !password) {
        const error = new Error('Username/email and password are required');
        error.statusCode = 400;
        throw error;
    }

    const user = await findUserByUsernameOrEmail(identifier);
    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }

    if (user.tenantId !== tenant.id) {
        const error = new Error('User does not belong to this tenant');
        error.statusCode = 403;
        throw error;
    }

    const hashedPassword = hash(password);
    const isPasswordValid = hash_compare(hashedPassword, user.password);
    if (!isPasswordValid) {
        const error = new Error('Invalid password');
        error.statusCode = 401;
        throw error;
    }

    const sessionId = crypto.randomUUID();
    const sessionKey = `session:${sessionId}`;

    await redis.hset(sessionKey, {
        id: user.id,
        username: user.username,
        email: user.email,
        tenantId: user.tenantId
    });
    await redis.expire(sessionKey, SESSION_TTL_SECONDS);

    return {
        session: sessionId,
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            tenantId: user.tenantId
        }
    };
};

