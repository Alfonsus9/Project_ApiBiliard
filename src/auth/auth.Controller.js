import { loginUser, registerUser, logoutUser } from './auth.Service.js';
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

        const maxAgeMs = (Number(process.env.SESSION_TTL_SECONDS) || 86400) * 1000;

        res.cookie("session_id", result.session, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: maxAgeMs,
            path: "/"
        });

        return sendSuccessResponse(res, 200, { user: result.user }, 'Login successful');
    } catch (error) {
        console.error('Error during login:', error);
        const statusCode = error.statusCode || 500;
        return sendErrorResponse(res, statusCode, error.message || 'Internal server error');
    }
};

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body || {};

        const result = await registerUser({
            username,
            email,
            password,
            tenant: req.tenant
        });

        return sendSuccessResponse(res, 201, result, 'User registered successfully');
    } catch (error) {
        console.error('Error during register:', error);
        const statusCode = error.statusCode || 500;
        return sendErrorResponse(res, statusCode, error.message || 'Internal server error');
    }
};

export const logout = async (req, res) => {
    try {
        const session = req.cookies?.session_id;

        if (!session || typeof session !== 'string' || session.trim().length === 0) {
            return sendErrorResponse(res, 400, 'Session is required');
        }

        await logoutUser({ session: session.trim() });

        res.clearCookie('session_id', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        });

        return sendSuccessResponse(res, 200, null, 'Logout successful');
    } catch (error) {
        console.error('Error during logout:', error);
        const statusCode = error.statusCode || 500;
        return sendErrorResponse(res, statusCode, error.message || 'Internal server error');
    }
};

export default {
    login,
    register,
    logout
};

