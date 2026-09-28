import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck, Users, Building2, Search, ArrowRight,
  BookOpen, Globe, Microscope, Link2,
  ChevronDown,
} from 'lucide-react';

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
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div>
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
            {/* Alternate description (swap in when preferred):
              Connect institutions with verified faculty, researchers, and academic professionals through one trusted platform.
            */}

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
              <Link
                to="/mentors"
                id="hero-find-faculty-btn"
                className="btn-primary flex items-center justify-center gap-2 text-base px-8 py-4 shadow-lg shadow-navy"
              >
                <Users className="w-5 h-5" aria-hidden="true" />
                Find Faculty
              </Link>
              <Link
                to="/institutions"
                id="hero-explore-institutions-btn"
                className="flex items-center justify-center gap-2 text-base px-8 py-4 rounded-[0.625rem] font-semibold border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-navy hover:text-navy dark:hover:text-navy transition-all"
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

          {/* Right: Decorative illustration */}
          <div className="hidden lg:flex items-center justify-center relative animate-fade-in-up" style={{ animationDelay: '0.3s' }} aria-hidden="true">
            <GlobeIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}

function GlobeIllustration() {
  const avatarColors = [
    'from-indigo-500 to-purple-500',
    'from-teal-500 to-green-500',
    'from-orange-500 to-rose-500',
    'from-blue-500 to-indigo-500',
  ];
  const initials = ['SC', 'JW', 'ER', 'MC'];
  // Avatar positions around the globe (in the 480×480 canvas)
  const avatarPositions = [
    { top: '6%',  left: '52%' },
    { top: '44%', left: '88%' },
    { top: '80%', left: '56%' },
    { top: '44%', left: '-4%' },
  ];

  // Curved SVG paths connecting globe centre (240,240) to each avatar centre
  // Avatar centres: top(267,28), right(451,211), bottom(267,384), left(28,211)
  const curvePaths = [
    'M 112 112 Q 140 60 140 14',
    'M 112 112 Q 170 100 210 98',
    'M 112 112 Q 140 165 140 210',
    'M 112 112 Q 55 105 14 98',
  ];
  const curveColors = [
    'rgb(99,102,241)',
    'rgb(16,185,129)',
    'rgb(99,102,241)',
    'rgb(16,185,129)',
  ];

  // Academic icon badges: label → Lucide icon + colour
  const iconBadges = [
    { Icon: Building2,  label: 'Institution',   color: 'text-indigo-600 dark:text-indigo-400',  pos: 'top-[20%] right-[8%]',  delay: '1s' },
    { Icon: BookOpen,   label: 'Research',      color: 'text-teal-600 dark:text-teal-400',      pos: 'bottom-[22%] right-[10%]', delay: '2.5s' },
    { Icon: Users,      label: 'Collaboration', color: 'text-purple-600 dark:text-purple-400',  pos: 'bottom-[14%] left-[12%]', delay: '0.5s' },
    { Icon: ShieldCheck,label: 'Verification',  color: 'text-blue-600 dark:text-blue-400',      pos: 'top-[18%] left-[14%]',  delay: '3s' },
  ];

  return (
    <div className="relative w-[480px] h-[480px] select-none">
      {/* Background gradient blob for depth */}
      <div className="absolute inset-8 rounded-full bg-gradient-to-br from-indigo-400/15 via-teal-300/10 to-purple-400/10 blur-3xl pointer-events-none" />

      {/* Central globe */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-56 h-56">
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/20 to-teal-500/20 animate-pulse-glow" />
          {/* Spinning orbit rings */}
          <div className="absolute inset-3 rounded-full border-2 border-dashed border-indigo-300/40 dark:border-indigo-600/40 animate-spin" style={{ animationDuration: '20s' }} />
          <div className="absolute inset-8 rounded-full border border-dashed border-teal-300/40 dark:border-teal-600/40 animate-spin" style={{ animationDuration: '14s', animationDirection: 'reverse' }} />

          {/* 3D-feel globe core — radial highlight for depth */}
          <div className="absolute inset-6 rounded-full shadow-2xl shadow-indigo-500/50 flex items-center justify-center overflow-hidden">
            {/* Base gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 via-indigo-600 to-teal-600" />
            {/* Radial highlight — simulates 3D light source */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_25%,rgba(255,255,255,0.35)_0%,transparent_65%)]" />
            {/* Bottom shadow rim */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,rgba(0,0,0,0.25)_0%,transparent_60%)]" />
            <Globe className="w-16 h-16 text-white/90 relative z-10" />
          </div>

          {/* Curved dashed SVG connector lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 224 224" fill="none">
            {curvePaths.map((d, i) => (
              <path
                key={i}
                d={d}
                stroke={curveColors[i]}
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.5"
                fill="none"
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Floating faculty avatars */}
      {avatarPositions.map((pos, i) => (
        <div
          key={i}
          className="absolute w-14 h-14 rounded-full ring-4 ring-white dark:ring-slate-900 shadow-lg animate-float flex items-center justify-center"
          style={{ top: pos.top, left: pos.left, animationDelay: `${i * 0.7}s` }}
        >
          <div className={`w-full h-full rounded-full bg-gradient-to-br ${avatarColors[i]} flex items-center justify-center text-white font-bold text-sm`}>
            {initials[i]}
          </div>
        </div>
      ))}

      {/* Academic icon badges */}
      {iconBadges.map(({ Icon, label, color, pos, delay }) => (
        <div
          key={label}
          title={label}
          className={`absolute ${pos} w-11 h-11 rounded-xl bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center animate-float`}
          style={{ animationDelay: delay }}
        >
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      ))}
    </div>
  );
}
