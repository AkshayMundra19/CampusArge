import { useState } from 'react';
import { 
  GraduationCap, Users, Award, Globe, 
  Shield, Heart, Zap, Target, 
  ChevronDown, ArrowRight, Building2,
  BookOpen, Sparkles
} from 'lucide-react';
import { SectionHeader } from '@/components/ui';
import { Link } from 'react-router-dom';

const FAQ_ITEMS = [
  { q: 'Are the professors verified?', a: 'Yes. Every faculty member goes through a verification process. Our team reviews credentials, university affiliation, and professional background before awarding the verified badge.' },
  { q: 'Can anyone create a profile?', a: 'No, creating a faculty profile is restricted to verified professors and researchers only.' },
  { q: 'What information is available for universities?', a: 'We provide detailed rankings, research focus areas, and a comprehensive directory of verified faculty affiliated with each institution.' },
  { q: 'Is CampusArge free for students?', a: 'Yes! Students and researchers can browse the global directory of verified faculty and institutions completely free.' },
];

export default function About() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const stats = [
    { icon: Building2, value: '500+', label: 'Global Universities', color: 'from-blue-500 to-indigo-500', delay: '0' },
    { icon: Users, value: '1,200+', label: 'Verified Faculty', color: 'from-teal-500 to-emerald-500', delay: '100' },
    { icon: Shield, value: '98%', label: 'Verification Rate', color: 'from-amber-500 to-orange-500', delay: '200' },
    { icon: Globe, value: '50+', label: 'Countries Reached', color: 'from-purple-500 to-pink-500', delay: '300' },
  ];

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-50/50 dark:bg-slate-950/50 overflow-hidden">
      
      {/* ─── HERO SECTION ─────────────────────────────────────────── */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24 text-center">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-navy to-burgundy blur-[100px] -z-10 rounded-full pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 border border-white/40 dark:border-white/10 shadow-sm animate-fade-in-up">
          <Sparkles className="w-4 h-4 text-burgundy" />
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">The New Academic Standard</span>
        </div>
        
        <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl text-slate-900 dark:text-white text-balance mb-8 tracking-tight animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          Bridging the gap between <br className="hidden lg:block" />
          <span className="gradient-text">ambition and expertise.</span>
        </h1>
        
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 text-pretty max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          CampusArge is the premier global marketplace connecting driven students with verified faculty from the world's top universities, democratizing access to elite academic networks.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <Link to="/institutions" className="btn-primary text-base px-8 py-4 h-auto shadow-xl shadow-navy">
            Explore Universities
          </Link>
          <Link to="/mentors" className="glass-card font-semibold text-slate-700 dark:text-slate-200 px-8 py-4 rounded-xl hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors">
            Meet the Faculty
          </Link>
        </div>
      </section>

      {/* ─── STATS BENTO GRID ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div 
                key={i} 
                className="glass-card rounded-3xl p-6 sm:p-8 card-hover relative overflow-hidden group border border-white/40 dark:border-slate-800/60 animate-fade-in-up"
                style={{ animationDelay: `${stat.delay}ms` }}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full -mr-10 -mt-10`} />
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-6 shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display font-black text-4xl sm:text-5xl text-slate-900 dark:text-white mb-2 tracking-tight">
                  {stat.value}
                </h3>
                <p className="text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── WHY CHOOSE US (BENTO) ────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-4">
            Designed for Academic Excellence
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            We're building more than a directory. We're creating the infrastructure for global academic collaboration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Large Card 1 */}
          <div className="md:col-span-2 glass-card rounded-3xl p-8 sm:p-10 card-hover overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full group-hover:bg-blue-500/20 transition-colors duration-700" />
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-6">
              <Shield className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white mb-4">Ironclad Verification</h3>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-md">
              Every professor, researcher, and institution on our platform is rigorously verified by our team. No fake profiles, no misleading credentials. Just absolute academic trust.
            </p>
          </div>

          {/* Small Card 1 */}
          <div className="glass-card rounded-3xl p-8 sm:p-10 card-hover">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center mb-6">
              <Globe className="w-7 h-7 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-3">Global Reach</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Break geographical barriers. Connect with faculty from Tokyo to Boston instantly.
            </p>
          </div>

          {/* Small Card 2 */}
          <div className="glass-card rounded-3xl p-8 sm:p-10 card-hover">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center mb-6">
              <BookOpen className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-3">Research Focus</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Filter by deep research areas to find exactly the mentor who matches your thesis.
            </p>
          </div>

          {/* Large Card 2 */}
          <div className="md:col-span-2 glass-card rounded-3xl p-8 sm:p-10 card-hover overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-burgundy-light blur-[80px] rounded-full group-hover:bg-burgundy-light transition-colors duration-700" />
            <div className="w-14 h-14 rounded-2xl bg-burgundy dark:bg-burgundy-light flex items-center justify-center mb-6">
              <Zap className="w-7 h-7 text-burgundy dark:text-burgundy" />
            </div>
            <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white mb-4">Frictionless Connection</h3>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-md">
              Finding a mentor used to mean sending cold emails into the void. We provide direct booking, messaging, and availability tracking all in one unified dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl text-slate-900 dark:text-white mb-4">
            Common Questions
          </h2>
        </div>
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="glass-card rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <span className="font-bold text-slate-900 dark:text-white pr-4">{item.q}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 transition-transform duration-300 ${openFaq === i ? 'rotate-180 bg-navy-light text-navy' : 'text-slate-400'}`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>
              <div 
                className={`grid transition-all duration-300 ease-in-out ${openFaq === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="overflow-hidden">
                  <div className="px-6 pb-6 pt-2 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                    {item.a}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative glass-card rounded-[2.5rem] p-10 sm:p-16 text-center overflow-hidden border border-white/50 dark:border-slate-800/50">
          <div className="absolute inset-0 bg-gradient-to-br from-navy to-burgundy opacity-90 dark:opacity-80" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-30" />
          
          <div className="relative z-10 flex flex-col items-center">
            <h3 className="font-display font-black text-3xl sm:text-5xl text-white mb-6 tracking-tight">
              Ready to elevate your academic journey?
            </h3>
            <p className="text-white/80 text-lg sm:text-xl mb-10 max-w-2xl mx-auto font-medium">
              Join thousands of students and faculty members who are transforming the future of education on CampusArge.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
              <Link to="/mentors" className="bg-white text-navy font-bold px-8 py-4 rounded-xl hover:bg-slate-50 transition-colors shadow-xl flex items-center justify-center gap-2">
                Browse Faculty <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/contact" className="glass text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center border border-white/30">
                Join as Institution
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
