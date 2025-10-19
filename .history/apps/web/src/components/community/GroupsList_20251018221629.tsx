'use client';

import { motion } from 'framer-motion';
import { Users, Plus, Trophy, TrendingUp, Crown } from 'lucide-react';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { useMyGroups, useCreateGroup, useJoinGroup } from '@/lib/hooks/useGroups';
import { toast } from 'sonner';
import { useState } from 'react';
import Link from 'next/link';

export function GroupsList() {
  const { t } = useTranslation();
  const { data: groups = [], isLoading } = useMyGroups();
  const createGroupMutation = useCreateGroup();
  const joinGroupMutation = useJoinGroup();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [joinGroupId, setJoinGroupId] = useState('');
  const [joinCode, setJoinCode] = useState('');

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      toast.error(t('groups.nameRequired'));
      return;
    }

    try {
      await createGroupMutation.mutateAsync(newGroupName);
      toast.success(t('groups.created'));
      setShowCreateModal(false);
      setNewGroupName('');
    } catch (error) {
      toast.error(t('common.error'));
    }
  };

  const handleJoinGroup = async () => {
    if (!joinGroupId.trim() || !joinCode.trim()) {
      toast.error(t('groups.codeRequired'));
      return;
    }

    try {
      await joinGroupMutation.mutateAsync({ id: joinGroupId, code: joinCode });
      toast.success(t('groups.joined'));
      setShowJoinModal(false);
      setJoinGroupId('');
      setJoinCode('');
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('groups.myGroups')}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowJoinModal(true)}
            className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 font-medium transition-colors"
          >
            {t('groups.join')}
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            {t('groups.create')}
          </button>
        </div>
      </div>

      {/* Groups Grid */}
      {!groups || groups.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Users size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500 dark:text-gray-400 mb-2 text-lg font-medium">
            {t('groups.noGroups')}
          </p>
          <p className="text-sm text-gray-400 mb-6">
            {t('groups.noGroupsDesc')}
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
          >
            {t('groups.createFirst')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group: any, index: number) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={`/dashboard/community/groups/${group.id}`}
                className="block glass-card p-6 hover:shadow-lg transition-all hover:scale-[1.02]"
              >
                {/* Group Icon */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold mb-4">
                  {group.name.charAt(0).toUpperCase()}
                </div>

                {/* Group Info */}
                <h3 className="text-lg font-bold mb-2 line-clamp-1">{group.name}</h3>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Users size={16} />
                    <span>{group.memberCount || 0} {t('groups.members')}</span>
                  </div>
                  {group.isOwner && (
                    <div className="flex items-center gap-1 text-amber-600">
                      <Crown size={16} />
                      <span>{t('groups.owner')}</span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{t('groups.totalLessons')}</p>
                    <p className="text-xl font-bold text-purple-600">{group.totalLessons || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{t('groups.topStreak')}</p>
                    <div className="flex items-center gap-1">
                      <Trophy size={16} className="text-amber-500" />
                      <p className="text-xl font-bold">{group.topStreak || 0}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold mb-4">{t('groups.createGroup')}</h3>
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder={t('groups.groupNamePlaceholder')}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 dark:bg-gray-700"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewGroupName('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleCreateGroup}
                disabled={createGroupMutation.isPending}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {createGroupMutation.isPending ? t('common.creating') : t('common.create')}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Join Group Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold mb-4">{t('groups.joinGroup')}</h3>
            <p className="text-sm text-gray-500 mb-4">{t('groups.joinDesc')}</p>
            <input
              type="text"
              value={joinGroupId}
              onChange={(e) => setJoinGroupId(e.target.value)}
              placeholder={t('groups.groupIdPlaceholder')}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-3 dark:bg-gray-700"
            />
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder={t('groups.inviteCodePlaceholder')}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 dark:bg-gray-700"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowJoinModal(false);
                  setJoinGroupId('');
                  setJoinCode('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleJoinGroup}
                disabled={joinGroupMutation.isPending}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {joinGroupMutation.isPending ? t('common.joining') : t('groups.join')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
