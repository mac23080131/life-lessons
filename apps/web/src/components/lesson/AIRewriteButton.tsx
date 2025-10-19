'use client';

import { useState } from 'react';
import { Sparkles, Loader2, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface AIRewriteButtonProps {
  content: string;
  onRewrite: (rewrittenText: string) => void;
  locale?: 'en' | 'vi';
  disabled?: boolean;
}

export function AIRewriteButton({ content, onRewrite, locale = 'vi', disabled }: AIRewriteButtonProps) {
  const [isRewriting, setIsRewriting] = useState(false);
  const [rewrittenText, setRewrittenText] = useState('');
  const [showComparison, setShowComparison] = useState(false);

  const t = {
    vi: {
      rewrite: 'AI viết lại',
      rewriting: 'Đang viết lại...',
      original: 'Bản gốc',
      rewritten: 'AI viết lại',
      useOriginal: 'Giữ bản gốc',
      useRewritten: 'Dùng bản này',
      success: 'AI đã viết lại bài học',
      error: 'Lỗi khi viết lại',
      empty: 'Vui lòng nhập nội dung trước',
    },
    en: {
      rewrite: 'AI Rewrite',
      rewriting: 'Rewriting...',
      original: 'Original',
      rewritten: 'AI Rewritten',
      useOriginal: 'Keep Original',
      useRewritten: 'Use This',
      success: 'AI has rewritten the lesson',
      error: 'Failed to rewrite',
      empty: 'Please enter content first',
    },
  };

  const texts = t[locale];

  const handleRewrite = async () => {
    if (!content.trim()) {
      toast.error(texts.empty);
      return;
    }

    setIsRewriting(true);

    try {
      // Call AI rewrite API (mock for now - replace with real API)
      const rewritten = await mockAIRewrite(content, locale);
      setRewrittenText(rewritten);
      setShowComparison(true);
      toast.success(texts.success);
    } catch (error) {
      console.error('AI Rewrite error:', error);
      toast.error(texts.error);
    } finally {
      setIsRewriting(false);
    }
  };

  const handleUseRewritten = () => {
    onRewrite(rewrittenText);
    toast.success(texts.useRewritten);
    setShowComparison(false);
    setRewrittenText('');
  };

  const handleKeepOriginal = () => {
    toast.success(texts.useOriginal);
    setShowComparison(false);
    setRewrittenText('');
  };

  return (
    <div className="space-y-4">
      {/* AI Rewrite Button */}
      {!showComparison && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleRewrite}
          disabled={isRewriting || disabled || !content.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg font-medium"
        >
          {isRewriting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{texts.rewriting}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>{texts.rewrite}</span>
            </>
          )}
        </motion.button>
      )}

      {/* Comparison View */}
      <AnimatePresence>
        {showComparison && rewrittenText && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Original */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                    {texts.original}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {content}
                </p>
              </div>

              {/* AI Rewritten */}
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                    {texts.rewritten}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {rewrittenText}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleKeepOriginal}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-blue-500 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors font-medium"
              >
                <X className="w-4 h-4" />
                {texts.useOriginal}
              </button>
              <button
                onClick={handleUseRewritten}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all font-medium shadow-lg"
              >
                <Check className="w-4 h-4" />
                {texts.useRewritten}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Mock AI Rewrite function (replace with actual API call)
async function mockAIRewrite(text: string, locale: 'en' | 'vi'): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Split into sentences
      const sentences = text.split(/[.!?]+/).filter(t => t.trim());
      
      if (sentences.length === 0) {
        resolve(text);
        return;
      }

      // Structure the content
      const mainLesson = sentences[0].trim();
      const additionalPoints = sentences.slice(1).filter(s => s.trim());
      
      let structured = '';
      
      if (locale === 'vi') {
        structured = `**Bài học chính:**\n${mainLesson}.\n\n`;
        
        if (additionalPoints.length > 0) {
          structured += `**Chi tiết:**\n`;
          additionalPoints.forEach(point => {
            structured += `- ${point.trim()}.\n`;
          });
          structured += `\n`;
        }
        
        structured += `**Suy ngẫm:**\nTôi có thể áp dụng bài học này như thế nào trong cuộc sống hàng ngày?`;
      } else {
        structured = `**Main Lesson:**\n${mainLesson}.\n\n`;
        
        if (additionalPoints.length > 0) {
          structured += `**Details:**\n`;
          additionalPoints.forEach(point => {
            structured += `- ${point.trim()}.\n`;
          });
          structured += `\n`;
        }
        
        structured += `**Reflection:**\nHow can I apply this lesson in my daily life?`;
      }
      
      resolve(structured);
    }, 2000); // 2 second delay to simulate API call
  });
}
