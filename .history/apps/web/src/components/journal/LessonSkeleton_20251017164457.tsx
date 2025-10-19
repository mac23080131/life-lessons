'use client';

import { motion } from 'framer-motion';

export function LessonCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass-card p-6 rounded-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="shimmer h-6 w-20 rounded-lg" />
          <div className="shimmer h-6 w-6 rounded-full" />
          <div className="shimmer h-4 w-24 rounded" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2 mb-4">
        <div className="shimmer h-4 w-full rounded" />
        <div className="shimmer h-4 w-5/6 rounded" />
        <div className="shimmer h-4 w-4/6 rounded" />
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3">
        <div className="shimmer h-3 w-20 rounded" />
        <div className="shimmer h-3 w-16 rounded" />
      </div>
    </motion.div>
  );
}

export function LessonGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <LessonCardSkeleton key={i} index={i} />
      ))}
    </div>
  );
}
