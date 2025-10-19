'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoginLoading, loginError } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4" suppressHydrationWarning>
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-2">{t('auth.welcomeBack')}</h1>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
            {t('auth.loginSubtitle')}
          </p>

          {loginError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
              {(loginError as any)?.response?.data?.message || t('auth.loginError')}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                {t('auth.email')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                {t('auth.password')}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoginLoading}
              className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
            >
              {isLoginLoading ? t('auth.loggingIn') : t('auth.loginButton')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/signup"
              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              {t('auth.noAccount')} {t('auth.signupButton')}
            </Link>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              {t('auth.demoCredentials')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
