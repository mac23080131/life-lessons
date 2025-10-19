'use client';

import { useState } from 'react';
import { useGoal } from '@/lib/hooks/useGoals';
import { useLessons } from '@/lib/hooks/useLessons';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { motion } from 'framer-motion';
import { Settings, Sparkles } from 'lucide-react';
import { EditGoalModal } from '@/components/goals/EditGoalModal';
import { SprintChart } from '@/components/goals/SprintChart';
import { WeeklyReviewPanel } from '@/components/goals/WeeklyReviewPanel';
import { Recommendations } from '@/components/goals/Recommendations';
import { toast } from 'sonner';

export default function GoalsPage() {
  const { data: goal, isLoading } = useGoal();
  const { data: lessonsData } = useLessons({ limit: 1000 });
  const { t } = useTranslation();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Calculate this week's lessons for recommendations
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  const lessonsThisWeek = (lessonsData?.lessons || []).filter((lesson: any) => {
    return new Date(lesson.createdAt) >= startOfWeek;
  });

  const handleSaveGoal = (data: { target: number; sprintSize: number; cadence: string }) => {
    // TODO: API call to update goal
    console.log('Saving goal:', data);
    toast.success(t('common.success'));
  };

  const handleStartReview = () => {
    // TODO: Navigate to review page or open modal
    toast.info('Weekly review feature coming soon!');
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="glass-card p-12 text-center">
        <Sparkles className="w-16 h-16 text-purple-500 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400 mb-2 text-lg font-medium">
          {t('goals.noGoalYet')}
        </p>
        <p className="text-sm text-gray-400">
          {t('goals.goalAutoCreated')}
        </p>
      </div>
    );
  }

  const progressPercent = ((goal.current / goal.target) * 100).toFixed(1);
  const currentSprint = Math.floor(goal.current / goal.sprintSize) + 1;
  const sprintProgress = goal.current % goal.sprintSize;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('goals.title')}</h1>
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:shadow-lg transition-shadow"
        >
          <Settings size={16} />
          {t('goals.editGoal')}
        </button>
      </div>

      {/* Progress Overview */}
      <div className="glass-card p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Progress Ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-32 h-32">
                <circle
                  className="text-gray-200 dark:text-gray-700"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="56"
                  cx="64"
                  cy="64"
                />
                <circle
                  className="text-purple-600"
                  strokeWidth="8"
                  strokeDasharray={`${(parseFloat(progressPercent) / 100) * 351.86} 351.86`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="56"
                  cx="64"
                  cy="64"
                  transform="rotate(-90 64 64)"
                />
              </svg>
              <span className="absolute text-2xl font-bold">{progressPercent}%</span>
            </div>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              {t('goals.overallProgress')}
            </p>
          </motion.div>

          {/* Total Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <p className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {goal.current}
            </p>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {t('goals.of')} {goal.target} {t('goals.lessonsLabel')}
            </p>
            <p className="mt-4 text-sm text-gray-500">
              {goal.target - goal.current} {t('goals.remaining')}
            </p>
          </motion.div>

          {/* Current Sprint */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {currentSprint}
            </p>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {t('goals.currentSprint')}
            </p>
            <p className="mt-4 text-sm text-gray-500">
              {sprintProgress}/{goal.sprintSize} {t('goals.lessonsLabel')}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Sprint Progress & Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sprint Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-semibold mb-4">
              {t('goals.sprint')} {currentSprint} {t('goals.progress')}
            </h2>
            
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block text-purple-600">
                    {sprintProgress} / {goal.sprintSize}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-purple-600">
                    {((sprintProgress / goal.sprintSize) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-xl bg-gray-200 dark:bg-gray-700">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(sprintProgress / goal.sprintSize) * 100}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-purple-600 to-pink-600"
                ></motion.div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                💡 {t('goals.keepItUp')} {goal.sprintSize - sprintProgress} {t('goals.moreLessons')}
              </p>
            </div>
          </motion.div>

          {/* Sprint Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <SprintChart
              sprints={goal.sprints || []}
              currentSprintIndex={currentSprint}
            />
          </motion.div>

          {/* Recommendations */}
          <Recommendations lessonsThisWeek={lessonsThisWeek} />
        </div>

        {/* Right Column - Ritual & Settings */}
        <div className="space-y-6">
          {/* Weekly Review */}
          <WeeklyReviewPanel onStartReview={handleStartReview} />

          {/* Goal Settings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-semibold mb-4">{t('goals.goalSettings')}</h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{t('goals.target')}:</span>
                <span className="font-semibold">{goal.target} {t('goals.lessonsLabel')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{t('goals.sprintSize')}:</span>
                <span className="font-semibold">{goal.sprintSize} {t('goals.lessonsLabel')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{t('goals.cadence')}:</span>
                <span className="font-semibold capitalize">{goal.cadence}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{t('goals.status')}:</span>
                <span className={`font-semibold capitalize ${
                  goal.status === 'active' ? 'text-green-600' :
                  goal.status === 'paused' ? 'text-amber-600' :
                  'text-gray-600'
                }`}>
                  {t(`goals.${goal.status}`)}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Edit Goal Modal */}
      <EditGoalModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        goal={goal}
        onSave={handleSaveGoal}
      />
    </div>
  );
}
