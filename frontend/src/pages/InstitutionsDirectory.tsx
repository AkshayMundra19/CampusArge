import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Search, SlidersHorizontal, MapPin, Users, BadgeCheck,
  Building2, Globe, ChevronLeft, ChevronRight,
  Linkedin, Twitter, Youtube, Instagram, X,
  SearchX,
} from 'lucide-react';
import { InstitutionCard } from '@/components/InstitutionCard';
import type { Institution } from '@/components/InstitutionCard';
import { REAL_UNIVERSITIES } from '@/lib/universitiesData';

const MAPPED_INSTITUTIONS = REAL_UNIVERSITIES.map((u): Institution => ({
  id: u.id,
  rank: u.qs_rank,
  name: u.name,
  location: `${u.city}, ${u.country}`,
  country: u.country,
  region: 'Global',
  verifiedFaculty: 1500,
  type: u.university_type === 'public' ? 'Public' : 'Private',
  founded: 1900,
  tags: u.programs,
  researchAreas: u.programs,
  scholarships: u.scholarships_available,
  verified: true,
  color: 'from-indigo-600 to-teal-600',
  logoUrl: u.logo_url,
}));

const COUNTRIES = [...new Set(MAPPED_INSTITUTIONS.map(i => i.country))].sort();
const REGIONS  = [...new Set(MAPPED_INSTITUTIONS.map(i => i.region))].sort();
const TYPES    = ['Public', 'Private'] as const;
const ALL_TAGS = [...new Set(MAPPED_INSTITUTIONS.flatMap(i => i.tags))].sort();
const ALL_RESEARCH_AREAS = [...new Set(MAPPED_INSTITUTIONS.flatMap(i => i.researchAreas))].sort();

const TOTAL_COUNT = MAPPED_INSTITUTIONS.length;
const PAGE_SIZE = 12;

function InstitutionsFooter() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const footerCols = {
    Platform: [
      { label: 'Institutions', path: '/institutions' },
      { label: 'Faculty Directory', path: '/mentors' },
      { label: 'Research Areas', path: '/research-areas' },
    ],
    Company: [
      { label: 'About Us', path: '/about' },
      { label: 'Blog', path: '/blog' },
      { label: 'Contact', path: '/contact' },
    ],
    Resources: [
      { label: 'Career Guide', path: '/roadmaps' },
      { label: 'Mentorship Tips', path: '/about' },
      { label: 'University Rankings', path: '/institutions' },
      { label: 'FAQ', path: '/#faq' },
    ],
  };

  const legalLinks = [
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Service', path: '/terms' },
    { label: 'Business Policy', path: '/business-policy' },
    { label: 'Disclaimer', path: '/disclaimer' },
    { label: 'Accessibility', path: '/accessibility' },
  ];

  const socialIcons = [
    { Icon: Linkedin,  href: '#', label: 'LinkedIn' },
    { Icon: Twitter,   href: '#', label: 'Twitter / X' },
    { Icon: Youtube,   href: '#', label: 'YouTube' },
    { Icon: Instagram, href: '#', label: 'Instagram' },
  ];

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Top section: links + newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Link columns */}
          {Object.entries(footerCols).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.path} className="text-sm text-slate-600 dark:text-slate-400 hover:text-navy dark:hover:text-navy transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter box — spans 2 cols */}
          <div className="lg:col-span-2">
            <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-2">
              Connecting institutions, faculty, and academic collaboration worldwide
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Stay updated with new institutional partnerships, faculty highlights, and research opportunities.
            </p>
            {sent ? (
              <p className="text-sm text-green-600 font-semibold">You're subscribed! 🎉</p>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); if (email.trim()) setSent(true); }} className="flex gap-2" aria-label="Newsletter subscription">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  aria-label="Email address for newsletter"
                  className="flex-1 min-w-0 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-navy"
                />
                <button type="submit" className="px-4 py-2.5 bg-green-500 hover:bg-green-400 text-white text-sm font-semibold rounded-xl transition-colors flex-shrink-0">
                  Subscribe
                </button>
              </form>
            )}
            {/* Social icons */}
            <div className="flex items-center gap-3 mt-5">
              {socialIcons.map(({ Icon, href, label }) => (
                <a key={label} href={href} aria-label={label} className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-navy hover:text-white transition-all">
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-500">
            &copy; {new Date().getFullYear()} Mentoring Path. All rights reserved. Your data is handled securely and in line with our Privacy Policy.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {legalLinks.map((l) => (
              <Link key={l.path} to={l.path} className="text-sm text-slate-500 dark:text-slate-500 hover:text-navy dark:hover:text-navy transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function InstitutionsDirectory() {
  const [search, setSearch] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterResearch, setFilterResearch] = useState('');
  const [filterRanking, setFilterRanking] = useState('');
  const [filterScholarships, setFilterScholarships] = useState(false);
  const [filterVerified, setFilterVerified] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [currentPage, setCurrentPage] = useState(1);

  const clearFilters = () => {
    setFilterCountry('');
    setFilterRegion('');
    setFilterType('');
    setFilterResearch('');
    setFilterRanking('');
    setFilterScholarships(false);
    setFilterVerified(false);
    setSearch('');
    setVisibleCount(PAGE_SIZE);
  };

  const hasFilters = !!(filterCountry || filterRegion || filterType || filterResearch || filterRanking || filterScholarships || filterVerified || search);

  const filtered = useMemo(() => {
    return MAPPED_INSTITUTIONS.filter((inst) => {
      if (search &&
          !inst.name.toLowerCase().includes(search.toLowerCase()) &&
          !inst.location.toLowerCase().includes(search.toLowerCase()) &&
          !inst.tags.some(t => t.toLowerCase().includes(search.toLowerCase())) &&
          !inst.researchAreas.some(r => r.toLowerCase().includes(search.toLowerCase()))
      ) return false;
      if (filterCountry && inst.country !== filterCountry) return false;
      if (filterRegion && inst.region !== filterRegion) return false;
      if (filterType && inst.type !== filterType) return false;
      if (filterResearch && !inst.researchAreas.includes(filterResearch)) return false;
      if (filterRanking === 'top10' && inst.rank > 10) return false;
      if (filterRanking === 'top50' && inst.rank > 50) return false;
      if (filterScholarships && !inst.scholarships) return false;
      if (filterVerified && !inst.verified) return false;
      return true;
    });
  }, [search, filterCountry, filterRegion, filterType, filterResearch, filterRanking, filterScholarships, filterVerified]);

  // Reset visible count when filters change
  useMemo(() => { setVisibleCount(PAGE_SIZE); }, [search, filterCountry, filterRegion, filterType, filterResearch, filterRanking, filterScholarships, filterVerified]);

  const visible = filtered.slice(0, visibleCount);

  // Active filter pills for display
  type FilterPill = { label: string; onRemove: () => void };
  const activePills: FilterPill[] = [
    ...(filterCountry    ? [{ label: filterCountry, onRemove: () => setFilterCountry('') }]    : []),
    ...(filterRegion     ? [{ label: filterRegion,  onRemove: () => setFilterRegion('') }]     : []),
    ...(filterType       ? [{ label: filterType,    onRemove: () => setFilterType('') }]       : []),
    ...(filterResearch   ? [{ label: filterResearch, onRemove: () => setFilterResearch('') }]  : []),
    ...(filterRanking    ? [{ label: filterRanking === 'top10' ? 'Top 10' : 'Top 50', onRemove: () => setFilterRanking('') }] : []),
    ...(filterScholarships ? [{ label: 'Scholarships', onRemove: () => setFilterScholarships(false) }] : []),
    ...(filterVerified   ? [{ label: 'Verified Only', onRemove: () => setFilterVerified(false) }] : []),
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24">
      <Helmet>
        <title>Institutions Directory | Mentoring Path</title>
      </Helmet>
      {/* Search Header */}
      <div className="relative pt-28 pb-14 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-300/20 dark:bg-indigo-700/10 rounded-full blur-3xl animate-float" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-300/15 dark:bg-teal-700/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-navy dark:text-navy bg-navy dark:bg-navy-light mb-4">
                University Directory
              </span>
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-slate-900 dark:text-white mb-4 text-balance">
                University <span className="gradient-text">Directory</span>
              </h1>
              {/* Updated description — institution/faculty-focused */}
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl">
                Discover verified institutions, explore their faculty, research strengths, and academic opportunities.
              </p>
            </div>

            {/* Decorative map illustration — unchanged */}
            <div className="hidden lg:flex justify-center" aria-hidden="true">
              <div className="relative w-80 h-56">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-50 to-teal-50 dark:from-indigo-900/20 dark:to-teal-900/20 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center">
                  <Globe className="w-24 h-24 text-indigo-200 dark:text-indigo-800" />
                </div>
                {[
                  { top: '20%', left: '22%' },
                  { top: '32%', left: '44%' },
                  { top: '40%', left: '68%' },
                  { top: '55%', left: '30%' },
                  { top: '25%', left: '74%' },
                ].map((pos, i) => (
                  <div
                    key={i}
                    className="absolute w-6 h-6 rounded-full bg-navy border-2 border-white dark:border-slate-900 shadow-md animate-float flex items-center justify-center"
                    style={{ top: pos.top, left: pos.left, animationDelay: `${i * 0.5}s` }}
                  >
                    <MapPin className="w-3 h-3 text-white" />
                  </div>
                ))}
                <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-white dark:bg-slate-800 rounded-xl px-3 py-2 shadow-lg">
                  <Building2 className="w-4 h-4 text-navy" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{TOTAL_COUNT} Institutions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Search bar */}
        <div className="flex gap-3 mb-5">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" aria-hidden="true" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by institution, country, research area, or specialization..."
              aria-label="Search institutions"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-navy text-sm"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            aria-expanded={showFilters}
            aria-controls="filter-panel"
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
              showFilters
                ? 'border-navy bg-navy dark:bg-navy-light text-navy dark:text-navy'
                : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" aria-hidden="true" /> Filters
            {hasFilters && <span className="w-2 h-2 rounded-full bg-navy" />}
          </button>
        </div>

        {/* Extended filter panel — 7 filters */}
        {showFilters && (
          <div id="filter-panel" className="glass-card rounded-2xl p-5 mb-5 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Country */}
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5" htmlFor="filter-country">Country</label>
                <select id="filter-country" value={filterCountry} onChange={(e) => setFilterCountry(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white">
                  <option value="">All Countries</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {/* Region */}
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5" htmlFor="filter-region">Region</label>
                <select id="filter-region" value={filterRegion} onChange={(e) => setFilterRegion(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white">
                  <option value="">All Regions</option>
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              {/* Institution Type */}
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5" htmlFor="filter-type">Institution Type</label>
                <select id="filter-type" value={filterType} onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white">
                  <option value="">All Types</option>
                  {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              {/* Research Areas */}
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5" htmlFor="filter-research">Research Areas</label>
                <select id="filter-research" value={filterResearch} onChange={(e) => setFilterResearch(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white">
                  <option value="">All Areas</option>
                  {ALL_RESEARCH_AREAS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              {/* Rankings */}
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5" htmlFor="filter-ranking">Rankings</label>
                <select id="filter-ranking" value={filterRanking} onChange={(e) => setFilterRanking(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white">
                  <option value="">All Rankings</option>
                  <option value="top10">Top 10</option>
                  <option value="top50">Top 50</option>
                </select>
              </div>
              {/* Scholarships + Verification checkboxes */}
              <div className="flex flex-col justify-end gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={filterScholarships} onChange={(e) => setFilterScholarships(e.target.checked)}
                    className="w-4 h-4 rounded accent-primary-600" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Scholarships Available</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={filterVerified} onChange={(e) => setFilterVerified(e.target.checked)}
                    className="w-4 h-4 rounded accent-primary-600" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Verified Only</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={clearFilters} className="text-xs text-navy dark:text-navy hover:underline font-medium">
                Clear all filters
              </button>
            </div>
          </div>
        )}

        {/* Active filter pills + results count */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {activePills.map(({ label, onRemove }) => (
            <span key={label} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy dark:bg-navy-light text-navy dark:text-navy text-xs font-semibold">
              {label}
              <button onClick={onRemove} aria-label={`Remove ${label} filter`} className="hover:text-navy dark:hover:text-navy">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {hasFilters && (
            <button onClick={clearFilters} className="text-xs text-slate-500 hover:text-navy dark:hover:text-navy font-medium transition-colors">
              Clear all
            </button>
          )}
        </div>

        {/* Results summary — "Showing X of Y" */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing <span className="font-semibold text-slate-900 dark:text-white">{Math.min(visibleCount, filtered.length)}</span> of{' '}
            <span className="font-semibold text-slate-900 dark:text-white">{TOTAL_COUNT}</span> institutions
            {filtered.length !== MAPPED_INSTITUTIONS.length && (
              <span className="text-slate-400"> ({filtered.length} match your filters)</span>
            )}
          </p>
        </div>

        {/* Grid / Empty state */}
        {filtered.length === 0 ? (
          /* Empty state */
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-5">
              <SearchX className="w-8 h-8 text-slate-400 dark:text-slate-500" aria-hidden="true" />
            </div>
            <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-2">
              No institutions matched your search
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
              Try different filters or keywords to discover institutions worldwide.
            </p>
            <button
              onClick={clearFilters}
              className="btn-primary px-6 py-2.5 text-sm"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 items-stretch" role="list" aria-label="Institution listings">
              {visible.map((inst) => (
                <div key={inst.id} role="listitem">
                  <InstitutionCard inst={inst} />
                </div>
              ))}
            </div>

            {/* Load more */}
            {visibleCount < filtered.length && (
              <div className="text-center mt-10">
                <button
                  onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                  id="load-more-institutions-btn"
                  className="px-8 py-3 text-sm font-semibold text-navy dark:text-navy border-2 border-navy rounded-xl hover:bg-navy dark:hover:bg-navy-light transition-all"
                >
                  Load more institutions ↓
                </button>
              </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-center gap-1.5 mt-8" role="navigation" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
                className="flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" /> Prev
              </button>
              {[1, 2, 3, 4].map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  aria-label={`Page ${p}`}
                  aria-current={currentPage === p ? 'page' : undefined}
                  className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
                    currentPage === p
                      ? 'bg-navy text-white shadow-md shadow-navy'
                      : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {p}
                </button>
              ))}
              <span className="px-2 text-slate-400">...</span>
              <button
                onClick={() => setCurrentPage(35)}
                aria-label="Page 35"
                className={`w-9 h-9 rounded-lg text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${currentPage === 35 ? 'bg-navy text-white border-navy' : ''}`}
              >
                35
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(35, p + 1))}
                disabled={currentPage === 35}
                aria-label="Next page"
                className="flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Institutions-specific footer */}
      <InstitutionsFooter />
    </div>
  );
}
