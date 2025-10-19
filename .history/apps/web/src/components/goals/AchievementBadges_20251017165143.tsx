'use client';

import { motion } from 'framer-motion';
import { Award, Star, Flame, Zap, Target, Crown, Rocket, Heart } from 'lucide-react';

interface AchievementBadgesProps {
  current: number;
  streak: number;
}

const achievements = [
  {
    id: 'first_lesson',
    name: 'Khởi đầu',
    description: 'Tạo bài học đầu tiên',
    icon: Rocket,
    requirement: 1,
    color: 'from-blue-500 to-cyan-500',
    emoji: '🚀',
  },
  {
    id: 'week_streak',
    name: 'Kiên trì',
    description: '7 ngày liên tiếp',
    icon: Flame,
    requirement: 7,
    color: 'from-orange-500 to-red-500',
    emoji: '🔥',
    isStreak: true,
  },
  {
    id: 'hundred',
    name: 'Trăm bài',
    description: 'Đạt 100 bài học',
    icon: Star,
    requirement: 100,
    color: 'from-yellow-500 to-orange-500',
    emoji: '⭐',
  },
  {
    id: 'month_streak',
    name: 'Bền bỉ',
    description: '30 ngày liên tiếp',
    icon: Zap,
    requirement: 30,
    color: 'from-purple-500 to-pink-500',
    emoji: '⚡',
    isStreak: true,
  },
  {
    id: 'five_hundred',
    name: 'Năm trăm',
    description: 'Đạt 500 bài học',
    icon: Target,
    requirement: 500,
    color: 'from-green-500 to-emerald-500',
    emoji: '🎯',
  },
  {
    id: 'thousand',
    name: 'Nghìn bài',
    description: 'Đạt 1,000 bài học',
    icon: Crown,
    requirement: 1000,
    color: 'from-indigo-500 to-purple-500',
    emoji: '👑',
  },
  {
    id: 'hundred_streak',
    name: 'Vĩnh cửu',
    description: '100 ngày liên tiếp',
    icon: Heart,
    requirement: 100,
    color: 'from-pink-500 to-rose-500',
    emoji: '💖',
    isStreak: true,
  },
  {
    id: 'master',
    name: 'Bậc thầy',
    description: 'Đạt 10,000 bài học',
    icon: Award,
    requirement: 10000,
    color: 'from-yellow-500 via-orange-500 to-red-500',
    emoji: '🏆',
  },
];

export function AchievementBadges({ current, streak }: AchievementBadgesProps) {
  const getProgress = (achievement: typeof achievements[0]) => {
    const value = achievement.isStreak ? streak : current;
    return Math.min((value / achievement.requirement) * 100, 100);
  };

  const isUnlocked = (achievement: typeof achievements[0]) => {
    const value = achievement.isStreak ? streak : current;
    return value >= achievement.requirement;
  };

  const unlockedCount = achievements.filter(a => isUnlocked(a)).length;

  return (
    <div className="glass-card p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Award className="text-yellow-500" size={24} />
          Thành tích
        </h3>
        <div className="text-sm text-muted-foreground">
          {unlockedCount}/{achievements.length} đạt được
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {achievements.map((achievement, index) => {
          const Icon = achievement.icon;
          const unlocked = isUnlocked(achievement);
          const progress = getProgress(achievement);

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, type: 'spring', stiffness: 300, damping: 20 }}
              className={`relative p-4 rounded-2xl border transition-all ${
                unlocked
                  ? `bg-gradient-to-br ${achievement.color} bg-opacity-10 border-current shadow-lg hover:scale-105`
                  : 'bg-background/30 border-border opacity-60 hover:opacity-80'
              }`}
            >
              {/* Unlock animation */}
              {unlocked && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, delay: index * 0.05 + 0.3 }}
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg"
                >
                  <Star className="text-white" size={16} fill="currentColor" />
                </motion.div>
              )}

              {/* Icon */}
              <div className={`w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center ${
                unlocked
                  ? `bg-gradient-to-br ${achievement.color}`
                  : 'bg-background/50'
              }`}>
                {unlocked ? (
                  <span className="text-3xl">{achievement.emoji}</span>
                ) : (
                  <Icon className="text-muted-foreground" size={28} />
                )}
              </div>

              {/* Content */}
              <div className="text-center">
                <div className={`font-semibold text-sm mb-1 ${
                  unlocked ? `bg-gradient-to-br ${achievement.color} bg-clip-text text-transparent` : ''
                }`}>
                  {achievement.name}
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  {achievement.description}
                </div>

                {/* Progress bar */}
                {!unlocked && (
                  <div className="mt-3">
                    <div className="w-full h-1.5 bg-background/50 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, delay: index * 0.05 }}
                        className={`h-full rounded-full bg-gradient-to-r ${achievement.color}`}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {Math.floor(progress)}%
                    </div>
                  </div>
                )}

                {unlocked && (
                  <div className="mt-2 text-xs font-medium text-green-600 dark:text-green-400">
                    ✓ Đã đạt
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Overall progress */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Tiến độ tổng</span>
          <span className="text-sm text-muted-foreground">
            {((unlockedCount / achievements.length) * 100).toFixed(0)}%
          </span>
        </div>
        <div className="w-full h-3 bg-background/50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
