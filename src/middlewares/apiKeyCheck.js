import { sendErrorResponse } from '../utils/sendResponse.js';
import prisma from '../utils/prisma.js';

export default function checkApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length === 0 || apiKey.length > 256) {
        return sendErrorResponse(res, 401, 'API key is missing or invalid');
    }

    prisma.tenant.findUnique({ where: { api_key: apiKey.trim() } })
        .then(apiKeyRecord => {
            if (!apiKeyRecord) {
                return sendErrorResponse(res, 401, 'Invalid API key');
            }
            req.tenant = apiKeyRecord;
            next();
        })
        .catch(error => {
            console.error('Error checking API key:', error);
            return sendErrorResponse(res, 500, 'Internal server error');
        });
}
