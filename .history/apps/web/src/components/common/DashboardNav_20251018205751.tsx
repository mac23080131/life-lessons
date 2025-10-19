'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Target, Users, Settings } from 'lucide-react';
import { useTranslation } from '@/lib/hooks/useTranslation';

export function DashboardNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const menuItems = [
    { 
      href: '/dashboard', 
      label: t('common.dashboard'),
      icon: Home
    },
    { 
      href: '/journal', 
      label: t('common.journal'),
      icon: BookOpen
    },
    { 
      href: '/goals', 
      label: t('common.goals'),
      icon: Target
    },
    { 
      href: '/community', 
      label: t('common.community'),
      icon: Users
    },
    { 
      href: '/settings', 
      label: t('common.settings'),
      icon: Settings
    },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="flex items-center gap-1 overflow-x-auto pb-2">
      {menuItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              isActive(item.href)
                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Icon size={18} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
