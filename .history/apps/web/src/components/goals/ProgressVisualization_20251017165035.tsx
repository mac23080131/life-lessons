'use client';

import { motion } from 'framer-motion';
import { Trophy, Sparkles, Flame } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

interface ProgressVisualizationProps {
  current: number;
  target: number;
  sprintSize: number;
}

const milestones = [
  { value: 1000, label: '1K', emoji: '🎯', color: 'from-blue-500 to-cyan-500' },
  { value: 2500, label: '2.5K', emoji: '⭐', color: 'from-purple-500 to-pink-500' },
  { value: 5000, label: '5K', emoji: '🔥', color: 'from-orange-500 to-red-500' },
  { value: 7500, label: '7.5K', emoji: '💎', color: 'from-indigo-500 to-purple-500' },
  { value: 10000, label: '10K', emoji: '🏆', color: 'from-yellow-500 to-orange-500' },
];

export function ProgressVisualization({ current, target, sprintSize }: ProgressVisualizationProps) {
  const percentage = (current / target) * 100;
  const currentSprint = Math.floor(current / sprintSize);
  const totalSprints = Math.ceil(target / sprintSize);
  const sprintProgress = (current % sprintSize) / sprintSize * 100;

  return (
    <div className="glass-card p-8 rounded-3xl">
      {/* Main Progress Ring */}
      <div className="flex flex-col lg:flex-row items-center gap-8 mb-8">
        {/* 3D Progress Circle */}
        <div className="relative w-64 h-64 flex-shrink-0">
          {/* Outer glow */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-2xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* SVG Progress */}
          <svg className="relative w-full h-full transform -rotate-90" viewBox="0 0 200 200">
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              className="text-border opacity-20"
            />

            {/* Progress circle */}
            <motion.circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 90}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 90 }}
              animate={{ 
                strokeDashoffset: 2 * Math.PI * 90 * (1 - percentage / 100) 
              }}
              transition={{ duration: 2, ease: 'easeOut' }}
              className="drop-shadow-glow"
            />

            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A855F7" />
                <stop offset="50%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
              className="text-5xl font-bold mb-2 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 bg-clip-text text-transparent"
            >
              {formatNumber(current)}
            </motion.div>
            <div className="text-sm text-muted-foreground">/ {formatNumber(target)}</div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-2xl font-bold mt-2 text-purple-600 dark:text-purple-400"
            >
              {percentage.toFixed(1)}%
            </motion.div>
          </div>
        </div>

        {/* Stats & Info */}
        <div className="flex-1 space-y-6">
          {/* Current Sprint */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Flame className="text-orange-500" size={20} />
                <span className="font-semibold">Sprint {currentSprint + 1} / {totalSprints}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {Math.floor(sprintProgress)}%
              </span>
            </div>
            <div className="w-full h-3 bg-background/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${sprintProgress}%` }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
              />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {current % sprintSize} / {sprintSize} bài học sprint này
            </div>
          </div>

          {/* Milestones */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="text-yellow-500" size={20} />
              <span className="font-semibold">Cột mốc quan trọng</span>
            </div>
            <div className="space-y-2">
              {milestones.map((milestone, index) => {
                const isCompleted = current >= milestone.value;
                const isCurrent = current < milestone.value && (index === 0 || current >= milestones[index - 1].value);
                
                return (
                  <motion.div
                    key={milestone.value}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                      isCompleted
                        ? `bg-gradient-to-r ${milestone.color} bg-opacity-10 border border-current`
                        : isCurrent
                        ? 'bg-background/50 border-2 border-purple-500'
                        : 'bg-background/30 opacity-50'
                    }`}
                  >
                    <div className={`text-2xl ${isCompleted ? 'scale-110' : ''} transition-transform`}>
                      {milestone.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{milestone.label} bài học</div>
                      <div className="text-xs text-muted-foreground">
                        {isCompleted ? 'Đã đạt! 🎉' : isCurrent ? `Còn ${formatNumber(milestone.value - current)} bài` : formatNumber(milestone.value)}
                      </div>
                    </div>
                    {isCompleted && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                      >
                        <Sparkles className={`bg-gradient-to-br ${milestone.color} bg-clip-text text-transparent`} size={20} />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
