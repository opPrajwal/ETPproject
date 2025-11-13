import express from 'express';
import { getChatMessages ,createChat, getChats, sendMessage as postMessage} from '../controllers/chatController.js';

const router = express.Router();
import { protect } from '../middleware/authMiddleware.js';
router.use(protect)
router.get('/getchats', getChats);
router.post('/', createChat);
router.get('/:chatId/messages', getChatMessages);
router.post('/:chatId/messages', postMessage);

export default router;
