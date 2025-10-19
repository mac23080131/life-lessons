'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  BookOpen, 
  FolderOpen, 
  TrendingUp,
  Activity,
  Database
} from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalConcepts: number;
  totalCategories: number;
  totalLessons: number;
  activeUsers: number;
  conceptsThisMonth: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalConcepts: 0,
    totalCategories: 0,
    totalLessons: 0,
    activeUsers: 0,
    conceptsThisMonth: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/admin/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Tổng Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      change: `${stats.activeUsers} hoạt động`
    },
    {
      title: 'Khái niệm',
      value: stats.totalConcepts,
      icon: BookOpen,
      color: 'from-purple-500 to-purple-600',
      change: `+${stats.conceptsThisMonth} tháng này`
    },
    {
      title: 'Danh mục',
      value: stats.totalCategories,
      icon: FolderOpen,
      color: 'from-green-500 to-green-600',
      change: 'Đang hoạt động'
    },
    {
      title: 'Bài học',
      value: stats.totalLessons,
      icon: Database,
      color: 'from-orange-500 to-orange-600',
      change: 'Tổng hệ thống'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="h-24"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Admin Dashboard
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Tổng quan hệ thống và quản lý
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm">
                <TrendingUp className="w-4 h-4" />
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stat.value.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">{stat.change}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/concepts"
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md transition-all text-center"
          >
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
            <p className="font-medium text-gray-900 dark:text-white">Quản lý Khái niệm</p>
          </a>
          <a
            href="/admin/users"
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all text-center"
          >
            <Users className="w-8 h-8 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
            <p className="font-medium text-gray-900 dark:text-white">Quản lý Users</p>
          </a>
          <a
            href="/admin/categories"
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 hover:shadow-md transition-all text-center"
          >
            <FolderOpen className="w-8 h-8 mx-auto mb-2 text-green-600 dark:text-green-400" />
            <p className="font-medium text-gray-900 dark:text-white">Quản lý Danh mục</p>
          </a>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Hoạt động gần đây
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-gray-600 dark:text-gray-400">Hệ thống đang hoạt động bình thường</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-gray-600 dark:text-gray-400">Database được đồng bộ</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            <span className="text-gray-600 dark:text-gray-400">CKB đang sẵn sàng</span>
          </div>
        </div>
      </div>
    </div>
  );
}
