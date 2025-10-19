'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTranslation } from '@/lib/hooks/useTranslation';

interface EditGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: {
    id: string;
    target: number;
    sprintSize: number;
    cadence: string;
  };
  onSave: (data: { target: number; sprintSize: number; cadence: string }) => void;
}

export function EditGoalModal({ isOpen, onClose, goal, onSave }: EditGoalModalProps) {
  const { t } = useTranslation();
  const [target, setTarget] = useState(goal.target);
  const [sprintSize, setSprintSize] = useState(goal.sprintSize);
  const [cadence, setCadence] = useState(goal.cadence);

  const handleSave = () => {
    onSave({ target, sprintSize, cadence });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="glass-card max-w-md w-full p-6 pointer-events-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">{t('goals.editGoal')}</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form */}
              <div className="space-y-4">
                {/* Target */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('goals.target')}
                  </label>
                  <input
                    type="number"
                    value={target}
                    onChange={(e) => setTarget(parseInt(e.target.value) || 0)}
                    min={1}
                    max={100000}
                    step={100}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Sprint Size */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('goals.sprintSize')}
                  </label>
                  <input
                    type="number"
                    value={sprintSize}
                    onChange={(e) => setSprintSize(parseInt(e.target.value) || 0)}
                    min={10}
                    max={1000}
                    step={10}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Cadence */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('goals.cadence')}
                  </label>
                  <select
                    value={cadence}
                    onChange={(e) => setCadence(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="daily">{t('goals.daily')}</option>
                    <option value="5x_week">{t('goals.fivePerWeek')}</option>
                    <option value="custom">{t('goals.custom')}</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:shadow-lg transition-shadow"
                >
                  {t('goals.saveChanges')}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
