import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Search, SlidersHorizontal,
  Linkedin, Twitter, Youtube, Instagram, X,
  SearchX
} from 'lucide-react';
import { InstitutionCard } from '@/components/InstitutionCard';
import type { Institution } from '@/components/InstitutionCard';
import { REAL_UNIVERSITIES } from '@/lib/universitiesData';

const MAPPED_INSTITUTIONS: Institution[] = REAL_UNIVERSITIES.map((u): Institution => ({
  id: u.id,
  rank: u.qs_rank,
  name: u.name,
  location: [u.city, u.country].filter(Boolean).join(', ') || 'United States',
  country: u.country || 'United States',
  region: 'Global',
  verifiedFaculty: u.verified_faculty_count || 1500,
  type: u.university_type === 'public' ? 'Public' : 'Private',
  founded: u.established_year || 1900,
  tags: u.programs || [],
  researchAreas: u.programs || [],
  scholarships: u.scholarships_available,
  verified: true,
  color: 'from-navy to-oxford',
  logoUrl: u.logo_url,
  classification: u.facts?.school_classification || null,
  costOfAttendance: u.cost_of_attendance || null,
  studentFacultyRatio: u.facts?.student_faculty_ratio?.display || null,
  studentFacultyRatioNum: u.facts?.student_faculty_ratio?.value || null,
  anchorPrograms: u.facts?.anchor_programs || null,
  undergradPop: u.facts?.undergrad_population?.value || null,
  accreditor: u.facts?.accreditor || null,
  crimeLevel: u.facts?.crime_rate?.level || null,
}));

const TYPES    = ['Public', 'Private'] as const;
const ALL_RESEARCH_AREAS = [...new Set(MAPPED_INSTITUTIONS.flatMap(i => i.researchAreas))].sort();

const CLASSIFICATIONS = [...new Set(MAPPED_INSTITUTIONS.map(i => i.classification).filter(Boolean) as string[])].sort();
const ACCREDITORS = [...new Set(MAPPED_INSTITUTIONS.map(i => i.accreditor).filter(Boolean) as string[])].sort();

const TOTAL_COUNT = MAPPED_INSTITUTIONS.length;
const PAGE_SIZE = 12;

function InstitutionsFooter() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const footerCols = {
    Platform: [
      { label: 'Institutions', path: '/institutions' },
      // { label: 'Faculty Directory', path: '/mentors' },
      // { label: 'Research Areas', path: '/research-areas' },
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {Object.entries(footerCols).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.path} className="text-sm text-slate-600 dark:text-slate-400 hover:text-navy dark:hover:text-gold transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-2">
            <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-2">
              Stay Informed on Global Higher Ed
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Get weekly updates on university partnerships, academic opportunities, and faculty highlights.
            </p>
            {sent ? (
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                Thank you for subscribing!
              </p>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); if (email) setSent(true); }} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-navy"
                />
                <button type="submit" className="px-4 py-2.5 bg-navy hover:bg-navy-dark text-white text-sm font-semibold rounded-xl transition-colors flex-shrink-0">
                  Subscribe
                </button>
              </form>
            )}
            <div className="flex items-center gap-3 mt-5">
              {socialIcons.map(({ Icon, href, label }) => (
                <a key={label} href={href} aria-label={label} className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-navy hover:text-white transition-all">
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-500">
            &copy; {new Date().getFullYear()} CampusArge. All rights reserved. Your data is handled securely and in line with our Privacy Policy.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {legalLinks.map((l) => (
              <Link key={l.path} to={l.path} className="text-sm text-slate-500 dark:text-slate-500 hover:text-navy dark:hover:text-gold transition-colors">
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
  // New filters:
  const [filterClassification, setFilterClassification] = useState('');
  const [filterAccreditor, setFilterAccreditor] = useState('');
  const [filterCoaRange, setFilterCoaRange] = useState('');
  const [filterRatio, setFilterRatio] = useState('');
  const [filterCrime, setFilterCrime] = useState('');
  // Sort:
  const [sortBy, setSortBy] = useState('name-asc');

  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const clearFilters = () => {
    setFilterCountry('');
    setFilterRegion('');
    setFilterType('');
    setFilterResearch('');
    setFilterRanking('');
    setFilterScholarships(false);
    setFilterVerified(false);
    setFilterClassification('');
    setFilterAccreditor('');
    setFilterCoaRange('');
    setFilterRatio('');
    setFilterCrime('');
    setSearch('');
    setSortBy('name-asc');
    setVisibleCount(PAGE_SIZE);
  };

  const filtered = useMemo(() => {
    const list = MAPPED_INSTITUTIONS.filter((inst) => {
      if (search) {
        const q = search.toLowerCase();
        const matchesName = inst.name.toLowerCase().includes(q);
        const matchesLoc = inst.location.toLowerCase().includes(q);
        const matchesTags = inst.tags.some(t => t.toLowerCase().includes(q));
        const matchesResearch = inst.researchAreas.some(r => r.toLowerCase().includes(q));
        const matchesAnchors = inst.anchorPrograms?.some(a => a.toLowerCase().includes(q));
        const matchesClass = inst.classification?.toLowerCase().includes(q);
        if (!matchesName && !matchesLoc && !matchesTags && !matchesResearch && !matchesAnchors && !matchesClass) {
          return false;
        }
      }
      if (filterCountry && inst.country !== filterCountry) return false;
      if (filterRegion && inst.region !== filterRegion) return false;
      if (filterType && inst.type !== filterType) return false;
      if (filterResearch && !inst.researchAreas.includes(filterResearch)) return false;
      if (filterRanking === 'top10' && (inst.rank == null || inst.rank > 10)) return false;
      if (filterRanking === 'top50' && (inst.rank == null || inst.rank > 50)) return false;
      if (filterScholarships && !inst.scholarships) return false;
      if (filterVerified && !inst.verified) return false;

      // New Filters
      if (filterClassification && inst.classification !== filterClassification) return false;
      if (filterAccreditor && inst.accreditor !== filterAccreditor) return false;

      if (filterCoaRange) {
        if (inst.costOfAttendance == null) return false;
        if (filterCoaRange === 'under30' && inst.costOfAttendance >= 30000) return false;
        if (filterCoaRange === '30to60' && (inst.costOfAttendance < 30000 || inst.costOfAttendance > 60000)) return false;
        if (filterCoaRange === 'over60' && inst.costOfAttendance <= 60000) return false;
      }

      if (filterRatio) {
        if (inst.studentFacultyRatioNum == null) return false;
        if (filterRatio === 'le10' && inst.studentFacultyRatioNum > 10) return false;
        if (filterRatio === 'le15' && inst.studentFacultyRatioNum > 15) return false;
      }

      if (filterCrime && inst.crimeLevel !== filterCrime) return false;

      return true;
    });

    // Sort
    return list.sort((a, b) => {
      if (sortBy === 'coa-asc') {
        const valA = a.costOfAttendance ?? Number.MAX_SAFE_INTEGER;
        const valB = b.costOfAttendance ?? Number.MAX_SAFE_INTEGER;
        return valA - valB;
      }
      if (sortBy === 'coa-desc') {
        const valA = a.costOfAttendance ?? -1;
        const valB = b.costOfAttendance ?? -1;
        return valB - valA;
      }
      if (sortBy === 'ratio-asc') {
        const valA = a.studentFacultyRatioNum ?? Number.MAX_SAFE_INTEGER;
        const valB = b.studentFacultyRatioNum ?? Number.MAX_SAFE_INTEGER;
        return valA - valB;
      }
      if (sortBy === 'undergrad-desc') {
        const valA = a.undergradPop ?? -1;
        const valB = b.undergradPop ?? -1;
        return valB - valA;
      }
      // default: name-asc
      return a.name.localeCompare(b.name);
    });
  }, [
    search, filterCountry, filterRegion, filterType, filterResearch,
    filterRanking, filterScholarships, filterVerified, filterClassification,
    filterAccreditor, filterCoaRange, filterRatio, filterCrime, sortBy
  ]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [
    search, filterCountry, filterRegion, filterType, filterResearch,
    filterRanking, filterScholarships, filterVerified, filterClassification,
    filterAccreditor, filterCoaRange, filterRatio, filterCrime, sortBy
  ]);

  const visible = filtered.slice(0, visibleCount);

  // Active filter pills for display
  type FilterPill = { label: string; onRemove: () => void };
  const activePills: FilterPill[] = [
    ...(filterCountry ? [{ label: filterCountry, onRemove: () => setFilterCountry('') }] : []),
    ...(filterRegion ? [{ label: filterRegion, onRemove: () => setFilterRegion('') }] : []),
    ...(filterType ? [{ label: filterType, onRemove: () => setFilterType('') }] : []),
    ...(filterResearch ? [{ label: filterResearch, onRemove: () => setFilterResearch('') }] : []),
    ...(filterRanking ? [{ label: filterRanking === 'top10' ? 'Top 10' : 'Top 50', onRemove: () => setFilterRanking('') }] : []),
    ...(filterClassification ? [{ label: filterClassification, onRemove: () => setFilterClassification('') }] : []),
    ...(filterAccreditor ? [{ label: `Accred: ${filterAccreditor}`, onRemove: () => setFilterAccreditor('') }] : []),
    ...(filterCoaRange ? [{
      label: filterCoaRange === 'under30' ? '< $30k COA' : filterCoaRange === '30to60' ? '$30k - $60k COA' : '> $60k COA',
      onRemove: () => setFilterCoaRange('')
    }] : []),
    ...(filterRatio ? [{ label: filterRatio === 'le10' ? 'Ratio ≤ 10:1' : 'Ratio ≤ 15:1', onRemove: () => setFilterRatio('') }] : []),
    ...(filterCrime ? [{ label: `Crime: ${filterCrime}`, onRemove: () => setFilterCrime('') }] : []),
    ...(filterScholarships ? [{ label: 'Scholarships Available', onRemove: () => setFilterScholarships(false) }] : []),
    ...(filterVerified ? [{ label: 'Verified Only', onRemove: () => setFilterVerified(false) }] : []),
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24">
      <Helmet>
        <title>University Directory | CampusArge</title>
        <meta name="description" content="Discover top universities, cost of attendance, student-faculty ratios, academic programs, and expert faculty worldwide." />
        <link rel="canonical" href="https://campusarge.com/institutions" />
      </Helmet>

      {/* Search Header */}
      <div className="relative pt-20 pb-12 overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-navy bg-navy-light mb-3">
                Global University Directory
              </span>
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-slate-900 dark:text-white mb-3 text-balance">
                University <span className="gradient-text">Directory</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl">
                Compare {TOTAL_COUNT} accredited institutions by tuition & cost of attendance, student-faculty ratio, programs, and verified faculty talent.
              </p>
            </div>

            <div className="hidden lg:flex justify-end" aria-hidden="true">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700 flex items-center gap-6 shadow-sm">
                <div className="text-center">
                  <p className="text-2xl font-bold text-navy dark:text-gold tabular-nums">{TOTAL_COUNT}</p>
                  <p className="text-xs text-slate-500 font-medium">Institutions</p>
                </div>
                <div className="w-px h-10 bg-slate-200 dark:bg-slate-700" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600 tabular-nums">413</p>
                  <p className="text-xs text-slate-500 font-medium">With Cost Data</p>
                </div>
                <div className="w-px h-10 bg-slate-200 dark:bg-slate-700" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-oxford dark:text-oxford-light tabular-nums">100%</p>
                  <p className="text-xs text-slate-500 font-medium">Verified</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search bar & Filter Trigger & Sort dropdown */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by institution name, city, program, or classification..."
              aria-label="Search institutions"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-navy text-sm shadow-sm"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort institutions"
                className="pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-navy"
              >
                <option value="name-asc">Sort: Name (A – Z)</option>
                <option value="coa-asc">Cost of Attendance: Low → High</option>
                <option value="coa-desc">Cost of Attendance: High → Low</option>
                <option value="ratio-asc">Student/Faculty Ratio: Low → High</option>
                <option value="undergrad-desc">Undergraduate Size: High → Low</option>
              </select>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              aria-expanded={showFilters}
              aria-controls="filter-panel"
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-colors shadow-sm ${
                showFilters || activePills.length > 0
                  ? 'border-navy bg-navy text-white'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" aria-hidden="true" /> Filters
              {activePills.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-gold text-white text-[11px] font-bold flex items-center justify-center">
                  {activePills.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Extended Filter Panel with All Enriched Dimensions */}
        {showFilters && (
          <div id="filter-panel" className="bg-white dark:bg-slate-900 rounded-2xl p-6 mb-6 border border-slate-200/80 dark:border-slate-800 shadow-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
              
              {/* Classification */}
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1.5" htmlFor="filter-classification">
                  Classification
                </label>
                <select
                  id="filter-classification"
                  value={filterClassification}
                  onChange={(e) => setFilterClassification(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white"
                >
                  <option value="">All Classifications</option>
                  {CLASSIFICATIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Accreditor */}
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1.5" htmlFor="filter-accreditor">
                  Accreditor
                </label>
                <select
                  id="filter-accreditor"
                  value={filterAccreditor}
                  onChange={(e) => setFilterAccreditor(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white"
                >
                  <option value="">All Accreditors</option>
                  {ACCREDITORS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>

              {/* Cost of Attendance Range */}
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1.5" htmlFor="filter-coa">
                  Cost of Attendance
                </label>
                <select
                  id="filter-coa"
                  value={filterCoaRange}
                  onChange={(e) => setFilterCoaRange(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white"
                >
                  <option value="">Any Cost</option>
                  <option value="under30">Under $30,000 / year</option>
                  <option value="30to60">$30,000 – $60,000 / year</option>
                  <option value="over60">Over $60,000 / year</option>
                </select>
              </div>

              {/* Student/Faculty Ratio */}
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1.5" htmlFor="filter-ratio">
                  Student / Faculty Ratio
                </label>
                <select
                  id="filter-ratio"
                  value={filterRatio}
                  onChange={(e) => setFilterRatio(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white"
                >
                  <option value="">Any Ratio</option>
                  <option value="le10">≤ 10 : 1</option>
                  <option value="le15">≤ 15 : 1</option>
                </select>
              </div>

              {/* Crime Level */}
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1.5" htmlFor="filter-crime">
                  Local Crime Level
                </label>
                <select
                  id="filter-crime"
                  value={filterCrime}
                  onChange={(e) => setFilterCrime(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white"
                >
                  <option value="">Any Crime Level</option>
                  <option value="low">Low Crime</option>
                  <option value="moderate">Moderate / Average</option>
                  <option value="high">Higher than Average</option>
                </select>
              </div>

              {/* Institution Type (Public / Private) */}
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1.5" htmlFor="filter-type">
                  Control / Type
                </label>
                <select
                  id="filter-type"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white"
                >
                  <option value="">All Types</option>
                  {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Research Areas */}
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1.5" htmlFor="filter-research">
                  Research & Programs
                </label>
                <select
                  id="filter-research"
                  value={filterResearch}
                  onChange={(e) => setFilterResearch(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white"
                >
                  <option value="">All Areas</option>
                  {ALL_RESEARCH_AREAS.slice(0, 30).map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              {/* Checkboxes */}
              <div className="flex flex-col justify-end gap-2.5 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterScholarships}
                    onChange={(e) => setFilterScholarships(e.target.checked)}
                    className="w-4 h-4 rounded text-navy focus:ring-navy"
                  />
                  <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">Scholarships Available</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterVerified}
                    onChange={(e) => setFilterVerified(e.target.checked)}
                    className="w-4 h-4 rounded text-navy focus:ring-navy"
                  />
                  <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">Verified Only</span>
                </label>
              </div>

            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500">
                {filtered.length} matching institutions found
              </span>
              <button onClick={clearFilters} className="text-xs text-navy dark:text-gold hover:underline font-semibold">
                Clear all filters
              </button>
            </div>
          </div>
        )}

        {/* Active Filter Pills */}
        {activePills.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs text-slate-500 font-medium">Active filters:</span>
            {activePills.map(({ label, onRemove }) => (
              <span
                key={label}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-light text-navy text-xs font-semibold"
              >
                {label}
                <button onClick={onRemove} aria-label={`Remove ${label} filter`} className="hover:text-navy-dark">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button onClick={clearFilters} className="text-xs text-slate-500 hover:text-navy dark:hover:text-gold font-medium ml-2">
              Clear all
            </button>
          </div>
        )}

        {/* Results Count Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Showing <span className="font-bold text-slate-900 dark:text-white">{Math.min(visibleCount, filtered.length)}</span> of{' '}
            <span className="font-bold text-slate-900 dark:text-white">{filtered.length}</span> institutions
            {filtered.length !== TOTAL_COUNT && (
              <span className="text-slate-400"> (filtered from {TOTAL_COUNT})</span>
            )}
          </p>
        </div>

        {/* Cards Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <SearchX className="w-8 h-8 text-slate-400" aria-hidden="true" />
            </div>
            <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-2">
              No institutions match your filters
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6 text-sm">
              Try adjusting your classification, cost range, or search keywords.
            </p>
            <button onClick={clearFilters} className="btn-primary px-6 py-2.5 text-sm">
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 items-stretch" role="list">
              {visible.map((inst) => (
                <div key={inst.id} role="listitem">
                  <InstitutionCard inst={inst} />
                </div>
              ))}
            </div>

            {/* Load more */}
            {visibleCount < filtered.length && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                  className="px-8 py-3 text-sm font-semibold text-navy dark:text-gold border-2 border-navy dark:border-gold rounded-xl hover:bg-navy hover:text-white dark:hover:bg-gold dark:hover:text-navy transition-all shadow-sm"
                >
                  Load More Institutions ({filtered.length - visibleCount} remaining) ↓
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <InstitutionsFooter />
    </div>
  );
}
