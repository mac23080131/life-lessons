'use client';

import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export function LanguageSwitcher() {
  const [locale, setLocale] = useState<'en' | 'vi'>('vi');
  const router = useRouter();
  const pathname = usePathname();

  // Load locale from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('locale') as 'en' | 'vi' | null;
      if (savedLocale && savedLocale !== locale) {
        setLocale(savedLocale);
      }
    }
  }, []);

  const toggleLanguage = () => {
    const newLocale = locale === 'vi' ? 'en' : 'vi';
    setLocale(newLocale);
    
    // Store in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale);
    }
    
    // Reload page to apply new locale (only when clicked)
    router.refresh();
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      title={`Switch to ${locale === 'vi' ? 'English' : 'Tiếng Việt'}`}
    >
      <Globe className="w-4 h-4" />
      <span className="text-sm font-medium">{locale === 'vi' ? 'VI' : 'EN'}</span>
    </button>
  );
}
