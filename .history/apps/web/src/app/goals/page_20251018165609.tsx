'use client';

import { useGoal, useCreateGoal, useGoalRoadmap } from '@/lib/hooks/useGoals';
import { useAnalytics } from '@/lib/hooks/useAnalytics';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Target, Sparkles, ArrowLeft } from 'lucide-react';
import { GoalStats } from '@/components/goals/GoalStats';
import { ProgressVisualization } from '@/components/goals/ProgressVisualization';
import { SprintTimeline } from '@/components/goals/SprintTimeline';
import { AchievementBadges } from '@/components/goals/AchievementBadges';
import { toast } from 'sonner';

export default function GoalsPage() {
  const router = useRouter();
  const { data: goal, isLoading } = useGoal();
  const { data: analytics } = useAnalytics();
  const createGoal = useCreateGoal();
  const { data: roadmap } = useGoalRoadmap(goal?.id || '');

  const handleCreateGoal = async () => {
    try {
      await createGoal.mutateAsync();
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-8 mb-8 glass-card"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-yellow-500/20 via-orange-500/20 to-red-500/20 rounded-full blur-3xl" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                <Target className="text-white" size={28} />
              </div>
              <h1 className="text-4xl font-bold">Mục tiêu 10,000 🏆</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              {goal 
                ? `Hành trình phát triển bản thân với ${goal.target.toLocaleString()} bài học`
                : 'Bắt đầu hành trình 10,000 bài học của bạn'
              }
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/dashboard')}
            className="btn-modern flex items-center gap-2 px-6 py-3 rounded-xl"
          >
            <ArrowLeft size={20} />
            Dashboard
          </motion.button>
        </div>
      </motion.div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-16">
          <div className="inline-block w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-muted-foreground">Đang tải...</p>
        </div>
      )}

      {/* No Goal - Onboarding */}
      {!goal && !isLoading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 rounded-3xl text-center max-w-2xl mx-auto"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-yellow-500/20 via-orange-500/20 to-red-500/20 flex items-center justify-center">
            <Sparkles className="text-yellow-500" size={48} />
          </div>
          
          <h2 className="text-3xl font-bold mb-4">
            Bắt đầu hành trình 10,000 bài học
          </h2>
          
          <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
            Mỗi sprint 100 bài học sẽ giúp bạn phát triển đều đặn, bền vững và đạt được sự thay đổi lớn trong cuộc sống
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8 max-w-lg mx-auto">
            <div className="p-4 rounded-xl bg-background/50">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-sm font-medium">100 sprints</div>
              <div className="text-xs text-muted-foreground">Mỗi sprint 100 bài</div>
            </div>
            <div className="p-4 rounded-xl bg-background/50">
              <div className="text-3xl mb-2">📈</div>
              <div className="text-sm font-medium">Theo dõi</div>
              <div className="text-xs text-muted-foreground">Tiến độ realtime</div>
            </div>
            <div className="p-4 rounded-xl bg-background/50">
              <div className="text-3xl mb-2">🏆</div>
              <div className="text-sm font-medium">Thành tích</div>
              <div className="text-xs text-muted-foreground">Badges & rewards</div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateGoal}
            disabled={createGoal.isPending}
            className="btn-modern px-8 py-4 text-lg rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createGoal.isPending ? (
              <>
                <div className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Đang tạo...
              </>
            ) : (
              <>
                <Sparkles size={20} className="inline mr-2" />
                Tạo mục tiêu ngay
              </>
            )}
          </motion.button>
        </motion.div>
      )}

      {/* Goal Dashboard */}
      {goal && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          {/* Stats Cards */}
          <GoalStats goal={goal} analytics={analytics} />

          {/* Progress Visualization */}
          <ProgressVisualization
            current={goal.current}
            target={goal.target}
            sprintSize={goal.sprintSize}
          />

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sprint Timeline */}
            {goal.sprints && goal.sprints.length > 0 && (
              <SprintTimeline
                sprints={goal.sprints}
                currentSprintIndex={roadmap?.currentSprint?.index}
              />
            )}

            {/* Achievement Badges */}
            <AchievementBadges
              current={goal.current}
              streak={analytics?.streak || 0}
            />
          </div>

          {/* Motivation Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="glass-card p-6 rounded-2xl border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-pink-500/5"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="text-white" size={24} />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Mẹo để đạt mục tiêu 💡</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Ghi chép đều đặn mỗi ngày, dù chỉ 1-2 bài học nhỏ</li>
                  <li>• Đặt nhắc nhở vào khung giờ cố định (buổi tối hoặc sáng sớm)</li>
                  <li>• Chia nhỏ mục tiêu thành các sprint 100 bài để dễ quản lý</li>
                  <li>• Review và tổng kết mỗi sprint để học hỏi từ trải nghiệm</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
