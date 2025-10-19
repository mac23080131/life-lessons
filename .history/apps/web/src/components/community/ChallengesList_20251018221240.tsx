'use client';

import { motion } from 'framer-motion';
import { Trophy, Target, Users, Calendar, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { useChallenges, useMyChallenges, useJoinChallenge } from '@/lib/hooks/useChallenges';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';

export function ChallengesList() {
  const { t } = useTranslation();
  const { data: challenges = [], isLoading } = useChallenges();
  const { data: myChallenges = [] } = useMyChallenges();
  const joinChallengeMutation = useJoinChallenge();

  const handleJoinChallenge = async (challengeId: string) => {
    try {
      await joinChallengeMutation.mutateAsync(challengeId);
      toast.success(t('challenges.joined'));
    } catch (error) {
      toast.error(t('common.error'));
    }
  };

  const isJoined = (challengeId: string) => {
    return myChallenges?.some((c: any) => c.challengeId === challengeId);
  };

  const getDifficultyColor = (difficulty: string) => {
    const upper = difficulty?.toUpperCase();
    switch (upper) {
      case 'EASY': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      case 'MEDIUM': return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400';
      case 'HARD': return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
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

  return (
    <div className="space-y-8">
      {/* Active Challenges */}
      {myChallenges && myChallenges.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp size={24} className="text-purple-600" />
            {t('challenges.active')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myChallenges.map((participation: any, index: number) => {
              const challenge = participation.challenge;
              return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card p-6 border-l-4 border-purple-500"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Trophy size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{challenge.name}</h3>
                      <p className="text-sm text-gray-500">{challenge.description}</p>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">{t('challenges.progress')}</span>
                    <span className="font-bold">{participation.progress}/{challenge.target}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(participation.progress / challenge.target) * 100}%` }}
                      transition={{ duration: 0.5 }}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-full"
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{t('challenges.daysLeft')}</p>
                    <p className="text-lg font-bold text-purple-600">{participation.daysLeft || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{t('challenges.streak')}</p>
                    <p className="text-lg font-bold text-amber-600">{participation.streak || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{t('challenges.completion')}</p>
                    <p className="text-lg font-bold text-green-600">
                      {Math.round((participation.progress / challenge.target) * 100)}%
                    </p>
                  </div>
                </div>
              </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Available Challenges */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Target size={24} className="text-purple-600" />
          {t('challenges.available')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {challenges?.map((challenge: any, index: number) => {
            const joined = isJoined(challenge.id);

            return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card p-6 hover:shadow-lg transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <Trophy size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">{challenge.name}</h3>
                    <p className="text-xs text-gray-500">{challenge.description}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar size={16} />
                    <span>{challenge.duration} {t('challenges.days')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Target size={16} />
                    <span>{challenge.target} {t('challenges.lessons')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Users size={16} />
                    <span>{challenge.participants || 0} {t('challenges.participants')}</span>
                  </div>
                </div>

                {/* Difficulty Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                    {t(`challenges.difficulty.${challenge.difficulty}`)}
                  </span>
                  {joined && (
                    <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                      <CheckCircle2 size={16} />
                      {t('challenges.joined')}
                    </div>
                  )}
                </div>

                {/* Action */}
                {!joined && (
                  <button
                    onClick={() => handleJoinChallenge(challenge.id)}
                    disabled={joinChallengeMutation.isPending}
                    className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors disabled:opacity-50"
                  >
                    {joinChallengeMutation.isPending ? t('common.joining') : t('challenges.joinNow')}
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
