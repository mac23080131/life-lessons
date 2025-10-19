'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Brain, 
  Lightbulb, 
  Target, 
  CheckCircle2, 
  AlertCircle,
  BookOpen,
  MessageCircle,
  Clock,
  ArrowRight,
  Link as LinkIcon
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/hooks/useTranslation';

interface ConceptSuggestion {
  id: string;
  key: string;
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
  relevance: number;
  slug: string;
  difficulty: string;
  practices?: Array<{
    id: string;
    title: string;
    titleEn: string;
    description: string;
    descriptionEn: string;
    duration?: number;
  }>;
}

interface Question {
  question: string;
  questionEn: string;
  type: string;
  source: 'ckb' | 'generated';
}

interface Practice {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  duration?: number;
  conceptTitle: string;
}

interface RelatedConcept {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
}

interface AnalysisResult {
  summary: string;
  concepts: ConceptSuggestion[];
  suggestedQuestions: Question[];
  practices: Practice[];
  relatedConcepts: RelatedConcept[];
}

interface CKBAnalysisPanelProps {
  analysis?: AnalysisResult | null;
  isAnalyzing?: boolean;
  onAnalyze?: () => void;
  error?: Error | null;
}

export function CKBAnalysisPanel({
  analysis,
  isAnalyzing = false,
  onAnalyze,
  error
}: CKBAnalysisPanelProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'concepts' | 'practices' | 'questions'>('concepts');
  const { locale } = useTranslation();
  const hasResults = analysis && (analysis.concepts.length > 0 || analysis.practices.length > 0);

  useEffect(() => {
    if (hasResults && !isAnalyzing) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [hasResults, isAnalyzing]);

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      BEGINNER: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      INTERMEDIATE: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      ADVANCED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return colors[difficulty] || colors.BEGINNER;
  };

  const getQuestionTypeIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      REFLECTIVE: <Brain className="w-4 h-4" />,
      PROVOCATIVE: <Lightbulb className="w-4 h-4" />,
      ACTION_ORIENTED: <Target className="w-4 h-4" />,
      EXPLORATORY: <MessageCircle className="w-4 h-4" />,
    };
    return icons[type] || <MessageCircle className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Analyze Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
      >
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
        >
          {isAnalyzing ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
              {locale === 'vi' ? 'Đang phân tích với CKB...' : 'Analyzing with CKB...'}
            </>
          ) : showSuccess ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              {locale === 'vi' ? 'Phân tích hoàn tất!' : 'Analysis Complete!'}
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              {hasResults 
                ? (locale === 'vi' ? 'Phân tích lại' : 'Analyze Again')
                : (locale === 'vi' ? 'Phân tích bằng AI + CKB' : 'Analyze with AI + CKB')}
            </>
          )}
        </button>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-600 dark:text-red-400">
              {locale === 'vi' ? 'Có lỗi xảy ra. Vui lòng thử lại.' : 'An error occurred. Please try again.'}
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Loading Animation */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8"
          >
            <div className="flex flex-col items-center justify-center text-center">
              <motion.div
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 flex items-center justify-center mb-6"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="text-white w-8 h-8" />
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {locale === 'vi' ? 'AI đang phân tích với CKB...' : 'AI is analyzing with CKB...'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
                {locale === 'vi' 
                  ? 'Đang tìm kiếm concepts liên quan, practices và câu hỏi từ Thư viện Khái niệm...'
                  : 'Searching for related concepts, practices, and questions from the Concept Library...'}
              </p>
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
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <Sparkles className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {locale === 'vi' ? 'Phân Tích CKB' : 'CKB Analysis'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {locale === 'vi' 
                      ? 'Insights từ Thư viện Khái niệm Nguồn Có Lợi'
                      : 'Insights from Concept Knowledge Base'}
                  </p>
                </div>
              </div>
            </div>

            {/* Summary */}
            {analysis.summary && (
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/10">
                <div className="flex items-start gap-3">
                  <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {locale === 'vi' ? 'Tóm Tắt' : 'Summary'}
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {analysis.summary}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('concepts')}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'concepts'
                      ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  {locale === 'vi' ? 'Khái Niệm' : 'Concepts'} ({analysis.concepts.length})
                </button>
                <button
                  onClick={() => setActiveTab('practices')}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'practices'
                      ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Lightbulb className="w-4 h-4" />
                  {locale === 'vi' ? 'Thực Hành' : 'Practices'} ({analysis.practices.length})
                </button>
                <button
                  onClick={() => setActiveTab('questions')}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'questions'
                      ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  {locale === 'vi' ? 'Câu Hỏi' : 'Questions'} ({analysis.suggestedQuestions.length})
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Concepts Tab */}
              {activeTab === 'concepts' && (
                <div className="space-y-4">
                  {analysis.concepts.map((concept, idx) => (
                    <motion.div
                      key={concept.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Link
                        href={`/dashboard/concepts/${concept.slug}`}
                        className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md transition-all group"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                              {locale === 'vi' ? concept.title : concept.titleEn}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {locale === 'vi' ? concept.summary : concept.summaryEn}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2 ml-4">
                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${getDifficultyColor(concept.difficulty)}`}>
                              {concept.difficulty.toLowerCase()}
                            </span>
                            <div className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400">
                              <span>{Math.round(concept.relevance * 100)}%</span>
                              <span className="text-gray-400">{locale === 'vi' ? 'liên quan' : 'match'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 mt-3">
                          <ArrowRight className="w-4 h-4" />
                          <span>{locale === 'vi' ? 'Xem chi tiết →' : 'View details →'}</span>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Practices Tab */}
              {activeTab === 'practices' && (
                <div className="space-y-4">
                  {analysis.practices.length > 0 ? (
                    analysis.practices.map((practice, idx) => (
                      <motion.div
                        key={practice.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border border-green-200 dark:border-green-800"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {locale === 'vi' ? practice.title : practice.titleEn}
                          </h4>
                          {practice.duration && (
                            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                              <Clock className="w-4 h-4" />
                              <span>{practice.duration} {locale === 'vi' ? 'phút' : 'min'}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                          {locale === 'vi' ? practice.description : practice.descriptionEn}
                        </p>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {locale === 'vi' ? 'Từ:' : 'From:'} {practice.conceptTitle}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      {locale === 'vi' ? 'Chưa có thực hành nào' : 'No practices available'}
                    </div>
                  )}
                </div>
              )}

              {/* Questions Tab */}
              {activeTab === 'questions' && (
                <div className="space-y-4">
                  {analysis.suggestedQuestions.map((question, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border border-purple-200 dark:border-purple-800"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                          {getQuestionTypeIcon(question.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase">
                              {question.type.replace('_', ' ')}
                            </span>
                            {question.source === 'ckb' && (
                              <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs">
                                CKB
                              </span>
                            )}
                          </div>
                          <p className="text-gray-900 dark:text-white font-medium">
                            {locale === 'vi' ? question.question : question.questionEn}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Related Concepts */}
            {analysis.relatedConcepts.length > 0 && (
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30">
                <div className="flex items-center gap-2 mb-4">
                  <LinkIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {locale === 'vi' ? 'Khái Niệm Liên Quan' : 'Related Concepts'}
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.relatedConcepts.map((concept) => (
                    <Link
                      key={concept.id}
                      href={`/dashboard/concepts/${concept.slug}`}
                      className="px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      {locale === 'vi' ? concept.title : concept.titleEn}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!hasResults && !isAnalyzing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 flex items-center justify-center">
            <Sparkles className="text-purple-600 dark:text-purple-400 w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {locale === 'vi' ? 'Chưa Có Phân Tích' : 'No Analysis Yet'}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            {locale === 'vi' 
              ? 'Nhấn nút "Phân tích bằng AI + CKB" để nhận insights, thực hành và câu hỏi từ Thư viện Khái niệm'
              : 'Click "Analyze with AI + CKB" to receive insights, practices, and questions from the Concept Library'}
          </p>
        </motion.div>
      )}
    </div>
  );
}
