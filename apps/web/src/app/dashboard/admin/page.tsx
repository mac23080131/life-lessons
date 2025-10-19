'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  BookOpen,
  FileText,
  TrendingUp,
  Settings,
  Shield,
} from 'lucide-react';

interface OverviewStats {
  users: { total: number; activeThisWeek: number };
  lessons: { total: number; thisWeek: number };
  concepts: { total: number };
  goals: { total: number };
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats/overview');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Shield className="w-8 h-8 text-purple-600" />
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage users, content, and system settings
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.users.total.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  {stats.users.activeThisWeek} active this week
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Lessons</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.lessons.total.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  +{stats.lessons.thisWeek} this week
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Concepts</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.concepts.total}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  in knowledge base
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Goals</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.goals.total.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  user goals set
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/dashboard/admin/users">
          <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-colors p-6 cursor-pointer">
            <Users className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              User Management
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View, edit, and manage user accounts
            </p>
          </div>
        </Link>

        <Link href="/dashboard/admin/concepts">
          <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors p-6 cursor-pointer">
            <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Concept Management
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage knowledge base concepts
            </p>
          </div>
        </Link>

        <Link href="/dashboard/admin/lessons">
          <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 transition-colors p-6 cursor-pointer">
            <FileText className="w-8 h-8 text-green-600 dark:text-green-400 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Lesson Management
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Review and moderate user lessons
            </p>
          </div>
        </Link>

        <Link href="/dashboard/admin/stats">
          <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 transition-colors p-6 cursor-pointer">
            <TrendingUp className="w-8 h-8 text-orange-600 dark:text-orange-400 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Statistics & Analytics
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View detailed platform metrics
            </p>
          </div>
        </Link>

        <Link href="/dashboard/settings">
          <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-500 transition-colors p-6 cursor-pointer">
            <Settings className="w-8 h-8 text-gray-600 dark:text-gray-400 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              System Settings
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Configure system parameters
            </p>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h2>
        <div className="text-gray-600 dark:text-gray-400 text-center py-8">
          Activity feed coming soon...
        </div>
      </div>
    </div>
  );
}
