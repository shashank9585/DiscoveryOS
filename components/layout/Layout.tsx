'use client';

import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Sidebar />
      <TopNav />
      <main className=\"ml-64 mt-16 p-6\">
        {children}
      </main>
    </div>
  );
}
