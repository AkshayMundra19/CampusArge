import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck, Building2, Search, ArrowRight,
  ChevronDown, Sparkles
} from 'lucide-react';
import heroImage from '@/assets/hero/hero-campus-banner.jpg';
import heroMobileImage from '@/assets/hero/hero-campus-mobile.webp';

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
    <section className="relative pt-24 pb-14 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-28 overflow-hidden bg-white dark:bg-slate-950 lg:min-h-[640px] xl:min-h-[700px] flex items-center">
      {/* Full-view Hero Background Artwork on Desktop — no borders, seamless fade */}
      <div className="absolute top-0 right-0 bottom-0 w-full lg:w-[58%] xl:w-[55%] pointer-events-none select-none z-0 hidden lg:block">
        <img
          src={heroImage}
          alt="CampusArge - Global Learning, Global Opportunities"
          width={1024}
          height={576}
          // @ts-expect-error fetchpriority attribute is supported in modern browsers
          fetchpriority="high"
          loading="eager"
          decoding="async"
          style={{ aspectRatio: '1024 / 576' }}
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
          <div className="lg:col-span-7 max-w-xl">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FBF6EC] border border-[#EADFC8] text-navy text-sm font-medium mb-6 sm:mb-8 animate-fade-in">
              <Building2 className="w-4 h-4 text-gold" aria-hidden="true" />
              <span className="text-sm font-semibold text-navy">
                Verified & Accredited Universities
              </span>
            </div>

            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-slate-900 dark:text-white leading-[1.12] text-balance animate-fade-in-up">
              Compare Verified Universities &{' '}
              <span className="gradient-text">Degree Programs</span>
            </h1>

            {/* Primary description */}
            <p className="mt-5 sm:mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-[480px] leading-relaxed text-pretty animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Explore transparent tuition fees, cost of attendance, faculty ratios, and accredited degree programs. Make confident higher education decisions with CampusArge.
            </p>

            {/* CTA Button */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3.5 sm:gap-4 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
              <Link
                to="/institutions"
                id="hero-explore-institutions-btn"
                className="btn-primary flex items-center justify-center gap-2 text-base px-7 py-3.5 shadow-lg shadow-navy/20 font-bold hover:scale-[1.02] transition-transform w-full sm:w-auto"
              >
                <Building2 className="w-5 h-5" aria-hidden="true" />
                Explore Universities
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>

            {/* Mobile view (< lg): centered, perfectly framed hero artwork */}
            <div className="lg:hidden mt-6 mb-3 animate-fade-in-up" style={{ animationDelay: '0.18s' }}>
              <div className="relative rounded-2xl overflow-hidden shadow-md border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 max-w-sm mx-auto">
                <img
                  src={heroMobileImage}
                  alt="CampusArge - Global Learning and Academic Opportunities"
                  width={704}
                  height={576}
                  loading="eager"
                  decoding="async"
                  // @ts-expect-error fetchpriority attribute is supported in modern browsers
                  fetchpriority="high"
                  style={{ aspectRatio: '704 / 576' }}
                  className="w-full h-auto object-cover object-center select-none pointer-events-none"
                />
              </div>
            </div>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="mt-6 animate-fade-in-up" style={{ animationDelay: '0.22s' }}>
              <div className="glass-card rounded-2xl p-2 flex items-center gap-2 max-w-[480px] border border-slate-200/80 shadow-md">
                <Search className="w-5 h-5 text-slate-400 ml-3 flex-shrink-0" aria-hidden="true" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by university name, major, or city..."
                  aria-label="Search universities, academic programs, or fields"
                  className="flex-1 bg-transparent border-none focus:outline-none text-slate-900 dark:text-white placeholder-slate-400 text-sm py-2 min-w-0"
                />
                <button
                  type="submit"
                  id="hero-search-btn"
                  className="btn-primary px-5 py-2.5 text-sm font-bold flex-shrink-0"
                >
                  Search
                </button>
              </div>

              {/* Instant Engagement Discovery Pills */}
              <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs max-w-[480px]">
                <span className="inline-flex items-center gap-1.5 py-1 text-slate-500 dark:text-slate-400 font-semibold text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" /> Popular:
                </span>
                <button
                  type="button"
                  onClick={() => navigate('/institutions?coa=under30')}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100/90 hover:bg-gold/15 dark:bg-slate-800/90 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-navy border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs leading-normal"
                >
                  <span>💰</span> <span>Under $30k Fees</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/institutions?q=Engineering')}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100/90 hover:bg-gold/15 dark:bg-slate-800/90 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-navy border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs leading-normal"
                >
                  <span>🔬</span> <span>Engineering & STEM</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/institutions?ratio=le10')}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100/90 hover:bg-gold/15 dark:bg-slate-800/90 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-navy border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs leading-normal"
                >
                  <span>👥</span> <span>10:1 Faculty Ratio</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/institutions?type=Public')}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100/90 hover:bg-gold/15 dark:bg-slate-800/90 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-navy border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs leading-normal"
                >
                  <span>🏛️</span> <span>Public Colleges</span>
                </button>
              </div>
            </form>

            {/* Scroll indicator */}
            <div className="mt-8 sm:mt-10 flex items-center gap-2 text-slate-400 dark:text-slate-500 animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
              <span className="text-xs font-medium tracking-wide">Scroll to explore</span>
              <ChevronDown className="w-4 h-4 animate-bounce" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
