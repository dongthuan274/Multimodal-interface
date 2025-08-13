
import React from 'react';
import { LogoIcon } from './icons/LogoIcon';
import { PlusIcon } from './icons/PlusIcon';
import { SettingsIcon } from './icons/SettingsIcon';

interface HeaderProps {
  onNewTab: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNewTab }) => {
  return (
    <header className="flex items-center justify-between p-2 bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 shadow-md">
      <div className="flex items-center gap-2">
        <LogoIcon className="w-8 h-8 text-sky-400" />
        <h1 className="text-xl font-bold text-slate-100 tracking-tight">Multimodal Search</h1>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onNewTab}
          className="p-2 rounded-md hover:bg-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          aria-label="Create new tab"
        >
          <PlusIcon className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};
