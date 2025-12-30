
import React, { useState } from 'react';
import { TabType } from './types';
import IntroTab from './components/IntroTab';
import HowItWorksTab from './components/HowItWorksTab';
import AlgorithmsTab from './components/AlgorithmsTab';
import HealthChecksTab from './components/HealthChecksTab';
import TypesTab from './components/TypesTab';
import QuizTab from './components/QuizTab';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.INTRO);

  const tabs = [
    { id: TabType.INTRO, label: 'Concept', icon: '🌍' },
    { id: TabType.HOW_IT_WORKS, label: 'How it Works', icon: '⚙️' },
    { id: TabType.ALGORITHMS, label: 'Algorithms', icon: '🔀' },
    { id: TabType.HEALTH_CHECKS, label: 'Health Checks', icon: '💓' },
    { id: TabType.TYPES, label: 'L4 vs L7', icon: '📁' },
    { id: TabType.QUIZ, label: 'Quiz', icon: '✅' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case TabType.INTRO: return <IntroTab />;
      case TabType.HOW_IT_WORKS: return <HowItWorksTab />;
      case TabType.ALGORITHMS: return <AlgorithmsTab />;
      case TabType.HEALTH_CHECKS: return <HealthChecksTab />;
      case TabType.TYPES: return <TypesTab />;
      case TabType.QUIZ: return <QuizTab />;
      default: return <IntroTab />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20M7 7l10 10M17 7L7 10"/></svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">LoadBalancer<span className="text-blue-500">Academy</span></h1>
              <p className="text-xs text-slate-400 font-medium">System Design Visualizer</p>
            </div>
          </div>
          <nav className="hidden md:flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          {renderContent()}
        </div>
      </main>

      {/* Mobile Nav */}
      <nav className="md:hidden sticky bottom-0 bg-slate-900 border-t border-slate-800 flex justify-around p-2 z-50 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center p-2 rounded-lg min-w-[60px] ${
              activeTab === tab.id ? 'text-blue-500' : 'text-slate-500'
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-[10px] mt-1 whitespace-nowrap">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-slate-500 text-sm">
        Built for educational purposes &copy; 2024 LoadBalancer Academy
      </footer>
    </div>
  );
};

export default App;
