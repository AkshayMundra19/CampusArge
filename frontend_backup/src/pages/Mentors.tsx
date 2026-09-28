import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Star, Globe, Languages, Clock } from 'lucide-react';

import type { Faculty, University } from '@/types';
import FacultyCard from '@/components/FacultyCard';
import { CardSkeleton, EmptyState } from '@/components/ui';
import { Users } from 'lucide-react';
import { DUMMY_FACULTY, DUMMY_UNIVERSITIES } from '@/lib/dummyData';

export default function Mentors() {
  const [searchParams] = useSearchParams();
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [universities, setUniversities] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('q') ?? '');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    university: searchParams.get('university') ?? '',
    subject: '',
    language: '',
    minRating: '',
    availability: false,
  });

  useEffect(() => {
    fetch('/api/faculty/list.php')
      .then((res) => res.ok ? res.json() : { faculty: DUMMY_FACULTY, universities: DUMMY_UNIVERSITIES })
      .then((data) => {
        const facs = data.faculty && data.faculty.length > 0 ? data.faculty : DUMMY_FACULTY;
        const unis = data.universities && data.universities.length > 0 ? data.universities : DUMMY_UNIVERSITIES;
        setFaculty(facs);
        setUniversities(unis);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch faculty list', err);
        setFaculty(DUMMY_FACULTY);
        setUniversities(DUMMY_UNIVERSITIES);
        setLoading(false);
      });
  }, []);

  const subjects = useMemo(() => [...new Set(faculty.flatMap((f) => f.subjects))].sort(), [faculty]);
  const languages = useMemo(() => [...new Set(faculty.flatMap((f) => f.languages))].sort(), [faculty]);

  const filtered = useMemo(() => {
    return faculty.filter((f) => {
      if (search) {
        const q = search.toLowerCase();
        if (!f.full_name.toLowerCase().includes(q) && !f.subjects.some((s) => s.toLowerCase().includes(q)) && !(f.university_name?.toLowerCase().includes(q))) return false;
      }
      if (filters.university && f.university_id !== filters.university) return false;
      if (filters.subject && !f.subjects.includes(filters.subject)) return false;
      if (filters.language && !f.languages.includes(filters.language)) return false;
      if (filters.minRating && f.rating < parseFloat(filters.minRating)) return false;
      if (filters.availability && !f.is_available) return false;
      return true;
    });
  }, [faculty, search, filters]);

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-2">
            Verified Faculty Marketplace
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Connect with {faculty.length} verified professors from top universities worldwide
          </p>
        </div>

        {/* Search & Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, subject, or university..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <SlidersHorizontal className="w-5 h-5" />
            Filters
            {Object.values(filters).some(Boolean) && <span className="w-2 h-2 rounded-full bg-primary-500" />}
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="glass-card rounded-2xl p-5 mb-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1"><Globe className="w-3 h-3" /> University</label>
                <select value={filters.university} onChange={(e) => setFilters({ ...filters, university: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white">
                  <option value="">All Universities</option>
                  {universities.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1"><Users className="w-3 h-3" /> Subject</label>
                <select value={filters.subject} onChange={(e) => setFilters({ ...filters, subject: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white">
                  <option value="">All Subjects</option>
                  {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1"><Languages className="w-3 h-3" /> Language</label>
                <select value={filters.language} onChange={(e) => setFilters({ ...filters, language: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white">
                  <option value="">All Languages</option>
                  {languages.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1"><Star className="w-3 h-3" /> Min Rating</label>
                <select value={filters.minRating} onChange={(e) => setFilters({ ...filters, minRating: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white">
                  <option value="">Any Rating</option>
                  <option value="4.5">4.5+</option>
                  <option value="4.0">4.0+</option>
                  <option value="3.5">3.5+</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={filters.availability} onChange={(e) => setFilters({ ...filters, availability: e.target.checked })} className="w-4 h-4 rounded accent-primary-600" />
                <span className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-1"><Clock className="w-3 h-3" /> Available Now</span>
              </label>
            </div>
          </div>
        )}

        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Showing {filtered.length} of {faculty.length} mentors
        </p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={Users} title="No mentors found" description="Try adjusting your filters or search query" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((f) => <FacultyCard key={f.id} faculty={f} />)}
          </div>
        )}
      </div>
    </div>
  );
}
