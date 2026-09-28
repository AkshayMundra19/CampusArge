import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { InstitutionCard, INSTITUTIONS } from '@/components/InstitutionCard';

export default function FeaturedInstitutions() {
  // Take top 3 institutions for featured display
  const featured = INSTITUTIONS.slice(0, 3);

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4">
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-navy dark:text-navy bg-navy dark:bg-navy-light mb-3">
              Explore
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white">
              Featured Institutions
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-2xl">
              Discover verified institutions and connect with their leading faculty members.
            </p>
          </div>
          <Link
            to="/institutions"
            className="flex items-center gap-2 text-navy dark:text-navy font-semibold hover:text-navy dark:hover:text-navy transition-colors whitespace-nowrap"
          >
            View all institutions <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {featured.map((inst) => (
            <InstitutionCard key={inst.id} inst={inst} />
          ))}
        </div>
        
        <div className="mt-10 text-center sm:hidden">
          <Link
            to="/institutions"
            className="btn-secondary inline-flex items-center justify-center gap-2 px-6 py-3 w-full"
          >
            View all institutions <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
