import { Link } from 'react-router-dom';
import { Star, Users, Award, MapPin, ArrowRight, Building2 } from 'lucide-react';
import type { University } from '@/types';

interface UniversityCardProps {
  university: University;
}

const generateGradient = (id: string) => {
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hues = [210, 250, 280, 320, 150, 180, 30, 0];
  const hue1 = hues[hash % hues.length];
  const hue2 = hues[(hash + 3) % hues.length];
  return `linear-gradient(135deg, hsl(${hue1}, 70%, 40%), hsl(${hue2}, 70%, 20%))`;
};

export default function UniversityCard({ university }: UniversityCardProps) {
  const hasCampusImage = !!university.campus_image_url;

  return (
    <div className="glass-card rounded-2xl overflow-hidden card-hover group flex flex-col h-full">
      {/* Banner — real campus photo OR gradient+logo fallback */}
      <div
        className="relative h-44 overflow-hidden"
        style={hasCampusImage ? undefined : { background: generateGradient(university.id) }}
      >
        {hasCampusImage ? (
          <img
            src={university.campus_image_url!}
            alt={`${university.name} campus`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          university.logo_url && (
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-2xl bg-white p-2 shadow-xl z-10">
              <img src={university.logo_url} alt={`${university.name} logo`} className="w-full h-full object-contain" loading="lazy" />
            </div>
          )
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        {university.qs_rank && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-slate-900 text-xs font-bold shadow-lg">
            <Award className="w-3.5 h-3.5 text-amber-500" /> QS #{university.qs_rank}
          </div>
        )}
        {university.scholarships_available && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-burgundy text-white text-xs font-semibold shadow-lg">
            Scholarships
          </div>
        )}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-sans font-bold text-lg leading-tight line-clamp-2">{university.name}</h3>
          <div className="flex items-center gap-1 text-white/80 text-sm">
            <MapPin className="w-3.5 h-3.5" /> {university.city}, {university.country}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <Users className="w-4 h-4 mx-auto text-navy mb-1" />
            <p className="text-xs text-slate-500 dark:text-slate-400">Faculty</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white">{university.verified_faculty_count}</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <Building2 className="w-4 h-4 mx-auto text-burgundy mb-1" />
            <p className="text-xs text-slate-500 dark:text-slate-400">Type</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white capitalize">{university.university_type}</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <Star className="w-4 h-4 mx-auto text-amber-500 mb-1" />
            <p className="text-xs text-slate-500 dark:text-slate-400">Tuition</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {university.tuition_min && university.tuition_max 
                ? `$${(university.tuition_min / 1000).toFixed(0)}k-$${(university.tuition_max / 1000).toFixed(0)}k` 
                : university.tuition_min ? `$${(university.tuition_min / 1000).toFixed(0)}k+`
                : 'N/A'}
            </p>
          </div>
        </div>

        {/* Programs */}
        <div className="flex flex-wrap gap-1.5 mb-4 min-h-[24px]">
          {university.programs && university.programs.length > 0 ? (
            <>
              {university.programs.slice(0, 3).map((program) => (
                <span key={program} className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {program}
                </span>
              ))}
              {university.programs.length > 3 && (
                <span className="px-2 py-0.5 rounded text-xs font-medium text-slate-400">
                  +{university.programs.length - 3} more
                </span>
              )}
            </>
          ) : (
            <span className="text-xs text-slate-400 italic">Programs not listed</span>
          )}
        </div>

        <div className="mt-auto flex items-center gap-2 pt-2">
          <Link
            to={`/universities/${university.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-navy to-navy rounded-lg hover:shadow-lg hover:shadow-navy transition-all"
          >
            View University <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to={`/mentors?university=${university.id}`}
            className="px-4 py-2.5 text-sm font-semibold text-navy bg-navy-light rounded-lg hover:bg-oxford-light transition-colors"
          >
            Faculty
          </Link>
        </div>
      </div>
    </div>
  );
}
