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
import { useLessons } from '@/lib/hooks/useLessons';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { useMemo } from 'react';

// Add Lesson interface for type safety
interface Lesson {
  id: string;
  createdAt: string;
  domain: 'INNER' | 'HEALTH' | 'RELATIONSHIP' | 'FINANCE';
  [key: string]: any;
}

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
  const { data: lessonsData, isLoading } = useLessons({ limit: 1000 }); // Fetch all lessons
  const { t } = useTranslation();

  // Calculate stats from lessons data
  const stats = useMemo(() => {
    // API returns { lessons, total } not { items, total }
    const lessons = lessonsData?.lessons;
    const apiTotal = lessonsData?.total;
    
    if (!lessons || lessons.length === 0) {
      return {
        total: 0,
        thisWeek: 0,
        streak: 0,
        avgPerDay: 0,
        domainCounts: { INNER: 0, HEALTH: 0, RELATIONSHIP: 0, FINANCE: 0 },
        totalChange: 0,
        weeklyChange: 0,
      };
    }

    // Use API total (counts ALL lessons) vs lessons.length (current page only)
    const total = apiTotal || lessons.length;
    
    console.log('📊 Stats Debug:', {
      apiTotal,
      lessonsLength: lessons.length,
      firstLesson: lessons[0]?.createdAt,
      lastLesson: lessons[lessons.length - 1]?.createdAt,
    });

    // Calculate this week's lessons
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0);

    const thisWeek = lessons.filter((lesson: Lesson) => {
      const lessonDate = new Date(lesson.createdAt);
      return lessonDate >= startOfWeek;
    }).length;
      return lessonDate >= startOfWeek;
    }).length;

    // Calculate last week for comparison
    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
    const lastWeek = lessons.filter((lesson: Lesson) => {
      const lessonDate = new Date(lesson.createdAt);
      return lessonDate >= startOfLastWeek && lessonDate < startOfWeek;
    }).length;

    const weeklyChange = lastWeek > 0 
      ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100)
      : thisWeek > 0 ? 100 : 0;

    // Calculate current streak
    const sortedLessons = [...lessons].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const lesson of sortedLessons) {
      const lessonDate = new Date(lesson.createdAt);
      lessonDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor((currentDate.getTime() - lessonDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 0 || diffDays === 1) {
        if (diffDays === 1) {
          currentDate = lessonDate;
          streak++;
        } else if (streak === 0) {
          streak = 1;
        }
      } else if (diffDays > 1) {
        break;
      }
    }

    // Calculate days active and avg per day
    if (total > 0) {
      const oldestLesson = new Date(Math.min(...lessons.map((l: Lesson) => new Date(l.createdAt).getTime())));
      const daysActive = Math.max(1, Math.ceil((now.getTime() - oldestLesson.getTime()) / (1000 * 60 * 60 * 24)));
      const avgPerDay = (total / daysActive).toFixed(1);

      // Calculate total change (last 30 days vs previous 30 days)
      const last30Days = new Date(now);
      last30Days.setDate(last30Days.getDate() - 30);
      const prev60Days = new Date(now);
      prev60Days.setDate(prev60Days.getDate() - 60);

      const last30Count = lessons.filter((l: Lesson) => new Date(l.createdAt) >= last30Days).length;
      const prev30Count = lessons.filter((l: Lesson) => {
        const d = new Date(l.createdAt);
        return d >= prev60Days && d < last30Days;
      }).length;

      const totalChange = prev30Count > 0
        ? Math.round(((last30Count - prev30Count) / prev30Count) * 100)
        : last30Count > 0 ? 100 : 0;

      // Domain breakdown
      const domainCounts = lessons.reduce((acc: Record<string, number>, lesson: Lesson) => {
        const domain = lesson.domain || 'INNER';
        acc[domain] = (acc[domain] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        total,
        thisWeek,
        streak,
        avgPerDay: parseFloat(avgPerDay),
        domainCounts: {
          INNER: domainCounts.INNER || 0,
          HEALTH: domainCounts.HEALTH || 0,
          RELATIONSHIP: domainCounts.RELATIONSHIP || 0,
          FINANCE: domainCounts.FINANCE || 0,
        },
        totalChange,
        weeklyChange,
      };
    }

    return {
      total: 0,
      thisWeek: 0,
      streak: 0,
      avgPerDay: 0,
      domainCounts: { INNER: 0, HEALTH: 0, RELATIONSHIP: 0, FINANCE: 0 },
      totalChange: 0,
      weeklyChange: 0,
    };
  }, [lessonsData]);

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

  return (
    <div className="space-y-6">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title={t('dashboard.totalLessons') || 'Total Lessons'}
          value={stats.total}
          change={stats.totalChange}
          icon={<Sparkles size={20} />}
          gradient="from-purple-500 to-pink-500"
          delay={0}
        />
        
        <StatsCard
          title={t('dashboard.thisWeek') || 'This Week'}
          value={stats.thisWeek}
          change={stats.weeklyChange}
          icon={<TrendingUp size={20} />}
          gradient="from-blue-500 to-cyan-500"
          delay={0.1}
        />
        
        <StatsCard
          title={t('dashboard.currentStreak') || 'Current Streak'}
          value={`${stats.streak} ${t('dashboard.days') || 'days'}`}
          icon={<Flame size={20} />}
          gradient="from-orange-500 to-red-500"
          delay={0.2}
        />
        
        <StatsCard
          title={t('dashboard.dailyAvg') || 'Daily Avg'}
          value={stats.avgPerDay}
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
            value={stats.domainCounts.INNER}
            icon={<Brain size={16} />}
            color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
          />
          
          <QuickStat
            label={t('domains.HEALTH') || 'Health'}
            value={stats.domainCounts.HEALTH}
            icon={<Target size={16} />}
            color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
          />
          
          <QuickStat
            label={t('domains.RELATIONSHIP') || 'Relationship'}
            value={stats.domainCounts.RELATIONSHIP}
            icon={<Sparkles size={16} />}
            color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
          />
          
          <QuickStat
            label={t('domains.FINANCE') || 'Finance'}
            value={stats.domainCounts.FINANCE}
            icon={<TrendingUp size={16} />}
            color="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
          />
        </div>
      </motion.div>
    </div>
  );
}
