'use client';

import { motion } from 'framer-motion';
import { Trophy, Flame, Target } from 'lucide-react';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { useChallenges, useJoinChallenge } from '@/lib/hooks/useCommunity';
import { toast } from 'sonner';

export function ChallengesTab() {
  const { t } = useTranslation();
  const { data: challenges, isLoading } = useChallenges();
  const joinChallenge = useJoinChallenge();

  const handleJoin = async (challengeId: string) => {
    try {
      await joinChallenge.mutateAsync(challengeId);
      toast.success(t('common.success'));
    } catch (error) {
      toast.error(t('common.error'));
    }
  };

  const getChallengeIcon = (id: string) => {
    if (id === '7-day') return <Flame className="text-orange-500" size={32} />;
    if (id === '21-day') return <Target className="text-blue-500" size={32} />;
    return <Trophy className="text-amber-500" size={32} />;
  };

  const getChallengeColor = (id: string) => {
    if (id === '7-day') return 'from-orange-500 to-red-500';
    if (id === '21-day') return 'from-blue-500 to-cyan-500';
    return 'from-amber-500 to-yellow-500';
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {challenges?.map((challenge: any, index: number) => (
        <motion.div
          key={challenge.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass-card p-6 hover:shadow-lg transition-shadow"
        >
          {/* Icon */}
          <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getChallengeColor(challenge.id)} flex items-center justify-center text-white mb-4 mx-auto`}>
            {getChallengeIcon(challenge.id)}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-center mb-2">
            {t(`community.challenge${challenge.duration}Days`)}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
            {t(`community.challengeDesc${challenge.duration}`)}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-4 mb-4 text-sm">
            <div className="text-center">
              <p className="font-bold text-2xl">{challenge.duration}</p>
              <p className="text-gray-500">{t('community.daysRemaining')}</p>
            </div>
          </div>

          {/* Join Button */}
          <button
            onClick={() => handleJoin(challenge.id)}
            disabled={joinChallenge.isPending}
            className={`w-full px-4 py-2 rounded-lg bg-gradient-to-r ${getChallengeColor(challenge.id)} text-white font-medium hover:shadow-lg transition-shadow disabled:opacity-50`}
          >
            {t('community.joinChallenge')}
          </button>
        </motion.div>
      ))}
    </div>
  );
}
