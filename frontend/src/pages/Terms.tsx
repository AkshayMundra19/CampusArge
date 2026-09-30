import { FileText } from 'lucide-react';

export default function Terms() {
  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-navy to-burgundy flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-3">
            Terms of Service
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Last updated: August 2026</p>
        </div>
        <div className="glass-card rounded-3xl p-8 sm:p-12 space-y-8 text-slate-700 dark:text-slate-300">
          <section>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">1. Acceptance of Terms</h3>
            <p className="leading-relaxed">By accessing and using CampusArge, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use the platform.</p>
          </section>
          <section>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">2. User Eligibility</h3>
            <p className="leading-relaxed">The platform is intended for academic institutions, research organizations, and verified faculty members. Users must provide accurate and verifiable information during registration.</p>
          </section>
          <section>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">3. Acceptable Use</h3>
            <p className="leading-relaxed">Users agree to use the platform solely for lawful academic and professional networking purposes. Any misuse, including scraping data, harassing other users, or misrepresenting credentials, will result in immediate termination of access.</p>
          </section>
          <section>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">4. Intellectual Property</h3>
            <p className="leading-relaxed">All content, logos, and materials provided by CampusArge are the intellectual property of the platform. Users retain ownership of their profile data but grant CampusArge a license to display it in accordance with our Privacy Policy.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
