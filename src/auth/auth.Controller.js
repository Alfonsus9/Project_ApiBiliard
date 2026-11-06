import { loginUser } from './auth.Service.js';
import { sendSuccessResponse, sendErrorResponse } from '../utils/sendResponse.js';

export const login = async (req, res) => {
    try {
        const { username, email, identifier, password } = req.body || {};
        const userIdentifier = username || email || identifier;

        if (!userIdentifier || !password) {
            return sendErrorResponse(res, 400, 'Username/email and password are required');
        }

        const result = await loginUser({
            identifier: userIdentifier,
            password,
            tenant: req.tenant
        });

        return sendSuccessResponse(res, 200, result, 'Login successful');
    } catch (error) {
        console.error('Error during login:', error);
        const statusCode = error.statusCode || 500;
        return sendErrorResponse(res, statusCode, error.message || 'Internal server error');
    }
};

export default {
    login
};

