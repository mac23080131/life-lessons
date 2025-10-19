'use client';

import { useLessons } from '@/lib/hooks/useLessons';
import { useState } from 'react';
import Link from 'next/link';
import { getMoodEmoji, getDomainColor, truncateText, formatDate } from '@/lib/utils';
import { LayoutGrid, List } from 'lucide-react';

type ViewMode = 'card' | 'list';

export default function JournalPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [filters, setFilters] = useState({
    q: '',
    domain: '',
    tag: '',
  });

  const { data: lessonsData, isLoading } = useLessons({
    ...filters,
    limit: 50,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Journal</h1>
        <div className="flex gap-3">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('card')}
              className={`p-2 rounded ${
                viewMode === 'card'
                  ? 'bg-white dark:bg-gray-600 shadow-sm'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              title="Card View"
            >
              <LayoutGrid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-600 shadow-sm'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              title="List View"
            >
              <List size={20} />
            </button>
          </div>

          <Link
            href="/dashboard/journal/new"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
          >
            + New Lesson
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search..."
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700"
          />

          <select
            value={filters.domain}
            onChange={(e) => setFilters({ ...filters, domain: e.target.value })}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700"
          >
            <option value="">All Domains</option>
            <option value="INNER">Inner</option>
            <option value="HEALTH">Health</option>
            <option value="RELATIONSHIP">Relationship</option>
            <option value="FINANCE">Finance</option>
          </select>

          <input
            type="text"
            placeholder="Tag..."
            value={filters.tag}
            onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700"
          />
        </div>
      </div>

      {/* Lessons List */}
      <div className={viewMode === 'card' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
        {isLoading ? (
          <div className="col-span-full text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          </div>
        ) : lessonsData?.lessons?.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-gray-800 rounded-lg p-12 text-center">
            <p className="text-gray-500 mb-4">No lessons yet. Create your first lesson!</p>
            <Link
              href="/dashboard/journal/new"
              className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
            >
              Create First Lesson
            </Link>
          </div>
        ) : (
          lessonsData?.lessons?.map((lesson: any) => (
            viewMode === 'card' ? (
              // Card View
              <Link
                key={lesson.id}
                href={`/dashboard/journal/${lesson.id}`}
                className="block bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm hover:shadow-lg transition-all hover:scale-[1.02]"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getDomainColor(lesson.domain)}`}>
                    {lesson.domain}
                  </span>
                  <span className="text-xl">{getMoodEmoji(lesson.mood)}</span>
                  <div className="ml-auto flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < lesson.resonance ? 'bg-yellow-400' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-3 line-clamp-3 text-sm">
                  {lesson.contentRaw}
                </p>

                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{formatDate(lesson.createdAt)}</span>
                  {lesson.tags?.length > 0 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                      {lesson.tags.length} tags
                    </span>
                  )}
                </div>
              </Link>
            ) : (
              // List View
              <Link
                key={lesson.id}
                href={`/dashboard/journal/${lesson.id}`}
                className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 min-w-[200px]">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getDomainColor(lesson.domain)}`}>
                    {lesson.domain}
                  </span>
                  <span className="text-xl">{getMoodEmoji(lesson.mood)}</span>
                  <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < lesson.resonance ? 'bg-yellow-400' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="flex-1 text-gray-700 dark:text-gray-300 truncate">
                  {truncateText(lesson.contentRaw, 100)}
                </p>

                <div className="flex items-center gap-3 text-sm text-gray-500">
                  {lesson.tags?.length > 0 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                      {lesson.tags.length} tags
                    </span>
                  )}
                  <span className="min-w-[100px] text-right">{formatDate(lesson.createdAt)}</span>
                </div>
              </Link>
            )
          ))
        )}
      </div>
    </div>
  );
}
