import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Plus,
  AlertCircle,
  CheckCircle,
  Clock,
  ChevronRight,
  User,
  X,
  Ticket as TicketIcon,
  Loader2,
} from 'lucide-react';
import { supportApi, type Ticket } from '../api/support';

function formatWhen(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    subject: '',
    customer_name: '',
    customer_email: '',
    description: '',
    priority: 'medium',
    assigned_to: '',
  });

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await supportApi.listTickets({
        status: filter === 'all' ? undefined : filter,
        search: searchQuery || undefined,
      });
      setTickets(data);
    } catch {
      setError('Failed to load tickets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(load, searchQuery ? 250 : 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, searchQuery]);

  const statusCounts = {
    all: tickets.length,
    open: tickets.filter((t) => t.status === 'open').length,
    pending: tickets.filter((t) => t.status === 'pending').length,
    in_progress: tickets.filter((t) => t.status === 'in_progress').length,
    resolved: tickets.filter((t) => t.status === 'resolved').length,
  };

  // When filtering server-side, counts reflect filtered set — load all for stats when needed
  // For demo, show counts from current list (good enough).

  const handleCreate = async () => {
    if (!form.subject.trim() || !form.customer_name.trim()) return;
    setCreating(true);
    try {
      const ticket = await supportApi.createTicket({
        subject: form.subject.trim(),
        customer_name: form.customer_name.trim(),
        customer_email: form.customer_email.trim(),
        description: form.description.trim(),
        priority: form.priority,
        assigned_to: form.assigned_to.trim() || undefined,
      });
      setTickets((prev) => [ticket, ...prev]);
      setShowCreateModal(false);
      setForm({
        subject: '',
        customer_name: '',
        customer_email: '',
        description: '',
        priority: 'medium',
        assigned_to: '',
      });
    } catch {
      setError('Could not create ticket.');
    } finally {
      setCreating(false);
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return (
          <span className="badge badge-danger">
            <AlertCircle className="w-3 h-3" /> High
          </span>
        );
      case 'medium':
        return (
          <span className="badge badge-warning">
            <Clock className="w-3 h-3" /> Medium
          </span>
        );
      case 'low':
        return <span className="badge badge-info">Low</span>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <span className="badge badge-danger">Open</span>;
      case 'pending':
        return <span className="badge badge-warning">Pending</span>;
      case 'in_progress':
        return <span className="badge badge-purple">In Progress</span>;
      case 'resolved':
        return (
          <span className="badge badge-success">
            <CheckCircle className="w-3 h-3" /> Resolved
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-surface-400 text-sm">
          Manage and resolve customer support tickets.
        </p>
        <button onClick={() => setShowCreateModal(true)} className="btn btn-primary btn-sm self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          Create Ticket
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Open', count: statusCounts.open, color: 'text-red-400' },
          { label: 'Pending', count: statusCounts.pending, color: 'text-amber-400' },
          { label: 'In Progress', count: statusCounts.in_progress, color: 'text-primary-400' },
          { label: 'Resolved', count: statusCounts.resolved, color: 'text-emerald-400' },
        ].map((stat, i) => (
          <div key={i} className="stat-card">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
            <p className="text-xs text-surface-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-with-icon"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { key: 'all', label: 'All' },
            { key: 'open', label: 'Open' },
            { key: 'pending', label: 'Pending' },
            { key: 'in_progress', label: 'In Progress' },
            { key: 'resolved', label: 'Resolved' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`btn btn-sm ${filter === f.key ? 'btn-primary' : 'btn-ghost'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-surface-400 gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading tickets...
        </div>
      ) : (
        <div className="space-y-2">
          {tickets.map((ticket) => (
            <Link
              key={ticket.id}
              to={`/tickets/${ticket.id}`}
              className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl glass glass-hover transition-all duration-200 group"
            >
              <div className="text-sm font-mono font-semibold text-primary-400 w-14 sm:w-16 flex-shrink-0">
                {ticket.ticket_number}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{ticket.subject}</p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <User className="w-3 h-3 text-surface-500 shrink-0" />
                    <span className="text-xs text-surface-500 truncate">{ticket.customer_name}</span>
                  </div>
                  <span className="text-xs text-surface-600 shrink-0 hidden sm:inline">{formatWhen(ticket.created_at)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <span className="hidden sm:inline-flex">{getPriorityBadge(ticket.priority)}</span>
                {getStatusBadge(ticket.status)}
                <ChevronRight className="w-4 h-4 text-surface-600 group-hover:text-surface-400 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && tickets.length === 0 && (
        <div className="text-center py-16">
          <TicketIcon className="w-12 h-12 text-surface-600 mx-auto mb-3" />
          <p className="text-surface-400 font-medium">No tickets found</p>
          <p className="text-surface-500 text-sm">
            Create one here or escalate from the AI Assistant.
          </p>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-surface-850 border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Create Ticket</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg hover:bg-white/5 text-surface-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-2">Subject</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="Brief description of the issue"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-2">Customer</label>
                <input
                  type="text"
                  value={form.customer_name}
                  onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                  placeholder="Customer name"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-2">Email</label>
                <input
                  type="email"
                  value={form.customer_email}
                  onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
                  placeholder="customer@email.com"
                  className="input"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-2">Priority</label>
                  <select
                    className="input"
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-2">Assign To</label>
                  <input
                    type="text"
                    value={form.assigned_to}
                    onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}
                    placeholder="Agent name"
                    className="input"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-2">Description</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Detailed description..."
                  className="input resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowCreateModal(false)} className="btn btn-secondary btn-sm">
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={creating || !form.subject.trim() || !form.customer_name.trim()}
                className="btn btn-primary btn-sm"
              >
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Create Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
