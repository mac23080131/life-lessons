'use client';

import { motion } from 'framer-motion';
import { AlertCircle, TrendingUp, Brain, Heart, DollarSign, Activity } from 'lucide-react';
import { useTranslation } from '@/lib/hooks/useTranslation';

interface RecommendationsProps {
  lessonsThisWeek: Array<{ domain: string }>;
}

export function Recommendations({ lessonsThisWeek }: RecommendationsProps) {
  const { t } = useTranslation();
  
  // Calculate domain distribution
  const domainCounts = lessonsThisWeek.reduce((acc, lesson) => {
    acc[lesson.domain] = (acc[lesson.domain] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Find missing or low domains
  const allDomains = ['INNER', 'HEALTH', 'RELATIONSHIP', 'FINANCE'];
  const missingDomains = allDomains.filter(domain => !domainCounts[domain] || domainCounts[domain] < 2);
  
  const getDomainIcon = (domain: string) => {
    switch (domain) {
      case 'INNER': return <Brain size={16} />;
      case 'HEALTH': return <Activity size={16} />;
      case 'RELATIONSHIP': return <Heart size={16} />;
      case 'FINANCE': return <DollarSign size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };
  
  if (missingDomains.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800"
      >
        <div className="flex items-start gap-3">
          <div className="p-2 bg-green-500 text-white rounded-lg">
            <TrendingUp size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-green-900 dark:text-green-100">Great balance!</h3>
            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
              You're maintaining a good balance across all life domains this week.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <AlertCircle className="text-amber-500" size={20} />
        {t('goals.recommendations')}
      </h3>
      
      <div className="space-y-3">
        {missingDomains.map((domain, index) => (
          <motion.div
            key={domain}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500 text-white rounded-lg">
                {getDomainIcon(domain)}
              </div>
              <div>
                <p className="font-medium text-sm">
                  {t('goals.missingDomain')}: {t(`domains.${domain}`)}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {domainCounts[domain] || 0} {t('goals.lessonsLabel')} {t('goals.thisWeek')}
                </p>
              </div>
            </div>
            <button className="text-xs px-3 py-1 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors">
              Add
            </button>
          </motion.div>
        ))}
        
        {/* Add Plan Next Week */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: missingDomains.length * 0.1 }}
          className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 text-white rounded-lg">
              <TrendingUp size={16} />
            </div>
            <div>
              <p className="font-medium text-sm">{t('goals.addPlanNextWeek')}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Set intentions for balanced growth
              </p>
            </div>
          </div>
          <button className="text-xs px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
            Plan
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
