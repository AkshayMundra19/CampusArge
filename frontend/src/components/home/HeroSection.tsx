import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck, Building2, Search, ArrowRight,
  ChevronDown,
} from 'lucide-react';
import heroImage from '@/assets/hero/hero-campus-banner.jpg';

export default function HeroSection() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/institutions?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="relative pt-32 pb-16 sm:pt-36 sm:pb-24 lg:pt-32 lg:pb-28 overflow-hidden bg-white dark:bg-slate-950 lg:min-h-[640px] xl:min-h-[700px] flex items-center">
      {/* Full-view Hero Background Artwork on Desktop — no borders, seamless fade */}
      <div className="absolute top-0 right-0 bottom-0 w-full lg:w-[58%] xl:w-[55%] pointer-events-none select-none z-0 hidden lg:block">
        <img
          src={heroImage}
          alt="CampusArge - Global Learning, Global Opportunities"
          // @ts-expect-error fetchpriority attribute is supported in modern browsers
          fetchpriority="high"
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover object-right"
        />
        {/* Soft linear gradient fade on left edge for seamless blend into white background */}
        <div className="absolute inset-y-0 left-0 w-32 xl:w-48 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-slate-950 dark:via-slate-950/80 pointer-events-none" />
      </div>

      {/* Subtle background ambient blob for left content area */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-[-80px] w-80 h-80 bg-indigo-200/30 dark:bg-indigo-700/15 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-gold/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Left: Text & Actions */}
          <div className="lg:col-span-7 max-w-2xl">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 mb-6 sm:mb-8 animate-fade-in">
              <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-400" aria-hidden="true" />
              <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                Trusted by Leading Institutions
              </span>
            </div>

            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-slate-900 dark:text-white leading-[1.12] text-balance animate-fade-in-up">
              Connect Your Institution with{' '}
              <span className="gradient-text">Global Academic Talent</span>
            </h1>

            {/* Primary description */}
            <p className="mt-5 sm:mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-xl text-pretty animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Showcase your institution, highlight verified faculty, foster academic collaborations, and increase global visibility.
            </p>

            {/* CTA */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
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
              <div className="glass-card rounded-2xl p-2 flex items-center gap-2 max-w-xl border border-slate-200/80 shadow-md">
                <Search className="w-5 h-5 text-slate-400 ml-3 flex-shrink-0" aria-hidden="true" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search institutions, academic programs, or fields..."
                  aria-label="Search institutions, academic programs, or fields"
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
            <div className="mt-8 sm:mt-10 flex items-center gap-2 text-slate-400 dark:text-slate-500 animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
              <span className="text-xs font-medium tracking-wide">Scroll to explore</span>
              <ChevronDown className="w-4 h-4 animate-bounce" aria-hidden="true" />
            </div>
          </div>

          {/* Mobile view (< lg): full view image displayed seamlessly without any card border */}
          <div className="lg:hidden col-span-12 mt-6 sm:mt-8 animate-fade-in-up pointer-events-none select-none">
            <img
              src={heroImage}
              alt="CampusArge - Global Learning, Global Opportunities"
              className="w-full h-auto object-cover object-right"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
