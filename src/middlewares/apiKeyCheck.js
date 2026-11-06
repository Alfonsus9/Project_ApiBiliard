import { sendErrorResponse } from '../utils/sendResponse.js';
import prisma from '../utils/prisma.js';

export default function checkApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
        return sendErrorResponse(res, 401, 'API key is missing');
    }

    prisma.tenant.findUnique({ where: { api_key: apiKey } })
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
