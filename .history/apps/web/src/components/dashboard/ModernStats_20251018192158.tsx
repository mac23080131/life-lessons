'use client';

import { motion } from 'framer-motion';
import { 
  Sparkles, 
  TrendingUp, 
  Flame, 
  Target,
  Calendar,
  Brain,
  Zap
} from 'lucide-react';
import { cn, formatNumber } from '@/lib/utils';
import { useAnalytics } from '@/lib/hooks/useAnalytics';
import { useTranslation } from '@/lib/hooks/useTranslation';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  gradient: string;
  delay?: number;
}

export function StatsCard({ title, value, change, icon, gradient, delay = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn(
        'glass-card p-6 rounded-2xl relative overflow-hidden group',
        'hover:shadow-glass-lg transition-all duration-300'
      )}
    >
      {/* Background gradient blur */}
      <div className={cn(
        'absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity',
        `bg-gradient-to-br ${gradient}`
      )} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center',
            `bg-gradient-to-br ${gradient}`,
            'shadow-lg'
          )}>
            <div className="text-white">
              {icon}
            </div>
          </div>
          
          {change !== undefined && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.2, type: 'spring' }}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-semibold',
                change >= 0 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              )}
            >
              {change >= 0 ? '+' : ''}{change}%
            </motion.div>
          )}
        </div>
        
        <h3 className="text-sm font-medium text-muted-foreground mb-1">
          {title}
        </h3>
        
        <motion.p 
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.1, type: 'spring' }}
          className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70"
        >
          {typeof value === 'number' ? formatNumber(value) : value}
        </motion.p>
      </div>
    </motion.div>
  );
}

interface QuickStatProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

export function QuickStat({ label, value, icon, color }: QuickStatProps) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
      <div className={cn(
        'w-10 h-10 rounded-lg flex items-center justify-center',
        color
      )}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  );
}

export function ModernDashboardStats() {
  const { data: analytics, isLoading } = useAnalytics();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card p-6 rounded-2xl h-32 animate-pulse">
            <div className="h-12 w-12 bg-muted rounded-xl mb-4" />
            <div className="h-4 w-20 bg-muted rounded mb-2" />
            <div className="h-8 w-16 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  // Calculate stats from analytics data
  const total = analytics?.totalLessons || 0;
  const thisWeek = analytics?.weeklyCount || 0;
  const streak = analytics?.currentStreak || 0;
  const avgPerDay = total > 0 && analytics?.daysActive 
    ? (total / analytics.daysActive).toFixed(1)
    : '0.0';

  // Calculate percentage changes (comparing with previous period)
  const totalChange = analytics?.totalChange || 0;
  const weeklyChange = analytics?.weeklyChange || 0;

  // Domain breakdown
  const domainCounts = analytics?.domainBreakdown || {
    INNER: 0,
    HEALTH: 0,
    RELATIONSHIP: 0,
    FINANCE: 0,
  };

  return (
    <div className="space-y-6">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title={t('dashboard.totalLessons') || 'Total Lessons'}
          value={total}
          change={totalChange}
          icon={<Sparkles size={20} />}
          gradient="from-purple-500 to-pink-500"
          delay={0}
        />
        
        <StatsCard
          title={t('dashboard.thisWeek') || 'This Week'}
          value={thisWeek}
          change={weeklyChange}
          icon={<TrendingUp size={20} />}
          gradient="from-blue-500 to-cyan-500"
          delay={0.1}
        />
        
        <StatsCard
          title={t('dashboard.currentStreak') || 'Current Streak'}
          value={`${streak} ${t('dashboard.days') || 'days'}`}
          icon={<Flame size={20} />}
          gradient="from-orange-500 to-red-500"
          delay={0.2}
        />
        
        <StatsCard
          title={t('dashboard.dailyAvg') || 'Daily Avg'}
          value={avgPerDay}
          icon={<Target size={20} />}
          gradient="from-green-500 to-emerald-500"
          delay={0.3}
        />
      </div>

      {/* Quick Stats Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6 rounded-2xl"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Zap className="text-primary" size={20} />
          {t('dashboard.quickInsights') || 'Quick Insights'}
        </h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <QuickStat
            label={t('domains.INNER') || 'Inner'}
            value={domainCounts.INNER || 0}
            icon={<Brain size={16} />}
            color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
          />
          
          <QuickStat
            label={t('domains.HEALTH') || 'Health'}
            value={domainCounts.HEALTH || 0}
            icon={<Target size={16} />}
            color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
          />
          
          <QuickStat
            label={t('domains.RELATIONSHIP') || 'Relationship'}
            value={domainCounts.RELATIONSHIP || 0}
            icon={<Sparkles size={16} />}
            color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
          />
          
          <QuickStat
            label={t('domains.FINANCE') || 'Finance'}
            value={domainCounts.FINANCE || 0}
            icon={<TrendingUp size={16} />}
            color="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
          />
        </div>
      </motion.div>
    </div>
  );
}
