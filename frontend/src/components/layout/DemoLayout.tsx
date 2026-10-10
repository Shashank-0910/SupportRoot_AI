import { Link, Outlet, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Bot,
  MessageSquare,
  Ticket,
  BarChart3,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { SupportrootLogo } from '../branding/SupportrootLogo';

const navItems = [
  { path: '/demo', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { path: '/demo/knowledge-base', label: 'Knowledge Base', icon: BookOpen },
  { path: '/demo/assistant', label: 'AI Assistant', icon: Bot },
  { path: '/demo/conversations', label: 'Conversations', icon: MessageSquare },
  { path: '/demo/tickets', label: 'Tickets', icon: Ticket },
  { path: '/demo/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function DemoLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-surface-900 font-sans">
      <aside className="hidden md:flex w-[240px] flex-col bg-surface-850 border-r border-white/5 shrink-0">
          <div className="flex items-center gap-3 h-16 px-4 border-b border-white/5">
            <SupportrootLogo className="w-7 h-7 text-primary-400" strokeWidth={1.75} />
            <span className="text-lg font-bold text-white tracking-tight">
              Supportroot<span className="text-primary-400">AI</span>
            </span>
          </div>

        <div className="mx-3 mt-3 px-3 py-2 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-primary-400" />
          <span className="text-xs font-medium text-primary-300">Demo Mode</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ path, label, icon: Icon, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/5">
          <Link
            to="/"
            className="sidebar-link w-full text-surface-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5 flex-shrink-0" />
            <span>Back to Home</span>
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="h-14 md:h-16 flex items-center justify-between gap-3 px-4 md:px-6 border-b border-white/5 bg-surface-850/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/"
              className="md:hidden p-2 rounded-lg hover:bg-white/5 text-surface-400"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-base md:text-lg font-semibold text-white">Demo Dashboard</h1>
              <p className="text-xs text-surface-500 hidden sm:block">
                Sample metrics · no account required
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link to="/register" className="btn btn-ghost btn-sm hidden sm:inline-flex">
              Sign up free
            </Link>
            <div className="flex items-center gap-2.5 pl-2 border-l border-white/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-sm font-semibold">
                D
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-white leading-tight">Demo User</p>
                <p className="text-xs text-surface-500 leading-tight">Demo Workspace</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
