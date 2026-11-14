import { ShieldCheck, Lock, Eye, Database, Server, UserCheck, HelpCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="pt-28 pb-24 min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <Helmet>
        <title>Privacy Policy | Student & Institutional Data Protection – CampusArge</title>
        <meta
          name="description"
          content="Read the comprehensive Privacy Policy of CampusArge. Learn how we safeguard student privacy, protect user data under GDPR & CCPA, and manage higher education cookies securely."
        />
        <meta
          name="keywords"
          content="CampusArge privacy policy, student data privacy, university data security, GDPR compliance, CCPA higher education, educational platform privacy"
        />
        <link rel="canonical" href="https://campusarge.com/privacy" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-navy to-navy-dark border border-gold/20 flex items-center justify-center mx-auto mb-4 shadow-md">
            <ShieldCheck className="w-7 h-7 text-gold" />
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-3">
            Privacy Policy
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Effective Date: November 2026 &bull; Compliant with Global Educational Privacy Standards
          </p>
        </div>

        {/* Content Container */}
        <div className="glass-card rounded-3xl p-8 sm:p-12 space-y-10 text-slate-700 dark:text-slate-300 shadow-sm border border-slate-200/80 dark:border-slate-800">
          
          <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
            <strong>Summary:</strong> CampusArge operates as an open-access higher education discovery and institutional comparison platform. We respect the privacy of prospective students, academic researchers, and institutional partners. We do not sell your personal data to advertisers, lenders, or predatory third parties.
          </div>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-gold" />
              1. Information We Collect
            </h2>
            <p className="leading-relaxed">
              To provide accurate university exploration and side-by-side college comparisons, CampusArge collects information across two primary categories:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>
                <strong>Directly Provided Information:</strong> When you submit an inquiry through our Contact page, sign up for university alerts, or request institutional updates, we collect your name, email address, topic of inquiry, and message content.
              </li>
              <li>
                <strong>Automated Usage Metrics & Device Data:</strong> When browsing university listings, filters, or comparison matrices, we collect standard anonymized metrics including browser type, operating system, referring URL, time spent per university profile, and device viewport dimensions.
              </li>
              <li>
                <strong>Public Higher Education Data:</strong> Information concerning tuition costs, accreditation agencies, campus acreage, and student-to-faculty ratios is sourced from public government databases (such as IPEDS and NCES) and official university disclosures.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-gold" />
              2. How We Utilize Your Information
            </h2>
            <p className="leading-relaxed">
              We process collected data exclusively for legitimate higher education directory services, including:
            </p>
            <div className="grid sm:grid-cols-2 gap-4 text-sm mt-3">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Platform Delivery</h3>
                <p>Generating relevant search results, personalized filtering (by state, tuition bracket, faculty ratio), and side-by-side comparisons.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Inquiry Fulfillment</h3>
                <p>Routing queries and admissions questions to appropriate institutional liaisons or our verified research editorial team.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Security & Integrity</h3>
                <p>Preventing automated scraping, bot attacks, denial-of-service attempts, and spam submissions on student contact forms.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Experience Enhancement</h3>
                <p>Analyzing aggregated traffic trends to identify in-demand degree programs, rising STEM fields, and regional college interest.</p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-gold" />
              3. Cookies and Tracking Technologies
            </h2>
            <p className="leading-relaxed">
              CampusArge uses essential session cookies and performance telemetry to maintain user interface preferences, such as selected comparison items, search filters, and dark/light color themes. You may disable non-essential cookies at any time via your browser settings or our on-page cookie banner. Disabling cookies will not hinder your ability to explore university profiles or read academic insights.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-gold" />
              4. Data Retention and Security Standards
            </h2>
            <p className="leading-relaxed">
              We employ enterprise-grade security mechanisms, including Transport Layer Security (TLS 1.3), hashed encryption protocols, and restricted role-based internal access to ensure that all transmitted messages and inquiries remain confidential. We retain user contact submissions only as long as necessary to address the correspondence or satisfy lawful audit obligations.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-gold" />
              5. Your Legal Rights (GDPR, CCPA & Global Protections)
            </h2>
            <p className="leading-relaxed">
              Regardless of your geographic location, CampusArge extends comprehensive data privacy rights to all visitors:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li><strong>Right to Know & Access:</strong> You may request a copy of any personal data submitted to our platform.</li>
              <li><strong>Right to Rectification:</strong> You can request corrections to any inaccurate institutional profile or contact information.</li>
              <li><strong>Right to Erasure ("Right to Be Forgotten"):</strong> You may request permanent deletion of your inquiry logs or communication history.</li>
              <li><strong>Non-Discrimination:</strong> We will never deny or degrade access to university data or comparison features if you exercise your privacy rights.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-gold" />
              6. Contacting the Privacy Officer
            </h2>
            <p className="leading-relaxed">
              If you have questions, feedback, or formal data protection requests regarding this Privacy Policy, please email our Data Compliance Desk at <a href="mailto:info@campusarge.com" className="text-navy dark:text-gold font-semibold underline">info@campusarge.com</a> or visit our <Link to="/contact" className="text-navy dark:text-gold font-semibold underline">Contact page</Link>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
