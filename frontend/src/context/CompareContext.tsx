import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { REAL_UNIVERSITIES } from '@/lib/universitiesIndex';

interface CompareContextType {
  selectedIds: string[];
  addInstitution: (id: string) => boolean;
  removeInstitution: (id: string) => void;
  toggleInstitution: (id: string) => void;
  clearAll: () => void;
  isSelected: (id: string) => boolean;
  canAdd: boolean;
  count: number;
}

const STORAGE_KEY = 'campusarge_compare_v1';
const MAX_COMPARE = 4;

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      // Validate that ids exist in the dataset
      const validIds = parsed
        .map(String)
        .filter(id => REAL_UNIVERSITIES.some(u => u.id === id))
        .slice(0, MAX_COMPARE);
      return validIds;
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedIds));
    } catch (err) {
      console.warn('Failed to save comparison to localStorage:', err);
    }
  }, [selectedIds]);

  const addInstitution = useCallback((id: string): boolean => {
    const sId = String(id);
    if (!REAL_UNIVERSITIES.some(u => u.id === sId)) return false;
    let added = false;
    setSelectedIds(prev => {
      if (prev.includes(sId) || prev.length >= MAX_COMPARE) return prev;
      added = true;
      return [...prev, sId];
    });
    return added;
  }, []);

  const removeInstitution = useCallback((id: string) => {
    const sId = String(id);
    setSelectedIds(prev => prev.filter(item => item !== sId));
  }, []);

  const toggleInstitution = useCallback((id: string) => {
    const sId = String(id);
    setSelectedIds(prev => {
      if (prev.includes(sId)) {
        return prev.filter(item => item !== sId);
      }
      if (prev.length >= MAX_COMPARE) {
        return prev;
      }
      if (!REAL_UNIVERSITIES.some(u => u.id === sId)) return prev;
      return [...prev, sId];
    });
  }, []);

  const clearAll = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const isSelected = useCallback((id: string) => {
    return selectedIds.includes(String(id));
  }, [selectedIds]);

  const value: CompareContextType = {
    selectedIds,
    addInstitution,
    removeInstitution,
    toggleInstitution,
    clearAll,
    isSelected,
    canAdd: selectedIds.length < MAX_COMPARE,
    count: selectedIds.length,
  };

  return (
    <CompareContext.Provider value={value}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}

