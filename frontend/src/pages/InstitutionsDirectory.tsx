import { useState, useMemo, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Search, SlidersHorizontal, X, SearchX,
  Building2, GraduationCap, BookOpen, Wallet, ShieldCheck,
  ArrowRight, ChevronDown, CheckCircle2
} from 'lucide-react';
import { InstitutionCard } from '@/components/InstitutionCard';
import type { Institution } from '@/components/InstitutionCard';
import { REAL_UNIVERSITIES } from '@/lib/universitiesData';
import heroCampus from '@/assets/institutions/hero-institutions-campus.png';

const MAPPED_INSTITUTIONS: Institution[] = REAL_UNIVERSITIES.map((u): Institution => ({
  id: u.id,
  rank: u.qs_rank,
  name: u.name,
  location: [u.city, u.country].filter(Boolean).join(', ') || 'United States',
  country: u.country || 'United States',
  region: 'Global',
  verifiedFaculty: u.verified_faculty_count || 0,
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

const ALL_RESEARCH_AREAS = [...new Set(MAPPED_INSTITUTIONS.flatMap(i => i.researchAreas))].sort();
const CLASSIFICATIONS = [...new Set(MAPPED_INSTITUTIONS.map(i => i.classification).filter(Boolean) as string[])].sort();
const ACCREDITORS = [...new Set(MAPPED_INSTITUTIONS.map(i => i.accreditor).filter(Boolean) as string[])].sort();

const TOTAL_COUNT = MAPPED_INSTITUTIONS.length;
const ALL_UNIQUE_PROGRAMS = [...new Set(REAL_UNIVERSITIES.flatMap(u => u.programs || []))];
const PROGRAMS_COUNT_DISPLAY = `${Math.floor(ALL_UNIQUE_PROGRAMS.length / 100) * 100}+`;
const WITH_COST_DATA_COUNT = REAL_UNIVERSITIES.filter(u => u.cost_of_attendance != null && u.cost_of_attendance > 0).length;

const PAGE_SIZE = 12;

export default function InstitutionsDirectory() {
  const [search, setSearch] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const [filterType, setFilterType] = useState<'Public' | 'Private' | ''>('');
  const [filterResearch, setFilterResearch] = useState('');
  const [filterRanking, setFilterRanking] = useState<'top10' | 'top50' | ''>('');
  const [filterScholarships, setFilterScholarships] = useState(false);
  const [filterVerified, setFilterVerified] = useState(false);
  const [filterClassification, setFilterClassification] = useState('');
  const [filterAccreditor, setFilterAccreditor] = useState('');
  const [filterCoaRange, setFilterCoaRange] = useState<'under30' | '30to60' | 'over60' | ''>('');
  const [filterRatio, setFilterRatio] = useState<'le10' | 'le15' | ''>('');
  const [filterCrime, setFilterCrime] = useState<'Low' | 'Medium' | 'High' | ''>('');

  const [sortBy, setSortBy] = useState('name-asc');
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Compare selection persistence
  const [compareIds, setCompareIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('campusarge_compare_v1');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.filter(id => MAPPED_INSTITUTIONS.some(i => i.id === id)).slice(0, 4) : [];
    } catch {
      return [];
    }
  });

  const [compareHint, setCompareHint] = useState<string | null>(null);
  const [pulseCompare, setPulseCompare] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Save compare selection to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('campusarge_compare_v1', JSON.stringify(compareIds));
    } catch {
      // ignore
    }
  }, [compareIds]);

  // Focus search when URL hash is #search
  useEffect(() => {
    if (location.hash === '#search') {
      const el = document.getElementById('directory-search');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus();
      }
    }
  }, [location.hash]);

  const toggleCompare = (inst: Institution) => {
    const id = String(inst.id);
    setCompareIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      if (prev.length >= 4) {
        setCompareHint('You can compare up to 4 institutions.');
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleHeroCompareClick = () => {
    if (compareIds.length >= 2) {
      navigate(`/compare?ids=${compareIds.join(',')}`);
    } else {
      document.getElementById('directory')?.scrollIntoView({ behavior: 'smooth' });
      setCompareHint('Select 2–4 institutions to compare.');
      setPulseCompare(true);
      setTimeout(() => setPulseCompare(false), 2000);
    }
  };

  // Filter & Sort
  const filtered = useMemo(() => {
    return MAPPED_INSTITUTIONS.filter((inst) => {
      if (search) {
        const q = search.toLowerCase();
        const matchesName = inst.name.toLowerCase().includes(q);
        const matchesLocation = inst.location.toLowerCase().includes(q);
        const matchesTags = inst.tags.some((t) => t.toLowerCase().includes(q));
        const matchesClassification = inst.classification?.toLowerCase().includes(q) ?? false;
        if (!matchesName && !matchesLocation && !matchesTags && !matchesClassification) return false;
      }

      if (filterCountry && inst.country !== filterCountry) return false;
      if (filterRegion && inst.region !== filterRegion) return false;
      if (filterType && inst.type !== filterType) return false;
      if (filterResearch && !inst.researchAreas.includes(filterResearch)) return false;

      if (filterRanking === 'top10' && (inst.rank === null || inst.rank > 10)) return false;
      if (filterRanking === 'top50' && (inst.rank === null || inst.rank > 50)) return false;

      if (filterScholarships && !inst.scholarships) return false;
      if (filterVerified && !inst.verified) return false;

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
    }).sort((a, b) => {
      if (sortBy === 'coa-asc') {
        const valA = a.costOfAttendance ?? Number.POSITIVE_INFINITY;
        const valB = b.costOfAttendance ?? Number.POSITIVE_INFINITY;
        return valA - valB;
      }
      if (sortBy === 'coa-desc') {
        const valA = a.costOfAttendance ?? -1;
        const valB = b.costOfAttendance ?? -1;
        return valB - valA;
      }
      if (sortBy === 'ratio-asc') {
        const valA = a.studentFacultyRatioNum ?? Number.POSITIVE_INFINITY;
        const valB = b.studentFacultyRatioNum ?? Number.POSITIVE_INFINITY;
        return valA - valB;
      }
      if (sortBy === 'undergrad-desc') {
        const valA = a.undergradPop ?? -1;
        const valB = b.undergradPop ?? -1;
        return valB - valA;
      }
      return a.name.localeCompare(b.name);
    });
  }, [
    search, filterCountry, filterRegion, filterType, filterResearch,
    filterRanking, filterScholarships, filterVerified, filterClassification,
    filterAccreditor, filterCoaRange, filterRatio, filterCrime, sortBy
  ]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [
    search, filterCountry, filterRegion, filterType, filterResearch,
    filterRanking, filterScholarships, filterVerified, filterClassification,
    filterAccreditor, filterCoaRange, filterRatio, filterCrime, sortBy
  ]);

  const visible = filtered.slice(0, visibleCount);

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

  const clearAllFilters = () => {
    setSearch('');
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
  };

  // Structured Data (JSON-LD)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Compare Colleges & Universities | CampusArge',
    description: `Explore and compare ${TOTAL_COUNT} accredited institutions by tuition, student-faculty ratios, and academic programs.`,
    url: 'https://campusarge.com/institutions',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: visible.map((inst, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: inst.name,
        url: `https://campusarge.com/institutions/${inst.id}`
      }))
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://campusarge.com' },
        { '@type': 'ListItem', position: 2, name: 'Institutions', item: 'https://campusarge.com/institutions' }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 transition-colors">
      <Helmet>
        <title>{`Compare ${TOTAL_COUNT}+ Colleges & Universities | CampusArge`}</title>
        <meta
          name="description"
          content={`Explore and compare ${TOTAL_COUNT}+ accredited institutions by tuition, programs, student-faculty ratio, and academic excellence on CampusArge.`}
        />
        <link rel="canonical" href="https://campusarge.com/institutions" />
        <meta property="og:title" content={`Compare ${TOTAL_COUNT}+ Colleges & Universities | CampusArge`} />
        <meta property="og:description" content={`Explore and compare ${TOTAL_COUNT}+ accredited institutions worldwide.`} />
        <meta property="og:url" content="https://campusarge.com/institutions" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      {/* ── B2: HERO SECTION ──────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 sm:pt-36 sm:pb-24 lg:pt-36 lg:pb-28 overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800">
        {/* Desktop Campus Photo — Bleeds to right edge, flush with header bottom, masked fade */}
        <div className="absolute top-0 right-0 bottom-0 w-[62vw] max-w-[1100px] pointer-events-none select-none z-0 hidden lg:block overflow-hidden">
          <img
            src={heroCampus}
            alt="Historic university campus building with trees and a green lawn under a blue sky"
            width={995}
            height={312}
            // @ts-expect-error fetchpriority attribute is supported in modern browsers
            fetchpriority="high"
            decoding="async"
            className="w-full h-full object-cover object-right inst-hero-art"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-2xl lg:max-w-xl xl:max-w-2xl">
            {/* Badge: Gold-tint pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FBF6EC] border border-[#EADFC8] text-navy text-sm font-medium mb-6">
              <Building2 className="w-4 h-4 text-gold" aria-hidden="true" />
              <span>Global Institution Directory</span>
            </div>

            {/* H1 */}
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-slate-900 dark:text-white leading-[1.12] mb-4 text-balance">
              Find the Right <span className="text-gold">Institution</span> for You
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-xl text-pretty mb-8">
              Explore and compare <strong className="text-navy dark:text-white font-bold">{TOTAL_COUNT}+</strong> accredited institutions by tuition, programs, faculty and more.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <a
                href="#directory"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('directory')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-7 py-3.5 bg-navy hover:bg-navy-dark text-white font-semibold rounded-[10px] shadow-sm transition-all text-sm flex items-center gap-2"
              >
                Explore Institutions
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>

              <button
                type="button"
                onClick={handleHeroCompareClick}
                className="px-7 py-3.5 bg-white dark:bg-slate-800 border-[1.5px] border-navy text-navy dark:text-gold hover:bg-navy-light/40 font-semibold rounded-[10px] transition-all text-sm flex items-center gap-1.5 shadow-sm"
              >
                Compare Now {compareIds.length > 0 && `(${compareIds.length})`}
              </button>
            </div>

            {/* Mobile Photo: below buttons */}
            <div className="lg:hidden w-full h-[200px] mt-6 relative overflow-hidden pointer-events-none select-none rounded-xl">
              <img
                src={heroCampus}
                alt="Historic university campus building with trees and a green lawn under a blue sky"
                className="w-full h-full object-cover object-[60%_center] [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── B3: FLOATING STATS BAR ────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-12 relative z-20 mb-12">
        <div className="bg-white dark:bg-slate-900 rounded-[20px] border border-[#E5E9EF] dark:border-slate-800 shadow-[0_4px_20px_rgba(16,42,67,0.06)] p-6 sm:p-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x divide-slate-200 dark:divide-slate-800">
            {/* Stat 1: Institutions */}
            <div className="flex items-center gap-4 lg:justify-center">
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-6 h-6 text-gold" aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy dark:text-white tabular-nums">{TOTAL_COUNT}+</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Institutions</p>
              </div>
            </div>

            {/* Stat 2: Programs */}
            <div className="flex items-center gap-4 lg:justify-center">
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-gold" aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy dark:text-white tabular-nums">{PROGRAMS_COUNT_DISPLAY}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Programs</p>
              </div>
            </div>

            {/* Stat 3: With Cost Data */}
            <div className="flex items-center gap-4 lg:justify-center">
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                <Wallet className="w-6 h-6 text-gold" aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy dark:text-white tabular-nums">{WITH_COST_DATA_COUNT}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">With Cost Data</p>
              </div>
            </div>

            {/* Stat 4: Verified Institutions */}
            <div className="flex items-center gap-4 lg:justify-center">
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6 text-gold" aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy dark:text-white tabular-nums">100%</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Verified Institutions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── B4: DIRECTORY TOOLBAR & CONTENT ─────────────────────────────────── */}
      <div id="directory" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Directory Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
          {/* Left: Heading & Subtitle */}
          <div>
            <h2 className="font-display font-semibold text-2xl sm:text-3xl text-slate-900 dark:text-white">
              Institutions <span className="text-gold">Directory</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-1">
              Compare accredited institutions by tuition, programs, faculty and more.
            </p>
          </div>

          {/* Right: Search, Sort, Filters row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search input */}
            <div className="relative min-w-[280px] sm:min-w-[320px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
              <input
                id="directory-search"
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by institution name, city, program, or classification…"
                aria-label="Search institutions"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E9EF] dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-navy text-sm shadow-sm"
              />
            </div>

            {/* Sort dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort institutions"
                className="w-full sm:w-auto appearance-none pl-3.5 pr-8 py-2.5 rounded-xl border border-[#E5E9EF] dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-navy cursor-pointer"
              >
                <option value="name-asc">Sort: Name (A – Z)</option>
                <option value="coa-asc">Cost of Attendance: Low → High</option>
                <option value="coa-desc">Cost of Attendance: High → Low</option>
                <option value="ratio-asc">Student/Faculty Ratio: Low → High</option>
                <option value="undergrad-desc">Undergraduate Size: High → Low</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Filters Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              aria-expanded={showFilters}
              aria-controls="filter-panel"
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-colors shadow-sm ${
                showFilters || activePills.length > 0
                  ? 'border-navy bg-navy text-white'
                  : 'border-[#E5E9EF] dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
              <span>Filters</span>
              {activePills.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-gold text-white text-[11px] font-bold flex items-center justify-center">
                  {activePills.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Counter row & Compare hint */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing <strong className="text-navy dark:text-white font-semibold">{visible.length}</strong> of{' '}
            <strong className="text-navy dark:text-white font-semibold">{filtered.length}</strong> institutions
          </p>

          {compareHint && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-amber-800 dark:text-amber-300 text-xs font-medium animate-fade-in">
              <span>{compareHint}</span>
              <button
                type="button"
                onClick={() => setCompareHint(null)}
                className="text-amber-600 hover:text-amber-900 dark:hover:text-amber-100 ml-1"
                aria-label="Dismiss hint"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* Extended Filter Panel */}
        {showFilters && (
          <div id="filter-panel" className="bg-white dark:bg-slate-900 rounded-2xl p-6 mb-8 border border-slate-200/80 dark:border-slate-800 shadow-md animate-fade-in">
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

              {/* Cost of Attendance */}
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1.5" htmlFor="filter-coa">
                  Cost of Attendance (COA)
                </label>
                <select
                  id="filter-coa"
                  value={filterCoaRange}
                  onChange={(e) => setFilterCoaRange(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white"
                >
                  <option value="">Any Cost</option>
                  <option value="under30">Under $30k / year</option>
                  <option value="30to60">$30k – $60k / year</option>
                  <option value="over60">Over $60k / year</option>
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
                  onChange={(e) => setFilterRatio(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white"
                >
                  <option value="">Any Ratio</option>
                  <option value="le10">10:1 or better</option>
                  <option value="le15">15:1 or better</option>
                </select>
              </div>

              {/* Institution Type */}
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1.5" htmlFor="filter-type">
                  Type
                </label>
                <select
                  id="filter-type"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white"
                >
                  <option value="">All Types</option>
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                </select>
              </div>

              {/* Ranking */}
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1.5" htmlFor="filter-ranking">
                  QS Ranking
                </label>
                <select
                  id="filter-ranking"
                  value={filterRanking}
                  onChange={(e) => setFilterRanking(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white"
                >
                  <option value="">All Rankings</option>
                  <option value="top10">Top 10 Globally</option>
                  <option value="top50">Top 50 Globally</option>
                </select>
              </div>

              {/* Research Field */}
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1.5" htmlFor="filter-research">
                  Research Discipline
                </label>
                <select
                  id="filter-research"
                  value={filterResearch}
                  onChange={(e) => setFilterResearch(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white"
                >
                  <option value="">All Disciplines</option>
                  {ALL_RESEARCH_AREAS.slice(0, 30).map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              {/* Crime Level */}
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1.5" htmlFor="filter-crime">
                  Campus Area Safety
                </label>
                <select
                  id="filter-crime"
                  value={filterCrime}
                  onChange={(e) => setFilterCrime(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white"
                >
                  <option value="">Any Safety Level</option>
                  <option value="Low">Low Crime Rate</option>
                  <option value="Medium">Medium</option>
                </select>
              </div>
            </div>

            {/* Checkbox row & clear button */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex flex-wrap items-center gap-6">
                <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterScholarships}
                    onChange={(e) => setFilterScholarships(e.target.checked)}
                    className="rounded text-navy focus:ring-navy w-4 h-4"
                  />
                  <span>Scholarships Available</span>
                </label>
                <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterVerified}
                    onChange={(e) => setFilterVerified(e.target.checked)}
                    className="rounded text-navy focus:ring-navy w-4 h-4"
                  />
                  <span>Verified Institutions Only</span>
                </label>
              </div>
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 underline"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        )}

        {/* Active Filter Pills */}
        {activePills.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs font-semibold text-slate-500">Active:</span>
            {activePills.map((pill) => (
              <span
                key={pill.label}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-navy-light text-navy border border-navy/20"
              >
                {pill.label}
                <button
                  type="button"
                  onClick={pill.onRemove}
                  aria-label={`Remove filter ${pill.label}`}
                  className="hover:text-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs text-slate-500 hover:text-navy underline ml-2"
            >
              Clear all
            </button>
          </div>
        )}

        {/* ── B5/B6: 3-COLUMN CARD GRID ───────────────────────────────────── */}
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-[20px] border border-[#E5E9EF] dark:border-slate-800 p-16 text-center max-w-xl mx-auto my-12 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <SearchX className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-2">
              No institutions found
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              Try adjusting your search terms or relaxing active filters to explore more institutions.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-6 py-2.5 bg-navy text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-navy-dark transition-colors"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {visible.map((inst) => (
                <InstitutionCard
                  key={inst.id}
                  inst={inst}
                  isComparing={compareIds.includes(String(inst.id))}
                  onToggleCompare={toggleCompare}
                  canCompare={compareIds.length < 4}
                />
              ))}
            </div>

            {/* Load More Button */}
            {visibleCount < filtered.length && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="px-8 py-3 text-sm font-semibold text-navy dark:text-gold border-2 border-navy dark:border-gold rounded-xl hover:bg-navy hover:text-white dark:hover:bg-gold dark:hover:text-navy transition-all shadow-sm"
                >
                  Load More Institutions ({filtered.length - visibleCount} remaining) ↓
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
