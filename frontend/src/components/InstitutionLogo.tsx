import { useState } from 'react';
import logoManifest from '@/lib/logoManifest.json';

export interface InstitutionLogoProps {
  id: string | number;
  name: string;
  logoUrl?: string | null;
  size?: 'card' | 'compare' | 'tray' | 'header';
  className?: string;
  alt?: string;
}

interface ManifestEntry {
  id: string;
  name: string;
  path: string | null;
  tier?: string;
  width?: number;
  height?: number;
  bg?: 'light' | 'dark';
}

const manifest = logoManifest as Record<string, ManifestEntry>;

export function InstitutionLogo({
  id,
  name,
  logoUrl,
  size = 'card',
  className = '',
  alt
}: InstitutionLogoProps) {
  const [hasError, setHasError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const entry = manifest[String(id)];
  const src = !hasError ? (entry?.path || logoUrl || `/logos/${id}.webp`) : null;

  // Clean initials (2-3 letters)
  const initials = name
    .replace(/\(.*?\)/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map(w => w[0]?.toUpperCase())
    .join('') || 'CA';

  const logoAlt = alt || `${name} logo`;

  // Fallback branded view
  if (!src || hasError) {
    if (size === 'tray') {
      return (
        <div
          className={`w-7 h-7 rounded bg-navy text-gold flex items-center justify-center font-display font-bold text-xs select-none border border-gold/20 flex-shrink-0 ${className}`}
          aria-label={logoAlt}
        >
          {initials.slice(0, 2)}
        </div>
      );
    }
    if (size === 'compare') {
      return (
        <div
          className={`w-14 h-14 rounded-xl bg-navy text-gold flex items-center justify-center font-display font-bold text-base select-none border border-gold/20 flex-shrink-0 shadow-sm ${className}`}
          aria-label={logoAlt}
        >
          {initials.slice(0, 2)}
        </div>
      );
    }
    if (size === 'header') {
      return (
        <div
          className={`w-20 h-20 rounded-2xl bg-navy text-gold flex items-center justify-center font-display font-bold text-2xl select-none border border-gold/20 flex-shrink-0 shadow-md ${className}`}
          aria-label={logoAlt}
        >
          {initials.slice(0, 3)}
        </div>
      );
    }

    // Card fallback: full 16:9 branded panel
    return (
      <div
        className={`w-full h-full aspect-video flex flex-col items-center justify-center bg-gradient-to-br from-[#FBF6EC] via-white to-[#F1F5F9] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-b border-[#EEF1F5] dark:border-slate-800 p-4 select-none ${className}`}
        aria-label={logoAlt}
      >
        <div className="w-14 h-14 rounded-full bg-navy text-gold flex items-center justify-center font-display font-bold text-xl shadow-md border border-gold/30 mb-1.5">
          {initials}
        </div>
        <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 line-clamp-1 text-center max-w-[85%]">
          {name}
        </span>
      </div>
    );
  }

  // Sizing variants
  if (size === 'tray') {
    return (
      <img
        src={src}
        alt={logoAlt}
        width={28}
        height={28}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        className={`w-7 h-7 max-w-7 max-h-7 object-contain ${className}`}
        onError={() => setHasError(true)}
      />
    );
  }

  if (size === 'compare') {
    return (
      <img
        src={src}
        alt={logoAlt}
        width={56}
        height={56}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        className={`w-14 h-14 max-w-14 max-h-14 object-contain ${className}`}
        onError={() => setHasError(true)}
      />
    );
  }

  if (size === 'header') {
    return (
      <img
        src={src}
        alt={logoAlt}
        width={80}
        height={80}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        className={`w-20 h-20 max-w-20 max-h-20 object-contain ${className}`}
        onError={() => setHasError(true)}
      />
    );
  }

  // Card default: 16:9 full-stretch panel with skeleton shimmer
  return (
    <div className={`relative w-full aspect-video bg-white dark:bg-slate-900 overflow-hidden flex items-center justify-center p-2 sm:p-2.5 ${className}`}>
      {/* Skeleton Shimmer */}
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-100 via-slate-200/80 to-slate-100 dark:from-slate-800 dark:via-slate-700/80 dark:to-slate-800 animate-pulse" />
      )}
      <img
        src={src}
        alt={logoAlt}
        width={640}
        height={360}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-contain object-center transition-all duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        } group-hover:scale-[1.03]`}
      />
    </div>
  );
}

export default InstitutionLogo;
