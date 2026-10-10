import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Bot, User, Loader2, BookOpen, AlertTriangle, Ticket, RotateCcw } from 'lucide-react';
import { supportApi } from '../api/support';

interface Message {
  id: number | string;
  sender: 'user' | 'ai' | 'system';
  content: string;
  timestamp: string;
  confidence?: number;
}

const welcomeMessage: Message = {
  id: 'welcome',
  sender: 'ai',
  content:
    "Hello! I'm your Supportroot Ai assistant. I can answer questions based on your company's knowledge base. How can I help you today?",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

export default function AIAssistant() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [escalating, setEscalating] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingQuestion = useRef('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const now = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleSend = async (override?: string) => {
    const text = (override ?? input).trim();
    if (!text || isTyping) return;

    pendingQuestion.current = text;
    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, sender: 'user', content: text, timestamp: now() },
    ]);
    setInput('');
    setIsTyping(true);
    setError('');

    try {
      const res = await supportApi.chat(text, conversationId);
      setConversationId(res.conversation_id);

      const next: Message[] = [
        {
          id: res.ai_message.id,
          sender: 'ai',
          content: res.ai_message.content,
          timestamp: now(),
          confidence: res.ai_message.confidence ?? undefined,
        },
      ];
      if (res.system_message) {
        next.push({
          id: res.system_message.id,
          sender: 'system',
          content: res.system_message.content,
          timestamp: now(),
        });
      }
      setMessages((prev) => [...prev, ...next]);
    } catch {
      setError('Chat failed. Check that the backend is running and you are logged in.');
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'system',
          content: 'Unable to reach the AI service. Please try again.',
          timestamp: now(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleEscalate = async () => {
    if (escalating) return;
    setEscalating(true);
    setError('');
    try {
      const subject =
        pendingQuestion.current.slice(0, 80) || 'Escalated from AI assistant';
      const ticket = await supportApi.createTicket({
        subject,
        customer_name: 'Customer (AI chat)',
        description: `Escalated from AI assistant.\n\nLast question: ${pendingQuestion.current}`,
        priority: 'medium',
        conversation_id: conversationId,
      });
      navigate(`/tickets/${ticket.id}`);
    } catch {
      setError('Could not create ticket.');
    } finally {
      setEscalating(false);
    }
  };

  const handleReset = () => {
    setMessages([{ ...welcomeMessage, timestamp: now() }]);
    setConversationId(null);
    setError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    'What is your refund policy?',
    'How long does delivery take?',
    'What payment methods do you accept?',
    'What are your pricing plans?',
  ];

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/5 shrink-0">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-white truncate">Supportroot Ai Assistant</h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            <span className="text-xs text-surface-500 truncate">Online · Knowledge Base Active</span>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => navigate('/knowledge-base')} className="btn btn-ghost btn-sm">
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Sources</span>
          </button>
          <button onClick={handleReset} className="btn btn-ghost btn-sm">
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-3 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-2 text-sm text-red-300 shrink-0">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto py-4 space-y-5 min-h-0">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {msg.sender !== 'system' && (
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  msg.sender === 'ai'
                    ? 'bg-primary-500/10 border border-primary-500/20'
                    : 'bg-surface-700'
                }`}
              >
                {msg.sender === 'ai' ? (
                  <Bot className="w-4 h-4 text-primary-400" />
                ) : (
                  <User className="w-4 h-4 text-surface-300" />
                )}
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[70%] ${
                msg.sender === 'system' ? 'mx-auto w-full max-w-lg' : ''
              }`}
            >
              {msg.sender === 'system' ? (
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-200">{msg.content}</p>
                  </div>
                  <button
                    onClick={handleEscalate}
                    disabled={escalating}
                    className="btn btn-sm btn-secondary text-amber-200 border-amber-500/30 hover:bg-amber-500/10 shrink-0 self-end sm:self-auto"
                  >
                    {escalating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Ticket className="w-4 h-4" />
                    )}
                    Create Ticket
                  </button>
                </div>
              ) : (
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    msg.sender === 'ai'
                      ? 'bg-white/[0.04] border border-white/[0.06] rounded-tl-md'
                      : 'bg-primary-600/20 border border-primary-500/20 rounded-tr-md'
                  }`}
                >
                  <p className="text-sm text-surface-200 leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>
                  <div className="flex items-center justify-between mt-2 gap-3">
                    <span className="text-xs text-surface-600">{msg.timestamp}</span>
                    {msg.confidence !== undefined && (
                      <span
                        className={`text-xs font-medium shrink-0 ${
                          msg.confidence >= 0.8
                            ? 'text-emerald-400'
                            : msg.confidence >= 0.5
                              ? 'text-amber-400'
                              : 'text-red-400'
                        }`}
                      >
                        {Math.round(msg.confidence * 100)}% confidence
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary-400" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-white/[0.04] border border-white/[0.06]">
              <div className="flex items-center gap-1.5">
                <Loader2 className="w-4 h-4 text-primary-400 animate-spin" />
                <span className="text-sm text-surface-400">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        {messages.length <= 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="text-left px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-primary-500/30 text-sm text-surface-300 hover:text-white transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="pt-3 border-t border-white/5 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask a question about your knowledge base..."
            className="input flex-1"
            disabled={isTyping}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="btn btn-primary px-3.5 py-3 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-surface-600 mt-2 text-center">
          AI responses are generated from your knowledge base. Accuracy may vary.
        </p>
      </div>
    </div>
  );
}
