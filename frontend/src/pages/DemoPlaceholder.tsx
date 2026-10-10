import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function DemoPlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-14 h-14 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mb-5">
        <Sparkles className="w-7 h-7 text-primary-400" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-primary-400 mb-2">
        Demo preview
      </p>
      <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>
      <p className="text-surface-400 max-w-md mb-8 leading-relaxed">{description}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link to="/demo" className="btn btn-secondary btn-sm">
          Back to demo dashboard
        </Link>
        <Link to="/register" className="btn btn-primary btn-sm">
          Create free account
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
