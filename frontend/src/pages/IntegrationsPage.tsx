import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Globe,
  Code,
  Database,
  Layers,
  Workflow,
  Mail,
  Copy,
  Check,
  MessageCircle,
} from 'lucide-react';
import { useState } from 'react';

const integrations = [
  { icon: Globe, name: 'Website Widget', desc: 'One script on any site' },
  { icon: Code, name: 'REST API', desc: 'Full API access' },
  { icon: Database, name: 'PostgreSQL', desc: 'Enterprise database' },
  { icon: Layers, name: 'Slack', desc: 'Team notifications' },
  { icon: Workflow, name: 'Zapier', desc: 'Workflow automation' },
  { icon: Mail, name: 'Email', desc: 'Email integration' },
];

const platforms = ['WordPress', 'Shopify', 'React', 'Next.js', 'Plain HTML', 'PHP'];

const snippet = `<script
  src="https://cdn.supportroot.ai/widget.js"
  data-agent-id="agent_12345">
</script>`;

export default function IntegrationsPage() {
  const [copied, setCopied] = useState(false);

  const copySnippet = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <main className="marketing-page font-sans">
      <div className="marketing-container">
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-semibold text-primary-400 mb-3">Integrations</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4 leading-tight">
            Website integration — easiest for most customers
          </h1>
          <p className="text-lg text-surface-400 leading-relaxed">
            Your site doesn&apos;t need to be React or Django. Paste one script and Supportroot appears
            as a chat button on WordPress, Shopify, Next.js, plain HTML, and more.
          </p>
        </div>

        {/* Install flow */}
        <div className="marketing-card mb-10">
          <h2 className="text-xl font-semibold text-white mb-6">From dashboard to live chat</h2>
          <ol className="space-y-3">
            {[
              'Sign up and open Supportroot Dashboard',
              'Create AI Agent',
              'Upload FAQs / PDFs / Documentation',
              'Customize chatbot',
              'Install on your website',
              'Copy JavaScript snippet',
            ].map((step, i) => (
              <li key={step} className="flex items-center gap-3 text-sm text-surface-300">
                <span className="w-7 h-7 rounded-lg bg-primary-500/15 border border-primary-500/25 flex items-center justify-center text-xs font-bold text-primary-300 shrink-0">
                  {i + 1}
                </span>
                {step}
                {i < 5 && <ArrowRight className="w-3.5 h-3.5 text-surface-600 ml-auto hidden sm:block" />}
              </li>
            ))}
          </ol>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          {/* Snippet */}
          <div className="marketing-card">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-lg font-semibold text-white">Paste this on your site</h2>
              <button type="button" onClick={copySnippet} className="btn btn-ghost btn-sm">
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="text-xs sm:text-sm text-primary-200/90 bg-black/40 border border-white/5 rounded-xl p-4 overflow-x-auto leading-relaxed font-mono">
              {snippet}
            </pre>
            <p className="text-xs text-surface-500 mt-3">That&apos;s it. No backend changes required.</p>
          </div>

          {/* Widget preview */}
          <div className="marketing-card relative min-h-[280px] overflow-hidden">
            <p className="text-sm font-semibold text-white mb-4">What visitors see</p>
            <div className="absolute bottom-6 right-6 flex flex-col items-end gap-3">
              <div className="w-64 rounded-2xl bg-surface-850 border border-white/10 shadow-2xl overflow-hidden">
                <div className="px-3 py-2.5 border-b border-white/5 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-primary-400" />
                  <span className="text-sm font-medium text-white">Supportroot Ai</span>
                </div>
                <div className="p-4 space-y-3">
                  <p className="text-sm text-surface-300">Hi! How can I help you?</p>
                  <div className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-surface-500">
                    Ask anything...
                  </div>
                </div>
              </div>
              <div className="px-4 py-2.5 rounded-full bg-primary-600 text-white text-sm font-medium shadow-lg shadow-primary-500/30 flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Supportroot Ai
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-surface-500 mb-4">Works with</p>
        <div className="flex flex-wrap gap-2 mb-12">
          {platforms.map((p) => (
            <span
              key={p}
              className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-surface-300"
            >
              {p}
            </span>
          ))}
        </div>

        <div className="marketing-grid marketing-grid-3 mb-14">
          {integrations.map((item) => (
            <div
              key={item.name}
              className="marketing-card flex items-center gap-4 hover:border-primary-500/25 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                <item.icon className="w-6 h-6 text-primary-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">{item.name}</p>
                <p className="text-xs text-surface-500 mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-4">
          <Link to="/register" className="btn btn-primary">
            Get your agent ID
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/demo" className="btn btn-secondary">
            Explore Demo
          </Link>
        </div>
      </div>
    </main>
  );
}
