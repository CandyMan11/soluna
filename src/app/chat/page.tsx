'use client';

import { useState, useRef, useEffect } from 'react';

// Define the structure of a message object
interface Message {
  text: string;
  isUser: boolean;
}

export default function ChatPage() {
  // State to hold the conversation messages
  const [messages, setMessages] = useState<Message[]>([]);
  // State for the user's current input
  const [input, setInput] = useState('');
  // State to manage loading status
  const [isLoading, setIsLoading] = useState(false);

  // Ref for the end of the messages list to enable auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Function to automatically scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // useEffect hook to scroll to the bottom whenever messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to handle sending a message
  const handleSend = async () => {
    if (input.trim() && !isLoading) {
      const userMessage: Message = { text: input, isUser: true };
      // Add user message to the conversation
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      const currentInput = input;
      setInput('');
      setIsLoading(true);

      try {
        // Call our new backend API route
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: currentInput }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const botMessage: Message = { text: data.reply, isUser: false };
        
        // Add the AI's response to the conversation
        setMessages((prevMessages) => [...prevMessages, botMessage]);

      } catch (error) {
        console.error('Error sending message:', error);
        const errorMessage: Message = { text: "Sorry, I'm having trouble connecting. Please try again later.", isUser: false };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle key press for sending message with 'Enter'
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-3xl mx-auto">
      {/* Header */}
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold text-center">AI Wellness Chat</h1>
      </div>

      {/* Message Display Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${
                msg.isUser
                  ? 'bg-blue-500 text-white'
                  : 'bg-foreground/10 text-foreground'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="px-4 py-2 rounded-2xl bg-foreground/10 text-foreground">
              <span className="animate-pulse">...</span>
            </div>
          </div>
        )}
        {/* Ref for auto-scrolling */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-full disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </div>
  );
}
