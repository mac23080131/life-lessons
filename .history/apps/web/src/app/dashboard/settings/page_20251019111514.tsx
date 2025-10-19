'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { Avatar } from '@/components/common/Avatar';
import { useState, useRef } from 'react';
import { Camera, Save, Upload } from 'lucide-react';

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    locale: user?.locale || 'vi',
    tz: user?.tz || 'Asia/Bangkok',
    privacyDefault: user?.privacyDefault || 'PRIVATE',
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      {/* Account */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Account</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={user?.name || ''}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700"
              placeholder="Your name"
            />
          </div>

          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold">
            Save Changes
          </button>
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Privacy</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Default Visibility</label>
            <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700">
              <option value="PRIVATE">Private</option>
              <option value="GROUP">Group</option>
              <option value="LINK">Link</option>
              <option value="PUBLIC_ANON">Public Anonymous</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Default visibility for new lessons
            </p>
          </div>
        </div>
      </div>

      {/* Export */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Export Data</h2>
        
        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Download your data in various formats
          </p>
          
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium">
              Export Markdown
            </button>
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium">
              Export CSV
            </button>
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium">
              Export JSON
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-4">Danger Zone</h2>
        
        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold">
          Delete Account
        </button>
        <p className="text-xs text-red-600 dark:text-red-400 mt-2">
          This action cannot be undone
        </p>
      </div>
    </div>
  );
}
