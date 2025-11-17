// backend/routes/chatbotRoutes.js
import express from 'express';
import { postMessage } from '../controllers/chatbotController.js';
const router = express.Router();

// POST /api/chatbot/message
router.post('/message', postMessage);

export default router;
