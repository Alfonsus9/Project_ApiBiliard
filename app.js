import express from 'express';
const app = express();
import authRouter from './src/auth/auth.Router.js';

app.use('/auth', authRouter);

export default app;