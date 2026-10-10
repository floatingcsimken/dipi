import React, { useState } from 'react';
import { sendChatMessage } from './services/api';
import ChatInterface from './components/ChatInterface';
import AnalysisView from './components/AnalysisView';
import type { ChatMessage, InvestigateResponseDto } from './types/agent';

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [analysisData, setAnalysisData] = useState<InvestigateResponseDto | null>(null);

  const handleSendMessage = async (userText: string, forceAnalysis: boolean = false) => {
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await sendChatMessage({
        messages: newMessages,
        forceAnalysis
      });

      if (response.type === 'question') {
        // Az agent kérdezett valamit, hozzáadjuk az asszisztens válaszát a history-hoz
        setMessages([...newMessages, { role: 'assistant', content: response.message }]);
      } else if (response.type === 'analysis' && response.data) {
        // Megérkezett a végső jelentés!
        setAnalysisData(response.data);
      }
    } catch (error) {
      console.error('Hiba történt a chat során:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setAnalysisData(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-6">
      <header className="w-full max-w-4xl mb-6 flex justify-between items-center border-b border-slate-700 pb-4">
        <h1 className="text-xl font-bold tracking-wider text-cyan-400">CYBER THREAT INTELLIGENCE</h1>
        {analysisData && (
          <button 
            onClick={handleReset}
            className="bg-slate-800 hover:bg-slate-700 text-xs px-4 py-2 rounded-lg border border-slate-600 transition cursor-pointer"
          >
            Új vizsgálat indítása
          </button>
        )}
      </header>

      <main className="w-full max-w-4xl flex-1 flex flex-col">
        {!analysisData ? (
          <ChatInterface 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            loading={loading} 
          />
        ) : (
          <AnalysisView data={analysisData} />
        )}
      </main>
    </div>
  );
}