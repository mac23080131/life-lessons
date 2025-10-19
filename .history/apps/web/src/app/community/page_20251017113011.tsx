'use client'

import { useRouter } from 'next/navigation'

export default function CommunityPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cộng đồng</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-sm text-indigo-600 hover:text-indigo-700"
          >
            ← Về Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feed ẩn danh */}
          <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Bài học công khai (v1 - TODO)
            </h2>
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p className="mb-4">Tính năng đang phát triển</p>
              <p className="text-sm">
                Sắp có: xem bài học được chia sẻ ẩn danh, phản ứng "cảm ơn", báo cáo
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Nhóm */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Nhóm của bạn
              </h3>
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p className="text-sm mb-4">Chưa tham gia nhóm nào</p>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm">
                  Tạo nhóm
                </button>
              </div>
            </div>

            {/* Thử thách */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Thử thách
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded">
                  <div className="font-semibold text-blue-900 dark:text-blue-200 text-sm">
                    7 ngày
                  </div>
                  <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    Ghi 1 bài mỗi ngày
                  </div>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900 rounded">
                  <div className="font-semibold text-purple-900 dark:text-purple-200 text-sm">
                    21 ngày
                  </div>
                  <div className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                    Xây dựng thói quen
                  </div>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900 rounded">
                  <div className="font-semibold text-green-900 dark:text-green-200 text-sm">
                    30 ngày
                  </div>
                  <div className="text-xs text-green-700 dark:text-green-300 mt-1">
                    Chiến dịch tháng
                  </div>
                </div>
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-600 text-sm">
                Xem tất cả
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
