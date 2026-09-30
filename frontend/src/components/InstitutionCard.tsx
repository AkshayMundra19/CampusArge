import { Link } from 'react-router-dom';
import { MapPin, BadgeCheck, Building2, Award } from 'lucide-react';

export interface Institution {
  id: string | number;
  rank: number;          // QS Ranking
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
  logoUrl?: string;
  coverUrl?: string;
}

export const INSTITUTIONS: Institution[] = [
  {
    id: 1, rank: 1, name: 'MIT', location: 'Cambridge, United States', country: 'United States', region: 'North America',
    verifiedFaculty: 2345, type: 'Public', founded: 1861,
    tags: ['AI Research', 'Engineering', 'Data Science'],
    researchAreas: ['Engineering', 'Computer Science', 'Physical Sciences'],
    scholarships: true, verified: true, color: 'from-navy to-oxford',
    logoUrl: 'https://www.google.com/s2/favicons?sz=128&domain_url=mit.edu',
  },
  {
    id: 2, rank: 2, name: 'Harvard University', location: 'Cambridge, United States', country: 'United States', region: 'North America',
    verifiedFaculty: 3187, type: 'Private', founded: 1636,
    tags: ['Law', 'Business', 'Medical Sciences'],
    researchAreas: ['Law', 'Business', 'Medicine'],
    scholarships: true, verified: true, color: 'from-oxford to-navy-dark',
    logoUrl: 'https://www.google.com/s2/favicons?sz=128&domain_url=harvard.edu',
  },
  {
    id: 3, rank: 3, name: 'Stanford University', location: 'Stanford, United States', country: 'United States', region: 'North America',
    verifiedFaculty: 2012, type: 'Private', founded: 1885,
    tags: ['AI Research', 'Business', 'Engineering'],
    researchAreas: ['Business', 'Engineering', 'Computer Science'],
    scholarships: true, verified: true, color: 'from-navy to-burgundy',
    logoUrl: 'https://www.google.com/s2/favicons?sz=128&domain_url=stanford.edu',
  },
  {
    id: 4, rank: 4, name: 'Columbia University', location: 'New York City, United States', country: 'United States', region: 'North America',
    verifiedFaculty: 1845, type: 'Private', founded: 1754,
    tags: ['Journalism', 'Business', 'Law'],
    researchAreas: ['Journalism', 'Business', 'Law'],
    scholarships: false, verified: true, color: 'from-blue-700 to-blue-800',
    logoUrl: 'https://www.google.com/s2/favicons?sz=128&domain_url=columbia.edu',
  },
  {
    id: 5, rank: 5, name: 'Yale University', location: 'New Haven, United States', country: 'United States', region: 'North America',
    verifiedFaculty: 1559, type: 'Private', founded: 1701,
    tags: ['Law', 'Medical Sciences', 'Sustainability'],
    researchAreas: ['Law', 'Drama', 'Medicine'],
    scholarships: true, verified: true, color: 'from-navy to-oxford',
    logoUrl: 'https://www.google.com/s2/favicons?sz=128&domain_url=yale.edu',
  },
  {
    id: 6, rank: 6, name: 'Princeton University', location: 'Princeton, United States', country: 'United States', region: 'North America',
    verifiedFaculty: 1318, type: 'Private', founded: 1746,
    tags: ['Engineering', 'Data Science', 'Sustainability'],
    researchAreas: ['Public Policy', 'Engineering', 'Mathematics'],
    scholarships: false, verified: true, color: 'from-oxford to-navy',
    logoUrl: 'https://www.google.com/s2/favicons?sz=128&domain_url=princeton.edu',
  },
  {
    id: 7, rank: 7, name: 'Johns Hopkins University', location: 'Baltimore, United States', country: 'United States', region: 'North America',
    verifiedFaculty: 2606, type: 'Private', founded: 1876,
    tags: ['Medical Sciences', 'AI Research', 'Engineering'],
    researchAreas: ['Medicine', 'Public Health', 'Engineering'],
    scholarships: true, verified: true, color: 'from-navy-dark to-navy',
    logoUrl: 'https://www.google.com/s2/favicons?sz=128&domain_url=jhu.edu',
  },
  {
    id: 8, rank: 8, name: 'New York University (NYU)', location: 'New York City, United States', country: 'United States', region: 'North America',
    verifiedFaculty: 2843, type: 'Private', founded: 1831,
    tags: ['Business', 'Law', 'Data Science'],
    researchAreas: ['Arts', 'Business', 'Law'],
    scholarships: true, verified: true, color: 'from-navy to-burgundy',
    logoUrl: 'https://www.google.com/s2/favicons?sz=128&domain_url=nyu.edu',
  },
  {
    id: 9, rank: 9, name: 'Duke University', location: 'Durham, United States', country: 'United States', region: 'North America',
    verifiedFaculty: 1537, type: 'Private', founded: 1838,
    tags: ['Medical Sciences', 'Law', 'Sustainability'],
    researchAreas: ['Medicine', 'Law', 'Business'],
    scholarships: false, verified: true, color: 'from-oxford to-navy',
    logoUrl: 'https://www.google.com/s2/favicons?sz=128&domain_url=duke.edu',
  },
  {
    id: 10, rank: 10, name: 'Northwestern University', location: 'Evanston, United States', country: 'United States', region: 'North America',
    verifiedFaculty: 1405, type: 'Private', founded: 1851,
    tags: ['Journalism', 'Business', 'Law'],
    researchAreas: ['Journalism', 'Business', 'Law'],
    scholarships: true, verified: true, color: 'from-navy-dark to-oxford',
    logoUrl: 'https://www.google.com/s2/favicons?sz=128&domain_url=northwestern.edu',
  },
  {
    id: 11, rank: 11, name: 'Boston University', location: 'Boston, United States', country: 'United States', region: 'North America',
    verifiedFaculty: 2219, type: 'Private', founded: 1839,
    tags: ['Business', 'Engineering', 'AI Research'],
    researchAreas: ['Business', 'Communication', 'Engineering'],
    scholarships: true, verified: true, color: 'from-oxford to-navy',
    logoUrl: 'https://www.google.com/s2/favicons?sz=128&domain_url=bu.edu',
  },
  {
    id: 12, rank: 12, name: 'University of Oxford', location: 'Oxford, United Kingdom', country: 'United Kingdom', region: 'Europe',
    verifiedFaculty: 2590, type: 'Public', founded: 1096,
    tags: ['Humanities', 'Medical Sciences', 'Sustainability'],
    researchAreas: ['Humanities', 'Sciences', 'Social Sciences'],
    scholarships: true, verified: true, color: 'from-navy to-oxford-dark',
    logoUrl: 'https://www.google.com/s2/favicons?sz=128&domain_url=ox.ac.uk',
  },
];

export function InstitutionCard({ inst }: { inst: Institution }) {
  return (
    <div className="glass-card bg-white rounded-2xl overflow-hidden card-hover flex flex-col h-full">
      <div className={`relative h-28 bg-gradient-to-br ${inst.color} flex items-center justify-center`}>
        {/* QS Rank badge */}
        <span className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-black/30 text-white text-xs font-bold flex items-center justify-center">
          #{inst.rank}
        </span>
        {/* Verified badge */}
        {inst.verified && (
          <Link to="/verification" className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-gold text-white text-xs font-semibold hover:opacity-80 transition-opacity cursor-pointer">
            <BadgeCheck className="w-3.5 h-3.5" aria-hidden="true" /> Verified
          </Link>
        )}
        {/* Institution icon / logo */}
        <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center overflow-hidden p-2 shadow-sm">
          {inst.logoUrl ? (
            <img src={inst.logoUrl} alt={`${inst.name} logo`} className="w-full h-full object-contain" />
          ) : (
            <Building2 className="w-7 h-7 text-slate-400" aria-hidden="true" />
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        {/* 1. Name */}
        <h3 className="font-sans font-bold text-slate-900 dark:text-white text-base leading-tight mb-1">
          {inst.name}
        </h3>
        {/* 2. Country */}
        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mb-3">
          <MapPin className="w-3 h-3 text-navy flex-shrink-0" aria-hidden="true" />
          <span className="truncate">{inst.location}</span>
        </div>

        {/* 3–6. Stats row: QS Ranking / Type / Verified Faculty */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center bg-slate-50 dark:bg-slate-800/50 rounded-lg py-2">
            <p className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-center gap-0.5">
              <Award className="w-3 h-3 text-amber-500" aria-hidden="true" />
              {inst.rank}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">QS Rank</p>
          </div>
          <div className="text-center bg-slate-50 dark:bg-slate-800/50 rounded-lg py-2">
            <p className="font-bold text-sm text-slate-900 dark:text-white">{inst.type}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Type</p>
          </div>
          <div className="text-center bg-slate-50 dark:bg-slate-800/50 rounded-lg py-2">
            <p className="font-bold text-sm text-slate-900 dark:text-white">{inst.verifiedFaculty.toLocaleString()}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Faculty</p>
          </div>
        </div>

        {/* 7. Specialization tags (discovery-oriented) */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {inst.tags.map((t) => (
            <span key={t} className="tag-pill">
              {t}
            </span>
          ))}
        </div>

        {/* 8. Scholarships — only shown when available */}
        {inst.scholarships && (
          <div className="flex items-center gap-1 mb-4">
            <BadgeCheck className="w-3.5 h-3.5 text-green-500 flex-shrink-0" aria-hidden="true" />
            <span className="text-[11px] font-semibold text-green-600 dark:text-green-400">Scholarships Available</span>
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-auto flex gap-2">
          <Link
            to={`/institutions/${inst.id}`}
            className="flex-1 btn-primary text-center text-sm py-2.5 px-3 whitespace-nowrap"
          >
            View University →
          </Link>
          <Link
            to={`/institutions/${inst.id}#faculty`}
            className="btn-secondary text-sm py-2.5 px-4 whitespace-nowrap"
          >
            View Faculty
          </Link>
        </div>
      </div>
    </div>
  );
}
