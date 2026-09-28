import { AlertTriangle } from 'lucide-react';

export default function Disclaimer() {
  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-3">
            Disclaimer
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Last updated: August 2026</p>
        </div>
        <div className="glass-card rounded-3xl p-8 sm:p-12 space-y-8 text-slate-700 dark:text-slate-300">
          <section>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">1. General Information Only</h3>
            <p className="leading-relaxed">The information provided on Mentoring Path is for general informational and networking purposes only. While we strive to ensure that all faculty profiles are verified and accurate, we make no guarantees regarding the completeness, reliability, or accuracy of the information provided by users.</p>
          </section>
          <section>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">2. No Guarantee of Outcomes</h3>
            <p className="leading-relaxed">Mentoring Path facilitates connections between institutions and faculty but does not guarantee any specific outcomes, research collaborations, or employment opportunities resulting from these connections.</p>
          </section>
          <section>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">3. Third Party Links</h3>
            <p className="leading-relaxed">The platform may contain links to external websites that are not provided or maintained by Mentoring Path. We do not endorse or assume any responsibility for the accuracy or content of external websites.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
