export enum SearchMethod {
  SINGLE = 'Single',
  FUSION = 'Fusion',
  LOCAL = 'Local',
  GROUP = 'Group',
  HIERARCHY = 'Hierarchy',
}

export interface ResultItem {
  id: string;
  rank: number;
  type: 'image' | 'video';
  thumbnailUrl: string;
  fullUrl: string;
  videoPreviewUrl?: string;
  title: string;
  startTime?: number;
  endTime?: number;
  sourceVideoId?: string;
}

export interface SearchSettings {
  method: SearchMethod;
  resultsPerRow: 3 | 4 | 5 | 'auto-fit';
  kValue: number;
  ocr: boolean;
  filters: {
    date: boolean;
    relevance: boolean;
    similarity: boolean;
  };
}

export interface Tab {
  id: string;
  title: string;
  settings: SearchSettings;
  results: ResultItem[];
  query: string;
  file?: File;
  filePreview?: string;
  isLoading: boolean;
}