'use client';

import { useLessons } from '@/lib/hooks/useLessons';
import { useState } from 'react';
import Link from 'next/link';
import { getMoodEmoji, getDomainColor, truncateText, formatDate } from '@/lib/utils';

export default function JournalPage() {
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
        <Link
          href="/journal/new"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
        >
          + New Lesson
        </Link>
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
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          </div>
        ) : lessonsData?.lessons?.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center">
            <p className="text-gray-500 mb-4">No lessons yet. Create your first lesson!</p>
            <Link
              href="/journal/new"
              className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
            >
              Create First Lesson
            </Link>
          </div>
        ) : (
          lessonsData?.lessons?.map((lesson: any) => (
            <Link
              key={lesson.id}
              href={`/journal/${lesson.id}`}
              className="block bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 text-sm font-medium rounded ${getDomainColor(lesson.domain)}`}>
                    {lesson.domain}
                  </span>
                  <span className="text-2xl">{getMoodEmoji(lesson.mood)}</span>
                  <span className="text-sm text-gray-500">
                    Resonance: {lesson.resonance}/3
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {formatDate(lesson.createdAt)}
                </span>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-3">
                {truncateText(lesson.contentRaw, 150)}
              </p>

              {lesson.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {lesson.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
