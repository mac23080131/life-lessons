'use client';

import { motion } from 'framer-motion';
import { Edit, Trash2, ExternalLink, Sparkles } from 'lucide-react';
import { getMoodEmoji, getDomainColor } from '@/lib/utils';
import { useState } from 'react';

interface LessonCardProps {
  lesson: any;
  index: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const domainLabels: Record<string, string> = {
  INNER: 'Nội tâm',
  HEALTH: 'Sức khỏe',
  RELATIONSHIP: 'Mối quan hệ',
  FINANCE: 'Tài chính',
};

export function LessonCard({ lesson, index, onEdit, onDelete }: LessonCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const needsTruncate = lesson.contentRaw.length > 200;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 300, damping: 30 }}
      layout
      className="group glass-card p-6 rounded-2xl hover:shadow-xl transition-all duration-300 cursor-pointer"
      onClick={() => needsTruncate && setIsExpanded(!isExpanded)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-3 py-1 rounded-lg text-xs font-medium ${getDomainColor(lesson.domain)}`}>
            {domainLabels[lesson.domain]}
          </span>
          <span className="text-2xl">{getMoodEmoji(lesson.mood)}</span>
          <span className="text-xs text-muted-foreground">
            {new Date(lesson.createdAt).toLocaleDateString('vi-VN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(lesson.id);
            }}
            className="p-2 rounded-lg hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 transition-colors"
            title="Chỉnh sửa"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(lesson.id);
            }}
            className="p-2 rounded-lg hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-colors"
            title="Xóa"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <motion.div
        animate={{ height: isExpanded ? 'auto' : 'auto' }}
        className="mb-4"
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {isExpanded || !needsTruncate
            ? lesson.contentRaw
            : `${lesson.contentRaw.substring(0, 200)}...`}
        </p>
        {needsTruncate && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="text-xs text-purple-600 dark:text-purple-400 hover:underline mt-2"
          >
            {isExpanded ? 'Thu gọn' : 'Xem thêm'}
          </button>
        )}
      </motion.div>

      {/* AI Summary */}
      {lesson.contentSummary && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 mb-4"
        >
          <div className="flex items-start gap-2">
            <Sparkles className="text-blue-500 flex-shrink-0 mt-0.5" size={14} />
            <div>
              <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">AI Tóm tắt</p>
              <p className="text-xs text-muted-foreground">{lesson.contentSummary}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            <span>Resonance {lesson.resonance}/3</span>
          </div>
          {lesson.tags && lesson.tags.length > 0 && (
            <>
              <span>•</span>
              <div className="flex gap-1 flex-wrap">
                {lesson.tags.slice(0, 3).map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md bg-background/50 backdrop-blur-sm text-xs"
                  >
                    #{tag}
                  </span>
                ))}
                {lesson.tags.length > 3 && (
                  <span className="px-2 py-0.5 text-xs">+{lesson.tags.length - 3}</span>
                )}
              </div>
            </>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(lesson.id);
          }}
          className="text-xs text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 flex items-center gap-1 transition-colors"
        >
          <span>Chi tiết</span>
          <ExternalLink size={12} />
        </button>
      </div>
    </motion.div>
  );
}
