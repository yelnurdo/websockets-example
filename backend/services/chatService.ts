import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import OpenAI from 'openai';
import Chat from '../models/chat';

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('The OPENAI_API_KEY environment variable is missing or empty');
}

const openai = new OpenAI({
  apiKey: apiKey,
});

export const getChatResponse = async (message: string): Promise<string> => {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: message }],
    max_tokens: 150,
  });

  if (!response.choices || !response.choices[0] || !response.choices[0].message || !response.choices[0].message.content) {
    throw new Error('Invalid response from OpenAI');
  }

  const botResponse = response.choices[0].message.content.trim();
  await Chat.create({ userMessage: message, botResponse });

  return botResponse;
};

export const streamChatResponse = async (message: string, send: (data: string) => void) => {
  if (!message) {
    throw new Error('Message cannot be null or undefined');
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: message }],
    max_tokens: 150,
    stream: true,
  });

  let botResponse = '';

  for await (const chunk of response) {
    const content = chunk.choices[0].delta?.content || '';
    botResponse += content;
    send(content);
  }

  await Chat.create({ userMessage: message, botResponse });
};

export const getChatHistory = async () => {
  return await Chat.find().sort({ createdAt: 1 });
};
