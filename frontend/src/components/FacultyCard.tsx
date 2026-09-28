import { Link } from 'react-router-dom';
import { Star, BadgeCheck, MapPin, Clock, Calendar } from 'lucide-react';
import type { Faculty } from '@/types';

interface FacultyCardProps {
  faculty: Faculty;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function FacultyCard({ faculty }: FacultyCardProps) {
  return (
    <div className="glass-card bg-teal-50/60 dark:bg-teal-900/10 rounded-2xl overflow-hidden card-hover group flex flex-col h-full">
      {/* Photo */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={faculty.photo_url ?? 'https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg'}
          alt={faculty.full_name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {faculty.verification_status === 'verified' && (
          <Link to="/verification" className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-burgundy text-white text-xs font-semibold shadow-lg hover:opacity-80 transition-opacity cursor-pointer">
            <BadgeCheck className="w-3.5 h-3.5" /> Verified
          </Link>
        )}
        {faculty.verification_status === 'pending' && (
          <Link to="/verification" className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 text-white text-xs font-semibold shadow-lg hover:opacity-80 transition-opacity cursor-pointer">
            <Clock className="w-3.5 h-3.5" /> Pending
          </Link>
        )}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-sans font-bold text-lg leading-tight">{faculty.full_name}</h3>
          <p className="text-white/80 text-sm">{faculty.title}</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
            <MapPin className="w-4 h-4 text-navy" />
            <span className="truncate">{faculty.university_name}</span>
          </div>
          {faculty.rating > 0 && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-sans font-semibold text-slate-900 dark:text-white">{faculty.rating.toFixed(1)}</span>
              <span className="text-slate-400">({faculty.review_count})</span>
            </div>
          )}
        </div>

        {/* Subjects */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {faculty.subjects.slice(0, 3).map((subject) => (
            <span key={subject} className="px-2.5 py-1 rounded-full text-xs font-medium bg-navy dark:bg-navy-light text-navy dark:text-navy">
              {subject}
            </span>
          ))}
          {faculty.subjects.length > 3 && (
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              +{faculty.subjects.length - 3}
            </span>
          )}
        </div>

        {/* Languages */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
          <span>Languages: {faculty.languages.join(', ')}</span>
          <span>-</span>
          <span>{faculty.experience_years} yrs exp</span>
        </div>

        <div className="mt-auto flex items-center gap-2 pt-2">
          <Link
            to={`/mentors/${faculty.id}`}
            className="flex-1 text-center px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-navy to-navy rounded-lg hover:shadow-lg hover:shadow-navy transition-all"
          >
            View Profile
          </Link>
          {faculty.is_available && faculty.verification_status === 'verified' && (
            <Link
              to={`/mentors/${faculty.id}#book`}
              className="px-4 py-2.5 text-sm font-semibold text-burgundy dark:text-burgundy bg-burgundy dark:bg-burgundy-light rounded-lg hover:bg-burgundy dark:hover:bg-burgundy-light transition-colors flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4" /> Book
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export { DAYS };
