'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Trophy, Crown } from 'lucide-react';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { useMyGroups, useCreateGroup, useGroupLeaderboard } from '@/lib/hooks/useGroups';
import { toast } from 'sonner';

export function GroupsTab() {
  const { t } = useTranslation();
  const { data: groups, isLoading } = useMyGroups();
  const createGroup = useCreateGroup();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const { data: leaderboard } = useGroupLeaderboard(selectedGroup || undefined);

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return;

    try {
      await createGroup.mutateAsync(groupName);
      toast.success(t('common.success'));
      setShowCreateModal(false);
      setGroupName('');
    } catch (error) {
      toast.error(t('common.error'));
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
    <div className="space-y-6">
      {/* Create Group Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:shadow-lg transition-shadow"
        >
          <Plus size={16} />
          {t('community.createGroup')}
        </button>
      </div>

      {/* Groups Grid */}
      {groups && groups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map((group: any, index: number) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedGroup(group.id)}
              className={`glass-card p-6 cursor-pointer hover:shadow-lg transition-all ${
                selectedGroup === group.id ? 'ring-2 ring-purple-500' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl text-white">
                    <Users size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{group.name}</h3>
                    <p className="text-sm text-gray-500">
                      {group.members?.length || 0} {t('community.members')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Mini Leaderboard */}
              {selectedGroup === group.id && leaderboard && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Trophy size={16} className="text-amber-500" />
                    <span className="text-sm font-medium">{t('community.leaderboard')}</span>
                  </div>
                  <div className="space-y-2">
                    {leaderboard.slice(0, 3).map((member: any, idx: number) => (
                      <div key={member.userId} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {idx === 0 && <Crown size={14} className="text-amber-500" />}
                          <span className="text-sm">{member.name}</span>
                          {member.role === 'admin' && (
                            <span className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full">
                              {t('community.admin')}
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-medium text-purple-600">
                          {member.streak} {t('community.streak')}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-2 text-lg font-medium">
            No groups yet
          </p>
          <p className="text-sm text-gray-400 mb-4">
            Create or join a group to connect with others
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:shadow-lg transition-shadow"
          >
            {t('community.createGroup')}
          </button>
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card max-w-md w-full p-6"
          >
            <h2 className="text-2xl font-bold mb-4">{t('community.createGroup')}</h2>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder={t('community.groupName')}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleCreateGroup}
                disabled={createGroup.isPending || !groupName.trim()}
                className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium disabled:opacity-50"
              >
                {t('common.save')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
