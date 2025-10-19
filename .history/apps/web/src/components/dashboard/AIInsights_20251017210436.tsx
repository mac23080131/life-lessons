'use client';

import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Target, Lightbulb } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AIInsight {
  type: 'streak' | 'goal' | 'suggestion' | 'achievement';
  title: string;
  description: string;
  action?: string;
  actionUrl?: string;
}

const mockInsights: AIInsight[] = [
  {
    type: 'streak',
    title: 'Streak đang tăng! 🔥',
    description: 'Bạn đã ghi bài học 3 ngày liên tiếp. Tiếp tục phát huy!',
    action: 'Xem thống kê',
    actionUrl: '/analytics'
  },
  {
    type: 'suggestion',
    title: 'Gợi ý ritual buổi tối',
    description: 'Hãy thử "3 điều biết ơn" trước khi ngủ để kết thúc ngày tích cực',
    action: 'Thử ngay',
    actionUrl: '/dashboard'
  },
  {
    type: 'goal',
    title: 'Bạn thiếu domain Health',
    description: 'Tuần này chưa có bài học nào về Sức khỏe. Cân bằng 4 lĩnh vực sẽ tốt hơn!',
    action: 'Ghi bài học',
    actionUrl: '/dashboard'
  }
];

const iconMap = {
  streak: TrendingUp,
  goal: Target,
  suggestion: Lightbulb,
  achievement: Sparkles,
};

const colorMap = {
  streak: 'from-orange-500 to-red-500',
  goal: 'from-purple-500 to-pink-500',
  suggestion: 'from-blue-500 to-cyan-500',
  achievement: 'from-green-500 to-emerald-500',
};

export function AIInsightsCarousel() {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="text-purple-500" size={20} />
          <h3 className="font-semibold">AI Insights</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockInsights.map((insight, idx) => {
          const Icon = iconMap[insight.type];
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="glass-card p-4 rounded-xl cursor-pointer group relative overflow-hidden"
              onClick={() => insight.actionUrl && router.push(insight.actionUrl)}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${colorMap[insight.type]} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              <div className="relative z-10">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorMap[insight.type]} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="text-white" size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">{insight.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {insight.description}
                    </p>
                  </div>
                </div>

                {insight.action && (
                  <div className="flex justify-end">
                    <span className="text-xs font-medium text-purple-600 dark:text-purple-400 group-hover:underline">
                      {insight.action} →
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
