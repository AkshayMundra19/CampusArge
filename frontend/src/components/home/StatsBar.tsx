import { useState, useEffect, useRef } from 'react';
import { Building2, Users, Globe, BookOpen, TrendingUp } from 'lucide-react';

interface StatItem {
  icon: React.ElementType;
  value: number;
  suffix: string;
  label: string;
  color: string;
}

const STATS: StatItem[] = [
  { icon: Building2,  value: 58,   suffix: '+', label: 'Partner Institutions',      color: 'from-indigo-500 to-indigo-600' },
  { icon: Users,      value: 1250, suffix: '+', label: 'Verified Faculty',           color: 'from-teal-500 to-teal-600' },
  { icon: Globe,      value: 40,   suffix: '+', label: 'Countries Represented',      color: 'from-purple-500 to-purple-600' },
  { icon: BookOpen,   value: 120,  suffix: '+', label: 'Academic Disciplines',       color: 'from-blue-500 to-blue-600' },
  { icon: TrendingUp, value: 2500, suffix: '+', label: 'Research Collaborations',    color: 'from-rose-500 to-rose-600' },
];

function AnimatedStat({ stat }: { stat: StatItem }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const Icon = stat.icon;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          const duration = 1800;
          const steps = 60;
          const increment = stat.value / steps;
          let current = 0;
          const interval = setInterval(() => {
            current += increment;
            if (current >= stat.value) {
              setCount(stat.value);
              clearInterval(interval);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [stat.value, started]);

  return (
    <div ref={ref} className="flex flex-col items-center text-center px-4">
      <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg mb-4`}>
        <Icon className="w-7 h-7 text-white" aria-hidden="true" />
      </div>
      <p className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
        {count.toLocaleString()}{stat.suffix}
      </p>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">{stat.label}</p>
    </div>
  );
}

export default function StatsBar() {
  return (
    <section className="py-14 border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950" aria-label="Platform statistics">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          {STATS.map((stat) => (
            <AnimatedStat key={stat.label} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
