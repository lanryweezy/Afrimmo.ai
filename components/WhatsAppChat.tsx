
import React, { useState, useRef, useEffect } from 'react';
import { Lead, ChatMessage, LeadInteraction } from '../types';
import { generateWhatsAppReply, runChatAction, generateWhatsAppSuggestions } from '../services/geminiService';
import Button from './Button';
import { SparklesIcon, PaperAirplaneIcon, CalendarDaysIcon, CheckIcon } from './IconComponents';

interface WhatsAppChatProps {
  lead: Lead;
  onSendMessage: (leadId: string, message: ChatMessage, isUserMessage: boolean) => void;
  onUpdateHistory: (leadId: string, interaction: LeadInteraction) => void;
}

const WhatsAppChat: React.FC<WhatsAppChatProps> = ({ lead, onSendMessage, onUpdateHistory }) => {
  const [input, setInput] = useState('');
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestedReply, setSuggestedReply] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [lead.conversation, suggestedReply, suggestions]);

  const handleSend = () => {
    if (input.trim() === '') return;
    setError('');

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'ai', // Agent
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
    };
    onSendMessage(lead.id, userMessage, true);
    setInput('');
    setSuggestedReply(null);
    setSuggestions([]);
  };

  const handleGetReply = async () => {
    setIsLoadingSuggestion(true);
    setSuggestedReply(null);
    setSuggestions([]);
    setError('');
    const conversationHistory = (lead.conversation || [])
      .map(msg => `${msg.sender === 'user' ? 'Client' : 'Agent'}: ${msg.text}`)
      .join('\n');
    
    try {
        const reply = await generateWhatsAppReply(conversationHistory);
        setSuggestedReply(reply);
    } catch (err: any) {
        console.error("Failed to get suggestion:", err);
        setError(err.message || "Sorry, couldn't get a suggestion right now.");
    } finally {
        setIsLoadingSuggestion(false);
    }
  };

  const handleGetSuggestions = async () => {
    setIsSuggesting(true);
    setSuggestions([]);
    setSuggestedReply(null);
    setError('');
    const conversationHistory = (lead.conversation || [])
      .map(msg => `${msg.sender === 'user' ? 'Client' : 'Agent'}: ${msg.text}`)
      .join('\n');
    
    try {
        const results = await generateWhatsAppSuggestions(conversationHistory);
        setSuggestions(results);
    } catch (err: any) {
        console.error("Failed to get suggestions:", err);
        setError(err.message || "Sorry, couldn't get suggestions.");
    } finally {
        setIsSuggesting(false);
    }
  };

  const handleScheduleViewing = async () => {
    setIsLoadingAction(true);
    setError('');
    const conversationHistory = (lead.conversation || [])
        .map(msg => `${msg.sender === 'user' ? 'Client' : 'Agent'}: ${msg.text}`)
        .join('\n');
    
    try {
        const actionResult = await runChatAction(conversationHistory);
        if (actionResult?.name === 'scheduleViewing' && actionResult.args) {
            const { date, time } = actionResult.args;

            const proposalMessage: ChatMessage = {
                id: `msg-${Date.now()}`,
                sender: 'ai',
                text: `Based on our conversation, I can schedule a viewing for you. How does ${date} at ${time} sound?`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
            };
            onSendMessage(lead.id, proposalMessage, true);

            const confirmationInteraction: LeadInteraction = {
                id: `hist-${Date.now()}`,
                date: 'Just now',
                description: `Viewing scheduled for ${date} at ${time}.`
            };
            onUpdateHistory(lead.id, confirmationInteraction);
            
            const systemMessage: ChatMessage = {
                id: `sys-${Date.now()}`,
                sender: 'system',
                text: `📅 Viewing Proposal Created: ${date} @ ${time}`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            onSendMessage(lead.id, systemMessage, false);
        } else {
            setError("AI couldn't determine a time. Ask the client for a preferred time first.");
        }

    } catch (err: any) {
         console.error("Failed to schedule viewing:", err);
         setError(err.message || "Could not schedule viewing.");
    } finally {
        setIsLoadingAction(false);
    }
  };
  
  const useSuggestion = (text: string) => {
    setInput(text);
    setSuggestedReply(null);
    setSuggestions([]);
  }

  return (
    <div className="h-full flex flex-col relative z-0">
      {/* Chat Messages Area */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {(lead.conversation || []).map((msg) => {
            if (msg.sender === 'system') {
                return (
                    <div key={msg.id} className="flex items-center justify-center my-4">
                        <span className="px-3 py-1 bg-slate-800/80 text-slate-400 rounded-lg text-[10px] font-medium uppercase tracking-wide border border-slate-700 shadow-sm">{msg.text}</span>
                    </div>
                );
            }
            if (msg.isTyping) {
                return (
                    <div key={msg.id} className="flex items-end gap-2">
                         <div className="bg-slate-800 rounded-2xl rounded-bl-none p-3 shadow-md">
                            <div className="flex items-center space-x-1">
                                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                            </div>
                        </div>
                    </div>
                );
            }
            const isAi = msg.sender === 'ai';
            return (
              <div key={msg.id} className={`flex flex-col ${isAi ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[85%] md:max-w-[70%] px-3 py-2 rounded-lg shadow-md relative ${
                    isAi
                      ? 'bg-[#005c4b] text-white rounded-tr-none' // WhatsApp Dark Green
                      : 'bg-slate-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  <div className="flex items-center justify-end gap-1 mt-1 opacity-70">
                      <p className="text-[10px]">{msg.timestamp}</p>
                      {isAi && <div className="flex -space-x-1"><CheckIcon className="w-3 h-3 text-blue-400" /><CheckIcon className="w-3 h-3 text-blue-400" /></div>}
                  </div>
                </div>
              </div>
            );
        })}
        <div ref={messagesEndRef} />
      </div>
      
      {/* AI Suggestion Box (Single) */}
      {suggestedReply && (
          <div className="px-4 pb-2 animate-fade-in">
            <div className="bg-slate-800 border border-emerald-500/30 p-3 rounded-xl shadow-xl relative">
                <div className="absolute -top-3 left-4 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1"><SparklesIcon className="w-3 h-3"/> DRAFT REPLY</div>
                <p className="text-sm text-slate-300 mt-2">{suggestedReply}</p>
                <div className="flex gap-3 mt-3 justify-end">
                    <button onClick={() => setSuggestedReply(null)} className="text-xs text-slate-400 hover:text-white px-2 py-1">Dismiss</button>
                    <button onClick={() => useSuggestion(suggestedReply)} className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg font-medium transition-colors">Insert</button>
                </div>
            </div>
          </div>
      )}

      {/* AI Suggestions List (Multiple) */}
      {suggestions.length > 0 && (
          <div className="px-4 pb-2 animate-fade-in">
            <div className="bg-slate-800 border border-purple-500/30 p-3 rounded-xl shadow-xl relative">
                 <div className="flex justify-between items-center mb-2">
                    <div className="text-[10px] font-bold text-purple-400 uppercase flex items-center gap-1"><SparklesIcon className="w-3 h-3"/> Quick Replies</div>
                    <button onClick={() => setSuggestions([])} className="text-slate-500 hover:text-white">&times;</button>
                </div>
                <div className="flex flex-col gap-2">
                    {suggestions.map((s, i) => (
                        <button key={i} onClick={() => useSuggestion(s)} className="text-left text-sm bg-slate-900/50 hover:bg-purple-500/20 hover:text-white text-slate-300 border border-slate-700 hover:border-purple-500/50 px-3 py-2 rounded-lg transition-colors">
                            {s}
                        </button>
                    ))}
                </div>
            </div>
          </div>
      )}

      {error && <p className="text-rose-400 text-xs text-center px-3 pb-2">{error}</p>}

      {/* Input Area */}
      <div className="p-3 bg-slate-900 border-t border-slate-800">
        {/* Quick Actions Toolbar */}
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
            <button 
                onClick={handleGetReply} 
                disabled={isLoadingSuggestion}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-full text-xs font-medium text-emerald-400 border border-emerald-500/20 whitespace-nowrap transition-colors disabled:opacity-50"
            >
                <SparklesIcon className="w-3.5 h-3.5"/>
                {isLoadingSuggestion ? 'Drafting...' : 'Draft Reply'}
            </button>
            <button 
                onClick={handleGetSuggestions} 
                disabled={isSuggesting}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-full text-xs font-medium text-purple-400 border border-purple-500/20 whitespace-nowrap transition-colors disabled:opacity-50"
            >
                <SparklesIcon className="w-3.5 h-3.5"/>
                {isSuggesting ? 'Thinking...' : 'Suggestions'}
            </button>
             <button 
                onClick={handleScheduleViewing} 
                disabled={isLoadingAction}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-full text-xs font-medium text-blue-400 border border-blue-500/20 whitespace-nowrap transition-colors disabled:opacity-50"
            >
                <CalendarDaysIcon className="w-3.5 h-3.5"/>
                {isLoadingAction ? 'Processing...' : 'Propose Viewing'}
            </button>
        </div>

        <div className="flex items-end gap-2">
            <div className="flex-1 bg-slate-800 rounded-2xl border border-slate-700 focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/20 transition-all">
                 <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder="Type a message..."
                    rows={1}
                    className="w-full bg-transparent text-white px-4 py-3 focus:outline-none text-sm resize-none max-h-32 placeholder-slate-500"
                    style={{minHeight: '44px'}}
                />
            </div>
            <button 
                onClick={handleSend} 
                disabled={!input.trim()}
                className={`p-3 rounded-full flex-shrink-0 transition-all ${input.trim() ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20 transform hover:scale-105' : 'bg-slate-800 text-slate-600'}`}
            >
              <PaperAirplaneIcon className="w-5 h-5"/>
            </button>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppChat;
