'use client'

import { useLesson, useUpdateLesson, useAnalyzeLesson } from '@/lib/hooks/useLessons'
import { useRouter } from 'next/navigation'
import { use, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Loader2, Check, AlertCircle, Edit } from 'lucide-react'
import { getMoodEmoji, getDomainColor } from '@/lib/utils'
import { AIAnalysisPanel } from '@/components/lesson/AIAnalysisPanel'

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
    <div className="max-w-5xl mx-auto pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <button
          onClick={() => router.push('/journal')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft size={20} />
          Quay lại Journal
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              {isEditing ? 'Chỉnh sửa bài học' : 'Chi tiết bài học'}
            </h1>
            <p className="text-muted-foreground">
              Tạo lúc {new Date(lesson.createdAt).toLocaleString('vi-VN')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {saveStatus === 'saved' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2 text-green-600 dark:text-green-400"
              >
                <Check size={20} />
                <span className="text-sm font-medium">Đã lưu</span>
              </motion.div>
            )}
            {saveStatus === 'error' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2 text-red-600 dark:text-red-400"
              >
                <AlertCircle size={20} />
                <span className="text-sm font-medium">Lỗi</span>
              </motion.div>
            )}
            
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    // Reset form
                    if (lesson) {
                      setContent(lesson.contentRaw)
                      setDomain(lesson.domain)
                      setMood(lesson.mood)
                      setResonance(lesson.resonance)
                      setTags(lesson.tags?.join(', ') || '')
                      setGratitude(lesson.gratitude || '')
                      setVisibility(lesson.visibility)
                    }
                  }}
                  className="px-6 py-3 rounded-xl border-2 border-border hover:bg-background/50 transition-all"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  disabled={!content.trim() || saveStatus === 'saving'}
                  className="btn-modern flex items-center gap-2 px-6 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saveStatus === 'saving' ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Lưu thay đổi
                    </>
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-modern flex items-center gap-2 px-6 py-3 rounded-xl"
              >
                <Edit size={18} />
                Chỉnh sửa
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Content */}
          <div className="glass-card p-6 rounded-2xl">
            <label className="text-sm font-medium block mb-2">Nội dung bài học</label>
            {isEditing ? (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Hôm nay mình học được..."
                className="w-full h-64 px-4 py-3 border-2 border-border rounded-xl resize-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background/50 backdrop-blur-sm transition-all"
              />
            ) : (
              <p className="text-sm leading-relaxed whitespace-pre-wrap min-h-64 px-4 py-3">
                {lesson.contentRaw}
              </p>
            )}
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <span>{isEditing ? content.length : lesson.contentRaw.length} ký tự</span>
              <span>Cập nhật: {new Date(lesson.updatedAt).toLocaleString('vi-VN')}</span>
            </div>
          </div>

          {/* Domain & Mood & Resonance */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <div>
              <label className="text-sm font-medium block mb-2">Lĩnh vực</label>
              {isEditing ? (
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-border rounded-xl bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="INNER">🧠 Nội tâm</option>
                  <option value="HEALTH">💪 Sức khỏe</option>
                  <option value="RELATIONSHIP">❤️ Mối quan hệ</option>
                  <option value="FINANCE">💰 Tài chính</option>
                </select>
              ) : (
                <div className={`px-4 py-3 rounded-xl font-medium inline-block ${getDomainColor(lesson.domain)}`}>
                  {domainLabels[lesson.domain]}
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium block mb-3">Tâm trạng</label>
              <div className="flex gap-3 justify-center">
                {[-2, -1, 0, 1, 2].map((m) => (
                  <button
                    key={m}
                    onClick={() => isEditing && setMood(m)}
                    disabled={!isEditing}
                    className={`text-3xl transition-all ${isEditing ? 'hover:scale-110 cursor-pointer' : 'cursor-default'} ${
                      mood === m ? 'scale-125 drop-shadow-lg' : 'opacity-40'
                    }`}
                  >
                    {getMoodEmoji(m)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-3">Resonance (Độ quan trọng)</label>
              <div className="flex gap-3 justify-center">
                {[0, 1, 2, 3].map((r) => (
                  <button
                    key={r}
                    onClick={() => isEditing && setResonance(r)}
                    disabled={!isEditing}
                    className={`w-12 h-12 rounded-xl border-2 transition-all ${isEditing ? 'hover:scale-105 cursor-pointer' : 'cursor-default'} ${
                      resonance === r
                        ? 'border-purple-500 bg-gradient-to-br from-purple-500/20 to-pink-500/20 shadow-lg scale-110'
                        : 'border-border'
                    }`}
                  >
                    <span className="font-bold">{r}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tags & Gratitude */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <div>
              <label className="text-sm font-medium block mb-2">
                Tags {!isEditing && lesson.tags?.length > 0 && `(${lesson.tags.length})`}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="growth, patience, productivity"
                  className="w-full px-4 py-3 border-2 border-border rounded-xl bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              ) : lesson.tags && lesson.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {lesson.tags.map((tag: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-background/50 backdrop-blur-sm border border-border"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Chưa có tags</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">
                Biết ơn
              </label>
              {isEditing ? (
                <textarea
                  value={gratitude}
                  onChange={(e) => setGratitude(e.target.value)}
                  placeholder="Mình biết ơn về..."
                  className="w-full h-24 px-4 py-3 border-2 border-border rounded-xl resize-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background/50 backdrop-blur-sm"
                />
              ) : lesson.gratitude ? (
                <p className="text-sm leading-relaxed whitespace-pre-wrap px-4 py-3 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
                  {lesson.gratitude}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">Chưa có ghi chú biết ơn</p>
              )}
            </div>

            {isEditing && (
              <div>
                <label className="text-sm font-medium block mb-2">Quyền riêng tư</label>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-border rounded-xl bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="PRIVATE">🔒 Riêng tư</option>
                  <option value="GROUP">👥 Nhóm</option>
                  <option value="LINK">🔗 Chia sẻ link</option>
                  <option value="PUBLIC_ANON">🌐 Công khai ẩn danh</option>
                </select>
              </div>
            )}
          </div>
        </motion.div>
        {/* AI Analysis Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Analyze Button */}
          <div className="glass-card p-6 rounded-2xl">
            <button
              onClick={handleAnalyze}
              disabled={analyzeLesson.isPending}
              className="w-full btn-modern flex items-center justify-center gap-2 px-6 py-3 rounded-xl disabled:opacity-50"
            >
              {analyzeLesson.isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Đang phân tích...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Phân tích bằng AI
                </>
              )}
            </button>
          </div>

          {/* AI Analysis Results */}
          {lesson.contentSummary && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 rounded-2xl space-y-4"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Sparkles className="text-white" size={20} />
                </div>
                <h3 className="text-lg font-semibold">AI Analysis</h3>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                  Tóm tắt
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {lesson.contentSummary}
                </p>
              </div>

              {lesson.aiConcepts && lesson.aiConcepts.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2 text-purple-600 dark:text-purple-400">
                    Khái niệm chính
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {lesson.aiConcepts.map((concept: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-lg text-xs font-medium bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {lesson.aiNextQuestion && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                  <h4 className="text-sm font-medium mb-2 text-green-600 dark:text-green-400">
                    Câu hỏi tiếp theo
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {lesson.aiNextQuestion}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Quick Info */}
          <div className="glass-card p-6 rounded-2xl space-y-3">
            <h3 className="text-lg font-semibold mb-4">Thông tin</h3>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Lĩnh vực</span>
              <span className={`px-3 py-1 rounded-lg font-medium ${getDomainColor(domain)}`}>
                {domainLabels[domain]}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Tâm trạng</span>
              <span className="text-2xl">{getMoodEmoji(mood)}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Resonance</span>
              <span className="font-medium">{resonance}/3</span>
            </div>

            {lesson.tags && lesson.tags.length > 0 && (
              <div className="pt-3 border-t border-border">
                <span className="text-sm text-muted-foreground block mb-2">Tags</span>
                <div className="flex flex-wrap gap-1">
                  {lesson.tags.map((tag: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-background/50 backdrop-blur-sm text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
