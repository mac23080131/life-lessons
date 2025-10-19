'use client';

import { useAnalytics } from '@/lib/hooks/useAnalytics';
import { useGoal } from '@/lib/hooks/useGoals';
import { useLessons, useCreateLesson } from '@/lib/hooks/useLessons';
import { useAuth } from '@/lib/hooks/useAuth';
import { useState } from 'react';
import { getMoodEmoji, getDomainColor } from '@/lib/utils';
import { ModernDashboardStats } from '@/components/dashboard/ModernStats';
import { ModernProgressRing } from '@/components/dashboard/ModernProgressRing';
import { AIInsightsCarousel } from '@/components/dashboard/AIInsights';
import { VoiceRecorder } from '@/components/lesson/VoiceRecorder';
import { AIRewriteButton } from '@/components/lesson/AIRewriteButton';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { ShareModal } from '@/components/lessons/ShareModal';
import { FloatingActionButton } from '@/components/dashboard/FloatingActionButton';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Share2, X } from 'lucide-react';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: analytics } = useAnalytics();
  const { data: goal } = useGoal();
  const { data: lessonsData } = useLessons({ limit: 5 });
  const createLesson = useCreateLesson();

  const [content, setContent] = useState('');
  const [domain, setDomain] = useState('INNER');
  const [mood, setMood] = useState(0);
  const [resonance, setResonance] = useState(1);
  const [locale, setLocale] = useState<'en' | 'vi'>('vi');
  const [lastCreatedLessonId, setLastCreatedLessonId] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showQuickCaptureModal, setShowQuickCaptureModal] = useState(false);

  const handleTranscript = (text: string) => {
    setContent(text);
    toast.success('Đã chuyển giọng nói thành văn bản!');
  };

  const handleAIRewrite = (rewrittenText: string) => {
    setContent(rewrittenText);
    toast.success('Đã sử dụng bản AI viết lại!');
  };

  const handleQuickCapture = async () => {
    if (!content.trim()) {
      toast.error('Vui lòng nhập nội dung bài học')
      return;
    }

    try {
      const newLesson = await createLesson.mutateAsync({
        contentRaw: content,
        domain,
        mood,
        resonance,
        tags: [],
      });
      
      setContent('');
      setMood(0);
      setResonance(1);
      setLastCreatedLessonId(newLesson.id);
      setShowQuickCaptureModal(false); // Close modal after save
      
      toast.success(
        'Đã lưu bài học! 🎉',
        {
          action: {
            label: 'Chia sẻ',
            onClick: () => setShowShareModal(true),
          },
        }
      );
    } catch (error) {
      toast.error('Không thể lưu. Vui lòng thử lại.');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-8 glass-card"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">Welcome back! 👋</h1>
          <p className="text-muted-foreground text-lg">
            Ready to capture today's insights?
          </p>
        </div>
      </motion.div>

      {/* Modern Stats Grid */}
      <ModernDashboardStats />

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <AIInsightsCarousel />
      </motion.div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Capture - Spans 2 columns */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 glass-card p-6 rounded-2xl"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="text-white" size={20} />
            </div>
            <h2 className="text-xl font-semibold">Quick Capture</h2>
            <div className="ml-auto">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Voice Recorder */}
          <div className="mb-4">
            <VoiceRecorder
              onTranscript={handleTranscript}
              locale={locale}
            />
          </div>
        
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Hôm nay mình học được..."
            className="w-full h-32 px-4 py-3 border-2 border-border rounded-xl resize-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background/50 backdrop-blur-sm transition-all"
          />

          {/* AI Rewrite Button */}
          <div className="mt-4">
            <AIRewriteButton
              content={content}
              onRewrite={handleAIRewrite}
              locale={locale}
            />
          </div>

          <div className="mt-4 space-y-4">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="text-sm font-medium block mb-2">Domain</label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="px-4 py-2 border-2 border-border rounded-xl bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="INNER">🧠 Inner</option>
                  <option value="HEALTH">💪 Health</option>
                  <option value="RELATIONSHIP">❤️ Relationship</option>
                  <option value="FINANCE">💰 Finance</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Mood</label>
                <div className="flex gap-2">
                  {[-2, -1, 0, 1, 2].map((m) => (
                    <button
                      key={m}
                      onClick={() => setMood(m)}
                      className={`text-2xl transition-all hover:scale-110 ${mood === m ? 'scale-125 drop-shadow-lg' : 'opacity-50'}`}
                    >
                      {getMoodEmoji(m)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Resonance</label>
                <div className="flex gap-2">
                  {[0, 1, 2, 3].map((r) => (
                    <button
                      key={r}
                      onClick={() => setResonance(r)}
                      className={`w-10 h-10 rounded-xl border-2 transition-all hover:scale-105 ${
                        resonance === r
                          ? 'border-purple-500 bg-gradient-to-br from-purple-500/20 to-pink-500/20 shadow-lg'
                          : 'border-border hover:border-purple-300'
                      }`}
                    >
                      <span className="font-semibold">{r}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleQuickCapture}
                disabled={!content.trim() || createLesson.isPending}
                className="btn-modern flex items-center gap-2 px-6 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createLesson.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Save Lesson
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Progress Ring Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6 rounded-2xl"
        >
          <h3 className="text-lg font-semibold mb-6">Your Journey</h3>
          
          <div className="flex justify-center mb-6">
            <ModernProgressRing
              current={analytics?.totalLessons || 0}
              target={goal?.target || 10000}
              size="lg"
            />
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <div className="text-sm text-muted-foreground mb-1">Current Sprint</div>
              <div className="text-2xl font-bold">
                {analytics?.totalLessons ? Math.floor((analytics.totalLessons % 100) || 0) : 0}/100
              </div>
              <div className="w-full h-2 bg-background/50 rounded-full mt-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((analytics?.totalLessons || 0) % 100)}%` }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
              <div className="text-sm text-muted-foreground mb-1">🔥 Streak</div>
              <div className="text-2xl font-bold">{analytics?.streak || 0} days</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Lessons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Recent Lessons</h2>
          <span className="text-sm text-muted-foreground">
            Last 5 entries
          </span>
        </div>
        
        {lessonsData?.lessons?.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <Sparkles className="text-purple-500" size={32} />
            </div>
            <p className="text-muted-foreground mb-2">No lessons yet</p>
            <p className="text-sm text-muted-foreground">Create your first lesson above! 👆</p>
          </div>
        ) : (
          <div className="space-y-3">
            {lessonsData?.lessons?.map((lesson: any, idx: number) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + idx * 0.1 }}
                className="group p-4 rounded-xl border border-border hover:border-purple-500/50 bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm line-clamp-2 mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {lesson.contentRaw}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="text-lg">{getMoodEmoji(lesson.mood)}</span>
                      <span>•</span>
                      <span>{new Date(lesson.createdAt).toLocaleDateString('vi-VN')}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                        Resonance {lesson.resonance}
                      </span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap ${getDomainColor(lesson.domain)}`}>
                    {lesson.domain}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Share Modal */}
      {lastCreatedLessonId && (
        <ShareModal
          lessonId={lastCreatedLessonId}
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {/* Floating Action Button */}
      <FloatingActionButton
        onQuickCapture={() => setShowQuickCaptureModal(true)}
      />

      {/* Quick Capture Modal */}
      <AnimatePresence>
        {showQuickCaptureModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQuickCaptureModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-2 top-[2vh] sm:top-[5vh] sm:inset-x-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl z-50 max-h-[96vh] sm:max-h-[90vh] overflow-y-auto"
            >
              <div className="glass-card p-4 sm:p-6 rounded-xl sm:rounded-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Sparkles className="text-white" size={16} />
                    </div>
                    <h2 className="text-lg sm:text-xl font-semibold">Quick Capture</h2>
                  </div>
                  <button
                    onClick={() => setShowQuickCaptureModal(false)}
                    className="p-1.5 sm:p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <X size={18} className="sm:w-5 sm:h-5" />
                  </button>
                </div>

                {/* Voice Recorder */}
                <div className="mb-3 sm:mb-4">
                  <VoiceRecorder
                    onTranscript={handleTranscript}
                    locale={locale}
                  />
                </div>

                {/* Content Input */}
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Hôm nay mình học được..."
                  className="w-full h-28 sm:h-32 px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border-2 border-border rounded-lg sm:rounded-xl resize-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background/50 backdrop-blur-sm transition-all mb-3 sm:mb-4"
                  autoFocus
                />

                {/* AI Rewrite Button */}
                <div className="mb-3 sm:mb-4">
                  <AIRewriteButton
                    content={content}
                    onRewrite={handleAIRewrite}
                    locale={locale}
                  />
                </div>

                {/* Options */}
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {/* Domain */}
                    <div>
                      <label className="text-xs sm:text-sm font-medium block mb-1.5 sm:mb-2">Domain</label>
                      <select
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        className="w-full px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base border-2 border-border rounded-lg sm:rounded-xl bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="INNER">🧠 Inner</option>
                        <option value="HEALTH">💪 Health</option>
                        <option value="RELATIONSHIP">❤️ Relationship</option>
                        <option value="FINANCE">💰 Finance</option>
                      </select>
                    </div>

                    {/* Language */}
                    <div>
                      <label className="text-xs sm:text-sm font-medium block mb-1.5 sm:mb-2">Language</label>
                      <LanguageSwitcher />
                    </div>
                  </div>

                  {/* Mood */}
                  <div>
                    <label className="text-xs sm:text-sm font-medium block mb-1.5 sm:mb-2">Mood</label>
                    <div className="flex gap-1.5 sm:gap-2 justify-center">
                      {[-2, -1, 0, 1, 2].map((m) => (
                        <button
                          key={m}
                          onClick={() => setMood(m)}
                          className={`text-xl sm:text-2xl transition-all hover:scale-110 ${mood === m ? 'scale-110 sm:scale-125 drop-shadow-lg' : 'opacity-50'}`}
                        >
                          {getMoodEmoji(m)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Resonance */}
                  <div>
                    <label className="text-xs sm:text-sm font-medium block mb-1.5 sm:mb-2">Resonance</label>
                    <div className="flex gap-1.5 sm:gap-2 justify-center">
                      {[0, 1, 2, 3].map((r) => (
                        <button
                          key={r}
                          onClick={() => setResonance(r)}
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl border-2 transition-all hover:scale-105 ${
                            resonance === r
                              ? 'border-purple-500 bg-gradient-to-br from-purple-500/20 to-pink-500/20 shadow-lg'
                              : 'border-border hover:border-purple-300'
                          }`}
                        >
                          <span className="text-sm sm:text-base font-semibold">{r}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
                    onClick={() => setShowQuickCaptureModal(false)}
                    className="w-full sm:flex-1 px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base border-2 border-border rounded-lg sm:rounded-xl font-semibold hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleQuickCapture}
                    disabled={!content.trim() || createLesson.isPending}
                    className="w-full sm:flex-1 btn-modern flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {createLesson.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Send size={16} className="sm:w-[18px] sm:h-[18px]" />
                        Save Lesson
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
