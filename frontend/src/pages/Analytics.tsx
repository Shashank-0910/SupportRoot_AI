import {
  BarChart3,
  CheckCircle,
  Bot,
  Users,
  Download,
  Calendar,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useState } from 'react';

// Demo Data
const volumeData = [
  { date: 'Sep 18', total: 145, resolved: 120, escalated: 25 },
  { date: 'Sep 19', total: 162, resolved: 138, escalated: 24 },
  { date: 'Sep 20', total: 138, resolved: 112, escalated: 26 },
  { date: 'Sep 21', total: 195, resolved: 168, escalated: 27 },
  { date: 'Sep 22', total: 178, resolved: 155, escalated: 23 },
  { date: 'Sep 23', total: 98, resolved: 89, escalated: 9 },
  { date: 'Sep 24', total: 82, resolved: 75, escalated: 7 },
];

const categoryData = [
  { name: 'Billing', value: 35 },
  { name: 'Technical', value: 25 },
  { name: 'Account', value: 20 },
  { name: 'Product Info', value: 15 },
  { name: 'Other', value: 5 },
];

const categoryColors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#64748b'];

const resolutionTimeData = [
  { range: '< 1m', count: 450 },
  { range: '1-5m', count: 320 },
  { range: '5-15m', count: 180 },
  { range: '15-60m', count: 90 },
  { range: '> 1h', count: 35 },
];

export default function Analytics() {
  const [dateRange, setDateRange] = useState('7d');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Analytics</h2>
          <p className="text-surface-400 text-sm mt-1">
            Track your support performance and AI effectiveness.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="input pl-10 py-1.5 text-sm w-36"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
          <button className="btn btn-secondary btn-sm">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Conversations', value: '1,248', change: '+12.3%', icon: BarChart3, color: 'text-primary-400', bg: 'bg-primary-500/10' },
          { label: 'Resolution Rate', value: '79.1%', change: '+2.4%', icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Avg AI Response', value: '1.2s', change: '-0.3s', icon: Bot, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Human Handoffs', value: '261', change: '-5.2%', icon: Users, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        ].map((kpi, i) => (
          <div key={i} className="stat-card">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
              <span className={`text-xs font-semibold ${kpi.change.startsWith('+') ? 'text-emerald-400' : kpi.change.startsWith('-') && kpi.label === 'Human Handoffs' ? 'text-emerald-400' : 'text-red-400'}`}>
                {kpi.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-white">{kpi.value}</p>
            <p className="text-xs text-surface-500 mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversation Volume Chart */}
        <div className="rounded-2xl glass p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white">Conversation Volume</h3>
            <p className="text-sm text-surface-500">Total vs Resolved conversations</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={volumeData}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="date" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e1e2e', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
              <Area type="monotone" dataKey="total" name="Total Conversations" stroke="#8b5cf6" strokeWidth={2} fill="url(#colorTotal)" />
              <Area type="monotone" dataKey="resolved" name="AI Resolved" stroke="#10b981" strokeWidth={2} fill="url(#colorResolved)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Resolution Time Distribution */}
        <div className="rounded-2xl glass p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white">Resolution Time</h3>
            <p className="text-sm text-surface-500">Distribution of conversation resolution times</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={resolutionTimeData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis dataKey="range" type="category" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ backgroundColor: '#1e1e2e', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
              />
              <Bar dataKey="count" name="Conversations" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                {resolutionTimeData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : index === 1 ? '#3b82f6' : index === 2 ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Queries by Category */}
        <div className="rounded-2xl glass p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white">Query Topics</h3>
            <p className="text-sm text-surface-500">Most common types of customer inquiries</p>
          </div>
          <div className="flex items-center justify-center h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={categoryColors[index % categoryColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e1e2e', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  iconType="circle"
                  wrapperStyle={{ fontSize: '13px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Unresolved Queries */}
        <div className="rounded-2xl glass p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Top Knowledge Gaps</h3>
              <p className="text-sm text-surface-500">Queries frequently escalated to humans</p>
            </div>
            <span className="badge badge-warning">Needs Attention</span>
          </div>
          <div className="space-y-4">
            {[
              { query: 'Enterprise custom SSO setup', count: 24, trend: '+5%' },
              { query: 'API rate limit increase request', count: 18, trend: '+12%' },
              { query: 'Invoice missing from dashboard', count: 15, trend: '-2%' },
              { query: 'Integration with custom CRM', count: 12, trend: '+8%' },
              { query: 'Bug report: Dashboard crashing', count: 8, trend: '-15%' },
            ].map((gap, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div>
                  <p className="text-sm font-medium text-white">{gap.query}</p>
                  <p className="text-xs text-surface-500 mt-1">{gap.count} escalations</p>
                </div>
                <div className={`text-xs font-semibold ${gap.trend.startsWith('+') ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {gap.trend}
                </div>
              </div>
            ))}
          </div>
          <button className="w-full btn btn-secondary mt-4">
            View All Gaps & Add to Knowledge Base
          </button>
        </div>
      </div>
    </div>
  );
}
