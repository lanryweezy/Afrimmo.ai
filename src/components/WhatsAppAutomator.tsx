
import React, { useState, useRef, useEffect } from 'react';
import Card from './Card';
import Button from './Button';
import { ChatMessage } from '../types';
import { generateWhatsAppReply, generateWhatsAppSuggestions } from '../services/geminiService';
import { SendIcon, SparklesIcon } from './IconComponents';

const WhatsAppAutomator: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Hello! I'm Afrimmo AI, your virtual assistant. How can I help you today? Feel free to ask about a property or schedule a viewing.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, suggestions]); // Scroll when suggestions appear too

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;
    setError('');
    setSuggestions([]); // Clear suggestions on send

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const conversationHistory = [...messages, userMessage]
      .map((msg) => `${msg.sender === 'user' ? 'Client' : 'AI'}: ${msg.text}`)
      .join('\n');

    try {
      const replyText = await generateWhatsAppReply(conversationHistory);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'Sorry, I am having trouble connecting. Please try again later.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGetSuggestions = async () => {
    setIsSuggesting(true);
    setSuggestions([]);
    setError('');
    
    // If no conversation exists yet, context is just the initial greeting
    const conversationHistory = messages
      .map((msg) => `${msg.sender === 'user' ? 'Client' : 'AI'}: ${msg.text}`)
      .join('\n');
    
    try {
        const result = await generateWhatsAppSuggestions(conversationHistory);
        setSuggestions(result);
    } catch (err: any) {
        console.error(err);
        setError(err.message || 'Could not fetch suggestions.');
    } finally {
        setIsSuggesting(false);
    }
  };

  const useSuggestion = (suggestion: string) => {
    setInput(suggestion);
    setSuggestions([]);
  };

  return (
    <div className="h-full flex flex-col max-w-2xl mx-auto">
      <div className="text-center mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">WhatsApp Lead Automator</h1>
        <p className="text-gray-400 mt-2">Simulate an AI-powered conversation to qualify leads.</p>
      </div>

      <Card className="flex-1 flex flex-col bg-gray-900/50 border border-gray-700">
        <div className="flex items-center p-3 border-b border-gray-700 bg-gray-800/50 rounded-t-xl">
            <img src="https://picsum.photos/seed/client/40/40" className="rounded-full w-10 h-10 mr-3 border-2 border-teal-500" alt="Client"/>
            <div>
                <p className="font-semibold text-white">Potential Client</p>
                <p className="text-xs text-green-400 flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>online</p>
            </div>
        </div>
        
        <div className="flex-1 p-4 space-y-4 overflow-y-auto min-h-[300px]">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
              {msg.sender === 'ai' && <img src="https://i.pravatar.cc/150?u=ai-agent" className="rounded-full w-6 h-6 self-start mt-1" alt="AI"/>}
              <div
                className={`max-w-[85%] sm:max-w-md p-3 rounded-2xl text-sm sm:text-base shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-teal-600 text-white rounded-br-sm'
                    : 'bg-gray-700 text-gray-100 rounded-bl-sm'
                }`}
              >
                <p>{msg.text}</p>
                <p className={`text-[10px] mt-1 text-right ${msg.sender === 'user' ? 'text-teal-200' : 'text-gray-400'}`}>{msg.timestamp}</p>
              </div>
              {msg.sender === 'user' && <img src="https://picsum.photos/seed/client/40/40" className="rounded-full w-6 h-6 self-start mt-1" alt="Client"/>}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-end gap-2">
                <img src="https://i.pravatar.cc/150?u=ai-agent" className="rounded-full w-6 h-6 self-start" alt="AI"/>
                <div className="bg-gray-700 rounded-2xl rounded-bl-sm p-4 shadow-sm">
                    <div className="flex items-center space-x-1.5 h-4">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="px-3 pb-2 space-y-2">
            {error && <p className="text-red-400 text-xs text-center bg-red-500/10 py-1 rounded">{error}</p>}
            {suggestions.length > 0 && (
                <div className="bg-gray-800/80 backdrop-blur p-3 rounded-lg border border-gray-700 animate-fade-in shadow-lg">
                    <p className="text-xs text-teal-400 font-bold mb-2 flex items-center gap-1 uppercase tracking-wider">
                        <SparklesIcon className="w-3 h-3"/> AI Suggestions
                    </p>
                    <div className="flex flex-col gap-2">
                        {suggestions.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => useSuggestion(s)}
                                className="text-left text-sm bg-gray-700 hover:bg-teal-600 hover:text-white text-gray-200 px-4 py-2 rounded-md transition-all duration-200 w-full border border-gray-600 hover:border-teal-500"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>

        <div className="p-3 border-t border-gray-700 bg-gray-800/30 rounded-b-xl">
            <div className="mb-3">
                <Button 
                    onClick={handleGetSuggestions} 
                    isLoading={isSuggesting} 
                    icon={<SparklesIcon className="w-4 h-4"/>} 
                    variant="secondary" 
                    size="small"
                    className="w-full bg-gray-700/50 hover:bg-gray-700 border border-gray-600 text-gray-300"
                >
                    {suggestions.length > 0 ? 'Regenerate Suggestions' : 'Suggest Replies'}
                </Button>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1 bg-gray-700 border-gray-600 text-white rounded-full py-3 px-5 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm transition-shadow"
                disabled={isLoading}
              />
              <Button 
                onClick={handleSend} 
                isLoading={isLoading} 
                className={`rounded-full !p-3 w-12 h-12 flex items-center justify-center transition-all ${input.trim() ? 'bg-teal-500 hover:bg-teal-600 shadow-lg shadow-teal-500/30' : 'bg-gray-700 text-gray-500'}`}
                disabled={!input.trim()}
              >
                <SendIcon className="w-5 h-5 ml-0.5"/>
              </Button>
            </div>
        </div>
      </Card>
    </div>
  );
};

export default WhatsAppAutomator;
