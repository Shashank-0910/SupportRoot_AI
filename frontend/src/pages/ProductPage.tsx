import { Link } from 'react-router-dom';
import { ArrowRight, Bot, BookOpen, Ticket, BarChart3, Users, Globe } from 'lucide-react';

const pillars = [
  {
    icon: Bot,
    title: 'AI Support Agent',
    description: 'Answer customer questions instantly using your own knowledge base.',
  },
  {
    icon: BookOpen,
    title: 'Knowledge Base',
    description: 'Upload PDFs, FAQs, docs and website content your AI can retrieve from.',
  },
  {
    icon: Globe,
    title: 'Website Widget',
    description: 'One script tag installs Supportroot on WordPress, Shopify, React, or plain HTML.',
  },
  {
    icon: Users,
    title: 'Human Handoff',
    description: 'Route tough conversations to your team with full context and AI summaries.',
  },
  {
    icon: Ticket,
    title: 'Smart Tickets',
    description: 'Turn unresolved chats into actionable tickets your team can close.',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'See what customers ask, how AI performs, and where humans step in.',
  },
];

export default function ProductPage() {
  return (
    <main className="marketing-page font-sans">
      <div className="marketing-container">
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-semibold text-primary-400 mb-3">Product</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4 leading-tight">
            AI customer support built on your knowledge
          </h1>
          <p className="text-lg text-surface-400 leading-relaxed">
            Supportroot Ai turns documentation into a 24/7 support agent — then embeds it on your
            website with a single script.
          </p>
        </div>

        <div className="marketing-grid marketing-grid-3">
          {pillars.map((item) => (
            <div key={item.title} className="marketing-card hover:border-primary-500/20 transition-colors">
              <div className="w-11 h-11 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mb-5">
                <item.icon className="w-5 h-5 text-primary-400" />
              </div>
              <h2 className="text-lg font-semibold text-white mb-2">{item.title}</h2>
              <p className="text-sm text-surface-400 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap gap-4">
          <Link to="/register" className="btn btn-primary">
            Start Building
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/integrations" className="btn btn-secondary">
            Website integration
          </Link>
        </div>
      </div>
    </main>
  );
}
