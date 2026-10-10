import { Link } from 'react-router-dom';
import { ArrowRight, Store, Building2, Headphones, Code2 } from 'lucide-react';

const solutions = [
  {
    icon: Store,
    title: 'E-commerce',
    description:
      'Handle refunds, shipping, and order status automatically — hand off payment disputes to humans.',
  },
  {
    icon: Building2,
    title: 'SaaS & Product',
    description:
      'Answer product, billing, and onboarding questions from your docs so your team focuses on edge cases.',
  },
  {
    icon: Headphones,
    title: 'Support teams',
    description:
      'Deflect repetitive tickets, keep full conversation history, and escalate with AI summaries.',
  },
  {
    icon: Code2,
    title: 'Agencies & builders',
    description:
      'Spin up branded AI agents for clients and install them on any stack with one snippet.',
  },
];

export default function SolutionsPage() {
  return (
    <main className="marketing-page font-sans">
      <div className="marketing-container">
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-semibold text-primary-400 mb-3">Solutions</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4 leading-tight">
            Built for teams that care about every conversation
          </h1>
          <p className="text-lg text-surface-400 leading-relaxed">
            Whether you sell products or software, Supportroot Ai meets customers where they already
            are — on your website.
          </p>
        </div>

        <div className="marketing-grid marketing-grid-2">
          {solutions.map((item) => (
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
          <Link to="/demo" className="btn btn-primary">
            Explore Demo
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/how-it-works" className="btn btn-secondary">
            See how it works
          </Link>
        </div>
      </div>
    </main>
  );
}
