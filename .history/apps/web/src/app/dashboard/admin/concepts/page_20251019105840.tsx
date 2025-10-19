'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye,
  TrendingUp,
  Users,
  Target,
  CheckCircle
} from 'lucide-react';

interface ConceptStats {
  totalConcepts: number;
  totalPractices: number;
  totalQuestions: number;
  totalViews: number;
  categoryCounts: Record<string, number>;
  recentlyViewed: Array<{
    id: string;
    title: string;
    views: number;
  }>;
}

export default function AdminConceptsPage() {
  const { locale } = useTranslation();
  const [stats, setStats] = useState<ConceptStats | null>(null);
  const [concepts, setConcepts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      const [conceptsRes, categoriesRes] = await Promise.all([
        fetch(`${apiBaseUrl}/api/concepts/search?limit=100`),
        fetch(`${apiBaseUrl}/api/concepts/categories`),
      ]);

      const conceptsData = await conceptsRes.json();
      const categoriesData = await categoriesRes.json();

      setConcepts(conceptsData.data || []);
      setCategories(categoriesData);

      // Calculate stats
      const stats: ConceptStats = {
        totalConcepts: conceptsData.data?.length || 0,
        totalPractices: 0,
        totalQuestions: 0,
        totalViews: 0,
        categoryCounts: {},
        recentlyViewed: [],
      };

      conceptsData.data?.forEach((concept: any) => {
        stats.totalViews += concept.views || 0;
        const catName = locale === 'vi' ? concept.category?.name : concept.category?.nameEn;
        stats.categoryCounts[catName] = (stats.categoryCounts[catName] || 0) + 1;
      });

      setStats(stats);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredConcepts = concepts.filter((concept) =>
    searchQuery === '' ||
    concept.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    concept.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    concept.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            CKB Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage concepts, practices, and questions
          </p>
        </div>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Concept
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Concepts</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.totalConcepts}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Categories</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {categories.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.totalViews.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg per Concept</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.totalConcepts > 0 ? Math.round(stats.totalViews / stats.totalConcepts) : 0}
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Distribution */}
      {stats && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Category Distribution
          </h2>
          <div className="space-y-3">
            {Object.entries(stats.categoryCounts).map(([category, count]) => (
              <div key={category} className="flex items-center gap-4">
                <div className="w-32 text-sm text-gray-600 dark:text-gray-400">
                  {category}
                </div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-8 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-full flex items-center justify-center text-white text-sm font-medium"
                    style={{ width: `${(count / stats.totalConcepts) * 100}%` }}
                  >
                    {count}
                  </div>
                </div>
                <div className="w-16 text-right text-sm text-gray-600 dark:text-gray-400">
                  {Math.round((count / stats.totalConcepts) * 100)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Concepts Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Concept
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Difficulty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredConcepts.map((concept) => (
                <tr key={concept.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {locale === 'vi' ? concept.title : concept.titleEn}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                        {locale === 'vi' ? concept.summary : concept.summaryEn}
                      </div>
                      {concept.tags && concept.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {concept.tags.slice(0, 3).map((tag: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {locale === 'vi' ? concept.category?.name : concept.category?.nameEn}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                      concept.difficulty === 'BEGINNER'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : concept.difficulty === 'INTERMEDIATE'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {concept.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {concept.views || 0}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredConcepts.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No concepts found</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors text-left">
            <Plus className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2" />
            <div className="font-medium text-gray-900 dark:text-white">Add Concept</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Create new concept</div>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors text-left">
            <Target className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
            <div className="font-medium text-gray-900 dark:text-white">Add Category</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Create new category</div>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-500 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors text-left">
            <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400 mb-2" />
            <div className="font-medium text-gray-900 dark:text-white">Bulk Import</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Import from file</div>
          </button>
        </div>
      </div>
    </div>
  );
}
