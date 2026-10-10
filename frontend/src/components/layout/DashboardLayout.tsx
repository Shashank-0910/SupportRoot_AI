import { Outlet, NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Bot,
  MessageSquare,
  Ticket,
  BarChart3,
  Settings,
  Bell,
  Search,
  LogOut,
  ChevronLeft,
  Menu,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { SupportrootLogo } from '../branding/SupportrootLogo';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/knowledge-base', label: 'Knowledge Base', icon: BookOpen },
  { path: '/assistant', label: 'AI Assistant', icon: Bot },
  { path: '/conversations', label: 'Conversations', icon: MessageSquare },
  { path: '/tickets', label: 'Tickets', icon: Ticket },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const getPageTitle = () => {
    const item = navItems.find(n => location.pathname.startsWith(n.path));
    return item?.label || 'Dashboard';
  };

  return (
    <div className="flex h-screen overflow-hidden bg-surface-900">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50
          flex flex-col bg-surface-850 border-r border-white/5
          transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'w-[72px]' : 'w-[240px]'}
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className={`flex items-center h-16 px-4 border-b border-white/5 ${sidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
          <SupportrootLogo className="w-7 h-7 text-primary-400 flex-shrink-0" strokeWidth={1.75} />
          {!sidebarCollapsed && (
            <span className="text-lg font-bold text-white tracking-tight">
              Supportroot<span className="text-primary-400">AI</span>
            </span>
          )}
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''} ${sidebarCollapsed ? 'justify-center px-0' : ''}`
              }
              title={sidebarCollapsed ? label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="px-3 py-4 border-t border-white/5">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="sidebar-link w-full hidden md:flex"
          >
            <ChevronLeft className={`w-5 h-5 flex-shrink-0 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
            {!sidebarCollapsed && <span>Collapse</span>}
          </button>
          <button onClick={logout} className={`sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 ${sidebarCollapsed ? 'justify-center px-0' : ''}`}>
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Bar */}
        <header className="h-14 md:h-16 flex items-center justify-between gap-3 px-4 md:px-6 border-b border-white/5 bg-surface-850/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-white/5 text-surface-400 shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base md:text-lg font-semibold text-white truncate">{getPageTitle()}</h1>
          </div>

          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            {/* Search */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/5 text-sm text-surface-400 w-[200px]">
              <Search className="w-4 h-4 shrink-0" />
              <span className="truncate">Search...</span>
              <kbd className="ml-auto px-1.5 py-0.5 rounded bg-white/5 text-xs text-surface-500 border border-white/10">⌘K</kbd>
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-white/5 text-surface-400 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary-500" />
            </button>

            {/* User Avatar */}
            <div className="flex items-center gap-2.5 pl-2 md:pl-3 border-l border-white/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-sm font-semibold uppercase shrink-0">
                {user?.first_name?.[0] || user?.username?.[0] || 'U'}
              </div>
              <div className="hidden sm:block min-w-0">
                <p className="text-sm font-medium text-white leading-tight truncate max-w-[120px]">
                  {user?.first_name || user?.username}
                </p>
                <p className="text-xs text-surface-500 leading-tight truncate max-w-[120px]">
                  {user?.workspace?.name || 'Admin'}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main
          className={`flex-1 min-h-0 p-4 md:p-6 ${
            location.pathname === '/assistant' ? 'overflow-hidden flex flex-col' : 'overflow-y-auto'
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
