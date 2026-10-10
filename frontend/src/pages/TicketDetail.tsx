import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  AlertCircle,
  User,
  Bot,
  CheckCircle,
  MessageSquare,
  Send,
  Lightbulb,
  Loader2,
  Clock,
} from 'lucide-react';
import { supportApi, type Ticket } from '../api/support';

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function TicketDetail() {
  const { id } = useParams();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [status, setStatus] = useState<Ticket['status']>('open');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    supportApi
      .getTicket(id)
      .then((data) => {
        setTicket(data);
        setStatus(data.status);
        setReplyText('');
      })
      .catch(() => setError('Ticket not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (next: Ticket['status']) => {
    if (!ticket) return;
    setStatus(next);
    setSaving(true);
    try {
      const updated = await supportApi.updateTicket(ticket.id, { status: next });
      setTicket(updated);
    } catch {
      setError('Could not update status.');
      setStatus(ticket.status);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-surface-400 gap-2">
        <Loader2 className="w-5 h-5 animate-spin" />
        Loading ticket...
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-24">
        <p className="text-surface-400">{error || 'Ticket not found'}</p>
        <Link to="/tickets" className="btn btn-secondary btn-sm mt-4 inline-flex">
          Back to tickets
        </Link>
      </div>
    );
  }

  const priorityBadge =
    ticket.priority === 'high' ? (
      <span className="badge badge-danger">
        <AlertCircle className="w-3 h-3" /> High
      </span>
    ) : ticket.priority === 'medium' ? (
      <span className="badge badge-warning">
        <Clock className="w-3 h-3" /> Medium
      </span>
    ) : (
      <span className="badge badge-info">Low</span>
    );

  const timeline = [
    {
      time: formatWhen(ticket.created_at),
      event: ticket.conversation_id
        ? 'Ticket created from conversation escalation'
        : 'Ticket created',
      type: 'created',
    },
    ...(ticket.ai_analysis
      ? [{ time: formatWhen(ticket.created_at), event: 'AI analysis completed', type: 'ai' }]
      : []),
    {
      time: formatWhen(ticket.created_at),
      event: `Assigned to ${ticket.assigned_to}`,
      type: 'assigned',
    },
    {
      time: formatWhen(ticket.updated_at),
      event: `Status: ${status.replace('_', ' ')}`,
      type: 'priority',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/tickets" className="p-2 rounded-lg hover:bg-white/5 text-surface-400">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-lg font-mono font-bold text-primary-400">
              {ticket.ticket_number}
            </span>
            <h2 className="text-xl font-bold text-white">{ticket.subject}</h2>
            {priorityBadge}
          </div>
          <p className="text-sm text-surface-500 mt-1">
            {ticket.customer_name} · {formatWhen(ticket.created_at)} · Assigned to{' '}
            {ticket.assigned_to}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={status}
            onChange={(e) => updateStatus(e.target.value as Ticket['status'])}
            className="input w-auto text-sm"
            disabled={saving}
          >
            <option value="open">Open</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl glass p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-surface-400" />
              <span className="text-sm font-medium text-white">Customer Message</span>
            </div>
            <p className="text-sm text-surface-300 leading-relaxed whitespace-pre-wrap">
              {ticket.description || 'No description provided.'}
            </p>
            {ticket.conversation_id && (
              <Link
                to="/assistant"
                className="inline-flex items-center gap-2 mt-4 text-sm text-primary-400 hover:text-primary-300"
              >
                <MessageSquare className="w-4 h-4" />
                Open AI Assistant
              </Link>
            )}
          </div>

          {ticket.ai_analysis && (
            <div className="rounded-2xl bg-primary-500/[0.06] border border-primary-500/10 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Bot className="w-4 h-4 text-primary-400" />
                <span className="text-sm font-medium text-white">AI Analysis</span>
              </div>
              <p className="text-sm text-surface-300 leading-relaxed">{ticket.ai_analysis}</p>
            </div>
          )}

          {ticket.suggested_response && (
            <div className="rounded-2xl bg-emerald-500/[0.06] border border-emerald-500/10 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-white">Suggested Response</span>
              </div>
              <p className="text-sm text-surface-300 leading-relaxed">
                {ticket.suggested_response}
              </p>
              <button
                onClick={() => setReplyText(ticket.suggested_response)}
                className="btn btn-sm btn-secondary mt-4"
              >
                Use This Response
              </button>
            </div>
          )}

          <div className="rounded-2xl glass p-6">
            <div className="flex items-center gap-2 mb-4">
              <Send className="w-4 h-4 text-surface-400" />
              <span className="text-sm font-medium text-white">Agent Reply</span>
            </div>
            <textarea
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your response to the customer..."
              className="input resize-none mb-4"
            />
            <div className="flex items-center justify-between">
              <button className="btn btn-ghost btn-sm text-surface-500" type="button">
                Save as Draft
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateStatus('resolved')}
                  className="btn btn-secondary btn-sm"
                  type="button"
                >
                  <CheckCircle className="w-4 h-4" />
                  Send & Resolve
                </button>
                <button className="btn btn-primary btn-sm" type="button">
                  <Send className="w-4 h-4" />
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl glass p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Details</h3>
            <div className="space-y-4">
              {[
                {
                  label: 'Status',
                  value: status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
                },
                {
                  label: 'Priority',
                  value: ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1),
                },
                { label: 'Assigned To', value: ticket.assigned_to },
                { label: 'Customer', value: ticket.customer_name },
                { label: 'Email', value: ticket.customer_email || '—' },
                { label: 'Created', value: formatWhen(ticket.created_at) },
              ].map((detail, i) => (
                <div key={i} className="flex items-center justify-between gap-4">
                  <span className="text-xs text-surface-500">{detail.label}</span>
                  <span className="text-sm text-surface-200 text-right">{detail.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl glass p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Timeline</h3>
            <div className="space-y-4">
              {timeline.map((event, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 ${
                        event.type === 'created'
                          ? 'bg-primary-400'
                          : event.type === 'ai'
                            ? 'bg-emerald-400'
                            : event.type === 'assigned'
                              ? 'bg-blue-400'
                              : 'bg-amber-400'
                      }`}
                    />
                    {i < timeline.length - 1 && <div className="w-px h-full bg-white/5 mt-1" />}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm text-surface-300">{event.event}</p>
                    <p className="text-xs text-surface-600 mt-0.5">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
