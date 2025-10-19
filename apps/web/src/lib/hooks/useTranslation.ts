'use client';

import { useState, useEffect } from 'react';
import enMessages from '@/messages/en.json';
import viMessages from '@/messages/vi.json';

type Messages = typeof enMessages;
type MessageKeys = keyof Messages;

export function useTranslation() {
  const [locale, setLocale] = useState<'en' | 'vi'>('vi');
  const [messages, setMessages] = useState<Messages>(viMessages);

  useEffect(() => {
    // Load locale from localStorage
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('locale') as 'en' | 'vi' | null;
      if (savedLocale) {
        setLocale(savedLocale);
        setMessages(savedLocale === 'en' ? enMessages : viMessages);
      }

      // Listen for locale changes
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'locale' && e.newValue) {
          const newLocale = e.newValue as 'en' | 'vi';
          setLocale(newLocale);
          setMessages(newLocale === 'en' ? enMessages : viMessages);
        }
      };

      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, []);

  // Helper function to get nested translations
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = messages;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return { t, locale, messages };
}
