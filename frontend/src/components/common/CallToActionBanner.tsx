import { Link } from 'react-router-dom';
import { Building2, Scale, ArrowRight, ShieldCheck } from 'lucide-react';

export default function CallToActionBanner() {
  return (
    <section className="relative py-16 sm:py-20 bg-gradient-to-br from-navy via-[#0B1E30] to-oxford text-white overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl -z-0 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-gold text-xs sm:text-sm font-semibold mb-6">
          <ShieldCheck className="w-4 h-4" />
          <span>Independent &amp; Verified Higher Education Discovery</span>
        </div>

        <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight text-balance mb-4">
          Ready to Find Your Ideal University?
        </h2>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
          Compare verified tuition, student-to-faculty ratios, and academic degree programs across 426+ accredited universities worldwide.
        </p>

        {/* High-Intent Conversion CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/institutions"
            className="w-full sm:w-auto px-8 py-4 bg-gold hover:bg-[#C29D64] text-navy font-bold rounded-xl shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2 text-base"
          >
            <Building2 className="w-5 h-5 text-navy" />
            Explore 426+ Universities
            <ArrowRight className="w-4 h-4 text-navy" />
          </Link>
          <Link
            to="/compare"
            className="w-full sm:w-auto px-7 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/25 transition-all hover:scale-105 flex items-center justify-center gap-2 text-base"
          >
            <Scale className="w-5 h-5 text-gold" />
            Compare Side-by-Side
          </Link>
        </div>

        <p className="text-xs text-white/50 mt-6 font-medium">
          100% Free Public Resource • Verified Accreditation • Zero Sponsored Rankings
        </p>
      </div>
    </section>
  );
}

