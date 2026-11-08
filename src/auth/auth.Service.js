import crypto from 'crypto';
import { findUserByUsernameOrEmail, findUserByUsername, findUserByEmail, createUser } from './auth.Repository.js';
import { hash, hash_compare } from '../utils/hasing.js';
import redis from '../utils/redis.js';
const SESSION_TTL_SECONDS = Number(process.env.SESSION_TTL_SECONDS) || 86400;

export const loginUser = async ({ identifier, password, tenant }) => {
    if (!identifier || !password) {
        const error = new Error('Username/email and password are required');
        error.statusCode = 400;
        throw error;
    }

    if (typeof identifier !== 'string' || identifier.length > 100 || typeof password !== 'string' || password.length > 128) {
        const error = new Error('Invalid input length');
        error.statusCode = 400;
        throw error;
    }

    const trimmedIdentifier = identifier.trim();
    const user = await findUserByUsernameOrEmail(trimmedIdentifier);

    const hashToCompare = user ? user.password : 'passsword';
    const isPasswordValid = await hash_compare(password, hashToCompare);

    if (!user || user.tenantId !== tenant.id || !isPasswordValid) {
        const error = new Error('Invalid username/email or password');
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
            username: user.username,
            email: user.email
        }
    };
};

export const logoutUser = async ({ session }) => {
    if (!session || typeof session !== 'string' || session.trim().length === 0) {
        const error = new Error('Session is required');
        error.statusCode = 400;
        throw error;
    }

    const sessionKey = `session:${session.trim()}`;

    const exists = await redis.exists(sessionKey);
    if (!exists) {
        const error = new Error('Session not found or already expired');
        error.statusCode = 401;
        throw error;
    }

    await redis.del(sessionKey);
};

export const registerUser = async ({ username, email, password, tenant }) => {

    if (!username || !email || !password) {
        const error = new Error('Username, email, and password are required');
        error.statusCode = 400;
        throw error;
    }

    if (typeof username !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
        const error = new Error('Invalid input format');
        error.statusCode = 400;
        throw error;
    }

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (trimmedUsername.length < 3 || trimmedUsername.length > 50) {
        const error = new Error('Username must be between 3 and 50 characters');
        error.statusCode = 400;
        throw error;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (trimmedEmail.length > 100 || !emailRegex.test(trimmedEmail)) {
        const error = new Error('Invalid email format');
        error.statusCode = 400;
        throw error;
    }

    if (password.length < 8 || password.length > 128) {
        const error = new Error('Password must be between 8 and 128 characters');
        error.statusCode = 400;
        throw error;
    }

    const existingUsername = await findUserByUsername(trimmedUsername);
    const existingEmail = await findUserByEmail(trimmedEmail);
    if (existingUsername || existingEmail) {
        const error = new Error('Username or email already in use');
        error.statusCode = 409;
        throw error;
    }

    const hashedPassword = await hash(password);

    const newUser = await createUser({
        tenantId: tenant.id,
        username: trimmedUsername,
        email: trimmedEmail,
        password: hashedPassword
    });

    return {
        username: newUser.username,
        email: newUser.email
    };
};

