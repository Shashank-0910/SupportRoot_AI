import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, HelpCircle, MessageSquare, FileText } from 'lucide-react';

const resources = [
  {
    icon: BookOpen,
    title: 'Documentation',
    description: 'Learn how to upload knowledge, create agents, and install the website widget.',
    to: '/how-it-works',
    cta: 'Read overview',
  },
  {
    icon: HelpCircle,
    title: 'FAQ',
    description: 'Answers about RAG, human handoff, uploads, and website crawling.',
    to: '/#faq',
    cta: 'View FAQ',
  },
  {
    icon: MessageSquare,
    title: 'Live demo',
    description: 'Browse a sample dashboard with conversations and analytics — no signup.',
    to: '/demo',
    cta: 'Open demo',
  },
  {
    icon: FileText,
    title: 'Website integration',
    description: 'Copy one script tag and add Supportroot Ai to WordPress, Shopify, React, and more.',
    to: '/integrations',
    cta: 'Install guide',
  },
];

export default function ResourcesPage() {
  return (
    <main className="marketing-page font-sans">
      <div className="marketing-container">
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-semibold text-primary-400 mb-3">Resources</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4 leading-tight">
            Guides, demos, and answers
          </h1>
          <p className="text-lg text-surface-400 leading-relaxed">
            Everything you need to evaluate Supportroot Ai and get an agent live on your site.
          </p>
        </div>

        <div className="marketing-grid marketing-grid-2">
          {resources.map((item) => (
            <div key={item.title} className="marketing-card flex flex-col">
              <div className="w-11 h-11 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mb-5">
                <item.icon className="w-5 h-5 text-primary-400" />
              </div>
              <h2 className="text-lg font-semibold text-white mb-2">{item.title}</h2>
              <p className="text-sm text-surface-400 leading-relaxed flex-1 mb-5">{item.description}</p>
              <Link to={item.to} className="text-sm font-medium text-primary-400 hover:text-primary-300 inline-flex items-center gap-1.5">
                {item.cta}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap gap-4">
          <Link to="/register" className="btn btn-primary">
            Create free account
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/pricing" className="btn btn-secondary">
            View pricing
          </Link>
        </div>
      </div>
    </main>
  );
}
