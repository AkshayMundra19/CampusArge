import { AlertTriangle, Info, BookOpen, ExternalLink, HelpCircle, ShieldAlert } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function Disclaimer() {
  return (
    <div className="pt-28 pb-24 min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <Helmet>
        <title>Educational Data Disclaimer | Tuition & Program Accuracy – CampusArge</title>
        <meta
          name="description"
          content="Review the Educational Data Disclaimer for CampusArge. Understand the scope of our higher education directory, tuition estimates, and independent academic research."
        />
        <meta
          name="keywords"
          content="CampusArge disclaimer, university tuition disclaimer, higher education accuracy, college data disclaimer, college comparison terms"
        />
        <link rel="canonical" href="https://campusarge.com/disclaimer" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-navy to-navy-dark border border-gold/20 flex items-center justify-center mx-auto mb-4 shadow-md">
            <AlertTriangle className="w-7 h-7 text-gold" />
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-3">
            Educational Data Disclaimer
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Important Guidance for Students, Parents, Counselors & Academic Researchers
          </p>
        </div>

        {/* Content Container */}
        <div className="glass-card rounded-3xl p-8 sm:p-12 space-y-10 text-slate-700 dark:text-slate-300 shadow-sm border border-slate-200/80 dark:border-slate-800">
          
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
            <strong>Key Note:</strong> CampusArge is an independent informational directory and comparative platform designed to simplify college exploration. We are not an official university admissions office, financial aid grantor, or accreditation agency.
          </div>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Info className="w-5 h-5 text-gold" />
              1. Informational & Research Purpose Only
            </h2>
            <p className="leading-relaxed">
              The metrics, tuition figures, student populations, student-to-faculty ratios, and academic program summaries displayed on CampusArge are compiled for general educational reference, self-guided research, and benchmarking. Although our editorial team audits information continuously against official databases (including IPEDS, NCES, and published collegiate catalogs), institutional policies change frequently.
            </p>
            <p className="leading-relaxed text-sm">
              Prospective students must always consult the official website and admissions staff of each university to obtain the final, legally binding details regarding admissions criteria, tuition bills, program prerequisites, and financial awards.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-gold" />
              2. Cost of Attendance and Tuition Estimates
            </h2>
            <p className="leading-relaxed">
              Tuition numbers and "Cost of Attendance" figures represent published annual estimates for typical undergraduate or graduate cohorts. They may not encompass individual program course fees, laboratory expenses, housing choices, health insurance mandates, or personalized financial aid packages.
            </p>
            <p className="leading-relaxed text-sm">
              CampusArge shall not be held liable for discrepancies between estimated platform figures and final billing statements issued by university bursars or financial aid offices.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-gold" />
              3. Independent Directory Status & Non-Endorsement
            </h2>
            <p className="leading-relaxed">
              The inclusion of any college, university, institute of technology, or degree program on CampusArge does not constitute an endorsement, sponsorship, or certification of quality by CampusArge. Conversely, the presence of a university on CampusArge does not imply that the university endorses or manages CampusArge. All institutional logos and registered marks are used under fair use principles for identification and comparison.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-gold" />
              4. External Institutional Links
            </h2>
            <p className="leading-relaxed">
              Throughout CampusArge, links directing to official university web portals (e.g., <code>.edu</code> websites) and third-party resources are provided for user convenience. CampusArge exercises no administrative oversight over external web properties and assumes no responsibility for their content, availability, or digital privacy practices.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-gold" />
              5. Reporting Data Inaccuracies
            </h2>
            <p className="leading-relaxed">
              We welcome corrections from university administrators, registrars, and students. If you observe any out-of-date information, please inform us via <a href="mailto:info@campusarge.com" className="text-navy dark:text-gold font-semibold underline">info@campusarge.com</a> or our <Link to="/contact" className="text-navy dark:text-gold font-semibold underline">Contact page</Link> so our team can verify and publish updates promptly.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
