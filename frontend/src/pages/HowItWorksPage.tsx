import { Link } from 'react-router-dom';
import { ArrowRight, Upload, Bot, Code2, BarChart3 } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: Upload,
    title: 'Upload Your Knowledge',
    description: 'Import PDFs, documents, FAQs, and website content into your knowledge base.',
  },
  {
    step: '02',
    icon: Bot,
    title: 'Create Your AI Agent',
    description:
      'Supportroot learns your content so it can answer from your real policies and docs.',
  },
  {
    step: '03',
    icon: Code2,
    title: 'Install on Your Website',
    description:
      'Copy one JavaScript snippet into WordPress, Shopify, React, Next.js, or plain HTML.',
  },
  {
    step: '04',
    icon: BarChart3,
    title: 'Monitor & Improve',
    description:
      'Track conversations, tickets, and AI performance — hand off to humans when needed.',
  },
];

export default function HowItWorksPage() {
  return (
    <main className="marketing-page font-sans">
      <div className="marketing-container">
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-semibold text-primary-400 mb-3">How it Works</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4 leading-tight">
            From knowledge to live chat in four steps
          </h1>
          <p className="text-lg text-surface-400 leading-relaxed">
            Upload docs, create an agent, paste a script — your website gets a Supportroot chat button.
          </p>
        </div>

        <div className="marketing-grid marketing-grid-2">
          {steps.map((step) => (
            <div key={step.step} className="marketing-card">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-surface-850 border border-white/[0.08] flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-primary-400 tracking-wider">
                    {step.step}
                  </span>
                  <step.icon className="w-5 h-5 text-surface-300 mt-0.5" />
                </div>
                <div className="min-w-0 pt-0.5">
                  <h2 className="text-lg font-semibold text-white mb-2">{step.title}</h2>
                  <p className="text-sm text-surface-400 leading-relaxed">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap gap-4">
          <Link to="/register" className="btn btn-primary">
            Get Started
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
