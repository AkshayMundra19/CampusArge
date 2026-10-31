import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  X, Plus, Copy, Check, ChevronRight, Building2,
  DollarSign, BookOpen, MapPin, ShieldCheck, ShieldAlert,
  ArrowRight, Search, Award, Sparkles, Scale
} from 'lucide-react';
import { REAL_UNIVERSITIES, getUniversityById } from '@/lib/universitiesData';
import { useCompare } from '@/context/CompareContext';
import type { University } from '@/types';
import InstitutionLogo from '@/components/InstitutionLogo';

export default function Compare() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { selectedIds, removeInstitution, addInstitution, clearAll } = useCompare();

  // Selected IDs from URL ?ids=, fallback to context
  const activeIds = useMemo(() => {
    const fromUrl = searchParams.get('ids');
    if (fromUrl) {
      const parsed = fromUrl.split(',').map(s => s.trim()).filter(Boolean);
      // Validate and cap at 4
      return parsed.filter(id => REAL_UNIVERSITIES.some(u => u.id === id)).slice(0, 4);
    }
    return selectedIds.slice(0, 4);
  }, [searchParams, selectedIds]);

  const [institutions, setInstitutions] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showDiffsOnly, setShowDiffsOnly] = useState(false);

  // Add institution combobox
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [comboboxSearch, setComboboxSearch] = useState('');
  const comboboxRef = useRef<HTMLDivElement>(null);

  // Sync URL when activeIds change
  useEffect(() => {
    if (activeIds.length > 0) {
      setSearchParams({ ids: activeIds.join(',') }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [activeIds, setSearchParams]);

  // Load rich university records dynamically (code-split)
  useEffect(() => {
    let cancelled = false;
    async function fetchFullRecords() {
      setLoading(true);
      try {
        const records = await Promise.all(
          activeIds.map(async (id) => {
            const full = await getUniversityById(id);
            return full;
          })
        );
        if (!cancelled) {
          setInstitutions(records.filter(Boolean) as University[]);
        }
      } catch (err) {
        console.error('Error loading universities for comparison:', err);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (activeIds.length > 0) {
      fetchFullRecords();
    } else {
      setInstitutions([]);
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [activeIds]);

  // Click outside combobox
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (comboboxRef.current && !comboboxRef.current.contains(e.target as Node)) {
        setComboboxOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleRemove = (id: string) => {
    removeInstitution(id);
    const remaining = activeIds.filter(i => i !== id);
    if (remaining.length > 0) {
      setSearchParams({ ids: remaining.join(',') });
    } else {
      setSearchParams({});
    }
  };

  const handleSelectFromCombobox = (id: string) => {
    addInstitution(id);
    if (!activeIds.includes(id) && activeIds.length < 4) {
      setSearchParams({ ids: [...activeIds, id].join(',') });
    }
    setComboboxOpen(false);
    setComboboxSearch('');
  };

  // Filter available universities for combobox
  const comboboxResults = useMemo(() => {
    if (!comboboxSearch.trim()) return [];
    const q = comboboxSearch.toLowerCase();
    return REAL_UNIVERSITIES.filter(
      u => !activeIds.includes(u.id) && (
        u.name.toLowerCase().includes(q) ||
        (u.city && u.city.toLowerCase().includes(q))
      )
    ).slice(0, 8);
  }, [comboboxSearch, activeIds]);

  // Comparison Rows Config
  interface RowConfig {
    label: string;
    section: string;
    caption?: string;
    getValue: (u: University) => string | number | null | undefined;
    renderCell?: (u: University, val: any, isLowest?: boolean) => React.ReactNode;
    isLowestCandidate?: boolean;
    lowestValueKey?: (u: University) => number | null;
  }

  const ROW_SECTIONS: { title: string; rows: RowConfig[] }[] = [
    {
      title: 'Cost & Affordability',
      rows: [
        {
          label: 'Cost of Attendance',
          section: 'Cost & Affordability',
          getValue: (u) => u.cost_of_attendance,
          isLowestCandidate: true,
          lowestValueKey: (u) => (u.cost_of_attendance && u.cost_of_attendance > 0 ? u.cost_of_attendance : null),
          renderCell: (u, val, isLowest) => (
            <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
              {val != null ? (
                <>
                  <span>${val.toLocaleString()}/yr</span>
                  {isLowest && (
                    <span className="px-1.5 py-0.5 rounded bg-gold/15 text-gold text-[10px] font-bold uppercase tracking-wider">
                      Lowest
                    </span>
                  )}
                </>
              ) : (
                <span className="text-slate-400 font-normal italic">Not reported</span>
              )}
            </div>
          )
        },
        {
          label: 'Cost of Living Index',
          section: 'Cost & Affordability',
          caption: '100 = U.S. National Average',
          getValue: (u) => u.facts?.cost_of_living_index ?? u.facts?.cost_of_living?.value,
          isLowestCandidate: true,
          lowestValueKey: (u) => {
            const v = u.facts?.cost_of_living_index ?? u.facts?.cost_of_living?.value;
            return typeof v === 'number' ? v : null;
          },
          renderCell: (u, val, isLowest) => (
            <div className="flex items-center gap-1.5 font-medium text-slate-900 dark:text-white">
              {val != null ? (
                <>
                  <span>{val}</span>
                  {isLowest && (
                    <span className="px-1.5 py-0.5 rounded bg-gold/15 text-gold text-[10px] font-bold uppercase tracking-wider">
                      Lowest
                    </span>
                  )}
                </>
              ) : (
                <span className="text-slate-400 font-normal italic">Not reported</span>
              )}
            </div>
          )
        },
        {
          label: 'Avg. Apartment Rent',
          section: 'Cost & Affordability',
          getValue: (u) => u.facts?.avg_apartment_rent?.display ?? u.facts?.avg_apartment_rent?.value,
          isLowestCandidate: true,
          lowestValueKey: (u) => u.facts?.avg_apartment_rent?.value ?? null,
          renderCell: (u, val, isLowest) => (
            <div className="flex items-center gap-1.5 font-medium text-slate-900 dark:text-white">
              {val != null ? (
                <>
                  <span>{u.facts?.avg_apartment_rent?.display || `$${val.toLocaleString()}`}</span>
                  {isLowest && (
                    <span className="px-1.5 py-0.5 rounded bg-gold/15 text-gold text-[10px] font-bold uppercase tracking-wider">
                      Lowest
                    </span>
                  )}
                </>
              ) : (
                <span className="text-slate-400 font-normal italic">Not reported</span>
              )}
            </div>
          )
        },
        {
          label: 'Avg. Home Price',
          section: 'Cost & Affordability',
          getValue: (u) => u.facts?.avg_home_price?.display ?? u.facts?.avg_home_price?.value,
          isLowestCandidate: true,
          lowestValueKey: (u) => u.facts?.avg_home_price?.value ?? null,
          renderCell: (u, val, isLowest) => (
            <div className="flex items-center gap-1.5 font-medium text-slate-900 dark:text-white">
              {val != null ? (
                <>
                  <span>{u.facts?.avg_home_price?.display || `$${val.toLocaleString()}`}</span>
                  {isLowest && (
                    <span className="px-1.5 py-0.5 rounded bg-gold/15 text-gold text-[10px] font-bold uppercase tracking-wider">
                      Lowest
                    </span>
                  )}
                </>
              ) : (
                <span className="text-slate-400 font-normal italic">Not reported</span>
              )}
            </div>
          )
        }
      ]
    },
    {
      title: 'Academics & Faculty',
      rows: [
        {
          label: 'Student / Faculty Ratio',
          section: 'Academics & Faculty',
          getValue: (u) => u.facts?.student_faculty_ratio?.value ?? u.facts?.student_faculty_ratio?.display,
          isLowestCandidate: true,
          lowestValueKey: (u) => u.facts?.student_faculty_ratio?.value ?? null,
          renderCell: (u, val, isLowest) => (
            <div className="flex items-center gap-1.5 font-medium text-slate-900 dark:text-white">
              {val != null ? (
                <>
                  <span>{u.facts?.student_faculty_ratio?.display || `${val}:1`}</span>
                  {isLowest && (
                    <span className="px-1.5 py-0.5 rounded bg-gold/15 text-gold text-[10px] font-bold uppercase tracking-wider">
                      Lowest
                    </span>
                  )}
                </>
              ) : (
                <span className="text-slate-400 font-normal italic">Not reported</span>
              )}
            </div>
          )
        },
        {
          label: 'Undergraduate Enrollment',
          section: 'Academics & Faculty',
          getValue: (u) => u.facts?.undergrad_population?.display ?? u.facts?.undergrad_population?.value,
          renderCell: (u, val) => (
            <span className="font-medium text-slate-900 dark:text-white">
              {u.facts?.undergrad_population?.display || (val != null ? Number(val).toLocaleString() : 'Not reported')}
            </span>
          )
        },
        {
          label: 'Graduate Enrollment',
          section: 'Academics & Faculty',
          getValue: (u) => u.facts?.graduate_population?.display ?? u.facts?.graduate_population?.value,
          renderCell: (u, val) => (
            <span className="font-medium text-slate-900 dark:text-white">
              {u.facts?.graduate_population?.display || (val != null ? Number(val).toLocaleString() : 'Not reported')}
            </span>
          )
        },
        {
          label: 'Listed Programs Count',
          section: 'Academics & Faculty',
          getValue: (u) => u.programs?.length,
          renderCell: (u, val) => (
            <span className="font-semibold text-navy dark:text-gold tabular-nums">
              {val != null ? `${val} programs` : 'Not reported'}
            </span>
          )
        },
        {
          label: 'Signature / Anchor Programs',
          section: 'Academics & Faculty',
          getValue: (u) => (u.facts?.anchor_programs || u.programs)?.slice(0, 3).join(', '),
          renderCell: (u) => {
            const list = u.facts?.anchor_programs || u.programs?.slice(0, 3);
            if (!list || list.length === 0) {
              return <span className="text-slate-400 font-normal italic">Not reported</span>;
            }
            return (
              <div className="flex flex-wrap gap-1">
                {list.slice(0, 3).map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#FBF6EC] border border-[#EADFC8] text-[#8C6D3B] line-clamp-1"
                  >
                    {item.replace(/\s*\([^)]*\)/g, '').trim()}
                  </span>
                ))}
              </div>
            );
          }
        }
      ]
    },
    {
      title: 'Campus & Athletics',
      rows: [
        {
          label: 'Campus Size',
          section: 'Campus & Athletics',
          getValue: (u) => u.facts?.campus_acreage?.display ?? u.facts?.campus_acreage?.value,
          renderCell: (u, val) => (
            <span className="font-medium text-slate-900 dark:text-white">
              {u.facts?.campus_acreage?.display || (val != null ? `${val} acres` : 'Not reported')}
            </span>
          )
        },
        {
          label: 'On-Campus Housing',
          section: 'Campus & Athletics',
          getValue: (u) => u.facts?.housing_capacity_beds?.display ?? u.facts?.housing_capacity_beds?.value,
          renderCell: (u, val) => (
            <span className="font-medium text-slate-900 dark:text-white">
              {u.facts?.housing_capacity_beds?.display || (val != null ? `${Number(val).toLocaleString()} beds` : 'Not reported')}
            </span>
          )
        },
        {
          label: 'Athletic Conference',
          section: 'Campus & Athletics',
          getValue: (u) => u.facts?.athletic_conference,
          renderCell: (u, val) => (
            <span className="font-medium text-slate-900 dark:text-white">
              {val || 'Not reported'}
            </span>
          )
        },
        {
          label: 'Varsity Sports',
          section: 'Campus & Athletics',
          getValue: (u) => u.facts?.varsity_sports?.display ?? u.facts?.varsity_sports?.value,
          renderCell: (u, val) => (
            <span className="font-medium text-slate-900 dark:text-white">
              {u.facts?.varsity_sports?.display || (val != null ? `${val} sports` : 'Not reported')}
            </span>
          )
        }
      ]
    },
    {
      title: 'Safety & Classification',
      rows: [
        {
          label: 'Campus Area Safety',
          section: 'Safety & Classification',
          getValue: (u) => u.facts?.crime_rate?.display ?? u.facts?.crime_rate?.level,
          renderCell: (u, val) => {
            const level = u.facts?.crime_rate?.level?.toLowerCase();
            const isLow = level === 'low' || level === 'very low';
            return (
              <div className="flex items-center gap-1.5">
                {isLow ? (
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" aria-hidden="true" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" aria-hidden="true" />
                )}
                <span className="font-medium text-slate-900 dark:text-white">
                  {u.facts?.crime_rate?.display || val || 'Not reported'}
                </span>
              </div>
            );
          }
        },
        {
          label: 'Classification',
          section: 'Safety & Classification',
          getValue: (u) => u.facts?.school_classification ?? u.university_type,
          renderCell: (u, val) => (
            <span className="font-medium text-slate-900 dark:text-white">
              {val || (u.university_type === 'public' ? 'Public University' : 'Private University')}
            </span>
          )
        },
        {
          label: 'Accreditation',
          section: 'Safety & Accreditation',
          getValue: (u) => u.facts?.accreditation_status ?? u.facts?.accreditor,
          renderCell: (u, val) => (
            <span className="font-medium text-slate-900 dark:text-white">
              {val || 'Not reported'}
            </span>
          )
        }
      ]
    }
  ];

  // Helper to determine lowest value for numeric comparison
  const findLowestIdForRow = (row: RowConfig): string | null => {
    if (!row.isLowestCandidate || !row.lowestValueKey || institutions.length < 2) return null;
    let minVal = Number.POSITIVE_INFINITY;
    let minId: string | null = null;
    let countValues = 0;

    institutions.forEach(inst => {
      const num = row.lowestValueKey!(inst);
      if (num != null && !isNaN(num) && num > 0) {
        countValues++;
        if (num < minVal) {
          minVal = num;
          minId = inst.id;
        }
      }
    });

    return countValues >= 2 ? minId : null;
  };

  // Check if a row has differences among compared institutions
  const hasRowDifferences = (row: RowConfig): boolean => {
    if (institutions.length < 2) return true;
    const values = institutions.map(u => String(row.getValue(u) ?? ''));
    return new Set(values).size > 1;
  };

  // Filter sections and rows based on availability and "showDiffsOnly"
  const visibleSections = useMemo(() => {
    return ROW_SECTIONS.map(section => {
      const filteredRows = section.rows.filter(row => {
        // Skip row if every institution has no data
        const hasAnyData = institutions.some(u => {
          const v = row.getValue(u);
          return v !== null && v !== undefined && v !== '';
        });
        if (!hasAnyData) return false;

        // If show differences only, hide rows where all values match
        if (showDiffsOnly && !hasRowDifferences(row)) return false;

        return true;
      });

      return {
        ...section,
        rows: filteredRows
      };
    }).filter(sec => sec.rows.length > 0);
  }, [institutions, showDiffsOnly]);

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 pt-24 pb-20 transition-colors">
      <Helmet>
        <title>Compare Institutions | CampusArge</title>
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://campusarge.com/compare" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 pt-4">
          <ol className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            <li>
              <Link to="/" className="hover:text-navy dark:hover:text-gold transition-colors">Home</Link>
            </li>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <li>
              <Link to="/institutions" className="hover:text-navy dark:hover:text-gold transition-colors">Institutions</Link>
            </li>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <li className="font-semibold text-slate-900 dark:text-white" aria-current="page">
              Compare
            </li>
          </ol>
        </nav>

        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200 dark:border-slate-800 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-light text-navy text-xs font-semibold uppercase tracking-wider mb-3">
              <Scale className="w-3.5 h-3.5" />
              <span>Side-by-Side Analysis</span>
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
              Compare Institutions
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 max-w-xl">
              Evaluate tuition costs, academic breadth, ratios, housing, and campus environment across up to 4 institutions.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Copy shareable link */}
            <button
              type="button"
              onClick={handleCopyLink}
              disabled={institutions.length === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:border-navy hover:text-navy transition-colors shadow-sm disabled:opacity-50"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 dark:text-emerald-400">Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Copy Link</span>
                </>
              )}
            </button>

            {/* Add Institution Combobox (up to 4 total) */}
            {activeIds.length < 4 && (
              <div className="relative" ref={comboboxRef}>
                <button
                  type="button"
                  onClick={() => setComboboxOpen(!comboboxOpen)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-navy hover:bg-navy-dark text-white text-xs sm:text-sm font-semibold transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Institution</span>
                </button>

                {comboboxOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-3 z-50 animate-fade-in">
                    <div className="relative mb-2">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        autoFocus
                        value={comboboxSearch}
                        onChange={(e) => setComboboxSearch(e.target.value)}
                        placeholder="Search institution name..."
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy"
                      />
                    </div>

                    <div className="max-h-56 overflow-y-auto space-y-1">
                      {comboboxResults.length > 0 ? (
                        comboboxResults.map(u => (
                          <button
                            key={u.id}
                            type="button"
                            onClick={() => handleSelectFromCombobox(u.id)}
                            className="w-full text-left p-2 rounded-lg hover:bg-navy-light/60 transition-colors flex items-center justify-between group"
                          >
                            <div className="truncate pr-2">
                              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate group-hover:text-navy">
                                {u.name}
                              </p>
                              <p className="text-[10px] text-slate-500 truncate">{u.city}, {u.country}</p>
                            </div>
                            <Plus className="w-3.5 h-3.5 text-navy flex-shrink-0" />
                          </button>
                        ))
                      ) : comboboxSearch.trim() ? (
                        <p className="text-xs text-slate-500 text-center py-4">No matching institutions found</p>
                      ) : (
                        <p className="text-xs text-slate-400 text-center py-4">Type to search 426+ universities...</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Clear All */}
            {activeIds.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  clearAll();
                  setSearchParams({});
                }}
                className="px-3 py-2 text-xs sm:text-sm font-semibold text-rose-600 hover:text-rose-700 hover:underline"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Empty State: fewer than 2 valid institutions */}
        {institutions.length < 2 && !loading && (
          <div className="bg-white dark:bg-slate-900 rounded-[20px] border border-[#E5E9EF] dark:border-slate-800 p-12 sm:p-16 text-center max-w-xl mx-auto my-12 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-gold/15 flex items-center justify-center mx-auto mb-4">
              <Scale className="w-8 h-8 text-gold" />
            </div>
            <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white mb-2">
              Pick at least 2 institutions to compare
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
              Select up to 4 colleges or universities from the directory to view side-by-side metrics on cost, programs, ratios, and campus life.
            </p>

            {institutions.length === 1 && (
              <div className="mb-6 inline-flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left">
                <InstitutionLogo id={institutions[0].id} name={institutions[0].name} logoUrl={institutions[0].logo_url} size="compare" />
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">{institutions[0].name}</p>
                  <p className="text-[11px] text-slate-500">1 of 4 selected — add at least 1 more</p>
                </div>
              </div>
            )}

            <div>
              <Link
                to="/institutions"
                className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold"
              >
                Browse Institutions
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="bg-white dark:bg-slate-900 rounded-[20px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-48 bg-slate-100 dark:bg-slate-800/60 rounded-xl" />
              ))}
            </div>
            <div className="h-64 bg-slate-100 dark:bg-slate-800/40 rounded-xl" />
          </div>
        )}

        {/* Comparison Table View */}
        {institutions.length >= 2 && !loading && (
          <div className="space-y-6">
            {/* Table controls row */}
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-slate-500 font-medium">
                Comparing <strong className="text-navy dark:text-white">{institutions.length}</strong> of 4 institutions
              </span>

              <label className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showDiffsOnly}
                  onChange={(e) => setShowDiffsOnly(e.target.checked)}
                  className="rounded text-navy focus:ring-navy w-4 h-4"
                />
                <span>Show differences only</span>
              </label>
            </div>

            {/* Responsive Table Container with Sticky First Column */}
            <div className="bg-white dark:bg-slate-900 rounded-[20px] border border-[#E5E9EF] dark:border-slate-800 shadow-[0_4px_20px_rgba(16,42,67,0.06)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[760px]">
                  {/* Table Header: Institution Cards */}
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50">
                      <th className="p-6 w-64 min-w-[220px] sticky left-0 bg-slate-50/95 dark:bg-slate-800/95 backdrop-blur-sm z-20 border-r border-slate-200 dark:border-slate-800 align-top">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          Criteria
                        </span>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          Institution Comparison
                        </p>
                      </th>

                      {institutions.map((inst) => (
                        <th
                          key={inst.id}
                          className="p-6 min-w-[240px] w-1/4 align-top border-r border-slate-200/80 dark:border-slate-800/80 last:border-r-0 relative"
                        >
                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={() => handleRemove(inst.id)}
                            aria-label={`Remove ${inst.name} from comparison`}
                            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-400 flex items-center justify-center transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>

                          <div className="flex flex-col h-full justify-between pr-6">
                            <div>
                              {/* Logo */}
                              <div className="w-14 h-14 rounded-xl bg-white border border-slate-100 dark:border-slate-700 flex items-center justify-center p-1.5 mb-3 shadow-sm overflow-hidden">
                                <InstitutionLogo id={inst.id} name={inst.name} logoUrl={inst.logo_url} size="compare" />
                              </div>

                              {/* Classification badge */}
                              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-oxford dark:text-gold mb-1">
                                {inst.facts?.school_classification || (inst.university_type === 'public' ? 'Public' : 'Private')}
                              </span>

                              {/* Name */}
                              <h3 className="font-sans font-bold text-base text-slate-900 dark:text-white leading-snug line-clamp-2 mb-1">
                                <Link to={`/institutions/${inst.id}`} className="hover:text-navy transition-colors">
                                  {inst.name}
                                </Link>
                              </h3>

                              {/* Location */}
                              <p className="text-xs text-slate-500 flex items-center gap-1 mb-4">
                                <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                <span className="truncate">{inst.city}, {inst.country}</span>
                              </p>
                            </div>

                            {/* View details button */}
                            <Link
                              to={`/institutions/${inst.id}`}
                              className="w-full py-2 px-3 text-center rounded-[8px] bg-navy hover:bg-navy-dark text-white text-xs font-semibold transition-colors block shadow-sm mt-3"
                            >
                              View Details →
                            </Link>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  {/* Table Body grouped by sections */}
                  <tbody>
                    {visibleSections.map((section) => (
                      <tbody key={section.title} className="divide-y divide-slate-100 dark:divide-slate-800">
                        {/* Section Header Row */}
                        <tr className="bg-slate-100/70 dark:bg-slate-800/70">
                          <td
                            colSpan={institutions.length + 1}
                            className="py-3 px-6 text-xs font-bold uppercase tracking-wider text-navy dark:text-gold border-t border-slate-200 dark:border-slate-700"
                          >
                            {section.title}
                          </td>
                        </tr>

                        {/* Data Rows */}
                        {section.rows.map((row) => {
                          const lowestId = findLowestIdForRow(row);

                          return (
                            <tr key={row.label} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                              {/* Label Column (Sticky) */}
                              <td className="py-4 px-6 sticky left-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm z-10 border-r border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                                <div>
                                  <p>{row.label}</p>
                                  {row.caption && (
                                    <p className="text-[11px] font-normal text-slate-400 mt-0.5">{row.caption}</p>
                                  )}
                                </div>
                              </td>

                              {/* Value Cells */}
                              {institutions.map((inst) => {
                                const val = row.getValue(inst);
                                const isLowest = lowestId === inst.id;

                                return (
                                  <td
                                    key={inst.id}
                                    className="py-4 px-6 text-xs sm:text-sm border-r border-slate-100 dark:border-slate-800 last:border-r-0 align-middle"
                                  >
                                    {row.renderCell ? (
                                      row.renderCell(inst, val, isLowest)
                                    ) : (
                                      <span className="font-medium text-slate-900 dark:text-white">
                                        {val !== null && val !== undefined ? String(val) : (
                                          <span className="text-slate-400 font-normal italic">Not reported</span>
                                        )}
                                      </span>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Note below table */}
              <div className="p-4 sm:p-6 bg-slate-50/70 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 leading-relaxed">
                <span className="font-semibold text-navy dark:text-gold">* Note: </span>
                A small <span className="text-gold font-bold">Lowest</span> tag highlights the lowest numerical value for Cost of Attendance, student-to-faculty ratios, and housing costs. Lower is not always better and depends on your personal financial priorities and academic objectives.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

