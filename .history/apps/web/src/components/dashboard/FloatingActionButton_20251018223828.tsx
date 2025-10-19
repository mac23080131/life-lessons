'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Sparkles, Mic } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface FloatingActionButtonProps {
  onQuickCapture: () => void;
  onVoiceCapture?: () => void;
}

export function FloatingActionButton({ onQuickCapture, onVoiceCapture }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 space-y-3"
          >
            {/* Voice Capture Button */}
            {onVoiceCapture && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: 0.05 }}
                onClick={() => {
                  onVoiceCapture();
                  setIsOpen(false);
                }}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-full',
                  'bg-gradient-to-r from-blue-500 to-cyan-500',
                  'text-white font-medium shadow-lg',
                  'hover:shadow-xl hover:scale-105',
                  'transition-all duration-200'
                )}
              >
                <Mic size={20} />
                <span className="pr-2">Voice Note</span>
              </motion.button>
            )}

            {/* Quick Capture Button */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: 0.1 }}
              onClick={() => {
                onQuickCapture();
                setIsOpen(false);
              }}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-full',
                'bg-gradient-to-r from-purple-500 to-pink-500',
                'text-white font-medium shadow-lg',
                'hover:shadow-xl hover:scale-105',
                'transition-all duration-200'
              )}
            >
              <Sparkles size={20} />
              <span className="pr-2">New Lesson</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleMenu}
        className={cn(
          'w-14 h-14 rounded-full flex items-center justify-center',
          'bg-gradient-to-r from-purple-600 to-pink-600',
          'text-white shadow-2xl',
          'hover:shadow-purple-500/50',
          'transition-all duration-200',
          'relative overflow-hidden'
        )}
      >
        {/* Animated Background */}
        <motion.div
          animate={{
            scale: isOpen ? 1.2 : 1,
            rotate: isOpen ? 90 : 0,
          }}
          className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"
        />

        {/* Icon */}
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="relative z-10"
        >
          {isOpen ? <X size={24} /> : <Plus size={24} />}
        </motion.div>

        {/* Ripple effect */}
        {!isOpen && (
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'loop',
            }}
            className="absolute inset-0 rounded-full bg-purple-400"
          />
        )}
      </motion.button>
    </div>
  );
}
