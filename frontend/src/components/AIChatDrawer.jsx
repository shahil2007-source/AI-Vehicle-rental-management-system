import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, MessageSquare, Loader2, Minimize2 } from 'lucide-react';
import { aiService } from '../services/api';

export default function AIChatDrawer({ selectedVehicle }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am your AI Vehicle Rental Assistant. I have live access to our 15+ vehicle fleet database. How can I help you choose today?',
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const quickPrompts = [
    "Which car is best for 6 people?",
    "Which vehicle is cheapest for a 5-day trip?",
    "Compare Innova and Carens",
    "Which vehicle has the largest luggage capacity?",
    "Which vehicle is best for a family trip?",
    "Which vehicle is best for a long-distance trip?"
  ];

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg = { sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await aiService.chat(query, selectedVehicle?._id);
      const botMsg = { sender: 'bot', text: res.data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: "Sorry, I ran into an issue accessing the database. Please try again!" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold shadow-2xl hover:scale-105 transition-all duration-300 ai-pulse ${
          isOpen ? 'hidden' : 'flex'
        }`}
      >
        <div className="relative">
          <Bot className="w-6 h-6 text-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
        </div>
        <div className="text-left">
          <div className="text-xs uppercase font-extrabold tracking-wider text-blue-200">Ask AI Assistant</div>
          <div className="text-sm font-bold">Rental Decisions</div>
        </div>
      </button>

      {/* Slide-out Drawer */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-gray-950/95 border-l border-gray-800 shadow-2xl flex flex-col backdrop-blur-2xl">
          
          {/* Header */}
          <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 p-0.5">
                <div className="w-full h-full bg-gray-950 rounded-[10px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-base font-outfit">AI Vehicle Assistant</h3>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono">
                    LIVE DB
                  </span>
                </div>
                <p className="text-xs text-gray-400">Database Grounded Intelligence</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-gray-900 text-gray-200 border border-gray-800 rounded-bl-none whitespace-pre-wrap'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-gray-400 italic bg-gray-900/40 p-3 rounded-xl border border-gray-800/50 w-fit">
                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                <span>AI Agent is querying vehicle database...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="p-3 border-t border-gray-800/80 bg-gray-900/30 overflow-x-auto">
            <div className="text-[10px] uppercase font-bold text-gray-400 mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Suggested Queries</span>
            </div>
            <div className="flex gap-2 pb-1 overflow-x-auto text-xs">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(qp)}
                  className="whitespace-nowrap px-3 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 hover:border-gray-700 transition-colors shrink-0"
                >
                  {qp}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <div className="p-4 border-t border-gray-800 bg-gray-950">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask AI about rental options (e.g. Innova vs Carens)..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="p-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
}
