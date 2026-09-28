import { ShieldCheck, CheckCircle, Search, FileText } from 'lucide-react';

export default function VerificationProcess() {
  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 mb-4">
            Trust & Safety
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-slate-900 dark:text-white mb-6">
            How Verification Works
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            At Mentoring Path, we take academic integrity seriously. Every institution and faculty member on our platform undergoes a rigorous manual verification process to ensure authenticity and trust.
          </p>
        </div>

        <div className="space-y-12">
          {/* Step 1 */}
          <div className="glass-card rounded-3xl p-8 sm:p-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-900/20 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110" />
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0 text-indigo-600 dark:text-indigo-400">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-2xl text-slate-900 dark:text-white mb-3">1. Credential Submission</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  During registration, faculty members and institutions submit official documentation. For faculty, this includes proof of current academic affiliation (such as an active university email address, staff ID, or link to an official faculty directory profile). For institutions, this involves providing accreditation details and official contact information.
                </p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="glass-card rounded-3xl p-8 sm:p-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 dark:bg-teal-900/20 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110" />
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-16 h-16 rounded-2xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center flex-shrink-0 text-teal-600 dark:text-teal-400">
                <Search className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-2xl text-slate-900 dark:text-white mb-3">2. Manual Review</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Our dedicated admin team manually reviews every application. We cross-reference the submitted information with public university directories, official institution websites, and accreditation databases to ensure the claims are accurate and up-to-date. We do not rely on automated approval systems for credential verification.
                </p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="glass-card rounded-3xl p-8 sm:p-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 dark:bg-green-900/20 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110" />
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 text-green-600 dark:text-green-400">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-2xl text-slate-900 dark:text-white mb-3">3. Badge Awarding & Monitoring</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Once verified, a "Verified" badge is added to the profile, giving students and partners confidence in the user's authenticity. We continuously monitor our network, and users are required to re-verify their status periodically to maintain their badge.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-6">
              <ShieldCheck className="w-8 h-8 text-primary-500" />
            </div>
            <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white mb-3">Commitment to Quality</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Our manual verification process is a core pillar of Mentoring Path, ensuring that every connection made on the platform is built on a foundation of trust and academic legitimacy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
