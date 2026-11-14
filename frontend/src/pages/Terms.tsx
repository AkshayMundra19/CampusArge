import { FileText, CheckCircle, Scale, AlertOctagon, HelpCircle, Shield } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="pt-28 pb-24 min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <Helmet>
        <title>Terms of Service | Platform Usage & Academic Guidelines – CampusArge</title>
        <meta
          name="description"
          content="Review CampusArge's Terms of Service. Understand the terms, acceptable use standards, copyright protections, and guidelines governing our independent higher education directory."
        />
        <meta
          name="keywords"
          content="CampusArge terms of service, platform user agreement, higher education terms of use, university directory legal terms, academic comparison guidelines"
        />
        <link rel="canonical" href="https://campusarge.com/terms" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-navy to-navy-dark border border-gold/20 flex items-center justify-center mx-auto mb-4 shadow-md">
            <FileText className="w-7 h-7 text-gold" />
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-3">
            Terms of Service
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Last Updated: November 2026 &bull; Universal Platform Agreement
          </p>
        </div>

        {/* Content Container */}
        <div className="glass-card rounded-3xl p-8 sm:p-12 space-y-10 text-slate-700 dark:text-slate-300 shadow-sm border border-slate-200/80 dark:border-slate-800">
          
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
            <strong>Notice to Users:</strong> By accessing, browsing, comparing institutions, or communicating through CampusArge ("the Service"), you agree to be bound by these Terms of Service. If you do not accept these terms in their entirety, you must discontinue your use of the platform.
          </div>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-gold" />
              1. Platform Nature and Independent Scope
            </h2>
            <p className="leading-relaxed">
              CampusArge is an independent digital catalog and educational intelligence repository. Our mission is to democratize access to transparent university data—including published tuition estimates, student-to-faculty ratios, regional accreditation status, and academic program offerings. CampusArge is not a degree-granting institution, university agent, admissions committee, or official administrative proxy for any college listed on the platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-gold" />
              2. Permitted and Lawful Use
            </h2>
            <p className="leading-relaxed">
              Users are granted a non-exclusive, revocable, non-transferable license to search, browse, evaluate, and compare universities for personal, educational, and academic research purposes. You agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>Deploy automated bots, spiders, or scrapers to extract university profiles, tuition databases, or logo assets in bulk without written authorization.</li>
              <li>Impersonate any college official, admissions officer, student, or faculty representative in correspondence with our team.</li>
              <li>Circumvent security firewalls, conduct vulnerability scans, or flood contact forms with unsolicited marketing or spam.</li>
              <li>Reproduce, redistribute, or commercially sublicense proprietary benchmarking algorithms or visual layouts of CampusArge.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-gold" />
              3. Intellectual Property Rights & Fair Use Trademarks
            </h2>
            <p className="leading-relaxed">
              All CampusArge logos, visual brand assets, software architecture, comparison tools, and editorial guides are proprietary to CampusArge and protected under international copyright and trademark laws. 
            </p>
            <p className="leading-relaxed text-sm">
              All institutional names, collegiate insignia, official crests, and trademarks referenced on this platform remain the exclusive property of their respective universities. Their presence on CampusArge constitutes <em>nominative fair use</em> for educational reference, identification, and public comparison purposes under applicable law.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-gold" />
              4. Accuracy of Educational Data & Disclaimer of Warranties
            </h2>
            <p className="leading-relaxed">
              While CampusArge rigorously verifies institutional data through audited public repositories, college websites, and IPEDS datasets, educational fees, program accreditations, and admission deadlines undergo continuous real-time changes by respective universities. All content is provided on an "as is" and "as available" basis without warranties of any kind. Prospective students must verify final figures directly with the university's official admissions office.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-gold" />
              5. Limitation of Liability
            </h2>
            <p className="leading-relaxed">
              In no event shall CampusArge, its creators, or editorial contributors be liable for any direct, indirect, incidental, special, or consequential damages arising out of your reliance upon college comparison data, admissions decisions, financial aid calculations, or enrollment outcomes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-gold" />
              6. Governance and Inquiries
            </h2>
            <p className="leading-relaxed">
              These Terms of Service are governed by applicable laws. Any legal notices or inquiries regarding the interpretation of these terms should be addressed to our legal department at <a href="mailto:info@campusarge.com" className="text-navy dark:text-gold font-semibold underline">info@campusarge.com</a> or via our <Link to="/contact" className="text-navy dark:text-gold font-semibold underline">Contact page</Link>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
