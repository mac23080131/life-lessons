import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center space-y-8 p-8">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Life Lessons
        </h1>
        <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Track your 10,000 lessons journey
        </p>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          Capture, analyze, and learn from your life experiences.
          Build meaningful insights through consistent reflection.
        </p>
        
        <div className="flex gap-4 justify-center pt-8">
          <Link
            href="/login"
            className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-8 py-3 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-semibold"
          >
            Sign Up
          </Link>
        </div>

        <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="text-3xl mb-3">📝</div>
            <h3 className="font-semibold mb-2">Quick Capture</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Write or speak your lessons in seconds
            </p>
          </div>
          
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="font-semibold mb-2">AI Analysis</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Get insights and reflection prompts
            </p>
          </div>
          
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-semibold mb-2">10,000 Goal</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Track progress with sprint-based roadmap
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
