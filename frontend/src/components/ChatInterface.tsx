import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types/agent';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (text: string, forceAnalysis?: boolean) => void;
  loading: boolean;
}

export default function ChatInterface({ messages, onSendMessage, loading }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSubmit = (e: React.FormEvent, force: boolean = false) => {
    e.preventDefault();
    if ((!input.trim() && !force) || loading) return;

    const textToSend = input.trim() || 'Kérlek indítsd el az analízis a eddigiek alapján.';
    onSendMessage(textToSend, force);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[75vh] bg-slate-800/50 rounded-2xl border border-slate-700 p-4 shadow-xl backdrop-blur-sm">
      {/* Üzenetek listája */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4">
        {messages.length === 0 && (
          <div className="text-center text-slate-400 my-auto py-12">
            <h3 className="text-lg font-medium text-cyan-300 mb-2">Cyber Threat Intelligence Triage</h3>
            <p className="max-w-md mx-auto text-sm">
              Írd le gyanús eseményt, incidenst vagy mutatót (IOC). Az AI asszisztens interaktívan rákérdez a hiányzó kontextusra (pl. szektor, ország), majd generálja a MITRE ATT&CK mitigációs stratégiát.
            </p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <span className="text-xs text-slate-400 mb-1 px-1">
              {msg.role === 'user' ? 'Te (Analyst)' : 'CTI Agent'}
            </span>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-cyan-600 text-white rounded-br-sm'
                  : 'bg-slate-700 text-slate-200 rounded-bl-sm border border-slate-600'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start">
            <div className="bg-slate-700 text-slate-400 rounded-2xl rounded-bl-sm px-4 py-3 text-sm animate-pulse border border-slate-600">
              Az agent elemez és gondolkodik...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input sáv és Vezérlőgombok */}
      <form onSubmit={(e) => handleSubmit(e, false)} className="flex flex-col gap-2 pt-2 border-t border-slate-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Írd be a választ vagy a részleteket..."
            disabled={loading}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-cyan-500 transition text-sm"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-semibold px-6 py-3 rounded-xl transition text-sm cursor-pointer"
          >
            Küldés
          </button>
        </div>

        {messages.length > 0 && (
          <div className="flex justify-between items-center px-1">
            <span className="text-xs text-slate-400">
              Elegendő információd van? Nem kell több kérdés?
            </span>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={loading}
              className="text-xs text-cyan-400 hover:text-cyan-300 underline cursor-pointer transition"
            >
              ⚡ Elemzés indítása azonnal (Force Analysis)
            </button>
          </div>
        )}
      </form>
    </div>
  );
}