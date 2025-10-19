'use client';

import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/hooks/useTranslation';

interface SprintChartProps {
  sprints: Array<{
    id: string;
    index: number;
    target: number;
    done: number;
    startAt: string;
    endAt: string;
  }>;
  currentSprintIndex: number;
}

export function SprintChart({ sprints, currentSprintIndex }: SprintChartProps) {
  const { t } = useTranslation();
  
  // Show only current and next 9 sprints for visualization
  const visibleSprints = sprints.slice(0, 10);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t('goals.sprintChart')}</h3>
      
      <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
        {visibleSprints.map((sprint, index) => {
          const percentage = (sprint.done / sprint.target) * 100;
          const isCurrent = sprint.index === currentSprintIndex;
          const isComplete = sprint.done >= sprint.target;
          
          return (
            <motion.div
              key={sprint.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative"
            >
              {/* Bar Container */}
              <div className="relative h-32 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                {/* Progress Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${percentage}%` }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className={`absolute bottom-0 w-full ${
                    isComplete
                      ? 'bg-gradient-to-t from-green-500 to-emerald-400'
                      : isCurrent
                      ? 'bg-gradient-to-t from-purple-500 to-pink-500'
                      : 'bg-gradient-to-t from-blue-500 to-cyan-400'
                  }`}
                />
                
                {/* Current Sprint Marker */}
                {isCurrent && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-yellow-400 animate-pulse" />
                )}
              </div>
              
              {/* Sprint Number */}
              <p className="text-xs text-center mt-1 font-medium">
                {sprint.index}
              </p>
              
              {/* Progress Count */}
              <p className="text-xs text-center text-gray-500">
                {sprint.done}/{sprint.target}
              </p>
            </motion.div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gradient-to-r from-purple-500 to-pink-500" />
          <span>{t('goals.currentSprint')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gradient-to-r from-green-500 to-emerald-400" />
          <span>{t('goals.done')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gradient-to-r from-blue-500 to-cyan-400" />
          <span>{t('goals.progress')}</span>
        </div>
      </div>
    </div>
  );
}
