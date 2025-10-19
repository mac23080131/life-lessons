'use client';

import { useAnalytics } from '@/lib/hooks/useAnalytics';
import { useGoal } from '@/lib/hooks/useGoals';
import { useLessons, useCreateLesson } from '@/lib/hooks/useLessons';
import { useState } from 'react';
import { getMoodEmoji, getDomainColor } from '@/lib/utils';
import { ModernDashboardStats } from '@/components/dashboard/ModernStats';
import { ModernProgressRing } from '@/components/dashboard/ModernProgressRing';
import { motion } from 'framer-motion';
import { Sparkles, Send } from 'lucide-react';

export default function DashboardPage() {
  const { data: analytics } = useAnalytics();
  const { data: goal } = useGoal();
  const { data: lessonsData } = useLessons({ limit: 5 });
  const createLesson = useCreateLesson();

  const [content, setContent] = useState('');
  const [domain, setDomain] = useState('INNER');
  const [mood, setMood] = useState(0);
  const [resonance, setResonance] = useState(1);

  const handleQuickCapture = () => {
    if (!content.trim()) return;

    createLesson.mutate({
      contentRaw: content,
      domain,
      mood,
      resonance,
      tags: [],
    }, {
      onSuccess: () => {
        setContent('');
        setMood(0);
        setResonance(1);
      },
    });
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
          </div>
        
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Hôm nay mình học được..."
            className="w-full h-32 px-4 py-3 border-2 border-border rounded-xl resize-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background/50 backdrop-blur-sm transition-all"
          />

          <div className="mt-4 flex flex-wrap gap-4 items-end">
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
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">Resonance</label>
            <div className="flex gap-2">
              {[0, 1, 2, 3].map((r) => (
                <button
                  key={r}
                  onClick={() => setResonance(r)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    resonance === r
                      ? 'border-purple-600 bg-purple-100 dark:bg-purple-900'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleQuickCapture}
            disabled={!content.trim() || createLesson.isPending}
            className="ml-auto px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {createLesson.isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Recent Lessons */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Recent Lessons</h2>
        
        {lessonsData?.lessons?.length === 0 ? (
          <p className="text-gray-500">No lessons yet. Create your first lesson above!</p>
        ) : (
          <div className="space-y-3">
            {lessonsData?.lessons?.map((lesson: any) => (
              <div
                key={lesson.id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {lesson.contentRaw}
                    </p>
                  </div>
                  <span className={`ml-4 px-2 py-1 text-xs font-medium rounded ${getDomainColor(lesson.domain)}`}>
                    {lesson.domain}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                  <span>{getMoodEmoji(lesson.mood)}</span>
                  <span>•</span>
                  <span>{new Date(lesson.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
