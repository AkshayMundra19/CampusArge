import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, BadgeCheck, Building2, Award, DollarSign, Users, Sparkles } from 'lucide-react';

export interface Institution {
  id: string | number;
  rank: number | null;          // QS Ranking (can be null)
  name: string;
  location: string;
  country: string;
  region: string;
  verifiedFaculty: number;
  type: 'Public' | 'Private';
  founded: number;
  tags: string[];        // specialization-oriented discovery tags
  researchAreas: string[];
  scholarships: boolean;
  verified: boolean;
  color: string;
  logoUrl?: string | null;
  coverUrl?: string | null;
  // Enriched fields
  classification?: string | null;
  costOfAttendance?: number | null;
  studentFacultyRatio?: string | null;
  studentFacultyRatioNum?: number | null;
  anchorPrograms?: string[] | null;
  undergradPop?: number | null;
  accreditor?: string | null;
  crimeLevel?: string | null;
}

export const INSTITUTIONS: Institution[] = [
  {
    id: 'u_1', rank: 1, name: 'MIT', location: 'Cambridge, United States', country: 'United States', region: 'North America',
    verifiedFaculty: 2345, type: 'Private', founded: 1861,
    tags: ['AI Research', 'Engineering', 'Data Science'],
    researchAreas: ['Engineering', 'Computer Science', 'Physical Sciences'],
    scholarships: true, verified: true, color: 'from-navy to-oxford',
    logoUrl: 'https://www.google.com/s2/favicons?sz=128&domain_url=mit.edu',
    costOfAttendance: 77020, studentFacultyRatio: '3:1', studentFacultyRatioNum: 3,
    classification: 'Private Research University', anchorPrograms: ['Engineering', 'Computer Science']
  },
  {
    id: 'u_2', rank: 2, name: 'Harvard University', location: 'Cambridge, United States', country: 'United States', region: 'North America',
    verifiedFaculty: 3187, type: 'Private', founded: 1636,
    tags: ['Law', 'Business', 'Medical Sciences'],
    researchAreas: ['Law', 'Business', 'Medicine'],
    scholarships: true, verified: true, color: 'from-oxford to-navy-dark',
    logoUrl: 'https://www.google.com/s2/favicons?sz=128&domain_url=harvard.edu',
    costOfAttendance: 76763, studentFacultyRatio: '7:1', studentFacultyRatioNum: 7,
    classification: 'Private Ivy League', anchorPrograms: ['Law', 'Business', 'Medicine']
  },
  {
    id: 'u_3', rank: 3, name: 'Stanford University', location: 'Stanford, United States', country: 'United States', region: 'North America',
    verifiedFaculty: 2012, type: 'Private', founded: 1885,
    tags: ['AI Research', 'Business', 'Engineering'],
    researchAreas: ['Business', 'Engineering', 'Computer Science'],
    scholarships: true, verified: true, color: 'from-navy to-burgundy',
    logoUrl: 'https://www.google.com/s2/favicons?sz=128&domain_url=stanford.edu',
    costOfAttendance: 78218, studentFacultyRatio: '5:1', studentFacultyRatioNum: 5,
    classification: 'Private Research University', anchorPrograms: ['Business', 'Engineering']
  }
];

export function InstitutionCard({ inst }: { inst: Institution }) {
  const [logoError, setLogoError] = useState(false);

  const initials = inst.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('');

  return (
    <div className="glass-card bg-white dark:bg-slate-900 rounded-2xl overflow-hidden card-hover flex flex-col h-full border border-slate-200/80 dark:border-slate-800 transition-all duration-300 hover:shadow-lg">
      <div className={`relative h-28 bg-gradient-to-br ${inst.color || 'from-navy to-oxford'} flex items-center justify-center`}>
        {/* QS Rank badge (if present) */}
        {inst.rank != null && (
          <span className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-black/40 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1">
            <Award className="w-3 h-3 text-gold" />
            #{inst.rank}
          </span>
        )}

        {/* Verified badge */}
        {inst.verified && (
          <Link
            to="/verification"
            className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-gold text-white text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
          >
            <BadgeCheck className="w-3.5 h-3.5" aria-hidden="true" /> Verified
          </Link>
        )}

        {/* Institution icon / logo */}
        <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center overflow-hidden p-2 shadow-md border border-white/30">
          {inst.logoUrl && !logoError ? (
            <img
              src={inst.logoUrl}
              alt={`${inst.name} logo`}
              width={48}
              height={48}
              className="w-full h-full object-contain"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="w-full h-full bg-navy text-white rounded-lg flex items-center justify-center font-bold text-sm">
              {initials || <Building2 className="w-6 h-6 text-slate-300" />}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        {/* Classification tag if present */}
        {inst.classification && (
          <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-oxford dark:text-gold mb-1 truncate">
            {inst.classification}
          </span>
        )}

        {/* Name */}
        <h3 className="font-sans font-bold text-slate-900 dark:text-white text-base leading-snug mb-1 line-clamp-1" title={inst.name}>
          {inst.name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mb-3">
          <MapPin className="w-3 h-3 text-navy flex-shrink-0" aria-hidden="true" />
          <span className="truncate">{inst.location}</span>
        </div>

        {/* Dynamic Stats Row: COA / Ratio / Type */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {/* Col 1: COA if present, else Rank, else Type */}
          {inst.costOfAttendance != null ? (
            <div className="text-center bg-slate-50 dark:bg-slate-800/50 rounded-lg py-1.5 px-1 border border-slate-100 dark:border-slate-800">
              <p className="font-bold text-xs text-emerald-700 dark:text-emerald-400 tabular-nums truncate flex items-center justify-center">
                <DollarSign className="w-3 h-3" />
                {Math.round(inst.costOfAttendance / 1000)}k/yr
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">COA</p>
            </div>
          ) : inst.rank != null ? (
            <div className="text-center bg-slate-50 dark:bg-slate-800/50 rounded-lg py-1.5 px-1 border border-slate-100 dark:border-slate-800">
              <p className="font-bold text-xs text-slate-900 dark:text-white flex items-center justify-center gap-0.5">
                <Award className="w-3 h-3 text-amber-500" />
                #{inst.rank}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Rank</p>
            </div>
          ) : (
            <div className="text-center bg-slate-50 dark:bg-slate-800/50 rounded-lg py-1.5 px-1 border border-slate-100 dark:border-slate-800">
              <p className="font-bold text-xs text-slate-900 dark:text-white">{inst.type}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Type</p>
            </div>
          )}

          {/* Col 2: Ratio if present, else Type */}
          {inst.studentFacultyRatio ? (
            <div className="text-center bg-slate-50 dark:bg-slate-800/50 rounded-lg py-1.5 px-1 border border-slate-100 dark:border-slate-800">
              <p className="font-bold text-xs text-slate-900 dark:text-white tabular-nums flex items-center justify-center gap-0.5">
                <Users className="w-3 h-3 text-blue-500" />
                {inst.studentFacultyRatio}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Ratio</p>
            </div>
          ) : (
            <div className="text-center bg-slate-50 dark:bg-slate-800/50 rounded-lg py-1.5 px-1 border border-slate-100 dark:border-slate-800">
              <p className="font-bold text-xs text-slate-900 dark:text-white">{inst.type}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Type</p>
            </div>
          )}

          {/* Col 3: Faculty Count or Type */}
          <div className="text-center bg-slate-50 dark:bg-slate-800/50 rounded-lg py-1.5 px-1 border border-slate-100 dark:border-slate-800">
            <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
              {inst.verifiedFaculty ? inst.verifiedFaculty.toLocaleString() : inst.type}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {inst.verifiedFaculty ? 'Faculty' : 'Control'}
            </p>
          </div>
        </div>

        {/* Anchor programs highlight (gold tinted pill) */}
        {inst.anchorPrograms && inst.anchorPrograms.length > 0 && (
          <div className="mb-2.5 flex items-center gap-1.5 overflow-hidden">
            <Sparkles className="w-3 h-3 text-gold flex-shrink-0" />
            <span className="text-[11px] font-semibold text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/50 px-2 py-0.5 rounded truncate">
              {inst.anchorPrograms.slice(0, 2).join(' • ')}
            </span>
          </div>
        )}

        {/* Specialization tags */}
        {inst.tags && inst.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {inst.tags.slice(0, 3).map((t) => (
              <span key={t} className="tag-pill text-[11px] truncate max-w-[140px]">
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Scholarships indicator */}
        {inst.scholarships && (
          <div className="flex items-center gap-1 mb-3">
            <BadgeCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" aria-hidden="true" />
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Scholarships Available</span>
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-auto pt-2 flex gap-2">
          <Link
            to={`/institutions/${inst.id}`}
            className="flex-1 btn-primary text-center text-xs py-2 px-2.5 whitespace-nowrap font-medium"
          >
            View Details →
          </Link>
          <Link
            to={`/institutions/${inst.id}#faculty`}
            className="btn-secondary text-xs py-2 px-3 whitespace-nowrap font-medium"
          >
            Faculty
          </Link>
        </div>
      </div>
    </div>
  );
}
