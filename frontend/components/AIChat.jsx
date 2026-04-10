'use client';

import { useState, useRef, useEffect } from 'react';
import { FiMessageSquare, FiX, FiSend } from 'react-icons/fi';

const BOT_RESPONSES = [
  { keywords: ['hello', 'hi', 'hey', 'namaste'], reply: 'Hello! 👋 Welcome to TechProp. I can help you find properties, calculate EMI, schedule visits, or answer any real estate questions. What are you looking for?' },
  { keywords: ['property', 'properties', 'house', 'flat', 'apartment', 'villa', 'buy', 'purchase'], reply: 'We have 2,500+ verified properties across 25+ cities in India! 🏠\n\nYou can:\n• Browse all properties at /properties\n• Filter by city, type, BHK, and price\n• View 3D virtual tours\n\nWhich city are you interested in?' },
  { keywords: ['price', 'cost', 'budget', 'affordable', 'cheap', 'expensive'], reply: 'Our properties range from ₹25 Lakhs to ₹10+ Crores. 💰\n\nUse our filters on the Properties page to set your budget range. You can also use our EMI Calculator to plan your finances!' },
  { keywords: ['emi', 'loan', 'mortgage', 'finance', 'interest', 'bank'], reply: 'Our EMI Calculator can help you plan your home loan! 📊\n\nCurrent home loan rates start from ~8.5% p.a. Click the purple calculator button (bottom right) or visit any property page to calculate your monthly EMI instantly.' },
  { keywords: ['visit', 'tour', 'schedule', 'appointment', 'see', 'view'], reply: 'You can schedule a site visit directly from any property page! 📅\n\nClick "Schedule Site Visit" on the property you\'re interested in. We offer slots from 9 AM to 5 PM, Monday to Saturday.' },
  { keywords: ['virtual', '3d', 'tour', 'online'], reply: 'We offer immersive 3D Virtual Tours for select properties! 🎯\n\nLook for the "▶ 3D Virtual Tour" button on property detail pages. You can explore every room without leaving your home!' },
  { keywords: ['agent', 'contact', 'call', 'whatsapp', 'phone'], reply: 'You can contact our agents directly! 📞\n\n• Each property listing shows the assigned agent\n• Click "Call" or "WhatsApp" on the property page\n• Or call us at +91-1234567890\n• Email: info@techprop.com' },
  { keywords: ['bangalore', 'bengaluru'], reply: 'Bangalore is one of our top markets! 🌆\n\nWe have 500+ properties in Bangalore including Koramangala, Whitefield, Indiranagar, HSR Layout, and more. Visit /properties?city=Bangalore to explore!' },
  { keywords: ['mumbai', 'bombay'], reply: 'Mumbai has some of our premium listings! 🏙️\n\nFrom South Mumbai to Bandra, Powai, and Navi Mumbai — we cover it all. Visit /properties?city=Mumbai to explore!' },
  { keywords: ['register', 'signup', 'account', 'login'], reply: 'Creating an account is free and takes just 2 minutes! ✅\n\nBenefits:\n• Save favorite properties\n• Track your inquiries\n• Manage scheduled visits\n• Get personalized recommendations\n\nVisit /register to get started!' },
  { keywords: ['admin', 'manage', 'dashboard'], reply: 'The Admin Panel at /admin lets you:\n\n• Add/Edit/Delete properties\n• Manage inquiries & visits\n• View analytics & stats\n• Manage agents\n\nYou need admin credentials to access it.' },
  { keywords: ['thank', 'thanks', 'bye', 'goodbye'], reply: 'You\'re welcome! 😊 Feel free to ask anything anytime. Happy house hunting! 🏡' },
];

const DEFAULT_REPLY = "I'm not sure about that, but our team can help! 😊\n\nYou can:\n• Browse properties at /properties\n• Call us: +91-1234567890\n• Email: info@techprop.com\n\nIs there anything specific about properties I can help with?";

function getBotReply(input) {
  const lower = input.toLowerCase();
  for (const item of BOT_RESPONSES) {
    if (item.keywords.some(k => lower.includes(k))) return item.reply;
  }
  return DEFAULT_REPLY;
}

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hi! 👋 I\'m Shine Native AI Assistant. I can help you find properties, calculate EMI, schedule visits, and more. How can I help you today?', sender: 'bot', time: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), text: input, sender: 'user', time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const reply = getBotReply(input);
      setTyping(false);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: reply, sender: 'bot', time: new Date() }]);
    }, 800 + Math.random() * 600);
  };

  const quickReplies = ['Find Properties', 'EMI Calculator', 'Schedule Visit', 'Contact Agent'];

  return (
    <>
      {/* Toggle Button */}
      <button onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 bg-primary text-white p-4 rounded-full shadow-xl hover:bg-secondary transition z-40 flex items-center gap-2"
        title="AI Chat Support">
        {isOpen ? <FiX size={22} /> : <FiMessageSquare size={22} />}
        {!isOpen && <span className="text-sm font-semibold pr-1">AI Chat</span>}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 bg-white rounded-2xl shadow-2xl w-80 md:w-96 h-[500px] z-40 flex flex-col border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-white p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-black font-bold text-lg">AI</div>
            <div>
              <h3 className="font-bold">Shine Native Assistant</h3>
              <div className="flex items-center gap-1.5 text-xs text-green-300">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Online • 24/7 Support
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="ml-auto hover:bg-white/20 p-1 rounded-full transition">
              <FiX size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0 mt-1">AI</div>
                )}
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-line ${
                  msg.sender === 'user'
                    ? 'bg-primary text-white rounded-br-sm'
                    : 'bg-white text-gray-800 shadow-sm rounded-bl-sm border border-gray-100'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">AI</div>
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100 flex gap-1">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="px-3 py-2 flex gap-2 overflow-x-auto bg-white border-t border-gray-100">
            {quickReplies.map(q => (
              <button key={q} onClick={() => { setInput(q); }}
                className="flex-shrink-0 text-xs bg-blue-50 text-primary border border-blue-100 px-3 py-1.5 rounded-full hover:bg-primary hover:text-white transition-colors">
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 flex gap-2 bg-white border-t border-gray-100">
            <input type="text" value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" />
            <button onClick={handleSend} disabled={!input.trim()}
              className="bg-primary text-white p-2.5 rounded-xl hover:bg-secondary transition disabled:opacity-50">
              <FiSend size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
