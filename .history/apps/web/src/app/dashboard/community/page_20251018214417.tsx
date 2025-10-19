'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, MessageSquare, Trophy } from 'lucide-react';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { PublicFeed } from '@/components/community/PublicFeed';
import { GroupsList } from '@/components/community/GroupsList';
import { ChallengesList } from '@/components/community/ChallengesList';

type TabType = 'feed' | 'groups' | 'challenges';

export default function CommunityPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('feed');

  const tabs = [
    { id: 'feed' as TabType, label: t('community.feed'), icon: MessageSquare },
    { id: 'groups' as TabType, label: t('community.myGroups'), icon: Users },
    { id: 'challenges' as TabType, label: t('community.challenges'), icon: Trophy },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          {t('community.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('community.subtitle') || 'Connect, share, and grow together'}
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <div className="glass-card mb-6">
        <div className="flex gap-2 p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all
                ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-black/20'
                }
              `}
            >
              <tab.icon size={20} />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'feed' && <PublicFeed />}
        {activeTab === 'groups' && <GroupsList />}
        {activeTab === 'challenges' && <ChallengesList />}
      </motion.div>
    </div>
  );
}
