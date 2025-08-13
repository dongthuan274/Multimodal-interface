
import React, { useCallback, useState } from 'react';
import { Tab, ResultItem, SearchSettings } from '../utils/types';
import { SettingsPanel } from './SettingsPanel';
import { ResultsGrid } from './ResultsGrid';
import { fetchSearchResults } from '../utils/api';
import { SearchIcon } from './icons/SearchIcon';
import { UploadIcon } from './icons/UploadIcon';
import { XIcon } from './icons/XIcon';
import { SettingsIcon } from './icons/SettingsIcon';

interface TabContentProps {
  tab: Tab;
  onUpdateTab: (updates: Partial<Tab>) => void;
  onViewResult: (result: ResultItem, currentTime: number) => void;
}

export const TabContent: React.FC<TabContentProps> = ({ tab, onUpdateTab, onViewResult }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const handleSettingsChange = useCallback((newSettings: SearchSettings) => {
    onUpdateTab({ settings: newSettings });
  }, [onUpdateTab]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateTab({ query: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateTab({ file, filePreview: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    onUpdateTab({ file: undefined, filePreview: undefined });
  };

  const handleSearch = async () => {
    if (!tab.query && !tab.file) {
      // Maybe show a gentle notification
      return;
    }
    onUpdateTab({ isLoading: true, results: [] });

    // On mobile, hide settings panel to show results after search
    if (window.innerWidth < 1024) { // lg breakpoint
      setIsSettingsOpen(false);
    }
    
    try {
      // TODO: Replace with actual backend API call
      // /api/search with query, file, and settings
      const results: ResultItem[] = await fetchSearchResults(tab.query, { ...tab.settings, file: tab.file });
      onUpdateTab({ results });
    } catch (error) {
      console.error("Search failed:", error);
      // TODO: Show user-friendly error message
    } finally {
      onUpdateTab({ isLoading: false });
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Settings Panel for DESKTOP */}
      <div className="hidden lg:block w-72 flex-shrink-0">
        <SettingsPanel
          settings={tab.settings}
          onSettingsChange={handleSettingsChange}
        />
      </div>

      <div className="flex-grow flex flex-col p-4 lg:p-6 bg-slate-900 overflow-auto">
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <div className="relative flex-grow w-full">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={tab.query}
              onChange={handleQueryChange}
              onKeyDown={handleKeyDown}
              placeholder="Enter text query..."
              className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors"
              aria-label="Search query"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <label htmlFor={`file-upload-${tab.id}`} className="cursor-pointer p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-slate-300 flex items-center gap-2">
              <UploadIcon className="w-5 h-5" />
              <span className="hidden sm:inline">{tab.file ? "Change File" : "Upload File"}</span>
            </label>
            <input id={`file-upload-${tab.id}`} type="file" className="hidden" onChange={handleFileChange} />
            
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`p-3 rounded-lg transition-colors lg:hidden ${isSettingsOpen ? 'bg-sky-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'}`}
              aria-controls="mobile-settings-panel"
              aria-expanded={isSettingsOpen}
              aria-label="Toggle Search Settings"
            >
              <SettingsIcon className="w-5 h-5" />
            </button>

            <button
              onClick={handleSearch}
              disabled={tab.isLoading}
              className="px-6 py-3 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg font-semibold text-white transition-colors flex-shrink-0"
            >
              {tab.isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Settings Panel for MOBILE (collapsible) */}
        {isSettingsOpen && (
            <div id="mobile-settings-panel" className="lg:hidden mb-6">
                <SettingsPanel
                    settings={tab.settings}
                    onSettingsChange={handleSettingsChange}
                />
            </div>
        )}

        {/* Hide results and preview on mobile when settings are open */}
        <div className={isSettingsOpen ? 'hidden lg:block' : 'block'}>
            {tab.filePreview && (
              <div className="mb-4 relative w-40 h-24 bg-slate-800 rounded-lg p-1 border border-slate-700">
                <img src={tab.filePreview} alt="File preview" className="w-full h-full object-cover rounded" />
                <button onClick={handleRemoveFile} className="absolute -top-2 -right-2 bg-red-600 rounded-full p-0.5 text-white hover:bg-red-500">
                  <XIcon className="w-4 h-4"/>
                </button>
              </div>
            )}
            <ResultsGrid
              results={tab.results}
              isLoading={tab.isLoading}
              resultsPerRow={tab.settings.resultsPerRow}
              onViewResult={onViewResult}
            />
        </div>
      </div>
    </div>
  );
};
