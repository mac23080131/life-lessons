'use client';

import { useGoal } from '@/lib/hooks/useGoals';

export default function GoalsPage() {
  const { data: goal, isLoading } = useGoal();

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center">
        <p className="text-gray-500 mb-4">No goal set yet.</p>
        <p className="text-sm text-gray-400">
          A goal will be created automatically when you create your first lesson.
        </p>
      </div>
    );
  }

  const progressPercent = ((goal.current / goal.target) * 100).toFixed(1);
  const currentSprint = Math.floor(goal.current / goal.sprintSize) + 1;
  const sprintProgress = goal.current % goal.sprintSize;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Goals & Roadmap</h1>

      {/* Progress Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-32 h-32">
                <circle
                  className="text-gray-200 dark:text-gray-700"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="56"
                  cx="64"
                  cy="64"
                />
                <circle
                  className="text-purple-600"
                  strokeWidth="8"
                  strokeDasharray={`${(parseFloat(progressPercent) / 100) * 351.86} 351.86`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="56"
                  cx="64"
                  cy="64"
                  transform="rotate(-90 64 64)"
                />
              </svg>
              <span className="absolute text-2xl font-bold">{progressPercent}%</span>
            </div>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Overall Progress</p>
          </div>

          <div className="text-center">
            <p className="text-5xl font-bold text-purple-600">{goal.current}</p>
            <p className="mt-2 text-gray-600 dark:text-gray-400">of {goal.target} lessons</p>
            <p className="mt-4 text-sm text-gray-500">{goal.target - goal.current} remaining</p>
          </div>

          <div className="text-center">
            <p className="text-5xl font-bold text-blue-600">{currentSprint}</p>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Current Sprint</p>
            <p className="mt-4 text-sm text-gray-500">
              {sprintProgress}/{goal.sprintSize} lessons
            </p>
          </div>
        </div>
      </div>

      {/* Sprint Progress Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Sprint {currentSprint} Progress</h2>
        
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block text-purple-600">
                {sprintProgress} / {goal.sprintSize}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-purple-600">
                {((sprintProgress / goal.sprintSize) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
            <div
              style={{ width: `${(sprintProgress / goal.sprintSize) * 100}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-600 transition-all duration-500"
            ></div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            💡 Keep it up! You're making great progress. {goal.sprintSize - sprintProgress} more lessons to complete this sprint.
          </p>
        </div>
      </div>

      {/* Goal Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Goal Settings</h2>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Target:</span>
            <span className="font-semibold">{goal.target} lessons</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Sprint Size:</span>
            <span className="font-semibold">{goal.sprintSize} lessons</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Cadence:</span>
            <span className="font-semibold">{goal.cadence}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Status:</span>
            <span className="font-semibold capitalize">{goal.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
