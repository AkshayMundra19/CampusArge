import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck, Building2, Search, ArrowRight,
  ChevronDown,
} from 'lucide-react';
import heroImage from '@/assets/hero/hero-student-globe.png';

export default function HeroSection() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/mentors?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="relative pt-32 pb-24 sm:pt-40 sm:pb-32 overflow-hidden">
      {/* Animated blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-[-80px] w-80 h-80 bg-indigo-300/30 dark:bg-indigo-700/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-32 right-[-60px] w-96 h-96 bg-teal-300/25 dark:bg-teal-700/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-purple-300/20 dark:bg-purple-800/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left: Text (7 cols) */}
          <div className="lg:col-span-7">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 mb-8 animate-fade-in">
              <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-400" aria-hidden="true" />
              <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                Trusted by Leading Institutions
              </span>
            </div>

            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-slate-900 dark:text-white leading-[1.1] text-balance animate-fade-in-up">
              Connect Your Institution with{' '}
              <span className="gradient-text">Global Academic Talent</span>
            </h1>

            {/* Primary description */}
            <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-xl text-pretty animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Showcase your institution, highlight verified faculty, foster academic collaborations, and increase global visibility.
            </p>

            {/* CTA */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
              <Link
                to="/institutions"
                id="hero-explore-institutions-btn"
                className="btn-primary flex items-center justify-center gap-2 text-base px-8 py-4 shadow-lg shadow-navy"
              >
                <Building2 className="w-5 h-5" aria-hidden="true" />
                Explore Institutions
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="mt-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="glass-card rounded-2xl p-2 flex items-center gap-2 max-w-xl">
                <Search className="w-5 h-5 text-slate-400 ml-3 flex-shrink-0" aria-hidden="true" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search institutions, faculty, research areas, or academic expertise..."
                  aria-label="Search institutions, faculty, research areas, or academic expertise"
                  className="flex-1 bg-transparent border-none focus:outline-none text-slate-900 dark:text-white placeholder-slate-400 text-sm py-2 min-w-0"
                />
                <button
                  type="submit"
                  id="hero-search-btn"
                  className="btn-primary px-5 py-2.5 text-sm flex-shrink-0"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Scroll indicator */}
            <div className="mt-10 flex items-center gap-2 text-slate-400 dark:text-slate-500 animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
              <span className="text-xs font-medium tracking-wide">Scroll to explore</span>
              <ChevronDown className="w-4 h-4 animate-bounce" aria-hidden="true" />
            </div>
          </div>

          {/* Right: Hero Image Artwork (5 cols) */}
          <div className="lg:col-span-5 flex items-center justify-center relative animate-fade-in-up mt-8 lg:mt-0" style={{ animationDelay: '0.25s' }}>
            <div className="relative w-full max-w-[320px] sm:max-w-[360px] lg:max-w-[400px] mx-auto flex items-center justify-center">
              {/* Subtle ambient glow behind artwork */}
              <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-gold/15 via-navy-light/40 to-navy/10 blur-2xl pointer-events-none" />
              
              <img
                src={heroImage}
                alt="Student facing world university campus under globe"
                // @ts-expect-error fetchpriority attribute is supported in modern browsers
                fetchpriority="high"
                loading="eager"
                decoding="async"
                className="relative z-10 w-full h-auto object-contain mx-auto mix-blend-multiply dark:mix-blend-normal [mask-image:radial-gradient(ellipse_at_center,black_65%,transparent_100%)] drop-shadow-md"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
