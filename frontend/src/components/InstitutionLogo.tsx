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
  tier: 'A' | 'B' | 'C' | 'D';
  width: number;
  height: number;
  bg: 'light' | 'dark';
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

  const entry = manifest[String(id)];
  const src = !hasError ? (entry?.path || logoUrl) : null;
  const isDarkBg = entry?.bg === 'dark';

  // Compute initials for monogram fallback
  const initials = name
    .replace(/\(.*?\)/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase())
    .join('') || 'U';

  const logoAlt = alt || `${name} logo`;

  if (!src || hasError) {
    if (size === 'tray') {
      return (
        <div
          className={`w-7 h-7 rounded bg-navy text-gold flex items-center justify-center font-display font-bold text-xs select-none border border-gold/20 flex-shrink-0 ${className}`}
          aria-label={logoAlt}
        >
          {initials}
        </div>
      );
    }
    if (size === 'compare') {
      return (
        <div
          className={`w-14 h-14 rounded-xl bg-navy text-gold flex items-center justify-center font-display font-bold text-base select-none border border-gold/20 flex-shrink-0 shadow-sm ${className}`}
          aria-label={logoAlt}
        >
          {initials}
        </div>
      );
    }
    if (size === 'header') {
      return (
        <div
          className={`w-20 h-20 rounded-2xl bg-navy text-gold flex items-center justify-center font-display font-bold text-2xl select-none border border-gold/20 flex-shrink-0 shadow-md ${className}`}
          aria-label={logoAlt}
        >
          {initials}
        </div>
      );
    }
    // card default monogram
    return (
      <div
        className={`w-20 h-20 rounded-2xl bg-navy text-gold flex items-center justify-center font-display font-bold text-2xl select-none shadow-md border border-gold/30 ${className}`}
        aria-label={logoAlt}
      >
        {initials}
      </div>
    );
  }

  // Size configurations
  let sizeClasses = '';
  let containerClasses = '';

  switch (size) {
    case 'tray':
      sizeClasses = 'w-7 h-7 max-w-7 max-h-7 object-contain';
      break;
    case 'compare':
      sizeClasses = 'w-14 h-14 max-w-14 max-h-14 object-contain';
      containerClasses = isDarkBg ? 'bg-navy/90 p-1.5 rounded-lg' : '';
      break;
    case 'header':
      sizeClasses = 'w-20 h-20 max-w-20 max-h-20 object-contain';
      containerClasses = isDarkBg ? 'bg-navy/90 p-2.5 rounded-2xl shadow-sm' : '';
      break;
    case 'card':
    default:
      // In card stage: max height 120px (104px on mobile), max width 70%, sharp contain
      sizeClasses = 'max-h-[104px] sm:max-h-[120px] max-w-[70%] object-contain select-none transition-transform duration-300 group-hover:scale-105';
      containerClasses = isDarkBg ? 'bg-navy/90 p-3 rounded-2xl shadow-sm' : '';
      break;
  }

  return (
    <div className={`flex items-center justify-center ${containerClasses} ${className}`}>
      <img
        src={src}
        alt={logoAlt}
        loading="lazy"
        decoding="async"
        className={sizeClasses}
        onError={() => setHasError(true)}
      />
    </div>
  );
}

export default InstitutionLogo;
