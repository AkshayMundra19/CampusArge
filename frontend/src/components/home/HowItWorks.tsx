import { Globe, Users, BookOpen, MessageCircle, Handshake } from 'lucide-react';

const STEPS = [
  {
    num: '01',
    icon: Globe,
    title: 'Discover Institutions',
    desc: 'Explore universities, research organizations, and departments worldwide.',
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    num: '02',
    icon: Users,
    title: 'Connect with Verified Faculty',
    desc: 'Find and connect with verified experts in your field of interest.',
    color: 'from-teal-500 to-teal-600',
  },
  {
    num: '03',
    icon: BookOpen,
    title: 'Explore Research Expertise',
    desc: 'Learn about research interests, publications, and ongoing projects.',
    color: 'from-purple-500 to-purple-600',
  },
  {
    num: '04',
    icon: MessageCircle,
    title: 'Initiate Collaboration',
    desc: 'Reach out to start discussions and explore opportunities.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    num: '05',
    icon: Handshake,
    title: 'Build Academic Partnerships',
    desc: 'Foster long-term collaborations and drive impact together.',
    color: 'from-rose-500 to-rose-600',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24" aria-labelledby="how-it-works-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-navy bg-navy-light mb-3">
            How It Works
          </span>
          <h2 id="how-it-works-heading" className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white text-balance">
            Building Academic Connections in 5 Simple Steps
          </h2>
        </div>

        <div className="relative">
          {/* Dashed connector line — desktop only */}
          <div
            className="absolute top-8 left-0 right-0 h-px hidden lg:block pointer-events-none"
            aria-hidden="true"
            style={{
              background: 'repeating-linear-gradient(to right, rgb(99 102 241 / 0.4) 0, rgb(99 102 241 / 0.4) 8px, transparent 8px, transparent 20px)',
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className="flex flex-col items-center text-center relative">
                  {/* Icon badge */}
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg shadow-indigo-500/20 z-10 relative mb-4`}>
                    <Icon className="w-7 h-7 text-white" aria-hidden="true" />
                  </div>
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-widest mb-2">
                    {step.num}
                  </span>
                  <h3 className="font-display font-bold text-slate-900 dark:text-white text-base mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
