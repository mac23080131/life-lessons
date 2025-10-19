'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Users, Globe, Facebook, Twitter, Linkedin, Link as LinkIcon, Check } from 'lucide-react';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { useShareLesson } from '@/lib/hooks/useShare';
import { useMyGroups } from '@/lib/hooks/useGroups';
import { toast } from 'sonner';

type ShareTab = 'community' | 'groups' | 'social';

interface ShareModalProps {
  lessonId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareModal({ lessonId, isOpen, onClose }: ShareModalProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<ShareTab>('community');
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const { data: groups } = useMyGroups();
  const shareToCommunity = useShareLesson('community');
  const shareToGroup = useShareLesson('group');
  const getShareUrl = useShareLesson('url');

  const handleShareToCommunity = async () => {
    try {
      await shareToCommunity.mutateAsync(lessonId);
      toast.success(t('share.sharedToCommunity'));
      onClose();
    } catch (error) {
      toast.error(t('common.error'));
    }
  };

  const handleShareToGroup = async () => {
    if (!selectedGroupId) {
      toast.error(t('share.selectGroup'));
      return;
    }

    try {
      await shareToGroup.mutateAsync({ lessonId, groupId: selectedGroupId });
      toast.success(t('share.sharedToGroup'));
      onClose();
    } catch (error) {
      toast.error(t('common.error'));
    }
  };

  const handleCopyLink = async () => {
    try {
      const result = await getShareUrl.mutateAsync(lessonId);
      await navigator.clipboard.writeText(result.shareUrl);
      setCopied(true);
      toast.success(t('share.linkCopied'));
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error(t('common.error'));
    }
  };

  const handleSocialShare = async (platform: 'facebook' | 'twitter' | 'linkedin') => {
    try {
      const result = await getShareUrl.mutateAsync(lessonId);
      const url = encodeURIComponent(result.shareUrl);
      const text = encodeURIComponent(t('share.socialText'));

      let shareUrl = '';
      switch (platform) {
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
          break;
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
          break;
        case 'linkedin':
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
          break;
      }

      window.open(shareUrl, '_blank', 'width=600,height=400');
    } catch (error) {
      toast.error(t('common.error'));
    }
  };

  const tabs = [
    { id: 'community' as ShareTab, label: t('share.community'), icon: Globe },
    { id: 'groups' as ShareTab, label: t('share.groups'), icon: Users },
    { id: 'social' as ShareTab, label: t('share.social'), icon: Share2 },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="glass-card w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                <Share2 className="text-white" size={20} />
              </div>
              <h2 className="text-2xl font-bold">{t('share.title')}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 p-4 border-b border-white/10">
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
                <tab.icon size={18} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
            {activeTab === 'community' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <p className="text-gray-600 dark:text-gray-400">
                  {t('share.communityDescription')}
                </p>
                <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    ⚠️ {t('share.anonymousWarning')}
                  </p>
                </div>
                <button
                  onClick={handleShareToCommunity}
                  disabled={shareToCommunity.isPending}
                  className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:shadow-lg transition-shadow disabled:opacity-50"
                >
                  {shareToCommunity.isPending ? t('common.loading') : t('share.shareToCommunity')}
                </button>
              </motion.div>
            )}

            {activeTab === 'groups' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <p className="text-gray-600 dark:text-gray-400">
                  {t('share.groupsDescription')}
                </p>

                {groups && groups.length > 0 ? (
                  <>
                    <div className="space-y-2">
                      {groups.map((group: any) => (
                        <label
                          key={group.id}
                          className={`
                            flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all
                            ${
                              selectedGroupId === group.id
                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                            }
                          `}
                        >
                          <input
                            type="radio"
                            name="group"
                            value={group.id}
                            checked={selectedGroupId === group.id}
                            onChange={(e) => setSelectedGroupId(e.target.value)}
                            className="w-4 h-4"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{group.name}</p>
                            <p className="text-sm text-gray-500">
                              {group.members?.length || 0} {t('community.members')}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                    <button
                      onClick={handleShareToGroup}
                      disabled={shareToGroup.isPending || !selectedGroupId}
                      className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:shadow-lg transition-shadow disabled:opacity-50"
                    >
                      {shareToGroup.isPending ? t('common.loading') : t('share.shareToGroup')}
                    </button>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Users size={48} className="mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {t('share.noGroups')}
                    </p>
                    <button
                      onClick={onClose}
                      className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                    >
                      {t('share.createGroup')}
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'social' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <p className="text-gray-600 dark:text-gray-400">
                  {t('share.socialDescription')}
                </p>

                {/* Copy Link */}
                <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <label className="block text-sm font-medium mb-2">
                    {t('share.shareableLink')}
                  </label>
                  <button
                    onClick={handleCopyLink}
                    disabled={getShareUrl.isPending}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check size={20} className="text-green-500" />
                        <span>{t('share.copied')}</span>
                      </>
                    ) : (
                      <>
                        <LinkIcon size={20} />
                        <span>{getShareUrl.isPending ? t('common.loading') : t('share.copyLink')}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Social Buttons */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium mb-2">
                    {t('share.shareOnSocial')}
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => handleSocialShare('facebook')}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                      <Facebook size={20} />
                      <span>Facebook</span>
                    </button>
                    <button
                      onClick={() => handleSocialShare('twitter')}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-sky-500 text-white hover:bg-sky-600 transition-colors"
                    >
                      <Twitter size={20} />
                      <span>Twitter</span>
                    </button>
                    <button
                      onClick={() => handleSocialShare('linkedin')}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-700 text-white hover:bg-blue-800 transition-colors"
                    >
                      <Linkedin size={20} />
                      <span>LinkedIn</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
