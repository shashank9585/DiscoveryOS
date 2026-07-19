'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export function TopNav() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className=\"fixed top-0 right-0 left-64 border-b border-border bg-card px-6 py-4 flex items-center justify-between\">
      <div className=\"flex-1\" />
      <div className=\"flex items-center gap-4\">
        <Button
          variant=\"ghost\"
          size=\"icon\"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? (
            <Sun className=\"h-5 w-5\" />
          ) : (
            <Moon className=\"h-5 w-5\" />
          )}
        </Button>
        <Button variant=\"ghost\" size=\"icon\">
          <LogOut className=\"h-5 w-5\" />
        </Button>
      </div>
    </div>
  );
}
