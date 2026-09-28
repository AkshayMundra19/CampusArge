import { useState, useEffect, useRef } from 'react';
import { Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    quote: 'Mentoring Path has significantly increased our institution\'s visibility and helped us connect with outstanding faculty for research collaborations.',
    name: 'Dr. Laura Bennett',
    role: 'Dean of Research',
    institution: 'University of Toronto',
    initials: 'LB',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    quote: 'The verification process ensures we connect with credible experts. It\'s now our go-to platform for building global academic partnerships.',
    name: 'Prof. Ahmed Khan',
    role: 'Vice Chancellor',
    institution: "King's College London",
    initials: 'AK',
    color: 'from-teal-500 to-green-500',
  },
  {
    quote: 'A powerful platform that bridges institutions and researchers, enabling meaningful collaborations that drive real-world impact.',
    name: 'Dr. Maria Gonzalez',
    role: 'Research Director',
    institution: 'University of Melbourne',
    initials: 'MG',
    color: 'from-blue-500 to-indigo-500',
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPaused) return;
    
    timerRef.current = setInterval(() => {
      setActiveIndex((current) => (current + 1) % TESTIMONIALS.length);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  return (
    <section className="py-24 bg-slate-50/60 dark:bg-slate-950/60 overflow-hidden" aria-labelledby="testimonials-heading">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-navy bg-navy-light mb-3">
            What Our Community Says
          </span>
          <h2 id="testimonials-heading" className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white">
            Trusted by Academic Leaders Worldwide
          </h2>
        </div>

        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="w-full flex-shrink-0">
                  <div className="glass-card rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center mx-2 h-full">
                    <Quote className="w-12 h-12 text-navy dark:text-navy mb-6 flex-shrink-0" aria-hidden="true" />
                    <p className="text-slate-700 dark:text-slate-300 text-lg sm:text-xl font-medium leading-relaxed italic mb-8 flex-1 max-w-2xl">
                      "{t.quote}"
                    </p>
                    <div className="flex flex-col items-center gap-3 pt-6 border-t border-slate-200/60 dark:border-slate-700/60 w-full max-w-sm">
                      <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg`}>
                        {t.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-base text-slate-900 dark:text-white truncate">{t.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{t.role}, {t.institution}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Carousel dot indicators */}
        <div className="flex items-center justify-center gap-3 mt-10" role="tablist" aria-label="Testimonial slides">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setActiveIndex(i)}
              className={`rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-navy focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${i === activeIndex ? 'w-8 h-2.5 bg-navy dark:bg-navy' : 'w-2.5 h-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
