import express from 'express';
const router = express.Router();
import checkApiKey from '../middlewares/apiKeyCheck.js';
import authController from './auth.Controller.js';

router.get('/test', checkApiKey, (req, res) => {
    res.send('Auth Router is working!');
});

router.post('/login', checkApiKey, authController.login);

export default router;
