import {
  MessageSquare,
  CheckCircle,
  Clock,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Bot,
  Users,
  AlertTriangle,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../context/AuthContext';

// Demo data
const chartData = [
  { name: 'Mon', conversations: 145, resolved: 120 },
  { name: 'Tue', conversations: 162, resolved: 138 },
  { name: 'Wed', conversations: 138, resolved: 112 },
  { name: 'Thu', conversations: 195, resolved: 168 },
  { name: 'Fri', conversations: 178, resolved: 155 },
  { name: 'Sat', conversations: 98, resolved: 89 },
  { name: 'Sun', conversations: 82, resolved: 75 },
];

const recentConversations = [
  { id: 1, customer: 'Rahul Sharma', message: 'Can I get a refund for my order?', time: '10:32 AM', status: 'resolved', channel: 'ai' },
  { id: 2, customer: 'Ananya Gupta', message: 'My payment failed but amount was deducted', time: '10:21 AM', status: 'escalated', channel: 'human' },
  { id: 3, customer: 'Aman Verma', message: 'How long does delivery take to Mumbai?', time: '09:48 AM', status: 'resolved', channel: 'ai' },
  { id: 4, customer: 'Priya Singh', message: 'I want to change my subscription plan', time: '09:15 AM', status: 'pending', channel: 'ai' },
  { id: 5, customer: 'Vikram Patel', message: 'Product arrived damaged, need replacement', time: '08:52 AM', status: 'escalated', channel: 'human' },
];

const stats = [
  {
    label: 'Total Conversations',
    value: '1,248',
    change: '+12.3%',
    trend: 'up',
    icon: MessageSquare,
    color: 'text-primary-400',
    bg: 'bg-primary-500/10',
  },
  {
    label: 'AI Resolved',
    value: '987',
    change: '+8.1%',
    trend: 'up',
    icon: CheckCircle,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    label: 'Avg Response Time',
    value: '2.4s',
    change: '-18.2%',
    trend: 'down',
    icon: Clock,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    label: 'Resolution Rate',
    value: '79.1%',
    change: '+2.4%',
    trend: 'up',
    icon: TrendingUp,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
];

interface DashboardProps {
  demoName?: string;
}

export default function Dashboard({ demoName }: DashboardProps) {
  const { user } = useAuth();
  const displayName = demoName || user?.first_name || user?.username || 'there';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h2 className="text-2xl font-bold text-white">{getGreeting()}, {displayName}</h2>
        <p className="text-surface-400 text-sm mt-1">Here's what's happening with your support today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold ${
                stat.trend === 'up' ? 'text-emerald-400' : 'text-blue-400'
              }`}>
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="w-3.5 h-3.5" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5" />
                )}
                {stat.change}
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-surface-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversation Analytics Chart */}
        <div className="lg:col-span-2 rounded-2xl glass p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Conversation Analytics</h3>
              <p className="text-sm text-surface-500">Last 7 days</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />
                <span className="text-surface-400">Conversations</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-surface-400">Resolved</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorConversations" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e1e2e',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '13px',
                }}
              />
              <Area type="monotone" dataKey="conversations" stroke="#8b5cf6" strokeWidth={2} fill="url(#colorConversations)" />
              <Area type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} fill="url(#colorResolved)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Stats */}
        <div className="rounded-2xl glass p-6">
          <h3 className="text-lg font-semibold text-white mb-6">AI Performance</h3>
          <div className="space-y-6">
            {/* Resolution Donut */}
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="56" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                  <circle
                    cx="64" cy="64" r="56" fill="none"
                    stroke="url(#donutGradient)" strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${79.1 * 3.52} ${100 * 3.52}`}
                  />
                  <defs>
                    <linearGradient id="donutGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#c084fc" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute">
                  <p className="text-2xl font-bold text-white">79.1%</p>
                  <p className="text-xs text-surface-500">Resolved</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-primary-400" />
                  <span className="text-sm text-surface-300">AI Handled</span>
                </div>
                <span className="text-sm font-semibold text-white">987</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-surface-300">Human Assisted</span>
                </div>
                <span className="text-sm font-semibold text-white">261</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span className="text-sm text-surface-300">Escalated</span>
                </div>
                <span className="text-sm font-semibold text-white">48</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Conversations */}
      <div className="rounded-2xl glass p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Recent Conversations</h3>
          <a href="/conversations" className="text-sm text-primary-400 hover:text-primary-300 font-medium">
            View All
          </a>
        </div>

        <div className="space-y-2">
          {recentConversations.map((conv) => (
            <div
              key={conv.id}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer"
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500/30 to-primary-700/30 border border-primary-500/20 flex items-center justify-center text-primary-300 text-sm font-semibold flex-shrink-0">
                {conv.customer[0]}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white">{conv.customer}</p>
                  {conv.channel === 'ai' ? (
                    <Bot className="w-3.5 h-3.5 text-primary-400" />
                  ) : (
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                  )}
                </div>
                <p className="text-sm text-surface-500 truncate">{conv.message}</p>
              </div>

              {/* Meta */}
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-surface-500">{conv.time}</p>
                <span className={`badge mt-1 ${
                  conv.status === 'resolved' ? 'badge-success' :
                  conv.status === 'escalated' ? 'badge-danger' :
                  'badge-warning'
                }`}>
                  {conv.status === 'resolved' ? 'Resolved' :
                   conv.status === 'escalated' ? 'Escalated' :
                   'Pending'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
