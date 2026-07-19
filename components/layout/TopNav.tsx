'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';

export function TopNav() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-4 flex items-center justify-between h-16">
      <div className="flex-1" />
      <div className="flex items-center gap-4">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          ) : (
            <Moon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          )}
        </button>
        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
          <LogOut className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        </button>
      </div>
    </div>
  );
}
