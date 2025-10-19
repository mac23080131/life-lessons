'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  locale?: 'en' | 'vi';
}

export function VoiceRecorder({ onTranscript, locale = 'vi' }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  const recognitionRef = useRef<any>(null);

  const t = {
    vi: {
      record: 'Ghi âm',
      recording: 'Đang ghi...',
      stop: 'Dừng',
      transcribing: 'Đang chuyển thành văn bản...',
      aiRewrite: 'AI viết lại',
      rewriting: 'Đang viết lại...',
      useOriginal: 'Dùng bản gốc',
      useRewritten: 'Dùng bản viết lại',
      error: 'Lỗi ghi âm',
      notSupported: 'Trình duyệt không hỗ trợ ghi âm',
      permissionDenied: 'Không có quyền truy cập microphone',
      transcribed: 'Đã chuyển xong',
    },
    en: {
      record: 'Record Voice',
      recording: 'Recording...',
      stop: 'Stop',
      transcribing: 'Converting to text...',
      aiRewrite: 'AI Rewrite',
      rewriting: 'Rewriting...',
      useOriginal: 'Use Original',
      useRewritten: 'Use Rewritten',
      error: 'Recording failed',
      notSupported: 'Voice recording not supported',
      permissionDenied: 'Microphone permission denied',
      transcribed: 'Transcription complete',
    },
  };

  const texts = t[locale];

  useEffect(() => {
    // Check for Web Speech API support
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = locale === 'vi' ? 'vi-VN' : 'en-US';
        
        let finalTranscriptText = '';
        
        recognition.onresult = (event: any) => {
          let interimTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcriptPart = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscriptText += transcriptPart + ' ';
              setTranscript(finalTranscriptText);
            } else {
              interimTranscript += transcriptPart;
            }
          }
        };
        
        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          if (event.error === 'not-allowed') {
            toast.error(texts.permissionDenied);
          } else {
            toast.error(texts.error);
          }
          setIsRecording(false);
        };
        
        recognition.onend = () => {
          if (isRecording) {
            // Auto-restart if still recording (for continuous mode)
            try {
              recognition.start();
            } catch (e) {
              console.log('Recognition ended');
            }
          }
        };
        
        recognitionRef.current = recognition;
      }
    }
  }, [locale, isRecording]);

  const startRecording = async () => {
    try {
      if (!recognitionRef.current) {
        toast.error(texts.notSupported);
        return;
      }

      setTranscript('');
      setRewrittenText('');
      setShowRewriteOption(false);
      
      // Start speech recognition
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        toast.success(texts.recording);
      } catch (error) {
        console.error('Error starting recognition:', error);
        toast.error('Không thể bắt đầu ghi âm. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error(texts.permissionDenied);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      
      if (transcript.trim()) {
        setIsTranscribing(true);
        
        // Simulate transcription delay
        setTimeout(() => {
          setIsTranscribing(false);
          onTranscript(transcript.trim());
          setShowRewriteOption(true);
          toast.success(texts.transcribed);
        }, 1000);
      }
    }
  };

  const handleAIRewrite = async () => {
    if (!transcript.trim()) return;
    
    setIsRewriting(true);
    
    try {
      // Call AI rewrite API (mock for now)
      const rewritten = await mockAIRewrite(transcript, locale);
      setRewrittenText(rewritten);
      toast.success('AI đã viết lại bài học');
    } catch (error) {
      toast.error('Lỗi khi viết lại');
    } finally {
      setIsRewriting(false);
    }
  };

  const useRewrittenVersion = () => {
    if (onAIRewrite) {
      onAIRewrite(transcript, rewrittenText);
    }
    onTranscript(rewrittenText);
    toast.success(texts.useRewritten);
    resetRecorder();
  };

  const useOriginalVersion = () => {
    toast.success(texts.useOriginal);
    resetRecorder();
  };

  const resetRecorder = () => {
    setTranscript('');
    setRewrittenText('');
    setShowRewriteOption(false);
  };

  return (
    <div className="space-y-4">
      {/* Recording Controls */}
      <div className="flex items-center gap-3">
        {!isRecording ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startRecording}
            disabled={isTranscribing || isRewriting}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            <Mic className="w-5 h-5" />
            <span className="font-medium">{texts.record}</span>
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={stopRecording}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg hover:from-gray-800 hover:to-black transition-all shadow-lg"
          >
            <Square className="w-5 h-5 fill-current" />
            <span className="font-medium">{texts.stop}</span>
          </motion.button>
        )}

        {/* Recording Animation */}
        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-3 h-3 bg-red-500 rounded-full"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {texts.recording}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transcribing Indicator */}
        {isTranscribing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-blue-600"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">{texts.transcribing}</span>
          </motion.div>
        )}
      </div>

      {/* Transcript Preview */}
      <AnimatePresence>
        {transcript && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Mic className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Bản gốc (Original):
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {transcript}
              </p>
            </div>

            {/* AI Rewrite Button */}
            {showRewriteOption && !rewrittenText && (
              <motion.button
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAIRewrite}
                disabled={isRewriting}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 disabled:opacity-50 transition-all shadow-lg"
              >
                {isRewriting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{texts.rewriting}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span className="font-medium">{texts.aiRewrite}</span>
                  </>
                )}
              </motion.button>
            )}

            {/* AI Rewritten Version */}
            {rewrittenText && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
                      AI viết lại (AI Rewritten):
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {rewrittenText}
                  </p>
                </div>

                {/* Choose Version Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={useOriginalVersion}
                    className="flex-1 px-4 py-2 border-2 border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors font-medium"
                  >
                    {texts.useOriginal}
                  </button>
                  <button
                    onClick={useRewrittenVersion}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all font-medium shadow-lg"
                  >
                    {texts.useRewritten}
                  </button>
                </div>
              </motion.div>
            )}
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
      // Simple mock: Add structure and formatting
      const lines = text.split(/[.!?]+/).filter(t => t.trim());
      const structured = lines.map((line, i) => {
        if (i === 0) return `**Bài học chính:** ${line.trim()}.`;
        return `- ${line.trim()}.`;
      }).join('\n');
      
      resolve(structured + '\n\n**Suy ngẫm:** ' + (locale === 'vi' 
        ? 'Tôi có thể áp dụng bài học này như thế nào trong tương lai?'
        : 'How can I apply this lesson in the future?'));
    }, 2000);
  });
}
