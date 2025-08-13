
import React, { useState, useRef, useEffect } from 'react';
import { Tab } from '../utils/types';
import { XIcon } from './icons/XIcon';

interface TabsBarProps {
  tabs: Tab[];
  activeTabId: string | null;
  onSelectTab: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
  onUpdateTab: (tabId: string, updates: Partial<Tab>) => void;
}

export const TabsBar: React.FC<TabsBarProps> = ({ tabs, activeTabId, onSelectTab, onCloseTab, onUpdateTab }) => {
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTabId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingTabId]);

  const handleTitleDoubleClick = (tab: Tab) => {
    setEditingTabId(tab.id);
    setEditingTitle(tab.title);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    if (editingTabId && editingTitle.trim()) {
      onUpdateTab(editingTabId, { title: editingTitle.trim() });
    }
    setEditingTabId(null);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleBlur();
    } else if (e.key === 'Escape') {
      setEditingTabId(null);
    }
  };

  return (
    <div className="flex-shrink-0 bg-slate-800 border-b border-slate-700/50 shadow-inner-sm">
      <div className="flex items-center space-x-1 p-1 overflow-x-auto">
        {tabs.map(tab => (
          <div
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            onDoubleClick={() => handleTitleDoubleClick(tab)}
            className={`flex items-center justify-between gap-2 px-3 py-2 rounded-md cursor-pointer transition-all duration-200 min-w-[150px] max-w-[200px] ${
              activeTabId === tab.id
                ? 'bg-sky-600/30 text-sky-300'
                : 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-slate-100'
            }`}
            role="tab"
            aria-selected={activeTabId === tab.id}
          >
            {editingTabId === tab.id ? (
              <input
                ref={inputRef}
                type="text"
                value={editingTitle}
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
                onKeyDown={handleTitleKeyDown}
                className="bg-transparent outline-none w-full text-sky-200 border-b border-sky-400"
              />
            ) : (
              <span className="truncate" title={tab.title}>{tab.title}</span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCloseTab(tab.id);
              }}
              className="p-1 rounded-full hover:bg-slate-500/50 text-slate-400 hover:text-slate-100 transition-colors focus:outline-none"
              aria-label={`Close tab ${tab.title}`}
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
