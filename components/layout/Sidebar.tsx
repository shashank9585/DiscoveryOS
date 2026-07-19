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
    <div className="h-full flex flex-col border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">DiscoveryOS</h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Product Intelligence</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
        <p className="text-xs text-slate-500 dark:text-slate-500 text-center">
          v1.0 MVP
        </p>
      </div>
    </div>
  );
}
