'use client';

import { motion } from 'framer-motion';
import { Calendar, CheckCircle } from 'lucide-react';
import { useTranslation } from '@/lib/hooks/useTranslation';

interface WeeklyReviewPanelProps {
  onStartReview: () => void;
}

export function WeeklyReviewPanel({ onStartReview }: WeeklyReviewPanelProps) {
  const { t } = useTranslation();
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl text-white">
          <Calendar size={24} />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">{t('goals.weeklyReview')}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {t('goals.weeklyReviewDesc')}
          </p>
          
          {/* Review Questions Preview */}
          <div className="space-y-2 mb-4">
            <div className="flex items-start gap-2 text-sm">
              <CheckCircle size={16} className="text-purple-500 mt-0.5 flex-shrink-0" />
              <span>What were my biggest wins this week?</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <CheckCircle size={16} className="text-purple-500 mt-0.5 flex-shrink-0" />
              <span>What patterns did I notice?</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <CheckCircle size={16} className="text-purple-500 mt-0.5 flex-shrink-0" />
              <span>What do I want to focus on next week?</span>
            </div>
          </div>
          
          <button
            onClick={onStartReview}
            className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:shadow-lg transition-shadow"
          >
            {t('goals.startReview')}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
