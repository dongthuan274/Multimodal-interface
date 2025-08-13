
import React from 'react';
import { SearchSettings, SearchMethod } from '../utils/types';
import { SEARCH_METHODS, RESULTS_PER_ROW_OPTIONS } from '../utils/constants';

interface SettingsPanelProps {
  settings: SearchSettings;
  onSettingsChange: (newSettings: SearchSettings) => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">{title}</h3>
    <div className="space-y-3">{children}</div>
  </div>
);

const Toggle: React.FC<{ label: string; checked: boolean; onChange: (checked: boolean) => void }> = ({ label, checked, onChange }) => (
  <label className="flex items-center justify-between cursor-pointer">
    <span className="text-slate-200">{label}</span>
    <div className="relative">
      <input type="checkbox" className="sr-only" checked={checked} onChange={e => onChange(e.target.checked)} />
      <div className={`block w-12 h-6 rounded-full transition ${checked ? 'bg-sky-500' : 'bg-slate-600'}`}></div>
      <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'translate-x-6' : ''}`}></div>
    </div>
  </label>
);

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSettingsChange }) => {
  const handleUpdate = <K extends keyof SearchSettings>(key: K, value: SearchSettings[K]) => {
    onSettingsChange({ ...settings, [key]: value });
  };
  
  const handleFilterUpdate = (filterKey: keyof SearchSettings['filters'], value: boolean) => {
    onSettingsChange({
      ...settings,
      filters: { ...settings.filters, [filterKey]: value }
    });
  };

  return (
    <aside className="w-full lg:w-72 flex-shrink-0 bg-slate-800 p-6 border-r border-slate-700/50 overflow-y-auto">
      <h2 className="text-lg font-bold mb-6 text-slate-100">Search Settings</h2>
      
      <Section title="Search Method">
        <select
          value={settings.method}
          onChange={e => handleUpdate('method', e.target.value as SearchMethod)}
          className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors"
        >
          {SEARCH_METHODS.map(method => (
            <option key={method} value={method}>{method}</option>
          ))}
        </select>
      </Section>

      <Section title="Other Settings">
        <div>
          <label htmlFor="k-value" className="block text-sm font-medium text-slate-300 mb-1">K Value</label>
          <input
            id="k-value"
            type="number"
            value={settings.kValue}
            onChange={e => handleUpdate('kValue', parseInt(e.target.value, 10) || 0)}
            className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors"
          />
        </div>
      </Section>

      <Section title="Layout">
        <div>
          <label htmlFor="results-per-row" className="block text-sm font-medium text-slate-300 mb-1">Results Per Row</label>
          <select
            id="results-per-row"
            value={settings.resultsPerRow}
            onChange={e => handleUpdate('resultsPerRow', e.target.value as SearchSettings['resultsPerRow'])}
            className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors"
          >
            {RESULTS_PER_ROW_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{String(opt)}</option>
            ))}
          </select>
        </div>
      </Section>
      
      <Section title="Processing">
        <Toggle label="OCR" checked={settings.ocr} onChange={checked => handleUpdate('ocr', checked)} />
      </Section>
      
      <Section title="Additional Filters">
        <Toggle label="Date" checked={settings.filters.date} onChange={checked => handleFilterUpdate('date', checked)} />
        <Toggle label="Relevance" checked={settings.filters.relevance} onChange={checked => handleFilterUpdate('relevance', checked)} />
        <Toggle label="Similarity" checked={settings.filters.similarity} onChange={checked => handleFilterUpdate('similarity', checked)} />
      </Section>
    </aside>
  );
};