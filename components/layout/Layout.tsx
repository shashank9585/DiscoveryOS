'use client';

import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { AIAssistant } from '../AIAssistant';
import { useState } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [showAI, setShowAI] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      {/* Sidebar - NOT fixed, part of flex layout */}
      <aside className="w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-y-auto">
        <Sidebar />
      </aside>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation - NOT fixed, part of flex layout */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex-shrink-0">
          <TopNav />
        </header>
        
        {children}
      </div>

      {/* AI Assistant */}
      <AIAssistant isOpen={showAI} onClose={() => setShowAI(false)} />
    </div>
  );
}
