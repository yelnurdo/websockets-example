import { WebSocket } from 'ws';
import { streamChatResponse, getChatHistory } from '../services/chatService';

export const handleChatWebSocket = async (ws: WebSocket) => {
  console.log('New WebSocket connection established');

  // Send existing chat history to the client
  const chatHistory = await getChatHistory();
  ws.send(JSON.stringify(chatHistory));

  ws.on('message', async (message: string) => {
    const userMessage = message.toString() || '';
    let fullBotResponse = '';

    // Stream chat response
    await streamChatResponse(userMessage, (data) => {
      fullBotResponse += data;
      ws.send(JSON.stringify([{ userMessage, botResponse: fullBotResponse }]));
    });

    // Fetch the updated chat history and send it to the client
    const updatedChatHistory = await getChatHistory();
    ws.send(JSON.stringify(updatedChatHistory));
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
};
