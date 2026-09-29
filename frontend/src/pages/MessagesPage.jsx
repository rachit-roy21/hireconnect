import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { messageService } from '../services/messageService';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Send, Search, User } from 'lucide-react';

const MessagesPage = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const res = await messageService.getConversations();
      if (res.success) {
        const formattedConversations = res.conversations.map(conv => ({
          _id: conv.otherUser._id,
          name: conv.otherUser.name,
          role: conv.otherUser.role,
          lastMessage: conv.lastMessage?.content || '',
          unreadCount: conv.unreadCount
        }));
        setConversations(formattedConversations);
        if (formattedConversations.length > 0) {
          setSelectedConversation(formattedConversations[0]);
          loadMessages(formattedConversations[0]._id);
        }
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (otherUserId) => {
    try {
      const res = await messageService.getMessages(otherUserId);
      if (res.success) {
        setMessages(res.messages);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const res = await messageService.sendMessage({
        recipientId: selectedConversation._id,
        content: newMessage
      });
      if (res.success) {
        setMessages([...messages, res.message]);
        setNewMessage('');
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div className="app-container">
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-content">
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>
              Messages
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.2rem' }}>
              Communicate with recruiters, alumni, and students
            </p>
          </div>

          <div className="card" style={{ minHeight: '500px', display: 'flex' }}>
            <div style={{ width: '300px', borderRight: '1px solid #e2e8f0', padding: '1rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '2rem', fontSize: '0.85rem' }}
                    placeholder="Search conversations..."
                  />
                </div>
              </div>

              {loading ? (
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Loading conversations...</p>
              ) : conversations.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>No conversations yet</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {conversations.map((conv) => (
                    <div
                      key={conv._id}
                      onClick={() => {
                        setSelectedConversation(conv);
                        loadMessages(conv._id);
                      }}
                      style={{
                        padding: '0.75rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        backgroundColor: selectedConversation?._id === conv._id ? '#eff6ff' : 'transparent',
                        border: selectedConversation?._id === conv._id ? '1px solid #bfdbfe' : '1px solid transparent'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <User size={16} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {conv.name || 'Conversation'}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {conv.lastMessage || 'No messages yet'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {selectedConversation ? (
                <>
                  <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{selectedConversation.name || 'Conversation'}</h3>
                  </div>

                  <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {messages.length === 0 ? (
                      <p style={{ fontSize: '0.9rem', color: '#64748b', textAlign: 'center', marginTop: '2rem' }}>
                        No messages yet. Start the conversation!
                      </p>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg._id}
                          style={{
                            maxWidth: '70%',
                            padding: '0.75rem 1rem',
                            borderRadius: '12px',
                            alignSelf: msg.sender === user._id ? 'flex-end' : 'flex-start',
                            backgroundColor: msg.sender === user._id ? '#2563eb' : '#f1f5f9',
                            color: msg.sender === user._id ? 'white' : '#0f172a'
                          }}
                        >
                          <p style={{ fontSize: '0.9rem', margin: 0 }}>{msg.content}</p>
                          <span style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: '0.25rem', display: 'block' }}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>

                  <form onSubmit={handleSendMessage} style={{ padding: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      className="form-input"
                      style={{ flex: 1 }}
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary" disabled={!newMessage.trim()}>
                      <Send size={18} />
                    </button>
                  </form>
                </>
              ) : (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                  <div style={{ textAlign: 'center' }}>
                    <MessageSquare size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
                    <p>Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default MessagesPage;
