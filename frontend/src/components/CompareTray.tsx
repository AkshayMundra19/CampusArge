import { useNavigate } from 'react-router-dom';
import { X, ArrowRight, Scale } from 'lucide-react';
import { useCompare } from '@/context/CompareContext';
import { REAL_UNIVERSITIES } from '@/lib/universitiesIndex';
import InstitutionLogo from './InstitutionLogo';

export default function CompareTray() {
  const { selectedIds, removeInstitution, clearAll, count } = useCompare();
  const navigate = useNavigate();

  if (count === 0) return null;

  const selectedUniversities = selectedIds
    .map(id => REAL_UNIVERSITIES.find(u => u.id === id))
    .filter(Boolean);

  const canCompare = count >= 2;

  const handleCompareClick = () => {
    if (canCompare) {
      navigate(`/compare?ids=${selectedIds.join(',')}`);
    }
  };

  return (
    <aside
      role="region"
      aria-label="Comparison tray"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_20px_rgba(16,42,67,0.1)] py-3 px-4 sm:px-6 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Selected Chips + Counter */}
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-hidden">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Scale className="w-4 h-4 text-gold" aria-hidden="true" />
            <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white whitespace-nowrap">
              {count} of 4 selected
            </span>
          </div>

          <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 hidden sm:block flex-shrink-0" />

          {/* Chips scroll horizontally on mobile */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
            {selectedUniversities.map((u) => {
              if (!u) return null;
              return (
                <div
                  key={u.id}
                  className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 flex-shrink-0 max-w-[180px] sm:max-w-[200px]"
                >
                  <InstitutionLogo id={u.id} name={u.name} logoUrl={u.logo_url} size="tray" />
                  <span className="truncate">{u.name}</span>
                  <button
                    type="button"
                    onClick={() => removeInstitution(u.id)}
                    aria-label={`Remove ${u.name} from comparison`}
                    className="w-4 h-4 rounded-full text-slate-400 hover:text-rose-600 hover:bg-slate-200 flex items-center justify-center transition-colors flex-shrink-0"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center justify-end gap-3 w-full sm:w-auto flex-shrink-0">
          <button
            type="button"
            onClick={clearAll}
            className="text-xs font-medium text-slate-500 hover:text-rose-600 transition-colors"
          >
            Clear all
          </button>

          <button
            type="button"
            onClick={handleCompareClick}
            disabled={!canCompare}
            className="btn-primary text-xs sm:text-sm py-2 px-5 rounded-[10px] flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            <span>Compare {count >= 2 && `(${count})`}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}

