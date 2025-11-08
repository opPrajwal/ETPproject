import express from 'express';
import { getChats, createChat, postMessage } from '../controllers/chatController.js';

const router = express.Router();

router.get('/', getChats);
router.post('/', createChat);
router.post('/:chatId/messages', postMessage);

export default router;
