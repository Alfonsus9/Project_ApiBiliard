import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const SALT_ROUNDS = 10;

export const hash = async (string) => {
    return await bcrypt.hash(string, SALT_ROUNDS);
};

export const hash_compare = async (plainPassword, hashedPassword) => {
    if (!plainPassword || !hashedPassword) return false;

    if (hashedPassword.startsWith('$2a$') || hashedPassword.startsWith('$2b$') || hashedPassword.startsWith('$2y$')) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    try {
        const sha256 = crypto.createHash('sha256').update(plainPassword).digest('hex');
        if (sha256.length !== hashedPassword.length) return false;
        return crypto.timingSafeEqual(Buffer.from(sha256), Buffer.from(hashedPassword));
    } catch {
        return false;
    }
};
