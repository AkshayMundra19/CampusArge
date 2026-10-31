import { Link } from 'react-router-dom';
import { MapPin, BadgeCheck, Users, Tag } from 'lucide-react';
import { REAL_UNIVERSITIES } from '@/lib/universitiesData';
import InstitutionLogo from './InstitutionLogo';

export interface Institution {
  id: string | number;
  rank: number | null;
  name: string;
  location: string;
  country: string;
  region: string;
  verifiedFaculty: number;
  type: 'Public' | 'Private';
  founded: number;
  tags: string[];
  researchAreas: string[];
  scholarships: boolean;
  verified: boolean;
  color: string;
  logoUrl?: string | null;
  coverUrl?: string | null;
  classification?: string | null;
  costOfAttendance?: number | null;
  studentFacultyRatio?: string | null;
  studentFacultyRatioNum?: number | null;
  anchorPrograms?: string[] | null;
  undergradPop?: number | null;
  accreditor?: string | null;
  crimeLevel?: string | null;
}

export const INSTITUTIONS: Institution[] = REAL_UNIVERSITIES.slice(0, 3).map((u): Institution => ({
  id: u.id,
  rank: u.qs_rank,
  name: u.name,
  location: [u.city, u.country].filter(Boolean).join(', ') || 'United States',
  country: u.country || 'United States',
  region: 'Global',
  verifiedFaculty: u.verified_faculty_count || 0,
  type: u.university_type === 'public' ? 'Public' : 'Private',
  founded: u.established_year || 1900,
  tags: u.programs || [],
  researchAreas: u.programs || [],
  scholarships: u.scholarships_available,
  verified: true,
  color: 'from-navy to-oxford',
  logoUrl: u.logo_url,
  classification: u.facts?.school_classification || null,
  costOfAttendance: u.cost_of_attendance || null,
  studentFacultyRatio: u.facts?.student_faculty_ratio?.display || null,
  studentFacultyRatioNum: u.facts?.student_faculty_ratio?.value || null,
  anchorPrograms: u.facts?.anchor_programs || null,
  undergradPop: u.facts?.undergrad_population?.value || null,
  accreditor: u.facts?.accreditor || null,
  crimeLevel: u.facts?.crime_rate?.level || null,
}));

interface InstitutionCardProps {
  inst: Institution;
  isComparing?: boolean;
  onToggleCompare?: (inst: Institution) => void;
  canCompare?: boolean;
}

export function InstitutionCard({
  inst,
  isComparing = false,
  onToggleCompare,
  canCompare = true,
}: InstitutionCardProps) {
  // Source tags: anchorPrograms if available, else first programs with text in parens stripped
  const rawTags = (inst.anchorPrograms && inst.anchorPrograms.length > 0)
    ? inst.anchorPrograms
    : (inst.tags || []);

  const cleanTags = rawTags.map(t => t.replace(/\s*\([^)]*\)/g, '').trim()).filter(Boolean);

  return (
    <div className="inst-card bg-white dark:bg-slate-900 rounded-[20px] border border-[#E5E9EF] dark:border-slate-800 shadow-[0_4px_16px_rgba(16,42,67,0.06)] hover:shadow-[0_8px_24px_rgba(16,42,67,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full group overflow-hidden">
      <div>
        {/* Full-width Logo Stage at top */}
        <div className="inst-logo-stage">
          {/* Compare toggle button overlay top-left */}
          <button
            type="button"
            onClick={() => onToggleCompare?.(inst)}
            aria-pressed={isComparing}
            aria-label={`${isComparing ? 'Remove' : 'Add'} ${inst.name} to comparison`}
            disabled={!isComparing && !canCompare}
            className={`absolute top-2.5 left-2.5 z-10 px-2.5 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1 shadow-sm ${
              isComparing
                ? 'bg-[#FBF6EC] border border-[#EADFC8] text-[#8C6D3B]'
                : 'bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-300/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-navy hover:text-navy disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
          >
            {isComparing ? '✓ Added' : '+ Compare'}
          </button>

          {/* Verified pill overlay top-right */}
          {inst.verified && (
            <span className="absolute top-2.5 right-2.5 z-10 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200/80 dark:border-slate-700 text-navy dark:text-gold text-xs font-medium shadow-sm">
              <BadgeCheck className="w-3.5 h-3.5 text-navy dark:text-gold" aria-hidden="true" />
              Verified
            </span>
          )}

          {/* Centered Large Crisp Logo */}
          <InstitutionLogo
            id={inst.id}
            name={inst.name}
            logoUrl={inst.logoUrl}
            size="card"
          />
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-6 pb-2">
          {/* Institution Type / Classification label */}
          <span className="text-[11px] font-bold uppercase tracking-wider text-oxford dark:text-gold block mb-1">
            {inst.classification || (inst.type ? `${inst.type.toUpperCase()}` : 'UNIVERSITY')}
          </span>

          {/* Name */}
          <h3 className="font-sans font-bold text-slate-900 dark:text-white text-lg leading-snug mb-1 line-clamp-2">
            <Link to={`/institutions/${inst.id}`} className="hover:text-navy dark:hover:text-gold transition-colors">
              {inst.name}
            </Link>
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" aria-hidden="true" />
            <span className="truncate">{inst.location}</span>
          </div>

          {/* Three Stat Chips: COA, Ratio, Programs */}
          <div className="grid grid-cols-3 gap-2 mb-3.5">
            {/* 1. COA */}
            <div className="bg-[#F4F6F8] dark:bg-slate-800/80 rounded-[10px] p-2 text-center">
              <p className="font-bold text-xs text-navy dark:text-white tabular-nums">
                {inst.costOfAttendance ? `$${inst.costOfAttendance.toLocaleString()}/yr` : '—'}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">COA</p>
            </div>

            {/* 2. Ratio */}
            <div className="bg-[#F4F6F8] dark:bg-slate-800/80 rounded-[10px] p-2 text-center">
              <p className="font-bold text-xs text-navy dark:text-white flex items-center justify-center gap-0.5">
                <Users className="w-3 h-3 text-slate-400" />
                {inst.studentFacultyRatio || '—'}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Ratio</p>
            </div>

            {/* 3. Programs */}
            <div className="bg-[#F4F6F8] dark:bg-slate-800/80 rounded-[10px] p-2 text-center">
              <p className="font-bold text-xs text-navy dark:text-white tabular-nums">
                {inst.tags?.length || inst.researchAreas?.length || '—'}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Programs</p>
            </div>
          </div>

          {/* Tag row */}
          {cleanTags.length > 0 && (
            <div className="flex items-center gap-1.5 my-3 overflow-hidden">
              <Tag className="w-3.5 h-3.5 text-gold flex-shrink-0" aria-hidden="true" />
              <div className="flex flex-wrap gap-1.5 overflow-hidden">
                {cleanTags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    title={tag}
                    className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#FBF6EC] border border-[#EADFC8] text-[#8C6D3B] truncate max-w-[130px]"
                  >
                    {tag.length > 22 ? `${tag.slice(0, 20)}…` : tag}
                  </span>
                ))}
                {cleanTags.length > 3 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500">
                    +{cleanTags.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Button: full-width navy View Details */}
      <div className="p-5 sm:p-6 pt-0">
        <Link
          to={`/institutions/${inst.id}`}
          aria-label={`View details for ${inst.name}`}
          className="w-full mt-2 py-2.5 px-4 bg-navy hover:bg-navy-dark text-white text-xs sm:text-sm font-semibold rounded-[10px] transition-colors text-center block shadow-sm"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}
