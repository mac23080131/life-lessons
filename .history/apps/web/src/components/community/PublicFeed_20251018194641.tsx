'use client';

import { motion } from 'framer-motion';
import { Heart, Flag, Brain, Activity, DollarSign } from 'lucide-react';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { usePublicFeed, useReactToLesson, useReportLesson } from '@/lib/hooks/useCommunity';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';

export function PublicFeed() {
  const { t, locale } = useTranslation();
  const { data: feedData, isLoading } = usePublicFeed({ limit: 20 });
  const reactMutation = useReactToLesson();
  const reportMutation = useReportLesson();

  const handleReact = async (lessonId: string) => {
    try {
      await reactMutation.mutateAsync({ lessonId, type: 'thank_you' });
      toast.success(t('community.thanked'));
    } catch (error) {
      toast.error(t('common.error'));
    }
  };

  const handleReport = async (lessonId: string) => {
    try {
      await reportMutation.mutateAsync({ lessonId, reason: 'inappropriate' });
      toast.success(t('community.reported'));
    } catch (error) {
      toast.error(t('common.error'));
    }
  };

  const getDomainIcon = (domain: string) => {
    switch (domain) {
      case 'INNER': return <Brain size={16} />;
      case 'HEALTH': return <Activity size={16} />;
      case 'RELATIONSHIP': return <Heart size={16} />;
      case 'FINANCE': return <DollarSign size={16} />;
      default: return <Brain size={16} />;
    }
  };

  const getDomainColor = (domain: string) => {
    switch (domain) {
      case 'INNER': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
      case 'HEALTH': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      case 'RELATIONSHIP': return 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400';
      case 'FINANCE': return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400';
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
      </div>
    );
  }

  if (!feedData?.lessons || feedData.lessons.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-gray-500 dark:text-gray-400 mb-2 text-lg font-medium">
          {t('community.noPublicLessons')}
        </p>
        <p className="text-sm text-gray-400">
          {t('community.noPublicLessonsDesc')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {feedData.lessons.map((lesson: any, index: number) => {
        const userReaction = lesson.reactions?.find((r: any) => r.type === 'thank_you');
        const reactionCount = lesson.reactions?.filter((r: any) => r.type === 'thank_you').length || 0;

        return (
          <motion.div
            key={lesson.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card p-6 hover:shadow-lg transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                  ?
                </div>
                <div>
                  <p className="font-medium">{t('community.anonymousUser')}</p>
                  <p className="text-xs text-gray-500">
                    {t('community.sharedAt')} {formatDistanceToNow(new Date(lesson.createdAt), {
                      addSuffix: true,
                      locale: locale === 'vi' ? vi : enUS,
                    })}
                  </p>
                </div>
              </div>

              {/* Domain Badge */}
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${getDomainColor(lesson.domain)}`}>
                {getDomainIcon(lesson.domain)}
                <span>{t(`domains.${lesson.domain}`)}</span>
              </div>
            </div>

            {/* Content */}
            <div className="mb-4">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {lesson.contentSummary || lesson.contentRaw}
              </p>
            </div>

            {/* Tags & Concepts */}
            {(lesson.tags?.length > 0 || lesson.aiConcepts?.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {lesson.tags?.map((tag: string) => (
                  <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded-full">
                    #{tag}
                  </span>
                ))}
                {lesson.aiConcepts?.map((concept: string) => (
                  <span key={concept} className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                    {concept}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => handleReact(lesson.id)}
                disabled={reactMutation.isPending}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                  userReaction
                    ? 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Heart size={16} className={userReaction ? 'fill-current' : ''} />
                <span className="text-sm">
                  {t('community.thankYou')} {reactionCount > 0 && `(${reactionCount})`}
                </span>
              </button>

              <button
                onClick={() => handleReport(lesson.id)}
                disabled={reportMutation.isPending}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
              >
                <Flag size={16} />
                <span className="text-sm">{t('community.report')}</span>
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
