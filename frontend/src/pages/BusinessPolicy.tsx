import { Briefcase, Award, ShieldCheck, CheckSquare, RefreshCw, Mail } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function BusinessPolicy() {
  return (
    <div className="pt-28 pb-24 min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <Helmet>
        <title>Business & Editorial Policy | Zero Sponsored Rankings – CampusArge</title>
        <meta
          name="description"
          content="Learn about CampusArge's Business Policy, editorial independence, zero-sponsored ranking ethics, and institutional data verification standards."
        />
        <meta
          name="keywords"
          content="CampusArge business policy, editorial integrity higher ed, zero sponsored ranking, university listing standards, college comparison ethics"
        />
        <link rel="canonical" href="https://campusarge.com/business-policy" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-navy to-navy-dark border border-gold/20 flex items-center justify-center mx-auto mb-4 shadow-md">
            <Briefcase className="w-7 h-7 text-gold" />
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-3">
            Business & Editorial Policy
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Ethical Governance &bull; Academic Independence &bull; Non-Biased Higher Education Directory
          </p>
        </div>

        {/* Content Container */}
        <div className="glass-card rounded-3xl p-8 sm:p-12 space-y-10 text-slate-700 dark:text-slate-300 shadow-sm border border-slate-200/80 dark:border-slate-800">
          
          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
            <strong>Core Principle:</strong> CampusArge exists to serve students, academic researchers, and universities with total objectivity. We adhere strictly to a non-pay-to-play model: no university can purchase higher ranks, manipulate comparison indicators, or alter algorithmic objectivity.
          </div>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-gold" />
              1. Editorial Independence and Zero Sponsored Rankings
            </h2>
            <p className="leading-relaxed">
              Every college and university represented in our directory is listed based on verified institutional accreditation, documented degree offerings, and transparent cost data. Unlike conventional commercial lead-generation portals:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>We <strong>do not sell ranking spots</strong> or prioritize institutions in search queries based on financial sponsorship.</li>
              <li>Filter parameters (such as tuition affordability, state location, and faculty ratio) sort exclusively on factual database values.</li>
              <li>Institutional profiles do not feature misleading third-party ads that divert prospective students away from legitimate admissions information.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-gold" />
              2. Verification Standards and Public Data Integrity
            </h2>
            <p className="leading-relaxed">
              Institutions designated as "Verified" on CampusArge have undergone multi-point verification against authoritative regional and national accrediting bodies recognized by the U.S. Department of Education and the Council for Higher Education Accreditation (CHEA). Our review covers:
            </p>
            <div className="grid sm:grid-cols-2 gap-4 text-sm mt-3">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Accreditation Legitimacy</h3>
                <p>Confirming valid institutional standing with regional agencies (e.g., HLC, SACSCOC, NECHE, MSCHE, NWCCU, WSCUC).</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Fee Transparency</h3>
                <p>Auditing annual cost of attendance, in-state vs. out-of-state tuition, and published academic fee schedules.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Faculty-Student Ratio</h3>
                <p>Cross-checking reported instructional staff numbers with official IPEDS graduation and enrollment data.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Program Accuracy</h3>
                <p>Ensuring undergraduate and graduate program majors accurately reflect current university catalog offerings.</p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-gold" />
              3. Partnership and Institutional Participation
            </h2>
            <p className="leading-relaxed">
              Universities and academic leadership may claim their verified profile to update published program details, notify our editors of tuition adjustments, or contribute verified research spotlights. Claiming an institutional profile requires official organizational email validation (e.g., <code>@institution.edu</code>) and does not permit the suppression of factual public data.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-gold" />
              4. Data Correction and Dispute Policy
            </h2>
            <p className="leading-relaxed">
              If an institution or researcher discovers outdated tuition rates, revised accreditation status, or modified contact channels, our editorial team commits to reviewing correction submissions within 48 to 72 business hours upon verification of the primary source.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-gold" />
              5. Editorial Office Contact
            </h2>
            <p className="leading-relaxed">
              For editorial inquiries, listing validation, or data correction submissions, contact our Academic Editorial Desk at <a href="mailto:info@campusarge.com" className="text-navy dark:text-gold font-semibold underline">info@campusarge.com</a> or via our <Link to="/contact" className="text-navy dark:text-gold font-semibold underline">Contact page</Link>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
