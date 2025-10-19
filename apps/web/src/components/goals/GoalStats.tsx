'use client';

import { motion } from 'framer-motion';
import { Trophy, Target, Zap, Calendar, TrendingUp } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

interface GoalStatsProps {
  goal: {
    current: number;
    target: number;
    sprintSize: number;
    cadence: string;
  };
  analytics?: {
    totalLessons?: number;
    streak?: number;
  };
}

export function GoalStats({ goal, analytics }: GoalStatsProps) {
  const percentage = (goal.current / goal.target) * 100;
  const sprintsRemaining = Math.ceil((goal.target - goal.current) / goal.sprintSize);
  const sprintsCompleted = Math.floor(goal.current / goal.sprintSize);
  const totalSprints = Math.ceil(goal.target / goal.sprintSize);

  const stats = [
    {
      icon: Target,
      label: 'Tiến độ',
      value: `${percentage.toFixed(1)}%`,
      subValue: `${formatNumber(goal.current)} / ${formatNumber(goal.target)}`,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-500/10 to-pink-500/10',
      borderColor: 'border-purple-500/20',
    },
    {
      icon: Trophy,
      label: 'Sprint hoàn thành',
      value: sprintsCompleted.toString(),
      subValue: `${totalSprints} sprints tổng`,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'from-yellow-500/10 to-orange-500/10',
      borderColor: 'border-yellow-500/20',
    },
    {
      icon: Zap,
      label: 'Sprint còn lại',
      value: sprintsRemaining.toString(),
      subValue: `${goal.sprintSize} bài/sprint`,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-500/10 to-cyan-500/10',
      borderColor: 'border-blue-500/20',
    },
    {
      icon: Calendar,
      label: 'Streak hiện tại',
      value: `${analytics?.streak || 0}`,
      subValue: 'ngày liên tiếp',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-500/10 to-emerald-500/10',
      borderColor: 'border-green-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, type: 'spring', stiffness: 300, damping: 30 }}
            className={`glass-card p-6 rounded-2xl border ${stat.borderColor} hover:shadow-xl transition-all group`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.bgColor} border ${stat.borderColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Icon className={`bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} size={24} />
              </div>
              <div className={`p-1 rounded-lg bg-gradient-to-br ${stat.bgColor}`}>
                <TrendingUp size={16} className={`bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} />
              </div>
            </div>
            
            <div className="text-3xl font-bold mb-1 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent">
              {stat.value}
            </div>
            <div className="text-sm font-medium text-muted-foreground mb-1">
              {stat.label}
            </div>
            <div className="text-xs text-muted-foreground">
              {stat.subValue}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
