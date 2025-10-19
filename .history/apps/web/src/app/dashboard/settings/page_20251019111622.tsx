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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      const token = localStorage.getItem('accessToken');
      
      const updateData: any = { ...formData };
      if (avatarPreview) {
        updateData.avatar = avatarPreview;
      }

      const response = await fetch(`${apiBaseUrl}/api/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        await refreshUser();
        setAvatarPreview(null);
        alert('Profile updated successfully!');
      } else {
        const error = await response.json();
        alert(`Failed to update profile: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      {/* Account */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Account</h2>
        
        <div className="space-y-6">
          {/* Avatar */}
          <div>
            <label className="block text-sm font-medium mb-3">Avatar</label>
            <div className="flex items-center space-x-4">
              <Avatar 
                user={avatarPreview ? { ...user, avatar: avatarPreview } : user} 
                size="xl" 
              />
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  Change Avatar
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  PNG, JPG up to 2MB
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-900 text-gray-900 dark:text-white"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Language</label>
            <select 
              value={formData.locale}
              onChange={(e) => setFormData({ ...formData, locale: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-900 text-gray-900 dark:text-white"
            >
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Timezone</label>
            <select 
              value={formData.tz}
              onChange={(e) => setFormData({ ...formData, tz: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-900 text-gray-900 dark:text-white"
            >
              <option value="Asia/Bangkok">Bangkok (GMT+7)</option>
              <option value="Asia/Ho_Chi_Minh">Ho Chi Minh (GMT+7)</option>
              <option value="Asia/Tokyo">Tokyo (GMT+9)</option>
              <option value="America/New_York">New York (GMT-5)</option>
              <option value="Europe/London">London (GMT+0)</option>
            </select>
          </div>

          {user?.role === 'ADMIN' && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    Admin Role
                  </div>
                  <div className="text-xs text-gray-500">
                    You have administrative privileges
                  </div>
                </div>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-xs font-medium">
                  ADMIN
                </span>
              </div>
            </div>
          )}

          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
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
