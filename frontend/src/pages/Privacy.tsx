import { ShieldCheck } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-navy to-burgundy flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-3">
            Privacy Policy
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Last updated: August 2026</p>
        </div>
        <div className="glass-card rounded-3xl p-8 sm:p-12 space-y-8 text-slate-700 dark:text-slate-300">
          <section>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">1. Information We Collect</h3>
            <p className="leading-relaxed">Mentoring Path collects information to facilitate connections between academic institutions and verified faculty members. When you register, we collect basic profile details (name, email, institutional affiliation) and optional professional history to enhance your profile visibility on the platform.</p>
          </section>
          <section>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">2. How We Use Your Data</h3>
            <p className="leading-relaxed">Your data is strictly used to match you with relevant institutional or academic opportunities. We do not sell your personal data to third parties. Public profile data is visible to registered users to foster connections and collaborations.</p>
          </section>
          <section>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">3. Data Security</h3>
            <p className="leading-relaxed">We implement industry standard encryption and security measures to protect your personal and institutional information from unauthorized access, alteration, or disclosure.</p>
          </section>
          <section>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">4. Your Rights</h3>
            <p className="leading-relaxed">You have the right to request access to, modification of, or deletion of your personal data at any time. You can manage your profile visibility directly from your dashboard or contact support for assistance.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
