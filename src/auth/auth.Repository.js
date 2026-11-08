import prisma from '../utils/prisma.js';

export const findUserByUsernameOrEmail = async (identifier) => {
    return await prisma.user.findFirst({
        where: {
            OR: [
                { email: identifier },
                { username: identifier }
            ]
        }
    });
};

export const findUserByUsername = async (username) => {
    return await prisma.user.findUnique({ where: { username } });
};

export const findUserByEmail = async (email) => {
    return await prisma.user.findUnique({ where: { email } });
};

export const createUser = async ({ tenantId, username, email, password }) => {
    return await prisma.user.create({
        data: { tenantId, username, email, password }
    });
};

