'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, Lightbulb, Target, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AIAnalysisPanelProps {
  summary?: string | null;
  concepts?: string[] | null;
  nextQuestion?: string | null;
  isAnalyzing?: boolean;
  onAnalyze?: () => void;
  error?: Error | null;
}

export function AIAnalysisPanel({
  summary,
  concepts,
  nextQuestion,
  isAnalyzing = false,
  onAnalyze,
  error
}: AIAnalysisPanelProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const hasResults = summary || (concepts && concepts.length > 0) || nextQuestion;

  useEffect(() => {
    if (hasResults && !isAnalyzing) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [hasResults, isAnalyzing]);

  return (
    <div className="space-y-6">
      {/* Analyze Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 rounded-2xl"
      >
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className="w-full btn-modern flex items-center justify-center gap-2 px-6 py-3 rounded-xl disabled:opacity-50 relative overflow-hidden group"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20"
            animate={{
              x: isAnalyzing ? ['-100%', '100%'] : '0%',
            }}
            transition={{
              duration: 1.5,
              repeat: isAnalyzing ? Infinity : 0,
              ease: 'linear',
            }}
          />
          <span className="relative z-10 flex items-center gap-2">
            {isAnalyzing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles size={18} />
                </motion.div>
                Đang phân tích...
              </>
            ) : showSuccess ? (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                >
                  <CheckCircle2 size={18} className="text-green-500" />
                </motion.div>
                Phân tích hoàn tất!
              </>
            ) : (
              <>
                <Sparkles size={18} />
                {hasResults ? 'Phân tích lại' : 'Phân tích bằng AI'}
              </>
            )}
          </span>
        </button>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2"
          >
            <AlertCircle size={16} className="text-red-500" />
            <span className="text-sm text-red-600 dark:text-red-400">
              Có lỗi xảy ra. Vui lòng thử lại.
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Loading Animation */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass-card p-8 rounded-2xl"
          >
            <div className="flex flex-col items-center justify-center text-center">
              <motion.div
                className="relative mb-6"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center relative">
                  <Sparkles className="text-white" size={32} />
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-50"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeOut',
                    }}
                  />
                </div>
              </motion.div>

              <h3 className="text-lg font-semibold mb-2">AI đang phân tích...</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Đang trích xuất insights và tạo gợi ý cho bạn
              </p>

              {/* Loading dots */}
              <div className="flex gap-2 mt-6">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-purple-500"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {hasResults && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="glass-card p-6 rounded-2xl space-y-6"
          >
            {/* Header */}
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center"
              >
                <Sparkles className="text-white" size={24} />
              </motion.div>
              <div>
                <h3 className="text-xl font-bold">AI Analysis</h3>
                <p className="text-xs text-muted-foreground">
                  Phân tích tự động từ nội dung bài học
                </p>
              </div>
            </div>

            {/* Summary */}
            {summary && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="relative"
              >
                <div className="absolute -left-3 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
                <div className="pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="text-blue-500" size={18} />
                    <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      Tóm tắt
                    </h4>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {summary}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Concepts */}
            {concepts && concepts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="relative"
              >
                <div className="absolute -left-3 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
                <div className="pl-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="text-purple-500" size={18} />
                    <h4 className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                      Khái niệm chính
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {concepts.map((concept, idx) => (
                      <motion.span
                        key={idx}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          delay: 0.4 + idx * 0.1,
                          type: 'spring',
                          stiffness: 500,
                          damping: 25,
                        }}
                        whileHover={{ scale: 1.05 }}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 cursor-default hover:border-purple-500/50 transition-colors"
                      >
                        {concept}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Next Question */}
            {nextQuestion && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="relative"
              >
                <div className="absolute -left-3 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full" />
                <div className="pl-4 p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                  <div className="flex items-start gap-2 mb-2">
                    <Lightbulb className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
                    <h4 className="text-sm font-semibold text-green-600 dark:text-green-400">
                      Câu hỏi tiếp theo
                    </h4>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed pl-6">
                    {nextQuestion}
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!hasResults && !isAnalyzing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-8 rounded-2xl text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <Sparkles className="text-purple-500" size={32} />
          </div>
          <h3 className="text-lg font-semibold mb-2">Chưa có phân tích</h3>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            Nhấn nút "Phân tích bằng AI" để nhận insights và gợi ý từ AI
          </p>
        </motion.div>
      )}
    </div>
  );
}
