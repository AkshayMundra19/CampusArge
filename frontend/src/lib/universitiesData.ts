import type { University } from '@/types';
import { REAL_UNIVERSITIES } from './universitiesIndex';

export { REAL_UNIVERSITIES };

// Cache for full data loaded dynamically on detail routes
let fullCache: University[] | null = null;

export async function getFullUniversities(): Promise<University[]> {
  if (fullCache) return fullCache;
  const mod = await import('./universitiesFull.json');
  fullCache = (mod.default || mod) as University[];
  return fullCache;
}

export async function getUniversityById(id: string): Promise<University | null> {
  // First check slim index for instant availability
  const slim = REAL_UNIVERSITIES.find(u => u.id === id);
  if (!slim) return null;
  
  try {
    const fullList = await getFullUniversities();
    const full = fullList.find(u => u.id === id);
    return full || slim;
  } catch (err) {
    console.error('Failed to load full university record:', err);
    return slim;
  }
}
