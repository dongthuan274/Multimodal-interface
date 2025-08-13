
import React from 'react';
import { ResultItem, SearchSettings } from '../utils/types';
import { ResultCard } from './ResultCard';

interface ResultsGridProps {
  results: ResultItem[];
  isLoading: boolean;
  resultsPerRow: SearchSettings['resultsPerRow'];
  onViewResult: (result: ResultItem, currentTime: number) => void;
}

export const ResultsGrid: React.FC<ResultsGridProps> = ({ results, isLoading, resultsPerRow, onViewResult }) => {

  if (isLoading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-400"></div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex-grow flex items-center justify-center text-slate-500">
        <p>No results found. Try adjusting your search.</p>
      </div>
    );
  }

  const gridStyle: React.CSSProperties = {
    gridTemplateColumns:
      resultsPerRow === 'auto-fit'
        ? 'repeat(auto-fit, minmax(280px, 1fr))'
        : `repeat(${resultsPerRow}, minmax(280px, 1fr))`,
  };

  return (
    <div className="grid gap-4 lg:gap-6" style={gridStyle}>
      {results.map(result => (
        <ResultCard
          key={result.id}
          result={result}
          onViewResult={onViewResult}
        />
      ))}
    </div>
  );
};
