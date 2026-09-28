import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, BadgeCheck, MapPin } from 'lucide-react';

import FacultyCard from '@/components/FacultyCard';
import { DUMMY_FACULTY } from '@/lib/dummyData';

export default function FacultyCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'right' ? 320 : -320, behavior: 'smooth' });
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  return (
    <section className="py-24 bg-slate-50/60 dark:bg-slate-950/60" aria-labelledby="faculty-carousel-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-navy dark:text-navy bg-navy dark:bg-navy-light mb-3">
              Verified Experts
            </span>
            <h2 id="faculty-carousel-heading" className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white">
              Meet Our Faculty
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Connect with distinguished faculty members across leading institutions
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              to="/mentors"
              className="text-sm font-semibold text-navy dark:text-navy hover:underline whitespace-nowrap inline-flex items-center gap-1"
            >
              View all faculty <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label="Scroll faculty left"
              className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:bg-navy hover:border-navy hover:text-navy disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label="Scroll faculty right"
              className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:bg-navy hover:border-navy hover:text-navy disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Scrollable carousel */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
          role="list"
          aria-label="Faculty members carousel"
        >
          {DUMMY_FACULTY.map((f) => (
            <div key={f.id} className="w-64 sm:w-80 flex-shrink-0">
              <FacultyCard faculty={f} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

