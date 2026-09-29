import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { aiService } from '../../services/aiService';
import { Sparkles, Send, User, Bot } from 'lucide-react';

const StudentAiAssistantPage = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your HireConnect AI Career Coach. Ask me anything about resume optimization, interview questions, tech skill roadmaps, or career paths!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await aiService.chat(userMsg);
      if (res.success) {
        setMessages(prev => [...prev, { sender: 'ai', text: res.reply }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: 'Sorry, I encountered an issue generating a response. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (promptText) => {
    setInput(promptText);
  };

  return (
    <div className="app-container">
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-content" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 65px)' }}>
          <div style={{ marginBottom: '1rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles color="#2563eb" /> AI Career Assistant
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              Smart campus placement career guidance and interview preparation coach
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <button onClick={() => handleQuickPrompt("How can I optimize my resume for campus placement?")} className="btn btn-outline btn-sm">
              📄 Resume Optimization
            </button>
            <button onClick={() => handleQuickPrompt("What are common technical interview questions for SDE?")} className="btn btn-outline btn-sm">
              💻 Interview Questions
            </button>
            <button onClick={() => handleQuickPrompt("Give me a 4-month campus placement learning roadmap")} className="btn btn-outline btn-sm">
              🗺️ 4-Month Roadmap
            </button>
          </div>

          <div style={{
            flex: 1,
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '1.5rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            marginBottom: '1rem'
          }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%'
                }}
              >
                {msg.sender === 'ai' && (
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Bot size={20} />
                  </div>
                )}

                <div style={{
                  backgroundColor: msg.sender === 'user' ? '#2563eb' : '#f1f5f9',
                  color: msg.sender === 'user' ? '#ffffff' : '#0f172a',
                  padding: '1rem 1.25rem',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-line'
                }}>
                  {msg.text}
                </div>

                {msg.sender === 'user' && (
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#e2e8f0', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <User size={20} />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', gap: '0.75rem', alignSelf: 'flex-start' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={20} />
                </div>
                <div style={{ backgroundColor: '#f1f5f9', padding: '0.85rem 1.25rem', borderRadius: '12px', color: '#64748b' }}>
                  <span className="loading-spinner" style={{ width: '16px', height: '16px' }}></span> AI Coach is typing...
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.75rem' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Ask AI about interview prep, resume score, or learning roadmaps..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Send size={18} />
            </button>
          </form>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default StudentAiAssistantPage;
