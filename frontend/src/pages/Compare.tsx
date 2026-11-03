import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  X, Plus, Copy, Check, ChevronRight,
  MapPin, ShieldCheck, ShieldAlert,
  ArrowRight, Search, Scale, AlertCircle
} from 'lucide-react';
import { REAL_UNIVERSITIES, getUniversityById } from '@/lib/universitiesData';
import { useCompare } from '@/context/CompareContext';
import type { University } from '@/types';
import InstitutionLogo from '@/components/InstitutionLogo';

interface RowConfig {
  id: string;
  label: string;
  section: string;
  caption?: string;
  getValue: (u: University) => string | number | null | undefined;
  renderCell: (u: University, val: unknown, isLowest: boolean) => React.ReactNode;
  isLowestCandidate?: boolean;
  lowestValueKey?: (u: University) => number | null;
}

// Reusable Lowest badge
function LowestBadge() {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gold/15 text-gold border border-gold/30 flex-shrink-0">
      Lowest
    </span>
  );
}

// Comparison Rows Config (defined statically outside component)
const ROW_SECTIONS: { title: string; rows: RowConfig[] }[] = [
  {
    title: 'Cost & Affordability',
    rows: [
      {
        id: 'coa',
        label: 'Cost of Attendance',
        section: 'Cost & Affordability',
        getValue: (u) => u.cost_of_attendance,
        isLowestCandidate: true,
        lowestValueKey: (u) => (u.cost_of_attendance && u.cost_of_attendance > 0 ? u.cost_of_attendance : null),
        renderCell: (_u, val, isLowest) => (
          typeof val === 'number' && val > 0 ? (
            <div className="flex items-center flex-wrap gap-1.5">
              <span className="font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                ${val.toLocaleString()}/yr
              </span>
              {isLowest && <LowestBadge />}
            </div>
          ) : (
            <span className="text-slate-400 font-normal italic">Not reported</span>
          )
        )
      },
      {
        id: 'col_index',
        label: 'Cost of Living Index',
        section: 'Cost & Affordability',
        caption: '100 = U.S. National Average',
        getValue: (u) => u.facts?.cost_of_living_index ?? u.facts?.cost_of_living?.value,
        isLowestCandidate: true,
        lowestValueKey: (u) => {
          const v = u.facts?.cost_of_living_index ?? u.facts?.cost_of_living?.value;
          return typeof v === 'number' && v > 0 ? v : null;
        },
        renderCell: (_u, val, isLowest) => (
          val != null ? (
            <div className="flex items-center flex-wrap gap-1.5">
              <span className="font-medium text-slate-900 dark:text-white whitespace-nowrap">
                {String(val)}
              </span>
              {isLowest && <LowestBadge />}
            </div>
          ) : (
            <span className="text-slate-400 font-normal italic">Not reported</span>
          )
        )
      },
      {
        id: 'apt_rent',
        label: 'Avg. Apartment Rent',
        section: 'Cost & Affordability',
        getValue: (u) => u.facts?.avg_apartment_rent?.value,
        isLowestCandidate: true,
        lowestValueKey: (u) => {
          const v = u.facts?.avg_apartment_rent?.value;
          return typeof v === 'number' && v > 0 ? v : null;
        },
        renderCell: (u, val, isLowest) => (
          typeof val === 'number' && val > 0 ? (
            <div className="flex items-center flex-wrap gap-1.5">
              <span className="font-medium text-slate-900 dark:text-white whitespace-nowrap">
                ${val.toLocaleString()}/mo
              </span>
              {isLowest && <LowestBadge />}
            </div>
          ) : u.facts?.avg_apartment_rent?.display ? (
            <span className="font-medium text-slate-900 dark:text-white">
              {u.facts.avg_apartment_rent.display}
            </span>
          ) : (
            <span className="text-slate-400 font-normal italic">Not reported</span>
          )
        )
      },
      {
        id: 'home_price',
        label: 'Avg. Home Price',
        section: 'Cost & Affordability',
        getValue: (u) => u.facts?.avg_home_price?.value,
        isLowestCandidate: true,
        lowestValueKey: (u) => {
          const v = u.facts?.avg_home_price?.value;
          return typeof v === 'number' && v > 0 ? v : null;
        },
        renderCell: (u, val, isLowest) => (
          typeof val === 'number' && val > 0 ? (
            <div className="flex items-center flex-wrap gap-1.5">
              <span className="font-medium text-slate-900 dark:text-white whitespace-nowrap">
                ${val.toLocaleString()}
              </span>
              {isLowest && <LowestBadge />}
            </div>
          ) : u.facts?.avg_home_price?.display ? (
            <span className="font-medium text-slate-900 dark:text-white">
              {u.facts.avg_home_price.display}
            </span>
          ) : (
            <span className="text-slate-400 font-normal italic">Not reported</span>
          )
        )
      }
    ]
  },
  {
    title: 'Academics & Faculty',
    rows: [
      {
        id: 'ratio',
        label: 'Student / Faculty Ratio',
        section: 'Academics & Faculty',
        getValue: (u) => u.facts?.student_faculty_ratio?.value,
        isLowestCandidate: true,
        lowestValueKey: (u) => {
          const v = u.facts?.student_faculty_ratio?.value;
          return typeof v === 'number' && v > 0 ? v : null;
        },
        renderCell: (u, val, isLowest) => (
          typeof val === 'number' && val > 0 ? (
            <div className="flex items-center flex-wrap gap-1.5">
              <span className="font-medium text-slate-900 dark:text-white whitespace-nowrap">
                {val}:1
              </span>
              {isLowest && <LowestBadge />}
            </div>
          ) : u.facts?.student_faculty_ratio?.display ? (
            <span className="font-medium text-slate-900 dark:text-white">
              {u.facts.student_faculty_ratio.display}
            </span>
          ) : (
            <span className="text-slate-400 font-normal italic">Not reported</span>
          )
        )
      },
      {
        id: 'undergrad_pop',
        label: 'Undergraduate Enrollment',
        section: 'Academics & Faculty',
        getValue: (u) => u.facts?.undergrad_population?.value,
        renderCell: (u, val) => (
          typeof val === 'number' && val > 0 ? (
            <span className="font-medium text-slate-900 dark:text-white">
              <span className="whitespace-nowrap">{val.toLocaleString()}</span>{' '}
              <span className="text-slate-500 dark:text-slate-400 text-xs font-normal">undergrads</span>
            </span>
          ) : u.facts?.undergrad_population?.display ? (
            <span className="font-medium text-slate-900 dark:text-white">
              {u.facts.undergrad_population.display}
            </span>
          ) : (
            <span className="text-slate-400 font-normal italic">Not reported</span>
          )
        )
      },
      {
        id: 'grad_pop',
        label: 'Graduate Enrollment',
        section: 'Academics & Faculty',
        getValue: (u) => u.facts?.graduate_population?.value,
        renderCell: (u, val) => {
          if (val === 0 || u.facts?.graduate_population?.display === '0 graduate students') {
            return (
              <span className="font-medium text-slate-900 dark:text-white">
                <span className="whitespace-nowrap">0</span>{' '}
                <span className="text-slate-500 dark:text-slate-400 text-xs font-normal">grad students</span>
              </span>
            );
          }
          if (typeof val === 'number' && val > 0) {
            return (
              <span className="font-medium text-slate-900 dark:text-white">
                <span className="whitespace-nowrap">{val.toLocaleString()}</span>{' '}
                <span className="text-slate-500 dark:text-slate-400 text-xs font-normal">grad students</span>
              </span>
            );
          }
          if (u.facts?.graduate_population?.display && u.facts.graduate_population.display !== 'N/A') {
            return (
              <span className="font-medium text-slate-900 dark:text-white">
                {u.facts.graduate_population.display}
              </span>
            );
          }
          return <span className="text-slate-400 font-normal italic">Not reported</span>;
        }
      },
      {
        id: 'programs_count',
        label: 'Listed Programs Count',
        section: 'Academics & Faculty',
        getValue: (u) => u.programs?.length,
        renderCell: (_u, val) => (
          typeof val === 'number' ? (
            <span className="font-semibold text-navy dark:text-gold whitespace-nowrap">
              {val} programs
            </span>
          ) : (
            <span className="text-slate-400 font-normal italic">Not reported</span>
          )
        )
      },
      {
        id: 'anchor_programs',
        label: 'Signature / Anchor Programs',
        section: 'Academics & Faculty',
        getValue: (u) => {
          const list = (u.facts?.anchor_programs && u.facts.anchor_programs.length > 0)
            ? u.facts.anchor_programs
            : (u.programs || []);
          return list.slice(0, 4).join(', ');
        },
        renderCell: (u) => {
          const rawList = (u.facts?.anchor_programs && u.facts.anchor_programs.length > 0)
            ? u.facts.anchor_programs
            : (u.programs || []);
          const cleanList = rawList.map(item => item.replace(/\s*\([^)]*\)/g, '').trim()).filter(Boolean);

          if (cleanList.length === 0) {
            return <span className="text-slate-400 font-normal italic">Not reported</span>;
          }

          const visible = cleanList.slice(0, 4);
          const remaining = cleanList.slice(4);

          return (
            <div className="flex flex-wrap gap-1.5 items-center w-full">
              {visible.map((item, idx) => (
                <span
                  key={idx}
                  title={item}
                  className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#FBF6EC] border border-[#EADFC8] text-[#8C6D3B] break-words"
                >
                  {item}
                </span>
              ))}
              {remaining.length > 0 && (
                <span
                  title={remaining.join(', ')}
                  className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex-shrink-0 cursor-default"
                >
                  +{remaining.length}
                </span>
              )}
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
        id: 'campus_size',
        label: 'Campus Size',
        section: 'Campus & Athletics',
        getValue: (u) => u.facts?.campus_acreage?.value,
        renderCell: (u, val) => (
          val != null ? (
            <span className="font-medium text-slate-900 dark:text-white whitespace-nowrap">
              {String(val)} acres
            </span>
          ) : u.facts?.campus_acreage?.display ? (
            <span className="font-medium text-slate-900 dark:text-white">
              {u.facts.campus_acreage.display}
            </span>
          ) : (
            <span className="text-slate-400 font-normal italic">Not reported</span>
          )
        )
      },
      {
        id: 'housing_beds',
        label: 'On-Campus Housing',
        section: 'Campus & Athletics',
        getValue: (u) => u.facts?.housing_capacity_beds?.value,
        renderCell: (u, val) => (
          typeof val === 'number' && val > 0 ? (
            <span className="font-medium text-slate-900 dark:text-white whitespace-nowrap">
              {val.toLocaleString()} beds
            </span>
          ) : u.facts?.housing_capacity_beds?.display && u.facts.housing_capacity_beds.display !== 'N/A' ? (
            <span className="font-medium text-slate-900 dark:text-white">
              {u.facts.housing_capacity_beds.display}
            </span>
          ) : (
            <span className="text-slate-400 font-normal italic">Not reported</span>
          )
        )
      },
      {
        id: 'athletic_conf',
        label: 'Athletic Conference',
        section: 'Campus & Athletics',
        getValue: (u) => u.facts?.athletic_conference,
        renderCell: (_u, val) => (
          val && val !== 'N/A' ? (
            <span className="font-medium text-slate-900 dark:text-white">
              {String(val)}
            </span>
          ) : (
            <span className="text-slate-400 font-normal italic">Not reported</span>
          )
        )
      },
      {
        id: 'varsity_sports',
        label: 'Varsity Sports',
        section: 'Campus & Athletics',
        getValue: (u) => u.facts?.varsity_sports?.value,
        renderCell: (u, val) => {
          if (val === 0 || u.facts?.varsity_sports?.display === 'None') {
            return <span className="font-medium text-slate-900 dark:text-white">None</span>;
          }
          if (typeof val === 'number' && val > 0) {
            return (
              <span className="font-medium text-slate-900 dark:text-white whitespace-nowrap">
                {val} sports
              </span>
            );
          }
          if (u.facts?.varsity_sports?.display && u.facts.varsity_sports.display !== 'N/A') {
            return (
              <span className="font-medium text-slate-900 dark:text-white">
                {u.facts.varsity_sports.display}
              </span>
            );
          }
          return <span className="text-slate-400 font-normal italic">Not reported</span>;
        }
      }
    ]
  },
  {
    title: 'Safety & Classification',
    rows: [
      {
        id: 'safety',
        label: 'Campus Area Safety',
        section: 'Safety & Classification',
        getValue: (u) => u.facts?.crime_rate?.display ?? u.facts?.crime_rate?.level,
        renderCell: (u, val) => {
          const level = u.facts?.crime_rate?.level?.toLowerCase() || '';
          const text = u.facts?.crime_rate?.display || (typeof val === 'string' ? val : '');
          if (!text || text === 'N/A') {
            return <span className="text-slate-400 font-normal italic">Not reported</span>;
          }

          const isLow = level === 'low' || level === 'very low' || text.toLowerCase().includes('lower');
          const isMedium = level === 'medium' || level === 'moderate';

          return (
            <div className="flex items-start gap-1.5 text-xs sm:text-sm">
              {isLow ? (
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              ) : isMedium ? (
                <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              )}
              <span className="font-medium text-slate-900 dark:text-white leading-snug">
                {text}
              </span>
            </div>
          );
        }
      },
      {
        id: 'classification',
        label: 'Classification',
        section: 'Safety & Classification',
        getValue: (u) => u.facts?.school_classification ?? (u.university_type === 'public' ? 'Public' : 'Private'),
        renderCell: (u, val) => (
          <span className="font-medium text-slate-900 dark:text-white">
            {typeof val === 'string' && val ? val : (u.university_type === 'public' ? 'Public' : 'Private')}
          </span>
        )
      },
      {
        id: 'accreditation',
        label: 'Accreditation',
        section: 'Safety & Classification',
        getValue: (u) => u.facts?.accreditation_status ?? u.facts?.accreditor,
        renderCell: (_u, val) => (
          val && val !== 'N/A' ? (
            <span className="font-medium text-slate-900 dark:text-white break-words">
              {String(val)}
            </span>
          ) : (
            <span className="text-slate-400 font-normal italic">Not reported</span>
          )
        )
      }
    ]
  }
];

// Normalized value comparison for "Show differences only"
function normalizeValueForDiff(val: unknown): string {
  if (val === null || val === undefined || val === '') return '__EMPTY__';
  const s = String(val).trim().toLowerCase();
  if (s === 'n/a' || s === 'not reported' || s === 'none' || s === '—') return '__EMPTY__';
  return s;
}

export default function Compare() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { selectedIds, removeInstitution, addInstitution, clearAll } = useCompare();

  const [copied, setCopied] = useState(false);
  const [invalidNotice, setInvalidNotice] = useState<string | null>(null);

  // Read differences toggle from URL (?diff=1)
  const diffFromUrl = searchParams.get('diff') === '1';
  const [showDiffsOnly, setShowDiffsOnly] = useState(diffFromUrl);

  // Sync state if URL changes externally
  useEffect(() => {
    setShowDiffsOnly(searchParams.get('diff') === '1');
  }, [searchParams]);

  // Selected IDs from URL ?ids=, fallback to context
  const activeIds = useMemo(() => {
    const fromUrl = searchParams.get('ids');
    if (fromUrl) {
      const parsed = fromUrl.split(',').map(s => s.trim()).filter(Boolean);
      const valid = parsed.filter(id => REAL_UNIVERSITIES.some(u => u.id === id));
      if (parsed.length > valid.length) {
        setInvalidNotice(`${parsed.length - valid.length} unrecognized institution ID(s) were excluded.`);
      }
      return valid.slice(0, 4);
    }
    return selectedIds.slice(0, 4);
  }, [searchParams, selectedIds]);

  const [institutions, setInstitutions] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);

  // Add institution combobox
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [comboboxSearch, setComboboxSearch] = useState('');
  const comboboxRef = useRef<HTMLDivElement>(null);

  // Sync URL when activeIds change, preserving ?diff=1
  useEffect(() => {
    setSearchParams(prev => {
      const next = new URLSearchParams();
      if (activeIds.length > 0) {
        next.set('ids', activeIds.join(','));
      }
      if (prev.get('diff') === '1') {
        next.set('diff', '1');
      }
      return next;
    }, { replace: true });
  }, [activeIds, setSearchParams]);

  // Load rich university records dynamically
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

  const handleToggleDiff = (checked: boolean) => {
    setShowDiffsOnly(checked);
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (checked) {
        next.set('diff', '1');
      } else {
        next.delete('diff');
      }
      return next;
    }, { replace: true });
  };

  const handleRemove = (id: string) => {
    removeInstitution(id);
    const remaining = activeIds.filter(i => i !== id);
    setSearchParams(prev => {
      const next = new URLSearchParams();
      if (remaining.length > 0) {
        next.set('ids', remaining.join(','));
      }
      if (prev.get('diff') === '1') {
        next.set('diff', '1');
      }
      return next;
    });
  };

  const handleSelectFromCombobox = (id: string) => {
    addInstitution(id);
    if (!activeIds.includes(id) && activeIds.length < 4) {
      const updated = [...activeIds, id];
      setSearchParams(prev => {
        const next = new URLSearchParams();
        next.set('ids', updated.join(','));
        if (prev.get('diff') === '1') {
          next.set('diff', '1');
        }
        return next;
      });
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

  // Helper to determine lowest value for numeric comparison
  // Must be strictly from numeric values; requires at least 2 comparable values; no lowest on ties
  const findLowestIdForRow = useCallback((row: RowConfig): string | null => {
    if (!row.isLowestCandidate || !row.lowestValueKey || institutions.length < 2) return null;

    const validCandidates: { id: string; num: number }[] = [];

    for (const inst of institutions) {
      const num = row.lowestValueKey(inst);
      if (typeof num === 'number' && !isNaN(num) && num > 0) {
        validCandidates.push({ id: inst.id, num });
      }
    }

    if (validCandidates.length < 2) return null;

    validCandidates.sort((a, b) => a.num - b.num);
    const minVal = validCandidates[0].num;

    // Tie check
    if (validCandidates[1].num === minVal) {
      return null;
    }

    return validCandidates[0].id;
  }, [institutions]);

  const hasRowDifferences = useCallback((row: RowConfig): boolean => {
    if (institutions.length < 2) return true;
    const values = institutions.map(u => normalizeValueForDiff(row.getValue(u)));
    return new Set(values).size > 1;
  }, [institutions]);

  const totalCriteriaCount = useMemo(() => {
    return ROW_SECTIONS.reduce((acc, sec) => acc + sec.rows.length, 0);
  }, []);

  const visibleSections = useMemo(() => {
    return ROW_SECTIONS.map(section => {
      const filteredRows = section.rows.filter(row => {
        const hasAnyData = institutions.some(u => {
          const v = row.getValue(u);
          return v !== null && v !== undefined && v !== '' && v !== 'N/A';
        });
        if (!hasAnyData) return false;

        if (showDiffsOnly && !hasRowDifferences(row)) return false;

        return true;
      });

      return {
        ...section,
        rows: filteredRows
      };
    }).filter(sec => sec.rows.length > 0);
  }, [institutions, showDiffsOnly, hasRowDifferences]);

  const visibleCriteriaCount = useMemo(() => {
    return visibleSections.reduce((acc, sec) => acc + sec.rows.length, 0);
  }, [visibleSections]);

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 pt-24 pb-36 sm:pb-28 transition-colors">
      <Helmet>
        <title>Compare Institutions | CampusArge</title>
        <meta name="description" content="Side-by-side comparison of universities and colleges across tuition costs, student-to-faculty ratios, living expenses, housing, and degree offerings." />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://campusarge.com/compare" />
      </Helmet>

      <div className="inst-container">
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

        {/* Invalid ID Notification if present */}
        {invalidNotice && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs sm:text-sm flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>{invalidNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setInvalidNotice(null)}
              className="text-amber-600 hover:text-amber-900 dark:hover:text-amber-100"
              aria-label="Dismiss notice"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Header Block & Toolbar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800 mb-8">
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
          <div className="compare-toolbar flex flex-wrap items-center gap-3">
            {/* Copy shareable link with inline toast */}
            <button
              type="button"
              onClick={handleCopyLink}
              disabled={institutions.length === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:border-navy hover:text-navy transition-colors shadow-sm disabled:opacity-50"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Link Copied!</span>
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
                  className="compare-add-btn inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-navy hover:bg-navy-dark text-white text-xs sm:text-sm font-semibold transition-colors shadow-sm"
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
                        placeholder="Search university name..."
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
                            className="w-full text-left p-2 rounded-lg hover:bg-navy-light/60 dark:hover:bg-slate-800 transition-colors flex items-center justify-between group"
                          >
                            <div className="truncate pr-2">
                              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate group-hover:text-navy dark:group-hover:text-gold">
                                {u.name}
                              </p>
                              <p className="text-[10px] text-slate-500 truncate">{u.city}, {u.country}</p>
                            </div>
                            <Plus className="w-3.5 h-3.5 text-navy dark:text-gold flex-shrink-0" />
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

        {/* Empty State: 0 institutions */}
        {institutions.length === 0 && !loading && (
          <div className="bg-white dark:bg-slate-900 rounded-[20px] border border-[#E5E9EF] dark:border-slate-800 p-12 sm:p-16 text-center max-w-xl mx-auto my-12 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-gold/15 flex items-center justify-center mx-auto mb-4">
              <Scale className="w-8 h-8 text-gold" />
            </div>
            <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white mb-2">
              No institutions selected for comparison
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
              Select up to 4 colleges or universities from the directory to view side-by-side metrics on cost, programs, ratios, and campus life.
            </p>
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

        {/* State: 1 institution selected */}
        {institutions.length === 1 && !loading && (
          <div className="bg-white dark:bg-slate-900 rounded-[20px] border border-[#E5E9EF] dark:border-slate-800 p-8 sm:p-12 text-center max-w-xl mx-auto my-12 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-gold/15 flex items-center justify-center mx-auto mb-4">
              <Scale className="w-7 h-7 text-gold" />
            </div>
            <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white mb-2">
              Add at least one more institution
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
              You need at least 2 institutions to see side-by-side comparison metrics.
            </p>

            <div className="mb-6 inline-flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left max-w-sm w-full">
              <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 dark:border-slate-700 flex items-center justify-center p-1 flex-shrink-0">
                <InstitutionLogo id={institutions[0].id} name={institutions[0].name} logoUrl={institutions[0].logo_url} size="compare" />
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{institutions[0].name}</p>
                <p className="text-[11px] text-slate-500 truncate">{institutions[0].city}, {institutions[0].country}</p>
                <p className="text-[10px] text-oxford dark:text-gold font-semibold mt-0.5">1 of 4 selected</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/institutions"
                className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold"
              >
                Browse Directory
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="bg-white dark:bg-slate-900 rounded-[20px] p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm animate-pulse space-y-6">
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-44 bg-slate-100 dark:bg-slate-800/60 rounded-xl" />
              ))}
            </div>
            <div className="h-64 bg-slate-100 dark:bg-slate-800/40 rounded-xl" />
          </div>
        )}

        {/* Comparison Table View (>= 2 institutions) */}
        {institutions.length >= 2 && !loading && (
          <div className="space-y-4">
            {/* Horizontal scroll hint for tablet/mobile */}
            <div className="lg:hidden flex items-center justify-between text-xs text-slate-500 px-1">
              <span>Swipe horizontally to compare all institutions →</span>
              <span>{institutions.length} institutions</span>
            </div>

            {/* Card Container holding table */}
            <div className="bg-white dark:bg-slate-900 rounded-[20px] border border-[#E5E9EF] dark:border-slate-800 shadow-[0_4px_20px_rgba(16,42,67,0.06)] overflow-hidden">
              <div className="compare-scroll-container">
                <table
                  role="table"
                  aria-label="Institution comparison"
                  data-cols={institutions.length}
                  className="compare-grid-table"
                  style={{ '--col-count': institutions.length } as React.CSSProperties}
                >
                  {/* Table Header: Column Headers */}
                  <thead>
                    <tr role="row">
                      {/* Top-left Criteria cell with embedded toggle */}
                      <th
                        scope="col"
                        className="compare-cell compare-header-cell compare-row-header flex flex-col justify-between items-start"
                      >
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                            Criteria
                          </span>
                          <span className="text-sm font-bold text-slate-900 dark:text-white block mt-0.5">
                            Comparison
                          </span>
                        </div>

                        {/* Differences toggle switch */}
                        <div className="w-full pt-3 mt-2 border-t border-slate-100 dark:border-slate-800">
                          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              id="diff-toggle"
                              checked={showDiffsOnly}
                              onChange={(e) => handleToggleDiff(e.target.checked)}
                              className="rounded text-navy focus:ring-navy w-4 h-4 cursor-pointer"
                            />
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                              Differences only
                            </span>
                          </label>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Showing {visibleCriteriaCount} of {totalCriteriaCount} criteria
                          </p>
                        </div>
                      </th>

                      {/* Institution Header Cells */}
                      {institutions.map((inst) => (
                        <th
                          key={inst.id}
                          scope="col"
                          className="compare-cell compare-header-cell flex flex-col justify-between items-stretch relative min-h-[160px]"
                        >
                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={() => handleRemove(inst.id)}
                            aria-label={`Remove ${inst.name} from comparison`}
                            className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-400 dark:bg-slate-800 dark:hover:bg-rose-950/60 dark:hover:text-rose-400 flex items-center justify-center transition-colors shadow-sm z-10"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>

                          {/* Institution Info */}
                          <div className="flex flex-col items-start w-full pr-6">
                            <div className="flex items-center gap-2.5 w-full mb-2">
                              {/* Logo tile 56x56 */}
                              <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 dark:border-slate-700 flex items-center justify-center p-1.5 shadow-sm overflow-hidden flex-shrink-0">
                                <InstitutionLogo id={inst.id} name={inst.name} logoUrl={inst.logo_url} size="compare" />
                              </div>

                              <div className="min-w-0 flex-1">
                                <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-oxford dark:text-gold">
                                  {inst.facts?.school_classification || (inst.university_type === 'public' ? 'Public' : 'Private')}
                                </span>
                                <h2
                                  title={inst.name}
                                  className="font-sans font-bold text-sm text-slate-900 dark:text-white leading-snug line-clamp-2"
                                >
                                  {inst.name}
                                </h2>
                              </div>
                            </div>

                            {/* Location */}
                            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 w-full mb-2">
                              <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" aria-hidden="true" />
                              <span className="truncate">{inst.city}, {inst.country}</span>
                            </p>
                          </div>

                          {/* View details button pinned to bottom */}
                          <Link
                            to={`/institutions/${inst.id}`}
                            className="mt-auto w-full py-2 px-3 text-center rounded-lg bg-navy hover:bg-navy-dark text-white text-xs font-semibold transition-colors block shadow-sm"
                          >
                            View Details →
                          </Link>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  {/* Table Body: Sibling tbody elements for each section */}
                  {visibleSections.length > 0 ? (
                    visibleSections.map((section) => (
                      <tbody key={section.title}>
                        {/* Section Header Band */}
                        <tr role="row">
                          <th
                            scope="rowgroup"
                            colSpan={institutions.length + 1}
                            className="compare-section-band"
                          >
                            {section.title}
                          </th>
                        </tr>

                        {/* Data Rows */}
                        {section.rows.map((row) => {
                          const lowestId = findLowestIdForRow(row);

                          return (
                            <tr key={row.id} role="row">
                              {/* Label Column (Row Header, Sticky Left) */}
                              <th
                                scope="row"
                                className="compare-cell compare-row-header text-xs sm:text-sm text-slate-700 dark:text-slate-300"
                              >
                                <div>
                                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                                    {row.label}
                                  </p>
                                  {row.caption && (
                                    <p className="text-[11px] font-normal text-slate-400 mt-0.5">
                                      {row.caption}
                                    </p>
                                  )}
                                </div>
                              </th>

                              {/* Value Cells */}
                              {institutions.map((inst) => {
                                const val = row.getValue(inst);
                                const isLowest = lowestId === inst.id;

                                return (
                                  <td
                                    key={inst.id}
                                    role="cell"
                                    className="compare-cell text-xs sm:text-sm"
                                  >
                                    {row.renderCell(inst, val, isLowest)}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    ))
                  ) : (
                    /* Empty state when differences only filters out all rows */
                    <tbody>
                      <tr role="row">
                        <td
                          role="cell"
                          className="compare-cell py-12 text-center text-slate-500 col-span-full flex flex-col items-center justify-center"
                          style={{ gridColumn: '1 / -1' }}
                        >
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            All compared criteria are identical across the selected institutions.
                          </p>
                          <button
                            type="button"
                            onClick={() => handleToggleDiff(false)}
                            className="text-xs text-navy dark:text-gold hover:underline mt-2 font-medium"
                          >
                            Disable &ldquo;Differences only&rdquo; to view all criteria
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  )}
                </table>
              </div>

              {/* Footnote inside the card */}
              <div className="p-4 sm:p-5 bg-slate-50/70 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 leading-relaxed">
                <span className="font-semibold text-navy dark:text-gold">* Note: </span>
                A small <span className="text-gold font-bold">LOWEST</span> tag highlights the lowest numerical value for Cost of Attendance, student-to-faculty ratios, and living costs. Lower is not always better and depends on your personal financial priorities and academic objectives.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
