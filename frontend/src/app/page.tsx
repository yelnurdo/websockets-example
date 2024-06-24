"use client"
import { useState, useEffect, FormEvent } from 'react';

interface Chat {
  userMessage: string;
  botResponse: string;
}

const Home = () => {
  const [message, setMessage] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Establish WebSocket connection
    const socket = new WebSocket('ws://localhost:5001');
    setWs(socket);

    socket.onopen = () => {
      console.log('WebSocket connection opened');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (Array.isArray(data)) {
        setChatHistory(data);
      } else {
        // Append to current response
        const newMessage = data[0];
        setChatHistory((prevHistory) => [
          ...prevHistory,
          newMessage,
        ]);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      socket.close();
    };
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!message || !ws || ws.readyState !== WebSocket.OPEN) {
      console.log('WebSocket is not open');
      return;
    }

    console.log('Sending message:', message);
    ws.send(message);
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <div className="bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">ChatGPT Clone</h1>
        <div className="overflow-y-auto h-64 mb-4 p-4 bg-gray-700 rounded">
          {chatHistory.map((chat, index) => (
            <div key={index} className="mb-2">
              <p className="text-blue-400"><strong>You:</strong> {chat.userMessage}</p>
              <p className="text-gray-300"><strong>Bot:</strong> {chat.botResponse}</p>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 p-2 bg-gray-600 text-white border border-gray-600 rounded-l"
          />
          <button type="submit" className="p-2 bg-blue-500 text-white rounded-r">Send</button>
        </form>
      </div>
    </div>
  );
}

export default Home;

