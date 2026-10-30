import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  MapPin, Globe, BookOpen, Award, CheckCircle2, Building2,
  ExternalLink, Users, ArrowLeft, DollarSign, Home, Shield,
  GraduationCap, Compass, Trophy, Bed, Maximize2, Sparkles,
  Info, ChevronRight
} from 'lucide-react';
import { REAL_UNIVERSITIES, getUniversityById } from '@/lib/universitiesData';
import type { University } from '@/types';

// Helper for Initials Monogram Fallback
function MonogramFallback({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('');
  return (
    <div className="w-full h-full rounded-xl bg-gradient-to-br from-navy to-oxford flex items-center justify-center text-white font-display font-bold text-lg sm:text-xl shadow-inner">
      {initials || 'CA'}
    </div>
  );
}

// Helper to format clean domain
function getCleanHostname(url: string | null): string {
  if (!url) return '';
  try {
    const u = new URL(url.startsWith('http') ? url : `https://${url}`);
    return u.hostname.replace(/^www\./, '');
  } catch {
    return url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  }
}

export default function InstitutionDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [logoError, setLogoError] = useState(false);

  // Instant initial state from slim index
  const initialUni = REAL_UNIVERSITIES.find(u => u.id === slug) || null;
  const [university, setUniversity] = useState<University | null>(initialUni);
  const [loadingFull, setLoadingFull] = useState(true);

  useEffect(() => {
    setLogoError(false);
    if (!slug) return;
    
    // Look up in slim list first
    const slim = REAL_UNIVERSITIES.find(u => u.id === slug) || null;
    setUniversity(slim);
    
    // Dynamically fetch full record
    getUniversityById(slug).then(full => {
      if (full) {
        setUniversity(full);
      }
      setLoadingFull(false);
    }).catch(() => {
      setLoadingFull(false);
    });
  }, [slug]);

  if (!university) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-center">
        <Helmet>
          <title>Institution Not Found | CampusArge</title>
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <div className="w-20 h-20 mx-auto bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6">
          <Building2 className="w-10 h-10 text-slate-400" />
        </div>
        <h1 className="text-3xl font-bold font-display text-slate-900 dark:text-white mb-4">Institution Not Found</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          The institution you are looking for does not exist or has been moved.
        </p>
        <Link to="/institutions" className="btn-primary px-6 py-3 inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Directory
        </Link>
      </div>
    );
  }

  const facts = university.facts || {};
  const isSparse = !university.cost_of_attendance && !facts.campus_acreage && !facts.undergrad_population && !facts.avg_apartment_rent;

  // SEO Helpers
  const pageTitle = `${university.name} – Programs, Cost & Research | CampusArge`;
  const metaDescParts = [
    `${university.name}${university.city ? ` in ${university.city}` : ''}`,
    facts.school_classification ? facts.school_classification : null,
    university.cost_of_attendance ? `Cost of attendance $${university.cost_of_attendance.toLocaleString('en-US')}/year` : null,
    facts.student_faculty_ratio ? `${facts.student_faculty_ratio.display} ratio` : null,
    'Explore programs and research on CampusArge.'
  ].filter(Boolean);
  const metaDescription = metaDescParts.join('. ').slice(0, 158);

  const canonicalUrl = `https://campusarge.com/institutions/${university.id}`;
  const websiteUrl = university.website || canonicalUrl;

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    "name": university.name,
    "url": websiteUrl,
    "sameAs": university.website ? [university.website] : undefined,
    "logo": university.logo_url || undefined,
    "description": university.description || facts.about || undefined,
    "identifier": university.id,
    "address": {
      "@type": "PostalAddress",
      ...(university.city ? { "addressLocality": university.city } : {}),
      ...(university.state ? { "addressRegion": university.state } : {}),
      "addressCountry": university.country || "United States"
    }
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://campusarge.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Institutions",
        "item": "https://campusarge.com/institutions"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": university.name,
        "item": canonicalUrl
      }
    ]
  };

  // FAQ Schema if relevant data exists
  const faqList = [];
  if (university.cost_of_attendance) {
    faqList.push({
      "@type": "Question",
      "name": `What is the cost of attendance at ${university.name}?`,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": `The estimated annual cost of attendance at ${university.name} is $${university.cost_of_attendance.toLocaleString('en-US')}.`
      }
    });
  }
  if (facts.student_faculty_ratio) {
    faqList.push({
      "@type": "Question",
      "name": `What is the student-to-faculty ratio at ${university.name}?`,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": `The student-to-faculty ratio at ${university.name} is ${facts.student_faculty_ratio.display}.`
      }
    });
  }
  if (facts.anchor_programs && facts.anchor_programs.length > 0) {
    faqList.push({
      "@type": "Question",
      "name": `Which programs is ${university.name} best known for?`,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": `${university.name} is known for signature programs including ${facts.anchor_programs.join(', ')}.`
      }
    });
  }

  const faqLd = faqList.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqList
  } : null;

  // Related Institutions (Up to 4 with same classification or matching anchor programs)
  const relatedInstitutions = REAL_UNIVERSITIES.filter(u => {
    if (u.id === university.id) return false;
    const sameClass = facts.school_classification && u.facts?.school_classification === facts.school_classification;
    const overlapAnchor = facts.anchor_programs && u.facts?.anchor_programs?.some(p => facts.anchor_programs?.includes(p));
    return sameClass || overlapAnchor;
  }).slice(0, 4);

  // Crime rate styling
  const crimeBadgeClass = facts.crime_rate?.level === 'low'
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800'
    : facts.crime_rate?.level === 'high'
    ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800'
    : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800';

  // Complete data sheet mapping for Section 10
  const dataSheetItems: { label: string; value: string | null }[] = [
    { label: 'University', value: university.name },
    { label: 'Website', value: university.website },
    { label: 'Description', value: university.description },
    { label: 'About', value: facts.about || null },
    { label: 'Research', value: facts.research_summary || null },
    { label: 'Programs', value: university.programs && university.programs.length > 0 ? university.programs.join(', ') : null },
    { label: 'Cost of Living (Annual)', value: facts.cost_of_living?.display || (facts.cost_of_living_index != null ? `${facts.cost_of_living_index} (Index, 100 = U.S. avg)` : null) },
    { label: 'Average Home Price', value: facts.avg_home_price?.display || null },
    { label: 'Local Crime Rate', value: facts.crime_rate?.display || null },
    { label: 'Average Apartment Rent', value: facts.avg_apartment_rent?.display || null },
    { label: 'School Classification', value: facts.school_classification || null },
    { label: 'Accreditation Status', value: facts.accreditation_status || null },
    { label: 'Campus Acreage', value: facts.campus_acreage?.display || null },
    { label: 'Undergrad Pop', value: facts.undergrad_population?.display || null },
    { label: 'Graduation Pop', value: facts.graduate_population?.display || null },
    { label: 'Campus Housing Capacity (Beds)', value: facts.housing_capacity_beds?.display || null },
    { label: 'Athletic Conference', value: facts.athletic_conference || null },
    { label: 'Athletic Options (Varsity Sports)', value: facts.varsity_sports?.display || null },
    { label: 'Student/Faculty Ratio', value: facts.student_faculty_ratio?.display || null },
    { label: 'Cost of Attendance (COA)', value: university.cost_of_attendance ? `$${university.cost_of_attendance.toLocaleString('en-US')} / year` : null },
    { label: 'Anchor Programs', value: facts.anchor_programs && facts.anchor_programs.length > 0 ? facts.anchor_programs.join(', ') : null },
    { label: 'Logo Links', value: university.logo_url || null }
  ].filter(item => item.value && item.value.trim().length > 0);

  return (
    <div className="min-h-screen pb-20 bg-slate-50/60 dark:bg-slate-950">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="CampusArge" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="https://campusarge.com/og-image.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content="https://campusarge.com/og-image.png" />

        {/* JSON-LD */}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
        {faqLd && <script type="application/ld+json">{JSON.stringify(faqLd)}</script>}
      </Helmet>

      {/* 1. Header (Branded Navy Gradient) */}
      <div className="relative pt-28 pb-14 bg-gradient-to-br from-navy via-navy-dark to-oxford text-white overflow-hidden shadow-md">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-xs text-white/70">
              <li>
                <Link to="/" className="hover:text-gold transition-colors">Home</Link>
              </li>
              <ChevronRight className="w-3.5 h-3.5 text-white/40" />
              <li>
                <Link to="/institutions" className="hover:text-gold transition-colors">Institutions</Link>
              </li>
              <ChevronRight className="w-3.5 h-3.5 text-white/40" />
              <li className="text-white font-medium truncate max-w-[200px] sm:max-w-none" aria-current="page">
                {university.name}
              </li>
            </ol>
          </nav>

          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            {/* Logo Tile */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white shadow-xl flex items-center justify-center overflow-hidden flex-shrink-0 p-3 border border-white/20">
              {university.logo_url && !logoError ? (
                <img
                  src={university.logo_url}
                  alt={`${university.name} logo`}
                  width={64}
                  height={64}
                  className="max-w-full max-h-full object-contain"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <MonogramFallback name={university.name} />
              )}
            </div>

            {/* Title, Badges, Location */}
            <div className="flex-1 min-w-0">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Institution
                </span>
                {facts.school_classification && (
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-md border border-white/10">
                    {facts.school_classification}
                  </span>
                )}
                {facts.accreditation_status && (
                  <span className="px-3 py-1 rounded-full bg-gold/20 text-gold-light text-xs font-semibold border border-gold/30">
                    {facts.accreditation_status}
                  </span>
                )}
                {university.university_type && (
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold capitalize border border-white/10">
                    {university.university_type}
                  </span>
                )}
              </div>

              {/* H1 Name */}
              <h1 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-white mb-3 leading-tight tracking-tight text-balance">
                {university.name}
              </h1>

              {/* Location & Rank */}
              <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
                {(university.city || university.country) && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-gold" />
                    {[university.city, university.state, university.country].filter(Boolean).join(', ')}
                  </span>
                )}
                {university.qs_rank && (
                  <span className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-gold" />
                    Global Rank: #{university.qs_rank}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 mt-6">
                {university.website && (
                  <a
                    href={university.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold px-4 py-2 text-xs sm:text-sm inline-flex items-center gap-2 font-semibold shadow-md"
                  >
                    Visit Website ({getCleanHostname(university.website)}) <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <Link
                  to="/institutions"
                  className="px-4 py-2 text-xs sm:text-sm inline-flex items-center gap-2 font-medium bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/15"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Institutions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* 2. At-a-Glance Stat Cards Grid (Up to 8 cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {university.cost_of_attendance != null && (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Cost of Attendance</p>
                <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tabular-nums truncate">
                  ${university.cost_of_attendance.toLocaleString('en-US')}
                </p>
                <span className="text-[11px] text-slate-400">per year</span>
              </div>
            </div>
          )}

          {facts.student_faculty_ratio && (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Student / Faculty</p>
                <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tabular-nums">
                  {facts.student_faculty_ratio.display}
                </p>
                <span className="text-[11px] text-slate-400">ratio</span>
              </div>
            </div>
          )}

          {facts.undergrad_population && (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Undergraduate</p>
                <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tabular-nums truncate">
                  {facts.undergrad_population.value != null ? facts.undergrad_population.value.toLocaleString('en-US') : facts.undergrad_population.display}
                </p>
                <span className="text-[11px] text-slate-400">students</span>
              </div>
            </div>
          )}

          {facts.graduate_population && (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Graduate Population</p>
                <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tabular-nums truncate">
                  {facts.graduate_population.value != null ? facts.graduate_population.value.toLocaleString('en-US') : facts.graduate_population.display}
                </p>
                <span className="text-[11px] text-slate-400">graduates</span>
              </div>
            </div>
          )}

          {facts.campus_acreage && (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-600 flex items-center justify-center flex-shrink-0">
                <Maximize2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Campus Acreage</p>
                <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tabular-nums truncate">
                  {facts.campus_acreage.display}
                </p>
                <span className="text-[11px] text-slate-400">campus size</span>
              </div>
            </div>
          )}

          {facts.housing_capacity_beds && (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center flex-shrink-0">
                <Bed className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Housing Capacity</p>
                <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tabular-nums truncate">
                  {facts.housing_capacity_beds.display}
                </p>
                <span className="text-[11px] text-slate-400">residential beds</span>
              </div>
            </div>
          )}

          {facts.varsity_sports && (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center flex-shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Athletics</p>
                <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tabular-nums truncate">
                  {facts.varsity_sports.display}
                </p>
                <span className="text-[11px] text-slate-400">varsity options</span>
              </div>
            </div>
          )}

          {(facts.cost_of_living != null || facts.cost_of_living_index != null) && (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center flex-shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Cost of Living</p>
                <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tabular-nums">
                  {facts.cost_of_living?.display || facts.cost_of_living_index}
                </p>
                <span className="text-[11px] text-slate-400" title="100 = U.S. average. Higher means more expensive.">
                  {facts.cost_of_living_index != null ? 'Index (100 = avg)' : 'Reported level'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 3. Main Grid: Content + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* About Section */}
            {(university.description || facts.about) && (
              <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-navy dark:text-gold" /> About {university.name}
                </h2>
                {university.description && (
                  <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4 font-normal">
                    {university.description}
                  </p>
                )}
                {facts.about && facts.about !== university.description && (
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm sm:text-base">
                    {facts.about}
                  </p>
                )}
              </section>
            )}

            {/* Research Focus */}
            {facts.research_summary && (
              <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-gold" /> Research Focus & Strengths
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                  {facts.research_summary}
                </p>
              </section>
            )}

            {/* Academic Programs */}
            {((facts.anchor_programs && facts.anchor_programs.length > 0) || (university.programs && university.programs.length > 0)) && (
              <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-navy dark:text-gold" /> Academic Programs
                </h2>

                {/* Signature / Anchor Programs */}
                {facts.anchor_programs && facts.anchor_programs.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-gold" /> Signature Anchor Programs
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {facts.anchor_programs.map(prog => (
                        <span
                          key={prog}
                          className="px-3.5 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60 text-xs sm:text-sm font-semibold flex items-center gap-1.5"
                        >
                          <Award className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                          {prog}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Programs */}
                {university.programs && university.programs.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                      All Academic Divisions & Programs
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {university.programs.map(prog => (
                        <div
                          key={prog}
                          className="flex items-center gap-3 p-3 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200"
                        >
                          <BookOpen className="w-4 h-4 text-navy dark:text-navy-light flex-shrink-0" />
                          <span className="text-sm font-medium">{prog}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Campus & Student Life Card */}
            {(facts.campus_acreage || facts.housing_capacity_beds || facts.athletic_conference || facts.varsity_sports || facts.student_faculty_ratio || facts.undergrad_population) && (
              <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-navy dark:text-gold" /> Campus & Student Life
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {facts.campus_acreage && (
                    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                      <Maximize2 className="w-4 h-4 text-slate-500" />
                      <div>
                        <p className="text-xs text-slate-500">Campus Acreage</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{facts.campus_acreage.display}</p>
                      </div>
                    </div>
                  )}

                  {facts.housing_capacity_beds && (
                    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                      <Bed className="w-4 h-4 text-slate-500" />
                      <div>
                        <p className="text-xs text-slate-500">Housing Capacity</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{facts.housing_capacity_beds.display}</p>
                      </div>
                    </div>
                  )}

                  {facts.athletic_conference && (
                    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                      <Trophy className="w-4 h-4 text-slate-500" />
                      <div>
                        <p className="text-xs text-slate-500">Athletic Conference</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{facts.athletic_conference}</p>
                      </div>
                    </div>
                  )}

                  {facts.varsity_sports && (
                    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                      <Award className="w-4 h-4 text-slate-500" />
                      <div>
                        <p className="text-xs text-slate-500">Varsity Sports</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{facts.varsity_sports.display}</p>
                      </div>
                    </div>
                  )}

                  {facts.undergrad_population && (
                    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                      <GraduationCap className="w-4 h-4 text-slate-500" />
                      <div>
                        <p className="text-xs text-slate-500">Undergraduate Population</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{facts.undergrad_population.display}</p>
                      </div>
                    </div>
                  )}

                  {facts.graduate_population && (
                    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                      <BookOpen className="w-4 h-4 text-slate-500" />
                      <div>
                        <p className="text-xs text-slate-500">Graduate Population</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{facts.graduate_population.display}</p>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Cost & Living Card */}
            {(university.cost_of_attendance || facts.avg_apartment_rent || facts.avg_home_price || facts.cost_of_living_index != null || facts.crime_rate) && (
              <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-600" /> Cost of Attendance & Living Environment
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {university.cost_of_attendance != null && (
                    <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800/40">
                      <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 mb-1">Cost of Attendance (COA)</p>
                      <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-200 tabular-nums">
                        ${university.cost_of_attendance.toLocaleString('en-US')}
                      </p>
                      <p className="text-xs text-emerald-700/80 dark:text-emerald-400 mt-1">Estimated annual comprehensive tuition and fees</p>
                    </div>
                  )}

                  {(facts.cost_of_living != null || facts.cost_of_living_index != null) && (
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800">
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Cost of Living</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                        {facts.cost_of_living?.display || facts.cost_of_living_index}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {facts.cost_of_living_index != null ? '100 = U.S. average. Higher values indicate higher living expenses.' : 'Local cost of living environment relative to national norms.'}
                      </p>
                    </div>
                  )}

                  {facts.avg_apartment_rent && (
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800">
                      <div className="flex items-center gap-2 mb-1">
                        <Home className="w-4 h-4 text-blue-600" />
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Average Apartment Rent</p>
                      </div>
                      <p className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">
                        {facts.avg_apartment_rent.display}
                      </p>
                    </div>
                  )}

                  {facts.avg_home_price && (
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800">
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 className="w-4 h-4 text-purple-600" />
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Average Home Price</p>
                      </div>
                      <p className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">
                        {facts.avg_home_price.display}
                      </p>
                    </div>
                  )}

                  {facts.crime_rate && (
                    <div className="sm:col-span-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-slate-500" />
                        <div>
                          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Local Crime Rate</p>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{facts.crime_rate.display}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${crimeBadgeClass}`}>
                        <Shield className="w-3.5 h-3.5" />
                        {facts.crime_rate.level ? `${facts.crime_rate.level.toUpperCase()} LEVEL` : 'REPORTED'}
                      </span>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Accreditation & Classification Card */}
            {(facts.school_classification || facts.accreditation_status) && (
              <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-gold" /> Accreditation & Institutional Classification
                </h2>
                <div className="space-y-3">
                  {facts.accreditation_status && (
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                      <p className="text-xs font-semibold text-slate-500 mb-1">Accreditation Status</p>
                      <p className="text-base font-bold text-slate-900 dark:text-white">
                        {facts.accreditor ? `Accredited by ${facts.accreditor}` : facts.accreditation_status}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Formally recognized accreditation verifying institutional academic and operational standards.
                      </p>
                    </div>
                  )}
                  {facts.school_classification && (
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                      <p className="text-xs font-semibold text-slate-500 mb-1">Classification</p>
                      <p className="text-base font-bold text-slate-900 dark:text-white">{facts.school_classification}</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* 10. Complete Data Sheet Table (<dl>-based) */}
            <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white flex items-center gap-2">
                  <Info className="w-5 h-5 text-navy dark:text-gold" /> Institution Data Sheet
                </h2>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {dataSheetItems.length} Fields Reported
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                Complete verified data points reported for {university.name}.
              </p>

              <dl className="divide-y divide-slate-100 dark:divide-slate-800 border-t border-b border-slate-100 dark:border-slate-800">
                {dataSheetItems.map(item => (
                  <div key={item.label} className="py-3 sm:py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4">
                    <dt className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
                      {item.label}
                    </dt>
                    <dd className="sm:col-span-2 text-xs sm:text-sm text-slate-900 dark:text-white font-medium break-words">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>

              {isSparse && (
                <div className="mt-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Info className="w-4 h-4 flex-shrink-0 text-slate-400" />
                  <span>Some details haven't been reported for this institution yet.</span>
                </div>
              )}
            </section>

            {/* 11. Related Institutions */}
            {relatedInstitutions.length > 0 && (
              <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-6">
                  Similar Institutions
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {relatedInstitutions.map(rel => (
                    <Link
                      key={rel.id}
                      to={`/institutions/${rel.id}`}
                      className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-gold/60 transition-all bg-slate-50/50 dark:bg-slate-800/30 flex items-center gap-3.5 group"
                    >
                      <div className="w-12 h-12 rounded-lg bg-white shadow-sm flex items-center justify-center p-2 flex-shrink-0 border border-slate-100">
                        {rel.logo_url ? (
                          <img src={rel.logo_url} alt="" className="w-full h-full object-contain" />
                        ) : (
                          <Building2 className="w-6 h-6 text-slate-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-gold transition-colors truncate">
                          {rel.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {[rel.city, rel.country].filter(Boolean).join(', ')}
                        </p>
                        {rel.facts?.school_classification && (
                          <span className="inline-block mt-1 text-[10px] text-slate-600 dark:text-slate-400 font-medium">
                            {rel.facts.school_classification}
                          </span>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-gold transition-colors" />
                    </Link>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Quick Facts Card (Sticky on desktop) */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm lg:sticky lg:top-24">
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                Quick Facts
              </h3>
              <ul className="space-y-4">
                {university.qs_rank && (
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center flex-shrink-0">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">QS World Ranking</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">#{university.qs_rank}</p>
                    </div>
                  </li>
                )}

                {facts.school_classification && (
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Classification</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{facts.school_classification}</p>
                    </div>
                  </li>
                )}

                {university.cost_of_attendance != null && (
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Annual Cost of Attendance</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                        ${university.cost_of_attendance.toLocaleString('en-US')}
                      </p>
                    </div>
                  </li>
                )}

                {facts.student_faculty_ratio && (
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Student-to-Faculty Ratio</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{facts.student_faculty_ratio.display}</p>
                    </div>
                  </li>
                )}

                {facts.accreditation_status && (
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gold/10 text-gold flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Accreditation</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{facts.accreditation_status}</p>
                    </div>
                  </li>
                )}

                {university.website && (
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center flex-shrink-0">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Official Website</p>
                      <a
                        href={university.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-bold text-navy hover:text-gold transition-colors truncate block"
                      >
                        {getCleanHostname(university.website)}
                      </a>
                    </div>
                  </li>
                )}
              </ul>
            </div>

            {/* CTA: Interested in Connecting? (Existing CTA preserved) */}
            <div className="bg-gradient-to-br from-navy via-navy-dark to-oxford text-white rounded-2xl p-6 shadow-md border border-white/10">
              <h3 className="font-display font-bold text-lg text-white mb-2">Interested in connecting?</h3>
              <p className="text-sm text-white/80 mb-6 leading-relaxed">
                Reach out to explore academic partnerships, faculty connections, or research collaborations with {university.name}.
              </p>
              <Link to="/contact" className="btn-gold w-full flex items-center justify-center gap-2 py-3 font-semibold shadow-sm">
                Contact Institution <ExternalLink className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
