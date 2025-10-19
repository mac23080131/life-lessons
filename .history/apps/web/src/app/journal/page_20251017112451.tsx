'use client'

import { useLessons, useDeleteLesson } from '@/lib/hooks/useLessons'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function JournalPage() {
  const router = useRouter()
  const [domain, setDomain] = useState('')
  const [search, setSearch] = useState('')
  
  const { data, isLoading } = useLessons({ domain: domain || undefined, q: search || undefined })
  const deleteLesson = useDeleteLesson()

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc muốn xóa bài học này?')) {
      await deleteLesson.mutateAsync(id)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nhật ký bài học</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-sm text-indigo-600 hover:text-indigo-700"
          >
            ← Về Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Tất cả lĩnh vực</option>
              <option value="INNER">Nội tâm</option>
              <option value="HEALTH">Sức khỏe</option>
              <option value="RELATIONSHIP">Mối quan hệ</option>
              <option value="FINANCE">Tài chính</option>
            </select>
          </div>
        </div>

        {/* Lessons List */}
        {isLoading && (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400">Đang tải...</div>
        )}

        {data && data.lessons && data.lessons.length === 0 && (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400">
            Chưa có bài học nào
          </div>
        )}

        <div className="space-y-4">
          {data?.lessons?.map((lesson: any) => (
            <div key={lesson.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 text-xs font-semibold rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                    {lesson.domain === 'INNER' && 'Nội tâm'}
                    {lesson.domain === 'HEALTH' && 'Sức khỏe'}
                    {lesson.domain === 'RELATIONSHIP' && 'Mối quan hệ'}
                    {lesson.domain === 'FINANCE' && 'Tài chính'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(lesson.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/journal/${lesson.id}`)}
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    Chi tiết
                  </button>
                  <button
                    onClick={() => handleDelete(lesson.id)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Xóa
                  </button>
                </div>
              </div>

              <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                {lesson.contentRaw.substring(0, 200)}
                {lesson.contentRaw.length > 200 && '...'}
              </p>

              {lesson.contentSummary && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded">
                  <p className="text-sm text-blue-900 dark:text-blue-200">
                    <strong>Tóm tắt AI:</strong> {lesson.contentSummary}
                  </p>
                </div>
              )}

              <div className="mt-4 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span>Tâm trạng: {lesson.mood > 0 ? '+' : ''}{lesson.mood}</span>
                <span>Cộng hưởng: {lesson.resonance}/3</span>
                {lesson.tags && lesson.tags.length > 0 && (
                  <div className="flex gap-1">
                    {lesson.tags.map((tag: string) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
