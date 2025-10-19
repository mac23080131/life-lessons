'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'account' | 'privacy' | 'reminders' | 'export'>('account')

  if (!user) {
    router.push('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cài đặt</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-sm text-indigo-600 hover:text-indigo-700"
          >
            ← Về Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="md:col-span-1">
            <nav className="space-y-1">
              {[
                { id: 'account', label: 'Tài khoản', icon: '👤' },
                { id: 'privacy', label: 'Riêng tư', icon: '🔒' },
                { id: 'reminders', label: 'Nhắc nhở', icon: '🔔' },
                { id: 'export', label: 'Xuất dữ liệu', icon: '📦' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${
                    activeTab === tab.id
                      ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="md:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            {activeTab === 'account' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Thông tin tài khoản
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-500 dark:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tên
                    </label>
                    <input
                      type="text"
                      defaultValue={user.name || ''}
                      placeholder="Nhập tên của bạn"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Ngôn ngữ
                    </label>
                    <select
                      defaultValue={user.locale || 'vi'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="vi">Tiếng Việt</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Múi giờ
                    </label>
                    <select
                      defaultValue={user.tz || 'Asia/Bangkok'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="Asia/Bangkok">Bangkok (GMT+7)</option>
                      <option value="Asia/Ho_Chi_Minh">Ho Chi Minh (GMT+7)</option>
                      <option value="Asia/Tokyo">Tokyo (GMT+9)</option>
                    </select>
                  </div>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                    Lưu thay đổi
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Cài đặt riêng tư
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Chế độ chia sẻ mặc định
                    </label>
                    <select
                      defaultValue={user.privacyDefault || 'PRIVATE'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="PRIVATE">Riêng tư (chỉ mình tôi)</option>
                      <option value="GROUP">Nhóm</option>
                      <option value="LINK">Link ẩn danh</option>
                      <option value="PUBLIC_ANON">Công khai ẩn danh</option>
                    </select>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      ⚠️ Chế độ công khai sẽ ẩn thông tin cá nhân của bạn
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reminders' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Nhắc nhở
                </h2>
                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Nhắc buổi tối</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">21:00 - Push notification</div>
                    </div>
                    <button className="text-sm text-red-600 hover:text-red-700">Xóa</button>
                  </div>
                </div>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                  + Thêm nhắc nhở
                </button>
              </div>
            )}

            {activeTab === 'export' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Xuất dữ liệu
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Tải xuất toàn bộ bài học của bạn theo định dạng mong muốn
                </p>
                <div className="space-y-3">
                  <button className="w-full p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-400 transition text-left">
                    <div className="font-medium text-gray-900 dark:text-white">📄 Markdown</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Định dạng văn bản đơn giản, dễ đọc
                    </div>
                  </button>
                  <button className="w-full p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-400 transition text-left">
                    <div className="font-medium text-gray-900 dark:text-white">📊 CSV</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Dữ liệu bảng, mở bằng Excel/Sheets
                    </div>
                  </button>
                  <button className="w-full p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-400 transition text-left">
                    <div className="font-medium text-gray-900 dark:text-white">🗃️ JSON</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Dữ liệu đầy đủ, dùng cho developer
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
