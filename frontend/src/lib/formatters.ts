/**
 * Shared formatting utilities with strict en-US locale enforcement.
 * Ensures consistent US currency ($850,000 not $8,50,000) and metric notation.
 */

const USD_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
});

const NUMBER_FORMATTER = new Intl.NumberFormat('en-US');

/**
 * Format a number as USD with whole dollar precision.
 * e.g. 850000 -> "$850,000"
 */
export function formatUSD(value: number | null | undefined): string | null {
  if (value == null || isNaN(value)) return null;
  return USD_FORMATTER.format(value);
}

/**
 * Format annual cost of attendance.
 * e.g. 13000 -> "$13,000/yr"
 */
export function formatCOA(value: number | null | undefined): string | null {
  if (value == null || isNaN(value) || value <= 0) return null;
  return `${USD_FORMATTER.format(value)}/yr`;
}

/**
 * Format monthly rent.
 * e.g. 2500 -> "$2,500/mo"
 */
export function formatRent(value: number | null | undefined): string | null {
  if (value == null || isNaN(value) || value <= 0) return null;
  return `${USD_FORMATTER.format(value)}/mo`;
}

/**
 * Format integer with en-US digit separators.
 * e.g. 42341 -> "42,341"
 */
export function formatNumber(value: number | null | undefined): string | null {
  if (value == null || isNaN(value)) return null;
  return NUMBER_FORMATTER.format(value);
}

/**
 * Format student-to-faculty ratio.
 * e.g. 2 -> "2:1"
 */
export function formatRatio(value: number | string | null | undefined): string | null {
  if (value == null || value === '' || value === 'N/A') return null;
  if (typeof value === 'number') return `${value}:1`;
  const clean = String(value).trim();
  if (clean.includes(':')) return clean;
  const parsed = Number(clean);
  if (!isNaN(parsed) && parsed > 0) return `${parsed}:1`;
  return clean;
}

