import { Globe, Lightbulb, GraduationCap, ArrowRight } from 'lucide-react';

const TOPICS = [
  'AI Research', 'Engineering', 'Medical Sciences',
  'Business', 'Law', 'Sustainability', 'Data Science'
];

export default function ResearchAreas() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16 animate-fade-in-up">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-navy bg-navy-light mb-4">
          Discovery
        </span>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-slate-900 dark:text-white mb-6">
          Research <span className="gradient-text">Areas</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Explore emerging fields, connect with leading faculty, and discover institutional strengths across a variety of disciplines.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {TOPICS.map((topic, i) => (
          <div key={topic} className="glass-card bg-purple-50/60 dark:bg-purple-900/10 rounded-2xl p-6 card-hover group flex flex-col items-start cursor-pointer">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
              i % 3 === 0 ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' :
              i % 3 === 1 ? 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400' :
              'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
            }`}>
              {i % 2 === 0 ? <Lightbulb className="w-6 h-6" /> : <Globe className="w-6 h-6" />}
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2 group-hover:text-navy dark:group-hover:text-navy transition-colors">
              {topic}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1">
              Connect with leading experts and verified institutions focusing on {topic.toLowerCase()}.
            </p>
            <div className="flex items-center gap-2 text-sm font-semibold text-navy dark:text-navy mt-auto">
              Explore Faculty <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-20 text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-6">
          <GraduationCap className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">More disciplines coming soon</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          We are continuously expanding our platform to cover more academic fields and research opportunities globally.
        </p>
      </div>
    </div>
  );
}
