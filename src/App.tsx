
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { TabsBar } from './components/TabsBar';
import { TabContent } from './components/TabContent';
import { Tab, ResultItem } from './utils/types';
import { createNewTab } from './utils/constants';
import { VideoPlayerModal } from './components/VideoPlayerModal';

const App: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [viewingResult, setViewingResult] = useState<{ result: ResultItem; startTime: number } | null>(null);

  useEffect(() => {
    // Open a default tab on initial load
    if (tabs.length === 0) {
      const newTab = createNewTab();
      setTabs([newTab]);
      setActiveTabId(newTab.id);
    }
  }, [tabs.length]);

  const addTab = useCallback(() => {
    const newTab = createNewTab();
    setTabs(prevTabs => [...prevTabs, newTab]);
    setActiveTabId(newTab.id);
  }, []);

  const closeTab = useCallback((tabId: string) => {
    setTabs(prevTabs => {
      const tabIndex = prevTabs.findIndex(tab => tab.id === tabId);
      const newTabs = prevTabs.filter(tab => tab.id !== tabId);

      if (activeTabId === tabId) {
        if (newTabs.length === 0) {
          setActiveTabId(null);
        } else {
          // Activate the previous tab, or the first one if the closed tab was the first
          const newActiveIndex = Math.max(0, tabIndex - 1);
          setActiveTabId(newTabs[newActiveIndex].id);
        }
      }
      return newTabs;
    });
  }, [activeTabId]);

  const updateTab = useCallback((tabId: string, updates: Partial<Tab>) => {
    setTabs(prevTabs =>
      prevTabs.map(tab =>
        tab.id === tabId ? { ...tab, ...updates } : tab
      )
    );
  }, []);
  
  const handleViewResult = (result: ResultItem, startTime: number) => {
    if (result.type === 'video') {
      setViewingResult({ result, startTime });
    }
  };

  const handleCloseModal = () => {
    setViewingResult(null);
  };


  const activeTab = tabs.find(tab => tab.id === activeTabId);

  return (
    <div className="flex flex-col h-screen font-sans">
      <Header onNewTab={addTab} />
      <TabsBar
        tabs={tabs}
        activeTabId={activeTabId}
        onSelectTab={setActiveTabId}
        onCloseTab={closeTab}
        onUpdateTab={updateTab}
      />
      <main className="flex-grow overflow-y-auto bg-slate-900">
        {activeTab ? (
          <TabContent
            key={activeTab.id}
            tab={activeTab}
            onUpdateTab={(updates) => updateTab(activeTab.id, updates)}
            onViewResult={handleViewResult}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500">
            <p>Create a new tab to start searching.</p>
          </div>
        )}
      </main>
      {viewingResult && (
        <VideoPlayerModal
            result={viewingResult.result}
            startTime={viewingResult.startTime}
            onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default App;
