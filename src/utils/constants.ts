
import { Tab, SearchMethod, SearchSettings } from './types';

export const DEFAULT_SEARCH_SETTINGS: SearchSettings = {
  method: SearchMethod.FUSION,
  resultsPerRow: 'auto-fit',
  kValue: 100,
  ocr: false,
  filters: {
    date: false,
    relevance: true,
    similarity: false,
  },
};

export const createNewTab = (): Tab => ({
  id: `tab_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
  title: 'New Tab',
  settings: { ...DEFAULT_SEARCH_SETTINGS },
  results: [],
  query: '',
  isLoading: false,
});

export const SEARCH_METHODS: SearchMethod[] = Object.values(SearchMethod);
export const RESULTS_PER_ROW_OPTIONS: Array<SearchSettings['resultsPerRow']> = [3, 4, 5, 'auto-fit'];