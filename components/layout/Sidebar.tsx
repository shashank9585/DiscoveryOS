'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  FileText,
  Settings,
  AlertTriangle,
  Brain,
  Upload,
  FolderOpen,
  PieChart,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();

  const items = [
    {
      label: 'Dashboard',
      href: '/',
      icon: BarChart3,
    },
    {
      label: 'Insights',
      href: '/insights',
      icon: Brain,
    },
    {
      label: 'Analytics',
      href: '/analytics',
      icon: PieChart,
    },
    {
      label: 'Risk Analysis',
      href: '/risk',
      icon: AlertTriangle,
    },
    {
      label: 'Reports',
      href: '/reports',
      icon: FileText,
    },
    {
      label: 'Upload',
      href: '/upload',
      icon: Upload,
    },
    {
      label: 'Projects',
      href: '/projects',
      icon: FolderOpen,
    },
    {
      label: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ];

  return (
    <div className=\"fixed left-0 top-0 h-screen w-64 border-r border-border bg-card p-4\">
      <div className=\"mb-8\">
        <h1 className=\"text-2xl font-bold text-primary\">DiscoveryOS</h1>
        <p className=\"text-sm text-muted-foreground\">Product Intelligence</p>
      </div>

      <nav className=\"space-y-2\">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              )}
            >
              <Icon className=\"h-5 w-5\" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
