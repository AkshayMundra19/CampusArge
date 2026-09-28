import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const INSTITUTIONS = [
  { name: 'MIT', full: 'Massachusetts Institute of Technology', abbr: 'MIT', color: 'from-red-600 to-red-700' },
  { name: 'Stanford', full: 'Stanford University', abbr: 'SU', color: 'from-red-800 to-rose-700' },
  { name: 'Harvard', full: 'Harvard University', abbr: 'HU', color: 'from-red-700 to-crimson-600' },
  { name: 'Oxford', full: 'University of Oxford', abbr: 'OX', color: 'from-blue-900 to-blue-700' },
  { name: 'NUS', full: 'National University of Singapore', abbr: 'NUS', color: 'from-indigo-600 to-indigo-700' },
  { name: 'Melbourne', full: 'The University of Melbourne', abbr: 'UM', color: 'from-blue-600 to-teal-600' },
];

export default function PartnerInstitutions() {
  return (
    <section className="py-24" aria-labelledby="partner-institutions-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 mb-3">
            Trusted by Leading Institutions
          </span>
          <h2 id="partner-institutions-heading" className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white text-balance">
            Partner Institutions
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-lg">
            Universities and organizations worldwide trust Mentoring Path
          </p>
        </div>

        {/* Logo strip */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 items-center">
          {INSTITUTIONS.map((inst) => (
            <div
              key={inst.name}
              className="group flex flex-col items-center gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md hover:shadow-primary-500/10 transition-all duration-300 cursor-pointer"
              title={inst.full}
            >
              {/* Text-based logo badge */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${inst.color} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300`}>
                <span className="text-white font-display font-bold text-sm">{inst.abbr}</span>
              </div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 text-center leading-tight">
                {inst.name}
              </span>
            </div>
          ))}
        </div>

        {/* Link */}
        <div className="text-center mt-10">
          <Link
            to="/institutions"
            id="view-all-institutions-link"
            className="inline-flex items-center gap-1.5 text-primary-600 dark:text-primary-400 font-semibold hover:gap-2.5 transition-all duration-200"
          >
            View all institutions <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
