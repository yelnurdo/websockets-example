import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

import express from 'express';
import mongoose from 'mongoose';
import chatRoutes from './routes/chatRoutes';
import { WebSocketServer } from 'ws';
import http from 'http';
import { handleChatWebSocket } from './websockets/chatWebSocket';

const app = express();
const port = process.env.PORT || 5001;

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI environment variable is not set");
}

app.use(express.json());
app.use('/api', chatRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const server = http.createServer(app);

const wss = new WebSocketServer({ server });
wss.on('connection', handleChatWebSocket);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
