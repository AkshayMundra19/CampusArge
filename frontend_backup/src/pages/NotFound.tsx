import { Link } from 'react-router-dom';
import { SearchX, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="pt-32 pb-20 min-h-screen flex items-center justify-center">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
        <div className="w-24 h-24 mx-auto bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-8 shadow-sm">
          <SearchX className="w-12 h-12 text-slate-400" />
        </div>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-slate-900 dark:text-white mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/" className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Return Home
          </Link>
          <Link to="/institutions" className="btn-secondary w-full sm:w-auto">
            Browse Institutions
          </Link>
        </div>
      </div>
    </div>
  );
}
