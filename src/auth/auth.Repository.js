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

