import express from 'express';
const router = express.Router();
import checkApiKey from '../middlewares/apiKeyCheck.js';
import authController from './auth.Controller.js';
import { loginRateLimiter, registerRateLimiter } from '../middlewares/rateLimiter.js';

router.get('/test', checkApiKey, (req, res) => {
    res.send('Auth Router is working!');
});

router.post('/login', loginRateLimiter, checkApiKey, authController.login);

router.post('/register', registerRateLimiter, checkApiKey, authController.register);

router.post('/logout', authController.logout);

export default router;
