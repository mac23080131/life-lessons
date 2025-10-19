'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { getDomainColor } from '@/lib/utils';

interface FilterChipsProps {
  activeFilters: {
    domain?: string;
    tags?: string[];
    mood?: number;
  };
  onRemoveFilter: (type: 'domain' | 'tag' | 'mood', value?: string) => void;
  onClearAll: () => void;
}

const domainLabels: Record<string, { label: string; emoji: string }> = {
  INNER: { label: 'Nội tâm', emoji: '🧠' },
  HEALTH: { label: 'Sức khỏe', emoji: '💪' },
  RELATIONSHIP: { label: 'Mối quan hệ', emoji: '❤️' },
  FINANCE: { label: 'Tài chính', emoji: '💰' },
};

const moodEmojis: Record<number, string> = {
  '-2': '😢',
  '-1': '😕',
  '0': '😐',
  '1': '🙂',
  '2': '😄',
};

export function FilterChips({ activeFilters, onRemoveFilter, onClearAll }: FilterChipsProps) {
  const hasFilters = activeFilters.domain || (activeFilters.tags && activeFilters.tags.length > 0) || activeFilters.mood !== undefined;

  if (!hasFilters) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-wrap items-center gap-2 mb-6"
    >
      <span className="text-sm text-muted-foreground">Đang lọc:</span>

      <AnimatePresence mode="popLayout">
        {activeFilters.domain && (
          <motion.div
            key={`domain-${activeFilters.domain}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${getDomainColor(activeFilters.domain)} cursor-pointer hover:scale-105 transition-transform`}
          >
            <span>{domainLabels[activeFilters.domain]?.emoji}</span>
            <span>{domainLabels[activeFilters.domain]?.label}</span>
            <button
              onClick={() => onRemoveFilter('domain')}
              className="hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5 transition-colors"
            >
              <X size={12} />
            </button>
          </motion.div>
        )}

        {activeFilters.tags?.map((tag) => (
          <motion.div
            key={`tag-${tag}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 cursor-pointer hover:scale-105 transition-transform"
          >
            <span>#{tag}</span>
            <button
              onClick={() => onRemoveFilter('tag', tag)}
              className="hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5 transition-colors"
            >
              <X size={12} />
            </button>
          </motion.div>
        ))}

        {activeFilters.mood !== undefined && (
          <motion.div
            key={`mood-${activeFilters.mood}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 cursor-pointer hover:scale-105 transition-transform"
          >
            <span>{moodEmojis[activeFilters.mood as keyof typeof moodEmojis]}</span>
            <span>Mood {activeFilters.mood > 0 ? '+' : ''}{activeFilters.mood}</span>
            <button
              onClick={() => onRemoveFilter('mood')}
              className="hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5 transition-colors"
            >
              <X size={12} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {hasFilters && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          onClick={onClearAll}
          className="text-xs text-muted-foreground hover:text-foreground underline ml-2 transition-colors"
        >
          Xóa tất cả
        </motion.button>
      )}
    </motion.div>
  );
}
