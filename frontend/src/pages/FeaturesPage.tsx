import { Link } from 'react-router-dom';
import { ArrowRight, Bot, BookOpen, MessageSquare, BarChart3, Ticket, Users } from 'lucide-react';

const features = [
  {
    icon: Bot,
    title: 'AI-Powered Responses',
    description:
      'Train your AI on your business knowledge base. Get accurate, contextual responses to customer queries instantly.',
  },
  {
    icon: BookOpen,
    title: 'Smart Knowledge Base',
    description:
      'Upload documents, FAQs, and website content. Our AI learns and retrieves information automatically.',
  },
  {
    icon: MessageSquare,
    title: 'Conversation Management',
    description:
      'Track every customer interaction. View conversation history, AI responses, and agent handoffs in one place.',
  },
  {
    icon: Ticket,
    title: 'Intelligent Ticketing',
    description:
      'Auto-create tickets from unresolved queries. Prioritize, assign, and resolve with AI-suggested responses.',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Insights',
    description:
      'Monitor resolution rates, response times, and AI performance. Make data-driven support decisions.',
  },
  {
    icon: Users,
    title: 'Human-AI Handoff',
    description:
      'Seamless escalation to human agents when AI needs help. Your team steps in only when necessary.',
  },
];

export default function FeaturesPage() {
  return (
    <main className="marketing-page font-sans">
      <div className="marketing-container">
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-semibold text-primary-400 mb-3">Features</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4 leading-tight">
            Everything you need for exceptional support
          </h1>
          <p className="text-lg text-surface-400 leading-relaxed">
            From AI-powered answers to intelligent analytics, Supportroot Ai gives your team the tools
            to delight customers at scale.
          </p>
        </div>

        <div className="marketing-grid marketing-grid-3">
          {features.map((feature) => (
            <div key={feature.title} className="marketing-card hover:border-primary-500/20 transition-colors">
              <div className="w-11 h-11 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mb-5">
                <feature.icon className="w-5 h-5 text-primary-400" />
              </div>
              <h2 className="text-lg font-semibold text-white mb-2">{feature.title}</h2>
              <p className="text-sm text-surface-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap gap-4">
          <Link to="/register" className="btn btn-primary">
            Get Started
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
