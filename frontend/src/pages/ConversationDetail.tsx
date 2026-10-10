import { useParams, Link } from 'react-router-dom';
import { Bot, User, ArrowLeft, Ticket, CheckCircle, Send } from 'lucide-react';
import { useState } from 'react';

export interface Message {
  id: number;
  sender: 'customer' | 'ai' | 'agent';
  content: string;
  timestamp: string;
}

const demoConversation: {
  id: number;
  customerName: string;
  customerEmail: string;
  status: 'resolved' | 'open' | 'pending';
  createdAt: string;
  messages: Message[];
} = {
  id: 1,
  customerName: 'Rahul Sharma',
  customerEmail: 'rahul@example.com',
  status: 'resolved',
  createdAt: 'Today, 10:15 AM',
  messages: [
    { id: 1, sender: 'customer', content: 'Hi, I received my order yesterday but the product was damaged during shipping. Can I get a refund?', timestamp: '10:15 AM' },
    { id: 2, sender: 'ai', content: 'I\'m sorry to hear about the damaged product, Rahul. Based on our Refund Policy, you\'re eligible for a full refund within 30 days of purchase. Here\'s how to proceed:\n\n1. Go to your Order History\n2. Select the damaged order\n3. Click "Request Refund"\n4. Upload photos of the damaged product\n\nYour refund will be processed within 5-7 business days.', timestamp: '10:15 AM' },
    { id: 3, sender: 'customer', content: 'Thanks! Can I get a replacement instead of a refund?', timestamp: '10:18 AM' },
    { id: 4, sender: 'ai', content: 'Yes, absolutely! You can choose either a replacement or a refund. For a replacement:\n\n1. Follow the same steps as above\n2. Select "Request Replacement" instead of "Request Refund"\n3. A new item will be shipped within 2-3 business days\n\nFree return shipping will be arranged for the damaged item.', timestamp: '10:18 AM' },
    { id: 5, sender: 'customer', content: 'Perfect, I\'ll go with the replacement. Thanks for the quick help!', timestamp: '10:20 AM' },
    { id: 6, sender: 'ai', content: 'You\'re welcome, Rahul! I\'ve noted your preference for a replacement. Once you submit the request through your order history, our fulfillment team will process it right away. Is there anything else I can help you with?', timestamp: '10:20 AM' },
  ],
};

export default function ConversationDetail() {
  const { id } = useParams();
  const [replyText, setReplyText] = useState('');
  const conv = demoConversation; // In real app, fetch by id
  console.log('Loading conversation:', id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/conversations" className="p-2 rounded-lg hover:bg-white/5 text-surface-400">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white">{conv.customerName}</h2>
            <span className="badge badge-success">
              <CheckCircle className="w-3 h-3" />
              Resolved
            </span>
          </div>
          <p className="text-sm text-surface-500">{conv.customerEmail} &middot; Started {conv.createdAt}</p>
        </div>
        <Link to="/tickets" className="btn btn-secondary btn-sm">
          <Ticket className="w-4 h-4" />
          Create Ticket
        </Link>
      </div>

      {/* Messages */}
      <div className="rounded-2xl glass p-6">
        <div className="space-y-6">
          {conv.messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.sender === 'customer' ? '' : ''}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                msg.sender === 'ai' ? 'bg-primary-500/10 border border-primary-500/20' :
                msg.sender === 'agent' ? 'bg-blue-500/10 border border-blue-500/20' :
                'bg-surface-700'
              }`}>
                {msg.sender === 'ai' ? (
                  <Bot className="w-4 h-4 text-primary-400" />
                ) : msg.sender === 'agent' ? (
                  <User className="w-4 h-4 text-blue-400" />
                ) : (
                  <User className="w-4 h-4 text-surface-300" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-white">
                    {msg.sender === 'ai' ? 'AI Assistant' : msg.sender === 'agent' ? 'Support Agent' : conv.customerName}
                  </span>
                  <span className="text-xs text-surface-600">{msg.timestamp}</span>
                </div>
                <div className={`px-4 py-3 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.sender === 'customer'
                    ? 'bg-white/[0.03] border border-white/[0.06] text-surface-300'
                    : msg.sender === 'ai'
                    ? 'bg-primary-500/[0.06] border border-primary-500/10 text-surface-200'
                    : 'bg-blue-500/[0.06] border border-blue-500/10 text-surface-200'
                }`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reply Box */}
        <div className="mt-6 pt-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type a reply as support agent..."
              className="input flex-1"
            />
            <button className="btn btn-primary px-4 py-3">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
