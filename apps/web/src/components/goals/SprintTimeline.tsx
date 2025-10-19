'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Play, Calendar } from 'lucide-react';
import { useState } from 'react';

interface Sprint {
  id: string;
  index: number;
  startAt: string;
  endAt: string;
  target: number;
  done: number;
}

interface SprintTimelineProps {
  sprints: Sprint[];
  currentSprintIndex?: number;
}

export function SprintTimeline({ sprints, currentSprintIndex }: SprintTimelineProps) {
  const [expandedSprint, setExpandedSprint] = useState<string | null>(null);

  const sortedSprints = [...sprints].sort((a, b) => a.index - b.index);

  return (
    <div className="glass-card p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Calendar className="text-purple-500" size={24} />
          Lịch sử Sprint
        </h3>
        <span className="text-sm text-muted-foreground">
          {sprints.length} sprints tổng
        </span>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-blue-500 to-pink-500" />

        {/* Sprint items */}
        <div className="space-y-4">
          <AnimatePresence>
            {sortedSprints.map((sprint, index) => {
              const isCompleted = sprint.done >= sprint.target;
              const isCurrent = currentSprintIndex === sprint.index;
              const progress = (sprint.done / sprint.target) * 100;
              const isExpanded = expandedSprint === sprint.id;

              return (
                <motion.div
                  key={sprint.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative pl-12"
                >
                  {/* Timeline dot */}
                  <div className={`absolute left-0 top-3 w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted
                      ? 'bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg shadow-green-500/50'
                      : isCurrent
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50 animate-pulse'
                      : 'bg-background border-2 border-border'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="text-white" size={20} />
                    ) : isCurrent ? (
                      <Play className="text-white" size={16} />
                    ) : (
                      <Circle className="text-muted-foreground" size={16} />
                    )}
                  </div>

                  {/* Sprint card */}
                  <motion.div
                    layout
                    onClick={() => setExpandedSprint(isExpanded ? null : sprint.id)}
                    className={`cursor-pointer p-4 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30 shadow-lg'
                        : isCompleted
                        ? 'bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/20'
                        : 'bg-background/50 border-border hover:border-purple-500/30'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg">Sprint #{sprint.index}</span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-500 text-white">
                            Đang chạy
                          </span>
                        )}
                        {isCompleted && (
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-500 text-white">
                            Hoàn thành
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {sprint.done}/{sprint.target}
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-2 bg-background/50 rounded-full overflow-hidden mb-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className={`h-full rounded-full ${
                          isCompleted
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                            : isCurrent
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                            : 'bg-gradient-to-r from-gray-400 to-gray-500'
                        }`}
                      />
                    </div>

                    {/* Dates */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="grid grid-cols-2 gap-4 pt-3 mt-3 border-t border-border text-sm">
                            <div>
                              <span className="text-muted-foreground">Bắt đầu:</span>
                              <div className="font-medium">
                                {new Date(sprint.startAt).toLocaleDateString('vi-VN', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Kết thúc:</span>
                              <div className="font-medium">
                                {new Date(sprint.endAt).toLocaleDateString('vi-VN', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </div>
                            </div>
                            <div className="col-span-2">
                              <span className="text-muted-foreground">Tiến độ:</span>
                              <div className="font-medium text-lg">
                                {progress.toFixed(1)}% hoàn thành
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-border grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-green-500">
            {sprints.filter(s => s.done >= s.target).length}
          </div>
          <div className="text-xs text-muted-foreground">Hoàn thành</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-purple-500">
            {sprints.filter(s => s.done < s.target).length - (currentSprintIndex !== undefined ? 1 : 0)}
          </div>
          <div className="text-xs text-muted-foreground">Đang chờ</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-blue-500">
            {currentSprintIndex !== undefined ? 1 : 0}
          </div>
          <div className="text-xs text-muted-foreground">Đang chạy</div>
        </div>
      </div>
    </div>
  );
}
