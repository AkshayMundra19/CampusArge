import { Globe, Users, BookOpen, MessageCircle, Handshake } from 'lucide-react';

const STEPS = [
  {
    num: '01',
    icon: Globe,
    title: 'Discover Institutions',
    desc: 'Explore accredited universities, research institutes, and academic centers worldwide.',
    isAccent: false,
  },
  {
    num: '02',
    icon: Users,
    title: 'Connect with Verified Faculty',
    desc: 'Identify and engage with verified scholars and subject-matter leaders in your field.',
    isAccent: false,
  },
  {
    num: '03',
    icon: BookOpen,
    title: 'Explore Research Expertise',
    desc: 'Review published research, key domains, active laboratories, and ongoing initiatives.',
    isAccent: false,
  },
  {
    num: '04',
    icon: MessageCircle,
    title: 'Initiate Collaboration',
    desc: 'Open dialogue to discuss joint research projects, faculty visits, and knowledge exchange.',
    isAccent: false,
  },
  {
    num: '05',
    icon: Handshake,
    title: 'Build Academic Partnerships',
    desc: 'Establish formal institutional ties, publish collaborative papers, and drive lasting impact.',
    isAccent: true, // Step 5 subtle burgundy accent
  },
];

export default function HowItWorks() {
  return (
    <section
      className="py-24 sm:py-28 bg-navy text-white relative overflow-hidden"
      aria-labelledby="how-it-works-heading"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-oxford/30 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-burgundy/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gold/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-gold/30 text-gold text-xs font-semibold uppercase tracking-wider mb-4">
            <span>Process</span>
          </div>
          <h2
            id="how-it-works-heading"
            className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white text-balance"
          >
            Building Academic Connections in 5 Simple Steps
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg text-pretty">
            A structured path for institutions and scholars to discover, verify, and establish international partnerships.
          </p>
        </div>

        {/* Desktop Timeline (>= lg screens) */}
        <div className="hidden lg:block relative">
          {/* Gold connecting line */}
          <div
            className="absolute top-7 left-[8%] right-[8%] h-0.5 bg-gradient-to-r from-gold/40 via-gold to-burgundy/60 pointer-events-none"
            aria-hidden="true"
          />

          <div className="grid grid-cols-5 gap-6">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className="flex flex-col items-center text-center group">
                  {/* Node on the timeline */}
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center relative z-10 transition-transform duration-300 group-hover:scale-110 shadow-lg ${
                      step.isAccent
                        ? 'bg-burgundy border-2 border-gold text-white shadow-burgundy/40'
                        : 'bg-oxford/90 border-2 border-gold/70 text-gold shadow-navy/50'
                    }`}
                  >
                    <Icon className="w-6 h-6" aria-hidden="true" />
                  </div>

                  {/* Numeral */}
                  <span
                    className={`mt-4 text-xs font-bold tracking-widest uppercase ${
                      step.isAccent ? 'text-rose-300 font-extrabold' : 'text-gold'
                    }`}
                  >
                    Step {step.num}
                  </span>

                  {/* Title */}
                  <h3 className="font-display font-semibold text-white text-lg mt-2 mb-2 group-hover:text-gold transition-colors leading-snug">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile & Tablet Vertical Rail (< lg screens) */}
        <div className="lg:hidden relative">
          {/* Vertical gold rail line */}
          <div
            className="absolute top-4 bottom-8 left-6 w-0.5 bg-gradient-to-b from-gold/70 via-gold/40 to-burgundy/80 pointer-events-none"
            aria-hidden="true"
          />

          <div className="space-y-8 sm:space-y-10">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className="flex items-start gap-5 relative group">
                  {/* Node on vertical rail */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 z-10 shadow-md ${
                      step.isAccent
                        ? 'bg-burgundy border-2 border-gold text-white shadow-burgundy/40'
                        : 'bg-oxford/90 border-2 border-gold/70 text-gold shadow-navy/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>

                  {/* Content block */}
                  <div className="flex-1 pt-0.5">
                    <span
                      className={`text-xs font-bold tracking-widest uppercase block ${
                        step.isAccent ? 'text-rose-300' : 'text-gold'
                      }`}
                    >
                      Step {step.num}
                    </span>
                    <h3 className="font-display font-semibold text-white text-lg mt-1 mb-1.5 leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
