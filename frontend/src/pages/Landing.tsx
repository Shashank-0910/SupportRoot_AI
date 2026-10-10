import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Bot,
  BookOpen,
  Ticket,
  BarChart3,
  Users,
  Globe,
  FileText,
  Check,
  ChevronDown,
  Sparkles,
  AlertTriangle,
  Search,
} from 'lucide-react';
import '../components/marketing/home-sections.css';

export default function Landing() {
  return (
    <>
      <Hero />
      <Trust />
      <InteractiveDemo />
      <CoreFeatures />
      <BentoGrid />
      <HowItWorks />
      <KnowledgePipeline />
      <AnalyticsShowcase />
      <HumanHandoff />
      <SocialProof />
      <FAQ />
      <FinalCTA />
    </>
  );
}

/* ---------- shared helpers ---------- */

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="hp-label">{children}</p>;
}

function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold, rootMargin: '0px 0px -8% 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function CountUp({ end, suffix = '', decimals = 0 }: { end: number; suffix?: string; decimals?: number }) {
  const { ref, visible } = useInView<HTMLSpanElement>(0.5);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!visible) return;
    let frame = 0;
    const duration = 1200;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(end * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [visible, end]);

  return (
    <span ref={ref} className={visible ? 'count-up-visible' : ''}>
      {decimals ? value.toFixed(decimals) : Math.round(value).toLocaleString()}
      {suffix}
    </span>
  );
}

/* ---------- 2. HERO ---------- */

function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 md:pt-32 md:pb-24">
      <div className="absolute inset-0 hero-grid opacity-60" />
      <div className="absolute inset-0 hero-radial" />
      <div className="absolute top-24 left-1/4 w-[30rem] h-[30rem] bg-primary-500/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/5 w-[24rem] h-[24rem] bg-primary-700/10 rounded-full blur-[110px] pointer-events-none" />

      <div className="relative marketing-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <p className="text-sm font-semibold text-primary-400 mb-4 tracking-wide">
              Supportroot Ai
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-bold text-white leading-[1.1] tracking-tight mb-4">
              Turn every customer question into an{' '}
              <span className="text-gradient-shine">instant answer.</span>
            </h1>
            <p className="text-xl sm:text-2xl font-semibold text-surface-200 mb-5">
              Your knowledge. Your AI support team.
            </p>
            <p className="text-base sm:text-lg text-surface-400 max-w-xl mb-8 leading-relaxed">
              Supportroot Ai transforms your documentation, FAQs and website into an intelligent
              customer-support assistant that works around the clock.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="btn btn-primary btn-lg magnetic-btn">
                Start Building
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/demo" className="btn btn-secondary btn-lg">
                Explore Demo
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="hero-chat overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-primary-400" />
                  <span className="text-sm font-semibold text-white">AI Support Assistant</span>
                </div>
                <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </span>
              </div>
              <div className="p-5 space-y-4 min-h-[280px]">
                <p className="text-sm text-surface-500 text-center">How can I help you today?</p>
                <div className="flex justify-end">
                  <div className="max-w-[85%] px-3.5 py-2.5 rounded-2xl rounded-tr-md bg-primary-600/25 border border-primary-500/20 text-sm text-surface-100">
                    What&apos;s your refund policy?
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-lg bg-primary-500/15 border border-primary-500/20 flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5 text-primary-400" />
                  </div>
                  <div className="max-w-[85%] px-3.5 py-2.5 rounded-2xl rounded-tl-md bg-white/[0.04] border border-white/[0.06] text-sm text-surface-200 leading-relaxed">
                    Customers can request a refund within 30 days of purchase. Refunds are
                    typically processed within 5–7 business days.
                  </div>
                </div>
              </div>
              <div className="px-4 pb-4">
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="flex-1 text-sm text-surface-500">Ask anything...</span>
                  <span className="w-7 h-7 rounded-lg bg-primary-500/20 flex items-center justify-center text-primary-300 text-xs">
                    ↑
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 3. TRUST ---------- */

function Trust() {
  const logos = ['Acme', 'Nova', 'Vertex', 'Orbit', 'Pulse', 'Helix'];

  return (
    <section className="border-t border-white/5 py-12 md:py-16">
      <div className="marketing-container">
        <p className="text-center text-surface-400 mb-8 max-w-lg mx-auto">
          Built for teams that care about every conversation.
        </p>
        <p className="text-center text-xs font-semibold uppercase tracking-wider text-surface-500 mb-6">
          Trusted by growing teams · demo brands
        </p>
        <div className="overflow-hidden mb-12 mask-fade">
          <div className="logo-marquee text-surface-500 text-lg font-semibold tracking-wide">
            {[...logos, ...logos].map((name, i) => (
              <span key={`${name}-${i}`} className="opacity-50 hover:opacity-90 transition-opacity">
                {name}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { value: 10, suffix: 'K+', label: 'Messages*', decimals: 0 },
            { value: 98.4, suffix: '%', label: 'Accuracy*', decimals: 1 },
            { value: 24, suffix: '/7', label: 'Availability*', decimals: 0 },
            { value: 2.5, suffix: 's', label: 'Response*', decimals: 1 },
          ].map((m) => (
            <div key={m.label} className="marketing-card text-center py-6">
              <p className="text-3xl font-bold text-white tracking-tight">
                {m.label.includes('Response') ? '<' : ''}
                <CountUp end={m.value} suffix={m.suffix} decimals={m.decimals} />
              </p>
              <p className="text-xs text-surface-500 mt-2">{m.label}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-[11px] text-surface-600 mt-4">
          * Sample / prototype metrics for demonstration only
        </p>
      </div>
    </section>
  );
}

/* ---------- 4. INTERACTIVE DEMO ---------- */

function InteractiveDemo() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 2200),
      setTimeout(() => setPhase(3), 3800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <section id="demo" className="hp-section border-t border-white/5">
      <div className="marketing-container">
        <div className="max-w-2xl mb-10">
          <SectionLabel>Live preview</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
            Don&apos;t just read about AI support. Try it.
          </h2>
          <p className="text-surface-400 leading-relaxed">
            Watch Supportroot retrieve from your knowledge base — this is how RAG feels to a customer.
          </p>
        </div>

        <div className="max-w-2xl mx-auto marketing-card p-6 sm:p-8 space-y-5">
          <div className="flex justify-end">
            <div className="px-4 py-3 rounded-2xl rounded-tr-md bg-primary-600/20 border border-primary-500/20 text-sm text-surface-100 max-w-[90%]">
              Can I return my order after 20 days?
            </div>
          </div>

          {phase >= 1 && (
            <div className="space-y-3 animate-fade-in-up">
              <div className="flex items-center gap-2 text-sm text-surface-400">
                <Search className="w-4 h-4 text-primary-400 animate-pulse" />
                Searching knowledge base...
              </div>
              <div className="progress-bar">
                <span />
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 text-xs">
                  <Check className="w-3 h-3" /> Refund Policy.pdf
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 text-xs">
                  <Check className="w-3 h-3" /> Customer FAQ.pdf
                </span>
              </div>
            </div>
          )}

          {phase >= 2 && (
            <div className="flex gap-3 animate-fade-in-up">
              <div className="w-8 h-8 rounded-lg bg-primary-500/15 border border-primary-500/20 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-primary-400" />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-white/[0.04] border border-white/[0.06] text-sm text-surface-200 leading-relaxed">
                Yes. According to your company&apos;s refund policy, customers can request a refund
                within 30 days of purchase.
              </div>
            </div>
          )}

          {phase >= 3 && (
            <div className="pt-2 border-t border-white/5 animate-fade-in-up">
              <p className="text-xs font-semibold text-surface-500 mb-2">Sources used</p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs text-surface-300">
                  <FileText className="w-3.5 h-3.5 text-primary-400" /> Refund Policy
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-surface-300">
                  <FileText className="w-3.5 h-3.5 text-primary-400" /> Customer FAQ
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------- 5. CORE FEATURES ---------- */

function CoreFeatures() {
  const features = [
    { icon: Bot, title: 'AI Support', desc: 'Answer customer questions instantly using your business knowledge.' },
    { icon: BookOpen, title: 'Knowledge Base', desc: 'Upload PDFs, FAQs, documentation and website content.' },
    { icon: Users, title: 'Human Handoff', desc: 'When AI needs help, seamlessly route conversations to your team.' },
    { icon: Ticket, title: 'Smart Tickets', desc: 'Turn unresolved conversations into actionable support tickets.' },
    { icon: BarChart3, title: 'Analytics', desc: 'Understand what’s happening across every customer conversation.' },
    { icon: Globe, title: 'Multi-language', desc: 'Support customers across languages and markets.' },
  ];

  return (
    <section id="features" className="hp-section border-t border-white/5">
      <div className="marketing-container">
        <div className="max-w-2xl mb-12">
          <SectionLabel>Features</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
            Everything your support team needs.
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className="bento-card">
              <div className="w-11 h-11 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-surface-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 6. BENTO ---------- */

function BentoGrid() {
  return (
    <section id="product" className="hp-section border-t border-white/5">
      <div className="marketing-container">
        <div className="max-w-2xl mb-12">
          <SectionLabel>Platform</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            One platform. Every support workflow.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-5 auto-rows-fr">
          <div className="bento-card md:col-span-2 md:row-span-2 min-h-[260px] flex flex-col">
            <p className="text-xs font-semibold text-primary-400 mb-2">AI CUSTOMER SUPPORT</p>
            <h3 className="text-xl font-bold text-white mb-4">Live chat preview</h3>
            <div className="flex-1 rounded-xl bg-surface-900/80 border border-white/5 p-4 space-y-3">
              <div className="text-xs text-surface-500">Customer · just now</div>
              <p className="text-sm text-surface-200">Where is my order #4821?</p>
              <div className="text-xs text-primary-400">AI · 1.2s</div>
              <p className="text-sm text-surface-300">
                Your order shipped yesterday via Express. ETA: tomorrow 2–5 PM.
              </p>
            </div>
          </div>

          <div className="bento-card">
            <BookOpen className="w-5 h-5 text-primary-400 mb-3" />
            <h3 className="font-semibold text-white mb-1">Knowledge Base</h3>
            <p className="text-3xl font-bold text-white tracking-tight">2,438</p>
            <p className="text-xs text-surface-500 mt-1">docs indexed · demo</p>
          </div>

          <div className="bento-card">
            <AlertTriangle className="w-5 h-5 text-amber-400 mb-3" />
            <h3 className="font-semibold text-white mb-1">Human Handoff</h3>
            <p className="text-3xl font-bold text-white tracking-tight">12</p>
            <p className="text-xs text-surface-500 mt-1">open tickets · demo</p>
          </div>

          <div className="bento-card md:col-span-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <BarChart3 className="w-5 h-5 text-emerald-400 mb-3" />
                <h3 className="font-semibold text-white mb-1">Analytics</h3>
                <p className="text-sm text-surface-400">79% AI resolved this week</p>
              </div>
              <div className="flex items-end gap-1 h-14">
                {[40, 55, 45, 70, 60, 85, 75].map((h, i) => (
                  <div
                    key={i}
                    className="w-3 rounded-t bg-gradient-to-t from-primary-600 to-primary-400 opacity-80"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="bento-card md:col-span-3 text-center py-8">
            <p className="text-sm font-semibold tracking-wide text-primary-300 mb-2">
              KNOWLEDGE → AI → CUSTOMER
            </p>
            <p className="text-surface-400 text-sm">
              Your docs become answers. Instantly. Around the clock.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 7. HOW IT WORKS ---------- */

function HowItWorks() {
  const steps = [
    {
      n: '01',
      title: 'Connect your knowledge',
      desc: 'Upload your documentation, FAQs, PDFs or website.',
      visual: ['PDF', 'Processing', '✓ Knowledge Ready'],
    },
    {
      n: '02',
      title: 'Supportroot understands',
      desc: 'Your information becomes searchable AI knowledge.',
      visual: ['Documents', 'Chunks', 'Embeddings', 'Knowledge Base'],
    },
    {
      n: '03',
      title: 'Customers get answers',
      desc: 'Your AI assistant uses that knowledge to answer instantly.',
      visual: ['Customer', 'Question', 'Supportroot Ai', 'Answer'],
    },
  ];

  return (
    <section id="solutions" className="hp-section border-t border-white/5">
      <div className="marketing-container">
        <div className="max-w-2xl mb-12">
          <SectionLabel>How it works</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
            From upload to answers in three steps
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div key={s.n} className="marketing-card">
              <span className="text-xs font-bold text-primary-400 tracking-wider">{s.n}</span>
              <h3 className="text-lg font-semibold text-white mt-2 mb-2">{s.title}</h3>
              <p className="text-sm text-surface-400 mb-5 leading-relaxed">{s.desc}</p>
              <div className="space-y-2">
                {s.visual.map((v, i) => (
                  <div key={v} className="flex items-center gap-2 text-xs text-surface-300">
                    <span className="text-primary-400">{i === s.visual.length - 1 ? '●' : '↓'}</span>
                    {v}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 8. KNOWLEDGE PIPELINE (scroll) ---------- */

function KnowledgePipeline() {
  const { ref, visible } = useInView<HTMLDivElement>(0.25);
  const stages = [
    { title: 'YOUR KNOWLEDGE', body: 'PDFs · FAQs · Website · Documentation' },
    { title: 'CLOUD AI', body: 'Retrieval → Context → Intelligence' },
    { title: 'HAPPY CUSTOMERS', body: 'Fast answers. Better support.' },
  ];
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => setActive((a) => (a + 1) % stages.length), 2200);
    return () => clearInterval(id);
  }, [visible, stages.length]);

  return (
    <section className="hp-section border-t border-white/5">
      <div className="marketing-container" ref={ref}>
        <div className="max-w-2xl mb-12 mx-auto text-center">
          <SectionLabel>Architecture</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
            Knowledge → AI → Customer
          </h2>
          <p className="text-surface-400">
            The signature flow behind Supportroot — how your data becomes support.
          </p>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {stages.map((s, i) => (
            <div key={s.title} className={`pipeline-stage ${active === i ? 'active' : ''}`}>
              <p className="text-sm font-bold tracking-widest text-primary-300 mb-2">{s.title}</p>
              <p className="text-surface-300">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 9. ANALYTICS ---------- */

function AnalyticsShowcase() {
  const questions = [
    { q: 'Refunds', p: 32 },
    { q: 'Shipping', p: 24 },
    { q: 'Payments', p: 18 },
    { q: 'Product', p: 15 },
    { q: 'Other', p: 11 },
  ];

  return (
    <section id="analytics" className="hp-section border-t border-white/5">
      <div className="marketing-container">
        <div className="max-w-2xl mb-10">
          <SectionLabel>Analytics</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
            Know what your customers are asking.
          </h2>
        </div>

        <div className="marketing-card p-6 sm:p-8">
          <p className="text-sm font-semibold text-white mb-6">Supportroot Analytics · demo</p>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { v: '1,248', l: 'Conversations' },
              { v: '987', l: 'AI Resolved' },
              { v: '79.1%', l: 'Resolution' },
            ].map((s) => (
              <div key={s.l}>
                <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{s.v}</p>
                <p className="text-xs text-surface-500 mt-1">{s.l}</p>
              </div>
            ))}
          </div>

          <div className="h-36 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-end px-4 pb-3 gap-2 mb-8">
            {[55, 70, 48, 90, 80, 40, 35].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-gradient-to-t from-primary-600 to-primary-400 opacity-75"
                  style={{ height: `${h}%` }}
                />
                <span className="text-[10px] text-surface-600">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                </span>
              </div>
            ))}
          </div>

          <p className="text-sm font-semibold text-white mb-4">Top Customer Questions</p>
          <div className="space-y-3">
            {questions.map((item) => (
              <div key={item.q} className="flex items-center gap-3">
                <span className="text-sm text-surface-300 w-20">{item.q}</span>
                <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary-500/80"
                    style={{ width: `${item.p}%` }}
                  />
                </div>
                <span className="text-xs text-surface-500 w-8 text-right">{item.p}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 10. HUMAN HANDOFF ---------- */

function HumanHandoff() {
  return (
    <section id="handoff" className="hp-section border-t border-white/5">
      <div className="marketing-container">
        <div className="max-w-2xl mb-12">
          <SectionLabel>Human handoff</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
            AI when it can. Humans when it matters.
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="marketing-card space-y-3 text-sm">
            {[
              { label: 'Customer', color: 'text-surface-200' },
              { label: 'AI Assistant', color: 'text-primary-300' },
              { label: 'Confident?', color: 'text-amber-300' },
              { label: 'YES → Answer', color: 'text-emerald-300' },
              { label: 'NO → Human Agent', color: 'text-blue-300' },
              { label: 'Resolved', color: 'text-white' },
            ].map((row, i) => (
              <div key={row.label} className="flex flex-col items-start">
                <div className={`px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/5 ${row.color} font-medium`}>
                  {row.label}
                </div>
                {i < 5 && <span className="text-surface-600 ml-6 my-1">↓</span>}
              </div>
            ))}
          </div>

          <div className="marketing-card border-amber-500/20 bg-amber-500/[0.04]">
            <div className="flex items-center gap-2 text-amber-300 text-sm font-semibold mb-4">
              <AlertTriangle className="w-4 h-4" />
              Human assistance requested
            </div>
            <p className="text-xs text-surface-500 mb-1">Customer</p>
            <p className="text-sm text-surface-200 mb-4 leading-relaxed">
              My payment was deducted but my order wasn&apos;t created.
            </p>
            <p className="text-xs text-surface-500 mb-1">AI Summary</p>
            <p className="text-sm text-surface-300 mb-6 leading-relaxed">
              Payment-related issue requiring human verification.
            </p>
            <button type="button" className="btn btn-primary btn-sm magnetic-btn">
              Take Over Conversation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 11. SOCIAL PROOF ---------- */

function SocialProof() {
  return (
    <section className="hp-section border-t border-white/5">
      <div className="marketing-container text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-10">
          Support that scales with your business.
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-4xl mx-auto">
          {[
            { v: '10K+', l: 'Questions*' },
            { v: '79%', l: 'AI Resolved*' },
            { v: '24/7', l: 'Availability*' },
            { v: '<2.5s', l: 'Avg Response*' },
          ].map((m) => (
            <div key={m.l} className="marketing-card py-8">
              <p className="text-3xl font-bold text-white tracking-tight">{m.v}</p>
              <p className="text-xs text-surface-500 mt-2">{m.l}</p>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-surface-600 mt-5">* Demo / sample metrics</p>
      </div>
    </section>
  );
}

/* ---------- 12. FAQ ---------- */

function FAQ() {
  const items = [
    {
      q: 'What is Supportroot Ai?',
      a: 'Supportroot Ai is an AI-powered customer support platform that uses a company’s own knowledge to answer customer questions.',
    },
    {
      q: 'What can I upload?',
      a: 'PDFs, FAQs, documentation and website content.',
    },
    {
      q: 'Does Supportroot replace human support agents?',
      a: 'No. The platform automates repetitive questions while allowing unresolved conversations to be handed to human agents.',
    },
    {
      q: 'How does the AI know about my business?',
      a: 'The final system will use a RAG architecture to retrieve relevant information from your connected knowledge base before generating an answer.',
    },
    {
      q: 'Can I integrate my website?',
      a: 'Yes. Website crawling is part of the planned knowledge ingestion system.',
    },
  ];
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="hp-section border-t border-white/5">
      <div className="marketing-container max-w-3xl">
        <SectionLabel>FAQ</SectionLabel>
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-8">
          Questions, answered
        </h2>
        <div>
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="faq-item">
                <button
                  type="button"
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <span className="text-sm font-semibold text-white">{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-surface-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-sm text-surface-400 leading-relaxed border-t border-white/5 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- 13. FINAL CTA ---------- */

function FinalCTA() {
  return (
    <section className="hp-section border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 hero-grid opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary-600/10 via-transparent to-transparent" />
      <div className="relative marketing-container text-center max-w-3xl">
        <Sparkles className="w-8 h-8 text-primary-400 mx-auto mb-5" />
        <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4 leading-tight">
          Your support team shouldn&apos;t answer the same question twice.
        </h2>
        <p className="text-surface-400 text-lg mb-8 leading-relaxed">
          Give your customers instant answers powered by your own knowledge.
        </p>
        <Link to="/register" className="btn btn-primary btn-lg magnetic-btn inline-flex">
          Build Your AI Support Agent
          <ArrowRight className="w-5 h-5" />
        </Link>
        <div className="mt-6">
          <Link to="/demo" className="text-sm text-primary-400 hover:text-primary-300 font-medium">
            Or explore the demo dashboard →
          </Link>
        </div>
      </div>
    </section>
  );
}
