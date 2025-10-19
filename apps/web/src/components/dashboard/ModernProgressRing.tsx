'use client';

import { motion } from 'framer-motion';
import { Trophy, Zap } from 'lucide-react';
import { cn, formatNumber } from '@/lib/utils';

interface ModernProgressRingProps {
  current: number;
  target: number;
  size?: 'sm' | 'md' | 'lg';
  showMilestones?: boolean;
}

export function ModernProgressRing({ 
  current, 
  target, 
  size = 'lg',
  showMilestones = true 
}: ModernProgressRingProps) {
  const percentage = Math.min((current / target) * 100, 100);
  const circumference = 2 * Math.PI * 90; // radius = 90
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
  };
  
  const textSizes = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-4xl',
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 1 }}
        className={cn('relative', sizeClasses[size])}
      >
        {/* Background circle */}
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="90"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            className="text-muted/20"
          />
          
          {/* Progress circle with gradient */}
          <motion.circle
            cx="50%"
            cy="50%"
            r="90"
            fill="none"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            animate={{ strokeDashoffset }}
            transition={{ duration: 2, ease: 'easeOut' }}
            className="text-primary drop-shadow-[0_0_12px_hsl(var(--primary)/0.5)]"
            style={{
              stroke: 'url(#progressGradient)',
            }}
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(262, 83%, 58%)" />
              <stop offset="50%" stopColor="hsl(217, 91%, 60%)" />
              <stop offset="100%" stopColor="hsl(336, 84%, 65%)" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="text-center"
          >
            <p className={cn('font-bold text-gradient', textSizes[size])}>
              {formatNumber(current)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              of {formatNumber(target)}
            </p>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-xs text-primary font-semibold mt-2"
            >
              {percentage.toFixed(1)}%
            </motion.p>
          </motion.div>
        </div>
        
        {/* Glow effect */}
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 rounded-full blur-2xl bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 opacity-30"
        />
      </motion.div>
      
      {/* Milestones */}
      {showMilestones && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="w-full max-w-md"
        >
          <div className="glass-card p-4 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Trophy className="text-yellow-500" size={16} />
                Milestones
              </h4>
              <Zap className="text-primary animate-pulse-soft" size={16} />
            </div>
            
            <div className="space-y-2">
              {[1000, 5000, 10000].map((milestone) => {
                const achieved = current >= milestone;
                const progress = Math.min((current / milestone) * 100, 100);
                
                return (
                  <div key={milestone} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className={cn(
                        'font-medium',
                        achieved ? 'text-primary' : 'text-muted-foreground'
                      )}>
                        {formatNumber(milestone)} lessons
                      </span>
                      <span className={cn(
                        'font-bold',
                        achieved ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
                      )}>
                        {achieved ? '✓' : `${progress.toFixed(0)}%`}
                      </span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, delay: 1 + milestone / 10000 }}
                        className={cn(
                          'h-full rounded-full',
                          achieved 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                            : 'bg-gradient-to-r from-purple-500 to-blue-500'
                        )}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
