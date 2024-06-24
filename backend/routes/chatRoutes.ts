import { Router } from 'express';
import { handleChatRequest, getChatHistoryController } from '../controllers/chatController';

const router = Router();

router.post('/chat', handleChatRequest);
router.get('/history', getChatHistoryController);

export default router;
