import express from 'express';
const router = express.Router();
import checkApiKey from '../middlewares/apiKeyCheck.js';

router.get('/test', checkApiKey, (req, res) => {
    res.send('Auth Router is working!');
});
export default router;