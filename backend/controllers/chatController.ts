import { Request, Response } from 'express';
import { getChatResponse, getChatHistory } from '../services/chatService';

export const handleChatRequest = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    const response = await getChatResponse(message);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getChatHistoryController = async (req: Request, res: Response) => {
  try {
    const history = await getChatHistory();
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
