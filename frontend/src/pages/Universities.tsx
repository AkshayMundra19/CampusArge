import { useState, useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal, X, Globe, Award, DollarSign } from 'lucide-react';

import type { University } from '@/types';
import UniversityCard from '@/components/UniversityCard';
import { CardSkeleton, EmptyState } from '@/components/ui';
import { GraduationCap } from 'lucide-react';
import { DUMMY_UNIVERSITIES } from '@/lib/dummyData';

export default function Universities() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const PAGE_SIZE = 12;
  const [filters, setFilters] = useState({
    country: '',
    type: '',
    minRank: '',
    maxTuition: '',
    scholarships: false,
    program: '',
  });

  useEffect(() => {
    fetch('/api/universities/list.php')
      .then((res) => res.ok ? res.json() : { data: DUMMY_UNIVERSITIES })
      .then((data) => {
        const unis = data.data && data.data.length > 0 ? data.data : DUMMY_UNIVERSITIES;
        setUniversities(unis);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch universities', err);
        setUniversities(DUMMY_UNIVERSITIES);
        setLoading(false);
      });
  }, []);

  const countries = useMemo(() => [...new Set(universities.map((u) => u.country).filter(Boolean))].sort(), [universities]);
  const programs = useMemo(() => [...new Set(universities.flatMap((u) => u.programs || []).filter(Boolean))].sort(), [universities]);

  const filtered = useMemo(() => {
    return universities.filter((u) => {
      if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.country.toLowerCase().includes(search.toLowerCase())) return false;
      if (filters.country && u.country !== filters.country) return false;
      if (filters.type && u.university_type !== filters.type) return false;
      if (filters.minRank && u.qs_rank && u.qs_rank > parseInt(filters.minRank)) return false;
      if (filters.maxTuition && u.cost_of_attendance && u.cost_of_attendance > parseInt(filters.maxTuition) * 1000) return false;
      if (filters.scholarships && !u.scholarships_available) return false;
      if (filters.program && (!u.programs || !u.programs.includes(filters.program))) return false;
      return true;
    });
  }, [universities, search, filters]);

  // Reset visible count when search/filters change so results start from top
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, filters]);

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-2">
            University Directory
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Browse {universities.length} world-class institutions and connect with their verified faculty
          </p>
        </div>

        {/* Search & Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-navy"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <SlidersHorizontal className="w-5 h-5" />
            Filters
            {Object.values(filters).some(Boolean) && (
              <span className="w-2 h-2 rounded-full bg-navy" />
            )}
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="glass-card rounded-2xl p-5 mb-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 dark:text-white">Advanced Filters</h3>
              <button
                onClick={() => setFilters({ country: '', type: '', minRank: '', maxTuition: '', scholarships: false, program: '' })}
                className="text-sm text-navy hover:text-navy"
              >
                Clear all
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1"><Globe className="w-3 h-3" /> Country</label>
                <select value={filters.country} onChange={(e) => setFilters({ ...filters, country: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white">
                  <option value="">All Countries</option>
                  {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1"><GraduationCap className="w-3 h-3" /> University Type</label>
                <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white">
                  <option value="">All Types</option>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="online">Online</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1"><Award className="w-3 h-3" /> Max QS Rank</label>
                <input type="number" placeholder="e.g. 50" value={filters.minRank} onChange={(e) => setFilters({ ...filters, minRank: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1"><DollarSign className="w-3 h-3" /> Max Tuition ($k)</label>
                <input type="number" placeholder="e.g. 50" value={filters.maxTuition} onChange={(e) => setFilters({ ...filters, maxTuition: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1"><GraduationCap className="w-3 h-3" /> Program</label>
                <select value={filters.program} onChange={(e) => setFilters({ ...filters, program: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white">
                  <option value="">All Programs</option>
                  {programs.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={filters.scholarships} onChange={(e) => setFilters({ ...filters, scholarships: e.target.checked })} className="w-4 h-4 rounded accent-primary-600" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Scholarships Available</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Results count */}
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Showing {Math.min(visibleCount, filtered.length)} of {filtered.length} universities
          {filtered.length !== universities.length && ` (filtered from ${universities.length} total)`}
        </p>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={GraduationCap} title="No universities found" description="Try adjusting your filters or search query" />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.slice(0, visibleCount).map((uni) => <UniversityCard key={uni.id} university={uni} />)}
            </div>
            {visibleCount < filtered.length && (
              <div className="text-center mt-10">
                <button
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="px-8 py-3 text-sm font-semibold text-navy dark:text-navy border-2 border-navy rounded-xl hover:bg-navy dark:hover:bg-navy-light hover:shadow-lg hover:shadow-navy transition-all"
                >
                  Load More ({filtered.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
