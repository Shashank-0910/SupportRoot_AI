import { useEffect, useState } from 'react';
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import { ArrowRight, Menu, X } from 'lucide-react';
import { SupportrootLogo } from '../branding/SupportrootLogo';

const navLinks = [
  { to: '/product', label: 'Product' },
  { to: '/solutions', label: 'Solutions' },
  { to: '/how-it-works', label: 'How it Works' },
  { to: '/integrations', label: 'Integrations' },
  { to: '/pricing', label: 'Pricing' },
];

export function MarketingNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 font-sans transition-all duration-300 ${
        scrolled
          ? 'bg-surface-900/80 backdrop-blur-xl border-b border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.35)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="marketing-container">
        <div className="flex items-center justify-between h-16 gap-3">
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <SupportrootLogo className="w-7 h-7 text-primary-400 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.75} />
            <span className="text-lg font-bold text-white tracking-tight">
              Supportroot<span className="text-primary-400">AI</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) =>
                  `px-2.5 xl:px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-white bg-white/5'
                      : 'text-surface-400 hover:text-white hover:bg-white/[0.03]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3 shrink-0">
            <Link to="/login" className="btn btn-ghost btn-sm">
              Log in
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm magnetic-btn">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-surface-400 hover:text-white hover:bg-white/5"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4 border-t border-white/5 pt-3 space-y-1 bg-surface-900/95 backdrop-blur-xl">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-surface-400 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-3 pt-3 px-1">
              <Link to="/login" className="btn btn-ghost btn-sm flex-1">
                Log in
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm flex-1">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export function MarketingFooter() {
  const columns = {
    Product: [
      { label: 'Product', to: '/product' },
      { label: 'How it Works', to: '/how-it-works' },
      { label: 'Integrations', to: '/integrations' },
      { label: 'Solutions', to: '/solutions' },
    ],
    Company: [
      { label: 'About', to: '/product' },
      { label: 'Contact', to: '/pricing' },
      { label: 'Careers', to: '/solutions' },
    ],
    Resources: [
      { label: 'Documentation', to: '/how-it-works' },
      { label: 'FAQ', to: '/#faq' },
      { label: 'Demo', to: '/demo' },
    ],
    Legal: [
      { label: 'Privacy', to: '/pricing' },
      { label: 'Terms', to: '/pricing' },
    ],
  };

  return (
    <footer className="border-t border-white/5 pt-16 pb-8 font-sans">
      <div className="marketing-container">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <SupportrootLogo className="w-7 h-7 text-primary-400" strokeWidth={1.75} />
              <span className="text-lg font-bold text-white tracking-tight">
                Supportroot<span className="text-primary-400">AI</span>
              </span>
            </div>
            <p className="text-sm text-surface-500 max-w-xs leading-relaxed">
              AI-powered customer support for modern businesses.
            </p>
          </div>

          {Object.entries(columns).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-white mb-4">{title}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="text-sm text-surface-500 hover:text-surface-300 transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-surface-600">
            &copy; {new Date().getFullYear()} Supportroot Ai
          </p>
          <p className="text-sm text-surface-600">Prototype metrics shown for demo</p>
        </div>
      </div>
    </footer>
  );
}

export default function MarketingLayout() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
      return;
    }
    const id = location.hash.replace('#', '');
    const t = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
    return () => window.clearTimeout(t);
  }, [location.pathname, location.hash]);

  return (
    <div className="min-h-screen bg-surface-900 font-sans antialiased">
      <MarketingNavbar />
      <Outlet />
      <MarketingFooter />
    </div>
  );
}
