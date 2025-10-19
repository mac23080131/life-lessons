'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';

async function fetchSharedLesson(token: string) {
  const response = await apiClient.get(`/lessons/shared/${token}`);
  return response.data;
}

export default function SharePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);

  const { data: lesson, isLoading, error } = useQuery({
    queryKey: ['shared-lesson', token],
    queryFn: () => fetchSharedLesson(token),
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading shared lesson...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold mb-2">Lesson Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This lesson may have been deleted or is no longer shared.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Life Lessons
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl">📝</div>
              <div>
                <h1 className="text-2xl font-bold">Shared Life Lesson</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {lesson.isAnonymous ? 'Shared anonymously' : 'Shared publicly'}
                </p>
              </div>
            </div>
            <Link
              href="/"
              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              Try the app →
            </Link>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
              {lesson.domain}
            </span>
            {lesson.tags?.map((tag: string) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <span>Mood:</span>
              <span className="font-medium">
                {lesson.mood > 0 ? '+' : ''}{lesson.mood}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span>Resonance:</span>
              <span className="font-medium">{lesson.resonance}/3</span>
            </div>
            <div className="flex items-center gap-1">
              <span>📅</span>
              <span>{new Date(lesson.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Lesson Content</h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
              {lesson.content}
            </p>
          </div>
        </div>

        {/* AI Summary */}
        {lesson.summary && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">AI Summary</h2>
            <p className="text-gray-700 dark:text-gray-300">{lesson.summary}</p>
          </div>
        )}

        {/* AI Concepts */}
        {lesson.aiConcepts && lesson.aiConcepts.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Key Concepts</h2>
            <div className="flex flex-wrap gap-2">
              {lesson.aiConcepts.map((concept: string, index: number) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Start Your Own Journey</h2>
          <p className="mb-6 opacity-90">
            Track your 10,000 life lessons with AI-powered insights and reflection.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              Sign Up Free
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors font-semibold"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
