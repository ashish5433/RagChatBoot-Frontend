import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { fetchHistory, resetSession, streamChatResponse } from '../api/chatApi.js';
import Loader from './Loader.jsx';
import '../styles/Chat.scss';

function Chat() {
    const [sessionId, setSessionId] = useState('');
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messageListRef = useRef(null);

    useEffect(() => {
        let currentSessionId = localStorage.getItem('chatSessionId');
        if (!currentSessionId) {
            currentSessionId = uuidv4();
            localStorage.setItem('chatSessionId', currentSessionId);
        }
        setSessionId(currentSessionId);

        const loadHistory = async (id) => {
            setIsLoading(true);
            try {
                const historyMessages = await fetchHistory(id);
                setMessages(historyMessages);
            } catch (error) {
                console.error('Could not load history for this session.', error);
                setMessages([]);
            } finally {
                setIsLoading(false);
            }
        };
        loadHistory(currentSessionId);
    }, []);

    useEffect(() => {
        if (messageListRef.current) {
            messageListRef.current.scrollTo({ top: messageListRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', text: input };
        const currentInput = input;
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // append assistant placeholder (so Loader can show)
        setMessages(prev => [...prev, { role: 'assistant', text: '' }]);

        try {
            await streamChatResponse({
                sessionId,
                query: currentInput,
                onChunk: (chunk) => {
                    setMessages(prev => {
                        if (prev.length === 0) return prev;
                        const lastMessage = prev[prev.length - 1];
                        if (lastMessage.role !== 'assistant') return prev;
                        const updatedLastMessage = { ...lastMessage, text: lastMessage.text + chunk };
                        return [...prev.slice(0, -1), updatedLastMessage];
                    });
                }
            });
        } catch (err) {
            console.error('Streaming error:', err);
            setMessages(prev => [...prev, { role: 'assistant', text: "Sorry — something went wrong." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = async () => {
        try {
            await resetSession(sessionId);
            setMessages([]);
            const newId = uuidv4();
            localStorage.setItem('chatSessionId', newId);
            setSessionId(newId);
        } catch (error) {
            console.error("Failed to reset session:", error);
        }
    };

    return (
        <div className="chat-container">
            <header className="chat-header" role="banner" aria-label="App header">
                <div className="header-left">
                    <div className="logo" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" >
                            <rect x="3" y="6" width="18" height="12" rx="2" />
                            <path d="M8 10h8M8 14h4" />
                        </svg>
                    </div>

                    <div className="title-group">
                        <h1>Feedlytic</h1>
                        <p>Piping the World into Your Feed</p>
                    </div>
                </div>

                <div className="header-right">
                    <button
                        className="briefing-btn"
                        onClick={handleReset}
                        title="Reset Session"
                        aria-label="Reset Session"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"></path>
                        </svg>
                    </button>
                </div>
            </header>

            <main className="message-list" ref={messageListRef}>
                {messages.map((msg, index) => {
                    if (msg.role === 'assistant' && (!msg.text || msg.text.trim() === '')) {
                        return null;
                    }

                    return (
                        <div key={index} className={`message-wrapper ${msg.role}`}>
                            <div className="avatar">
                                {msg.role === 'user' ? (
                                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" /></svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A2,2 0 0,1 14,4A2,2 0 0,1 12,6A2,2 0 0,1 10,4A2,2 0 0,1 12,2M19.5,11C17.7,11 16,12.7 16,14.5C16,16.3 17.7,18 19.5,18C21.3,18 23,16.3 23,14.5C23,12.7 21.3,11 19.5,11M9,14.5C9,12.7 7.3,11 5.5,11C3.7,11 2,12.7 2,14.5C2,16.3 3.7,18 5.5,18C7.3,18 9,16.3 9,14.5M16,21.5C16,19.7 14.3,18 12.5,18C10.7,18 9,19.7 9,21.5C9,23.3 10.7,25 12.5,25C14.3,25 16,23.3 16,21.5Z" /></svg>
                                )}
                            </div>

                            <div className={`message ${msg.role}`}>
                                {msg.text}
                            </div>
                        </div>
                    );
                })}

                {isLoading && messages[messages.length - 1]?.role === 'assistant' && !messages[messages.length - 1]?.text && (
                    <Loader />
                )}

            </main>

            <footer className="input-footer-container">
                <form className="input-area" onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about today's headlines..."
                        disabled={isLoading}
                    />
                    <button className="send-button" type="submit" disabled={isLoading || !input.trim()}>
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                    </button>
                </form>
            </footer>
        </div>
    );
}

export default Chat;
