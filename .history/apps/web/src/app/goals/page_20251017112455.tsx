'use client'

import { useGoal, useCreateGoal, useGoalRoadmap } from '@/lib/hooks/useGoals'
import { useRouter } from 'next/navigation'

export default function GoalsPage() {
  const router = useRouter()
  const { data: goal, isLoading } = useGoal()
  const createGoal = useCreateGoal()
  const { data: roadmap } = useGoalRoadmap(goal?.id || '')

  const handleCreateGoal = async () => {
    try {
      await createGoal.mutateAsync()
      alert('Mục tiêu đã được tạo!')
    } catch (error) {
      alert('Có lỗi xảy ra')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mục tiêu 10,000</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-sm text-indigo-600 hover:text-indigo-700"
          >
            ← Về Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400">Đang tải...</div>
        )}

        {!goal && !isLoading && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Bắt đầu hành trình 10,000 bài học
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Mỗi sprint 100 bài học sẽ giúp bạn phát triển đều đặn và bền vững
            </p>
            <button
              onClick={handleCreateGoal}
              disabled={createGoal.isPending}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {createGoal.isPending ? 'Đang tạo...' : 'Tạo mục tiêu'}
            </button>
          </div>
        )}

        {goal && (
          <div className="space-y-6">
            {/* Progress Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="text-center mb-6">
                <div className="text-6xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                  {goal.current}
                </div>
                <div className="text-xl text-gray-600 dark:text-gray-400">
                  / {goal.target} bài học
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  {((goal.current / goal.target) * 100).toFixed(1)}% hoàn thành
                </div>
              </div>

              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div
                  className="bg-indigo-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${(goal.current / goal.target) * 100}%` }}
                ></div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.ceil((goal.target - goal.current) / goal.sprintSize)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Sprint còn lại</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {goal.sprintSize}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Bài học/sprint</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {goal.cadence === 'daily' ? 'Hàng ngày' : goal.cadence}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Nhịp độ</div>
                </div>
              </div>
            </div>

            {/* Current Sprint */}
            {roadmap?.currentSprint && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Sprint hiện tại #{roadmap.currentSprint.index}
                </h2>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>{roadmap.currentSprint.done} / {roadmap.currentSprint.target}</span>
                    <span>
                      {((roadmap.currentSprint.done / roadmap.currentSprint.target) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${(roadmap.currentSprint.done / roadmap.currentSprint.target) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Bắt đầu: </span>
                    <span className="text-gray-900 dark:text-white">
                      {new Date(roadmap.currentSprint.startAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Kết thúc: </span>
                    <span className="text-gray-900 dark:text-white">
                      {new Date(roadmap.currentSprint.endAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Sprints List */}
            {goal.sprints && goal.sprints.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Lịch sử Sprint
                </h2>
                <div className="space-y-2">
                  {goal.sprints.map((sprint) => (
                    <div
                      key={sprint.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded"
                    >
                      <div>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          Sprint #{sprint.index}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                          {sprint.done}/{sprint.target}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(sprint.startAt).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
