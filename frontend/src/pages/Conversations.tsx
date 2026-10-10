import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Search,
  Bot,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  ChevronRight,
} from 'lucide-react';

interface Conversation {
  id: number;
  customerName: string;
  lastMessage: string;
  status: 'resolved' | 'active' | 'escalated' | 'pending';
  channel: 'ai' | 'human';
  messageCount: number;
  time: string;
  date: string;
}

const demoConversations: Conversation[] = [
  { id: 1, customerName: 'Rahul Sharma', lastMessage: 'Can I get a refund for my recent order? The product arrived damaged.', status: 'resolved', channel: 'ai', messageCount: 6, time: '10:32 AM', date: 'Today' },
  { id: 2, customerName: 'Ananya Gupta', lastMessage: 'My payment failed but the amount was deducted from my account.', status: 'escalated', channel: 'human', messageCount: 8, time: '10:21 AM', date: 'Today' },
  { id: 3, customerName: 'Aman Verma', lastMessage: 'How long does delivery take to Mumbai?', status: 'resolved', channel: 'ai', messageCount: 4, time: '09:48 AM', date: 'Today' },
  { id: 4, customerName: 'Priya Singh', lastMessage: 'I want to change my subscription plan from Starter to Professional.', status: 'active', channel: 'ai', messageCount: 3, time: '09:15 AM', date: 'Today' },
  { id: 5, customerName: 'Vikram Patel', lastMessage: 'Product arrived damaged, need a replacement urgently.', status: 'escalated', channel: 'human', messageCount: 12, time: '08:52 AM', date: 'Today' },
  { id: 6, customerName: 'Neha Reddy', lastMessage: 'What are the available payment methods?', status: 'resolved', channel: 'ai', messageCount: 3, time: '08:30 AM', date: 'Today' },
  { id: 7, customerName: 'Karthik Iyer', lastMessage: 'How do I cancel my subscription?', status: 'resolved', channel: 'ai', messageCount: 5, time: '11:45 PM', date: 'Yesterday' },
  { id: 8, customerName: 'Meera Joshi', lastMessage: 'I need help setting up the API integration.', status: 'pending', channel: 'ai', messageCount: 2, time: '10:20 PM', date: 'Yesterday' },
  { id: 9, customerName: 'Arjun Kumar', lastMessage: 'Is there a student discount available?', status: 'resolved', channel: 'ai', messageCount: 4, time: '09:10 PM', date: 'Yesterday' },
  { id: 10, customerName: 'Divya Nair', lastMessage: 'My account was charged twice for the same order.', status: 'escalated', channel: 'human', messageCount: 10, time: '08:00 PM', date: 'Yesterday' },
];

export default function Conversations() {
  const location = useLocation();
  const isDemo = location.pathname.startsWith('/demo');
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = demoConversations.filter((c) => {
    if (filter !== 'all' && c.status !== filter) return false;
    if (
      searchQuery &&
      !c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const statusCounts = {
    all: demoConversations.length,
    active: demoConversations.filter((c) => c.status === 'active').length,
    resolved: demoConversations.filter((c) => c.status === 'resolved').length,
    escalated: demoConversations.filter((c) => c.status === 'escalated').length,
    pending: demoConversations.filter((c) => c.status === 'pending').length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return (
          <span className="badge badge-success">
            <CheckCircle className="w-3 h-3" /> Resolved
          </span>
        );
      case 'active':
        return (
          <span className="badge badge-info">
            <MessageSquare className="w-3 h-3" /> Active
          </span>
        );
      case 'escalated':
        return (
          <span className="badge badge-danger">
            <AlertTriangle className="w-3 h-3" /> Escalated
          </span>
        );
      case 'pending':
        return (
          <span className="badge badge-warning">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
      default:
        return null;
    }
  };

  const rowClass =
    'flex items-center gap-4 p-4 rounded-xl glass glass-hover transition-all duration-200 group';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Conversations</h2>
        <p className="text-surface-400 text-sm mt-1">
          {isDemo
            ? 'Sample conversations · sign up to open full thread detail.'
            : 'View and manage all customer conversations.'}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-with-icon"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {(['all', 'active', 'resolved', 'escalated', 'pending'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`btn btn-sm ${filter === status ? 'btn-primary' : 'btn-ghost'}`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="text-xs opacity-60 ml-1">{statusCounts[status]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filteredConversations.map((conv) => {
          const body = (
            <>
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-500/30 to-primary-700/30 border border-primary-500/20 flex items-center justify-center text-primary-300 text-sm font-semibold flex-shrink-0">
                {conv.customerName[0]}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-white">{conv.customerName}</p>
                  {conv.channel === 'ai' ? (
                    <Bot className="w-3.5 h-3.5 text-primary-400" />
                  ) : (
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                  )}
                  <span className="text-xs text-surface-600 ml-auto">
                    {conv.date}, {conv.time}
                  </span>
                </div>
                <p className="text-sm text-surface-500 truncate">{conv.lastMessage}</p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right">
                  {getStatusBadge(conv.status)}
                  <p className="text-xs text-surface-600 mt-1">{conv.messageCount} messages</p>
                </div>
                {!isDemo && (
                  <ChevronRight className="w-4 h-4 text-surface-600 group-hover:text-surface-400 transition-colors" />
                )}
              </div>
            </>
          );

          if (isDemo) {
            return (
              <div key={conv.id} className={rowClass}>
                {body}
              </div>
            );
          }

          return (
            <Link key={conv.id} to={`/conversations/${conv.id}`} className={rowClass}>
              {body}
            </Link>
          );
        })}
      </div>

      {filteredConversations.length === 0 && (
        <div className="text-center py-16">
          <MessageSquare className="w-12 h-12 text-surface-600 mx-auto mb-3" />
          <p className="text-surface-400 font-medium">No conversations found</p>
          <p className="text-surface-500 text-sm">Try adjusting your filters or search query.</p>
        </div>
      )}
    </div>
  );
}
