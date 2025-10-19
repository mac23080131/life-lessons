'use client'

import { useLesson, useUpdateLesson, useAnalyzeLesson } from '@/lib/hooks/useLessons'
import { useRouter } from 'next/navigation'
import { use, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Sparkles, Loader2, Check, AlertCircle, Edit } from 'lucide-react'
import { getMoodEmoji, getDomainColor } from '@/lib/utils'

const domainLabels: Record<string, string> = {
  INNER: '🧠 Nội tâm',
  HEALTH: '💪 Sức khỏe',
  RELATIONSHIP: '❤️ Mối quan hệ',
  FINANCE: '💰 Tài chính',
}

export default function LessonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { data: lesson, isLoading } = useLesson(resolvedParams.id)
  const updateLesson = useUpdateLesson()
  const analyzeLesson = useAnalyzeLesson()

  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState('')
  const [domain, setDomain] = useState('INNER')
  const [mood, setMood] = useState(0)
  const [resonance, setResonance] = useState(1)
  const [tags, setTags] = useState('')
  const [gratitude, setGratitude] = useState('')
  const [visibility, setVisibility] = useState('PRIVATE')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  // Load lesson data into form
  useEffect(() => {
    if (lesson) {
      setContent(lesson.contentRaw)
      setDomain(lesson.domain)
      setMood(lesson.mood)
      setResonance(lesson.resonance)
      setTags(lesson.tags?.join(', ') || '')
      setGratitude(lesson.gratitude || '')
      setVisibility(lesson.visibility)
    }
  }, [lesson])

  const handleSave = async () => {
    if (!content.trim()) return

    setSaveStatus('saving')
    try {
      await updateLesson.mutateAsync({
        id: resolvedParams.id,
        data: {
          contentRaw: content,
          domain,
          mood,
          resonance,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          gratitude: gratitude || undefined,
          visibility,
        },
      })

      setSaveStatus('saved')
      setIsEditing(false)
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (error) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }

  const handleAnalyze = async () => {
    try {
      await analyzeLesson.mutateAsync(resolvedParams.id)
    } catch (error) {
      console.error('Analyze error:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-500" />
          <p className="text-muted-foreground">Đang tải bài học...</p>
        </div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold mb-2">Không tìm thấy bài học</h2>
          <button
            onClick={() => router.push('/journal')}
            className="btn-modern px-6 py-3 rounded-xl mt-4"
          >
            Quay lại Journal
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Chi tiết bài học</h1>
          <button
            onClick={() => router.push('/journal')}
            className="text-sm text-indigo-600 hover:text-indigo-700"
          >
            ← Quay lại
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          {/* Metadata */}
          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            <span className="px-3 py-1 text-sm font-semibold rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
              {lesson.domain === 'INNER' && 'Nội tâm'}
              {lesson.domain === 'HEALTH' && 'Sức khỏe'}
              {lesson.domain === 'RELATIONSHIP' && 'Mối quan hệ'}
              {lesson.domain === 'FINANCE' && 'Tài chính'}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(lesson.createdAt).toLocaleString('vi-VN')}
            </span>
          </div>

          {/* Content */}
          <div className="prose dark:prose-invert max-w-none mb-6">
            <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
              {lesson.contentRaw}
            </p>
          </div>

          {/* Metadata details */}
          <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Tâm trạng</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {lesson.mood > 0 ? '+' : ''}{lesson.mood}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Cộng hưởng</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {lesson.resonance}/3
              </div>
            </div>
          </div>

          {lesson.gratitude && (
            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900 rounded">
              <div className="text-sm font-semibold text-yellow-900 dark:text-yellow-200 mb-1">
                Biết ơn
              </div>
              <p className="text-yellow-800 dark:text-yellow-100">{lesson.gratitude}</p>
            </div>
          )}

          {/* AI Analysis */}
          {lesson.contentSummary ? (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded">
                <div className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
                  Tóm tắt AI
                </div>
                <p className="text-blue-800 dark:text-blue-100">{lesson.contentSummary}</p>
              </div>

              {lesson.aiConcepts && lesson.aiConcepts.length > 0 && (
                <div className="p-4 bg-purple-50 dark:bg-purple-900 rounded">
                  <div className="text-sm font-semibold text-purple-900 dark:text-purple-200 mb-2">
                    Khái niệm chính
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {lesson.aiConcepts.map((concept: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-200 rounded-full text-sm"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {lesson.aiNextQuestion && (
                <div className="p-4 bg-green-50 dark:bg-green-900 rounded">
                  <div className="text-sm font-semibold text-green-900 dark:text-green-200 mb-2">
                    Câu hỏi tiếp theo
                  </div>
                  <p className="text-green-800 dark:text-green-100">{lesson.aiNextQuestion}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <button
                onClick={handleAnalyze}
                disabled={analyzeLesson.isPending}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {analyzeLesson.isPending ? 'Đang phân tích...' : '🤖 Phân tích với AI'}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
