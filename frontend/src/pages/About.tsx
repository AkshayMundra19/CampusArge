import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Building2, BookOpen, Wallet, ShieldCheck, 
  Scale, CheckCircle2, Globe, Zap, 
  ChevronDown, ArrowRight, Sparkles, HelpCircle,
  FileText, RefreshCw, Award, Compass, Users
} from 'lucide-react';
import { REAL_UNIVERSITIES } from '@/lib/universitiesData';

// ── DATA-DRIVEN COUNTS (mirrors InstitutionsDirectory.tsx) ──────────
const TOTAL_COUNT = REAL_UNIVERSITIES.length; // 426+
const ALL_UNIQUE_PROGRAMS = [...new Set(REAL_UNIVERSITIES.flatMap(u => u.programs || []))];
const PROGRAMS_COUNT_NUM = Math.floor(ALL_UNIQUE_PROGRAMS.length / 100) * 100; // 700
const WITH_COST_DATA_COUNT = REAL_UNIVERSITIES.filter(u => u.cost_of_attendance != null && u.cost_of_attendance > 0).length; // 406

// ── ACCESSIBLE COUNT-UP COMPONENT ──────────────────────────────────
function AnimatedStatCounter({ 
  targetValue, 
  suffix = '', 
  label, 
  icon: Icon,
  colorClass
}: { 
  targetValue: number; 
  suffix?: string; 
  label: string; 
  icon: React.ElementType;
  colorClass: string;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplayValue(targetValue);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          const duration = 1200; // ms
          const start = performance.now();

          const step = (timestamp: number) => {
            const progress = Math.min((timestamp - start) / duration, 1);
            // Ease-out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setDisplayValue(Math.floor(easeOut * targetValue));

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setDisplayValue(targetValue);
            }
          };

          requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [targetValue]);

  return (
    <div 
      ref={ref}
      className="bg-white dark:bg-slate-900 rounded-[20px] p-6 sm:p-8 border border-[#E5E9EF] dark:border-slate-800 shadow-[0_4px_20px_rgba(16,42,67,0.06)] hover:shadow-[0_8px_24px_rgba(16,42,67,0.1)] transition-all duration-300 group"
    >
      <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center mb-5 shadow-sm group-hover:scale-105 transition-transform`}>
        <Icon className="w-6 h-6" aria-hidden="true" />
      </div>
      <div className="font-display font-extrabold text-3xl sm:text-4xl text-navy dark:text-white tabular-nums mb-1 tracking-tight">
        {displayValue.toLocaleString()}{suffix}
      </div>
      <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>
    </div>
  );
}

// ── FAQ DATA (4 existing preserved verbatim + 4 new) ────────────────
const FAQ_ITEMS = [
  {
    q: 'Are the professors verified?',
    a: 'Yes. Every faculty member goes through a verification process. Our team reviews credentials, university affiliation, and professional background before awarding the verified badge.'
  },
  {
    q: 'Can anyone create a profile?',
    a: 'No, creating a faculty profile is restricted to verified professors and researchers only.'
  },
  {
    q: 'What information is available for universities?',
    a: 'We provide detailed rankings, research focus areas, and a comprehensive directory of verified faculty affiliated with each institution.'
  },
  {
    q: 'Is CampusArge free for students?',
    a: 'Yes! Students and researchers can browse the global directory of verified faculty and institutions completely free.'
  },
  {
    q: 'How often is institution data updated?',
    /* [CONFIRM]: Review schedule for official institution updates */
    a: 'We review institution data regularly and update it when new official figures are published. Check the "last reviewed" note on the About page and always confirm details with the institution.'
  },
  {
    q: 'What does "COA" mean?',
    a: 'COA stands for Cost of Attendance, the estimated total yearly cost including tuition, fees and typical living expenses.'
  },
  {
    q: 'Is CampusArge affiliated with any university?',
    a: 'No. CampusArge is an independent platform and is not affiliated with or endorsed by any listed university.'
  },
  {
    q: 'How can my institution be listed or updated?',
    a: 'Write to info@campusarge.com and our team will help you review and update institutional profiles.'
  }
];

export default function About() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // FAQPage JSON-LD generated dynamically from the exact FAQ array
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a
      }
    }))
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-50/60 dark:bg-slate-950 transition-colors">
      <Helmet>
        <title>About CampusArge | Verified University Directory and Comparison Platform</title>
        <meta 
          name="description" 
          content="Learn how CampusArge provides verified, transparent institution data, tuition figures, and academic comparisons for students and families worldwide." 
        />
        <link rel="canonical" href="https://campusarge.com/about" />
        <meta property="og:title" content="About CampusArge | Verified University Directory and Comparison Platform" />
        <meta property="og:description" content="Discover how CampusArge empowers students with verified university data, costs, and comparisons." />
        <meta property="og:url" content="https://campusarge.com/about" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify(faqJsonLd)}
        </script>
      </Helmet>

      {/* ─── 1. HERO SECTION ─────────────────────────────────────────── */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 text-center">
        {/* Soft background glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-r from-navy/10 via-oxford/10 to-gold/10 blur-[90px] -z-10 rounded-full pointer-events-none" 
          aria-hidden="true" 
        />
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FBF6EC] border border-[#EADFC8] text-navy text-sm font-medium mb-8 shadow-sm">
          <Sparkles className="w-4 h-4 text-gold" aria-hidden="true" />
          <span>The New Academic Standard</span>
        </div>
        
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-slate-900 dark:text-white text-balance mb-6 tracking-tight leading-[1.12]">
          Bridging the gap between <br className="hidden sm:block" />
          <span className="text-gold">ambition and expertise.</span>
        </h1>
        
        <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-400 text-pretty max-w-2xl mx-auto leading-relaxed mb-10">
          CampusArge brings verified institution data into one clean, comparable view, so students and families can make decisions with confidence.
        </p>

        {/* Hero Actions: Single primary button + subtle smooth-scroll link */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <Link 
            to="/institutions" 
            className="w-full sm:w-auto px-8 py-3.5 bg-navy hover:bg-navy-dark text-white font-semibold rounded-[10px] shadow-sm transition-all text-sm inline-flex items-center justify-center gap-2"
          >
            Explore Universities
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
          <a
            href="#verification"
            className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-navy dark:hover:text-gold transition-colors underline underline-offset-4 decoration-slate-300 dark:decoration-slate-700 hover:decoration-navy py-2"
          >
            See how verification works ↓
          </a>
        </div>
      </section>

      {/* ─── 2. DATA-DRIVEN STATS STRIP ───────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-28 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <AnimatedStatCounter 
            targetValue={TOTAL_COUNT}
            suffix="+"
            label="Institutions Listed"
            icon={Building2}
            colorClass="bg-navy/10 text-navy dark:text-gold"
          />
          <AnimatedStatCounter 
            targetValue={PROGRAMS_COUNT_NUM}
            suffix="+"
            label="Programs Covered"
            icon={BookOpen}
            colorClass="bg-oxford/10 text-oxford dark:text-white"
          />
          <AnimatedStatCounter 
            targetValue={WITH_COST_DATA_COUNT}
            suffix=""
            label="With Cost Data (COA)"
            icon={Wallet}
            colorClass="bg-gold/15 text-gold"
          />
          <AnimatedStatCounter 
            targetValue={100}
            suffix="%"
            label="Verified Legitimacy"
            icon={ShieldCheck}
            colorClass="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
          />
        </div>
      </section>

      {/* ─── 3. OUR MISSION / STORY ───────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-28">
        <div className="bg-white dark:bg-slate-900 rounded-[24px] border border-[#E5E9EF] dark:border-slate-800 p-8 sm:p-12 lg:p-16 shadow-[0_4px_24px_rgba(16,42,67,0.06)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Narrative text */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
                <span>Our Purpose</span>
              </div>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
                Why CampusArge exists
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base sm:text-lg">
                Choosing where to study shouldn't mean opening thirty browser tabs. Tuition figures live in one place, programs in another, and reliable information about faculty and research is often buried or outdated.
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base sm:text-lg">
                CampusArge brings verified institution data into one clean, comparable view, so students and families can make decisions with confidence. We are an independent platform: we are not affiliated with, or endorsed by, any listed university.
              </p>
            </div>

            {/* Right: Key Principle Callout */}
            <div className="lg:col-span-5 bg-[#FBF6EC] dark:bg-slate-800/80 rounded-2xl p-6 sm:p-8 border border-[#EADFC8] dark:border-slate-700">
              <h3 className="font-display font-bold text-xl text-navy dark:text-white mb-3">
                Independent & Unbiased
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Universities cannot pay for ranking placement or altered statistics. Every data point is indexed strictly from accredited public disclosures and verified institutional reporting.
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#8C6D3B] dark:text-gold">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                <span>100% Free Public Education Directory</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. HOW IT WORKS ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-28">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <RefreshCw className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
            <span>Simple Workflow</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-3">
            How CampusArge Works
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Navigate global higher education in three straightforward steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Step 1 */}
          <div className="bg-white dark:bg-slate-900 rounded-[20px] p-8 border border-[#E5E9EF] dark:border-slate-800 shadow-[0_4px_16px_rgba(16,42,67,0.06)] relative flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-navy/10 text-navy dark:text-gold flex items-center justify-center font-display font-extrabold text-lg mb-6">
                1
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-3">
                Search and filter
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Find institutions by name, city, program or subject area with real-time responsive filtering and live count tracking.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white dark:bg-slate-900 rounded-[20px] p-8 border border-[#E5E9EF] dark:border-slate-800 shadow-[0_4px_16px_rgba(16,42,67,0.06)] relative flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-oxford/10 text-oxford dark:text-gold flex items-center justify-center font-display font-extrabold text-lg mb-6">
                2
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-3">
                Compare side by side
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Line up cost of attendance, student-to-faculty ratio and programs for multiple institutions at once in an interactive matrix.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white dark:bg-slate-900 rounded-[20px] p-8 border border-[#E5E9EF] dark:border-slate-800 shadow-[0_4px_16px_rgba(16,42,67,0.06)] relative flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-gold/15 text-gold flex items-center justify-center font-display font-extrabold text-lg mb-6">
                3
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-3">
                Decide with confidence
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Open a full institution profile with verified details, accreditation information, and anchor programs to plan your academic next step.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. DESIGNED FOR ACADEMIC EXCELLENCE (6 BENTO CARDS) ─────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-28">
        <div className="text-center mb-14">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-3">
            Designed for Academic Excellence
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            We're building more than a directory. We're creating the infrastructure for global academic discovery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Ironclad Verification (Existing) */}
          <div className="bg-white dark:bg-slate-900 rounded-[20px] p-8 border border-[#E5E9EF] dark:border-slate-800 shadow-[0_4px_16px_rgba(16,42,67,0.06)] flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-navy/10 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-navy dark:text-gold" aria-hidden="true" />
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-3">
                Ironclad Verification
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Every institution on our platform is cross-checked against official accreditation boards and institutional registries. No fake profiles, no misleading credentials.
              </p>
            </div>
          </div>

          {/* Card 2: Global Reach (Existing) */}
          <div className="bg-white dark:bg-slate-900 rounded-[20px] p-8 border border-[#E5E9EF] dark:border-slate-800 shadow-[0_4px_16px_rgba(16,42,67,0.06)] flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-oxford/10 flex items-center justify-center mb-6">
                <Globe className="w-6 h-6 text-oxford dark:text-gold" aria-hidden="true" />
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-3">
                Global Reach
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Break geographical barriers. Compare prestigious research centers and universities across North America and international academic hubs instantly.
              </p>
            </div>
          </div>

          {/* Card 3: Research Focus (Existing) */}
          <div className="bg-white dark:bg-slate-900 rounded-[20px] p-8 border border-[#E5E9EF] dark:border-slate-800 shadow-[0_4px_16px_rgba(16,42,67,0.06)] flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-gold/15 flex items-center justify-center mb-6">
                <BookOpen className="w-6 h-6 text-gold" aria-hidden="true" />
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-3">
                Research Focus
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Filter by deep discipline and anchor programs to find universities with the laboratory capabilities, faculty talent, and resources that match your ambitions.
              </p>
            </div>
          </div>

          {/* Card 4: Frictionless Connection (Existing) */}
          <div className="bg-white dark:bg-slate-900 rounded-[20px] p-8 border border-[#E5E9EF] dark:border-slate-800 shadow-[0_4px_16px_rgba(16,42,67,0.06)] flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-navy-light flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-navy" aria-hidden="true" />
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-3">
                Frictionless Connection
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Finding academic details used to mean navigating dozens of fragmented portals. We provide unified directory profiles, program indexes, and direct institutional links.
              </p>
            </div>
          </div>

          {/* Card 5: Transparent Cost Data (New) */}
          <div className="bg-white dark:bg-slate-900 rounded-[20px] p-8 border border-[#E5E9EF] dark:border-slate-800 shadow-[0_4px_16px_rgba(16,42,67,0.06)] flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-gold/15 flex items-center justify-center mb-6">
                <Wallet className="w-6 h-6 text-gold" aria-hidden="true" />
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-3">
                Transparent Cost Data
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Cost of attendance is shown up front on every institution card, so you can compare tuition, housing estimates, and total financial commitments early in the search.
              </p>
            </div>
          </div>

          {/* Card 6: Side-by-Side Comparison (New) */}
          <div className="bg-white dark:bg-slate-900 rounded-[20px] p-8 border border-[#E5E9EF] dark:border-slate-800 shadow-[0_4px_16px_rgba(16,42,67,0.06)] flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-oxford/10 flex items-center justify-center mb-6">
                <Scale className="w-6 h-6 text-oxford dark:text-gold" aria-hidden="true" />
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-3">
                Side-by-Side Comparison
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Add institutions to a comparison tray and review them against the exact same criteria: COA, student-to-faculty ratios, programs, and campus safety metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. OUR VERIFICATION PROCESS (TIMELINE) ─────────────────── */}
      <section id="verification" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-28 scroll-mt-24">
        <div className="bg-white dark:bg-slate-900 rounded-[24px] border border-[#E5E9EF] dark:border-slate-800 p-8 sm:p-12 lg:p-16 shadow-[0_4px_24px_rgba(16,42,67,0.06)]">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Award className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
              <span>Trust Protocol</span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-3">
              Our Verification Process
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
              How we ensure the accuracy and accreditation of every university profile.
            </p>
          </div>

          {/* Timeline steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-gold uppercase tracking-wider block mb-2">Step 01</span>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-2">
                  Identity and accreditation check
                </h3>
                {/* [CONFIRM]: Verification process Step 1 specifics */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  We check recognition against recognized regional and national accrediting agencies (e.g. NECHE, SACSCOC, HLC).
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-gold uppercase tracking-wider block mb-2">Step 02</span>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-2">
                  Data review against official sources
                </h3>
                {/* [CONFIRM]: Verification process Step 2 specifics */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Tuition, degree programs, student-faculty ratios, and campus facts are gathered from published disclosures and institutional reports.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-gold uppercase tracking-wider block mb-2">Step 03</span>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-2">
                  Verified badge awarded
                </h3>
                {/* [CONFIRM]: Verification badge issuance criteria */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Institutions passing full checks receive the Verified badge, confirming profile accuracy and current accreditation status.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-gold uppercase tracking-wider block mb-2">Step 04</span>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-2">
                  Periodic re-checks
                </h3>
                {/* [CONFIRM]: Re-check periodicity and audit frequency */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Data is audited regularly to incorporate academic calendar updates, new program accreditations, and annual cost revisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. UNDERSTANDING THE DATA (GLOSSARY) ────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-28">
        <div className="bg-white dark:bg-slate-900 rounded-[24px] border border-[#E5E9EF] dark:border-slate-800 p-8 sm:p-12 shadow-[0_4px_24px_rgba(16,42,67,0.06)]">
          <div className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <FileText className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
              <span>Metrics & Methodology</span>
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white mb-2">
              Understanding the Data
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Clear definitions of the key indicators displayed across our cards and comparison tables.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-5 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60">
              <h3 className="font-sans font-bold text-sm text-navy dark:text-white mb-1.5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold" aria-hidden="true" />
                COA (Cost of Attendance)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                The estimated yearly cost of enrollment including tuition, mandatory fees, and typical on-campus living expenses. Figures are indicative and intended for comparative benchmarking.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60">
              <h3 className="font-sans font-bold text-sm text-navy dark:text-white mb-1.5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold" aria-hidden="true" />
                Student-to-Faculty Ratio
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                The average ratio of enrolled students per instructional faculty member. Lower ratios generally reflect smaller seminar sizes and greater direct access to professors.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60">
              <h3 className="font-sans font-bold text-sm text-navy dark:text-white mb-1.5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold" aria-hidden="true" />
                Degree Programs
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                The count and catalog of distinct academic degree fields and anchor departments actively offered by the institution.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60">
              <h3 className="font-sans font-bold text-sm text-navy dark:text-white mb-1.5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold" aria-hidden="true" />
                Verified Badge
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Signifies that the university's institutional status, accreditation credentials, and public baseline figures have been corroborated by CampusArge.
              </p>
            </div>
          </div>

          {/* Indicative Disclaimer and Last Reviewed Note */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
            <p className="italic">
              Figures are indicative and can change over time. Always confirm current tuition and program terms with the institution directly before applying.
            </p>
            <span className="font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
              {/* [CONFIRM]: Date of latest data review batch */}
              Data last reviewed: October 2026
            </span>
          </div>
        </div>
      </section>

      {/* ─── 8. BUILT FOR (INFORMATIONAL ONLY, NO BUTTONS) ──────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-28">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Users className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
            <span>Audience Value</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-3">
            Built for Students, Families & Institutions
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Delivering clarity and fairness on both sides of the higher education landscape.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Column 1: For students and families */}
          <div className="bg-white dark:bg-slate-900 rounded-[20px] p-8 border border-[#E5E9EF] dark:border-slate-800 shadow-[0_4px_16px_rgba(16,42,67,0.06)]">
            <div className="w-12 h-12 rounded-xl bg-navy/10 text-navy dark:text-gold flex items-center justify-center mb-6">
              <Compass className="w-6 h-6" aria-hidden="true" />
            </div>
            <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white mb-4">
              For students and families
            </h3>
            <ul className="space-y-3.5 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>Replace thirty scattered tabs with one unified, searchable directory.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>Transparent cost of attendance figures shown up front before applying.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>Objective side-by-side comparison across programs, ratios, and living costs.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>Confidence that every listed university holds verified official accreditation.</span>
              </li>
            </ul>
          </div>

          {/* Column 2: For institutions */}
          <div className="bg-white dark:bg-slate-900 rounded-[20px] p-8 border border-[#E5E9EF] dark:border-slate-800 shadow-[0_4px_16px_rgba(16,42,67,0.06)]">
            <div className="w-12 h-12 rounded-xl bg-oxford/10 text-oxford dark:text-gold flex items-center justify-center mb-6">
              <Building2 className="w-6 h-6" aria-hidden="true" />
            </div>
            <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white mb-4">
              For institutions
            </h3>
            <ul className="space-y-3.5 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>Standardized, fair presentation of verified programs and academic strengths.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>Direct exposure to motivated global applicants researching specific degrees.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>Equal discoverability regardless of marketing ad budgets or sponsored bids.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>Verified badge display corroborating institutional authenticity worldwide.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ─── 9. FAQ ACCORDION (8 ACCESSIBLE ITEMS) ────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
            <span>Common Questions</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Everything you need to know about our data, verification, and directory features.
          </p>
        </div>

        <div className="space-y-3.5">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openFaq === i;
            return (
              <div 
                key={i} 
                className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-[#E5E9EF] dark:border-slate-800 shadow-sm"
              >
                <button
                  type="button"
                  id={`faq-btn-${i}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-navy"
                >
                  <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white pr-4">
                    {item.q}
                  </span>
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-navy text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" aria-hidden="true" />
                  </div>
                </button>
                <div 
                  id={`faq-answer-${i}`}
                  role="region"
                  aria-labelledby={`faq-btn-${i}`}
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                      {item.a}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ending note: Single plain text link, NOT a boxed CTA */}
        <div className="text-center mt-12 text-sm text-slate-600 dark:text-slate-400">
          Still have questions? Write to{' '}
          <a 
            href="mailto:info@campusarge.com" 
            className="text-navy dark:text-gold font-semibold underline underline-offset-4 hover:text-gold transition-colors"
          >
            info@campusarge.com
          </a>
        </div>
      </section>
    </div>
  );
}
