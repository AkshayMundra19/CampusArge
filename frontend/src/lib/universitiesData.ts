import type { University } from '@/types';
import { REAL_UNIVERSITIES } from './universitiesIndex';

export { REAL_UNIVERSITIES };

export function getUniversitySlug(u: { name: string; slug?: string }): string {
  if (u.slug) return u.slug;
  return u.name
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function matchUniversity(u: University, query: string): boolean {
  if (!query) return false;
  const q = query.trim().toLowerCase();
  const qSlug = q.replace(/_/g, '-');
  if (u.id.toLowerCase() === q) return true;
  if (u.slug && u.slug.toLowerCase() === qSlug) return true;
  if (getUniversitySlug(u) === qSlug) return true;
  return false;
}

// Cache for full data loaded dynamically on detail routes
let fullCache: University[] | null = null;

export async function getFullUniversities(): Promise<University[]> {
  if (fullCache) return fullCache;
  const mod = await import('./universitiesFull.json');
  fullCache = (mod.default || mod) as University[];
  return fullCache;
}

export function findSlimUniversity(idOrSlug: string): University | null {
  if (!idOrSlug) return null;
  return REAL_UNIVERSITIES.find(u => matchUniversity(u, idOrSlug)) || null;
}

export async function getUniversityById(idOrSlug: string): Promise<University | null> {
  const slim = findSlimUniversity(idOrSlug);
  
  try {
    const fullList = await getFullUniversities();
    const full = fullList.find(u => matchUniversity(u, idOrSlug));
    return full || slim;
  } catch (err) {
    console.error('Failed to load full university record:', err);
    return slim;
  }
}
