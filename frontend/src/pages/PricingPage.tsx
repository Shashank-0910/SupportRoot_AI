import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: '$29',
    description: 'Perfect for small businesses just getting started.',
    features: [
      '500 AI conversations/mo',
      '1 Knowledge Base',
      '3 Team Members',
      'Email Support',
      'Basic Analytics',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Professional',
    price: '$79',
    description: 'For growing teams that need advanced features.',
    features: [
      '5,000 AI conversations/mo',
      '5 Knowledge Bases',
      '10 Team Members',
      'Priority Support',
      'Advanced Analytics',
      'Custom AI Training',
      'API Access',
    ],
    cta: 'Get Started',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$199',
    description: 'For large organizations with custom requirements.',
    features: [
      'Unlimited conversations',
      'Unlimited Knowledge Bases',
      'Unlimited Team Members',
      '24/7 Dedicated Support',
      'Custom Integrations',
      'SSO & Advanced Security',
      'SLA Guarantee',
      'On-premise option',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <main className="marketing-page font-sans">
      <div className="marketing-container">
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-semibold text-primary-400 mb-3">Pricing</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4 leading-tight">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-surface-400 leading-relaxed">
            Start free for the demo, upgrade as you grow. No hidden fees.
          </p>
        </div>

        <div className="marketing-grid marketing-grid-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-7 sm:p-8 transition-all duration-300 ${
                plan.popular
                  ? 'bg-gradient-to-b from-primary-500/10 to-primary-900/10 border-2 border-primary-500/30'
                  : 'marketing-card'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary-500 text-white text-xs font-bold">
                  Most Popular
                </div>
              )}
              <h2 className="text-xl font-bold text-white mb-1">{plan.name}</h2>
              <p className="text-sm text-surface-400 mb-6 leading-relaxed">{plan.description}</p>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-bold text-white tracking-tight">{plan.price}</span>
                <span className="text-surface-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-surface-300">
                    <Check className="w-4 h-4 text-primary-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className={`btn w-full ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
