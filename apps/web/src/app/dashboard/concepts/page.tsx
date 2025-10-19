'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { BookOpen, Search, Filter, Sparkles, TrendingUp, Brain } from 'lucide-react';
import Link from 'next/link';

interface ConceptCategory {
  id: string;
  key: string;
  name: string;
  nameEn: string;
  description?: string;
  icon?: string;
  color?: string;
  order: number;
  _count?: {
    concepts: number;
  };
}

interface Concept {
  id: string;
  key: string;
  slug: string;
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
  categoryId: string;
  tags: string[];
  difficulty: string;
  views: number;
}

export default function ConceptsPage() {
  const { t, locale } = useTranslation();
  const [categories, setCategories] = useState<ConceptCategory[]>([]);
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all'); // all, beginner, intermediate, advanced

  useEffect(() => {
    fetchCategories();
    fetchConcepts();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchConcepts(selectedCategory);
    } else {
      fetchConcepts();
    }
  }, [selectedCategory, filter]);

  const fetchCategories = async () => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      const response = await fetch(`${apiBaseUrl}/api/concepts/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data.sort((a: ConceptCategory, b: ConceptCategory) => a.order - b.order));
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchConcepts = async (categoryId?: string) => {
    setLoading(true);
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      let url = `${apiBaseUrl}/api/concepts/search?`;
      if (categoryId) url += `categoryId=${categoryId}&`;
      if (filter !== 'all') url += `difficulty=${filter.toUpperCase()}&`;
      if (searchQuery) url += `q=${encodeURIComponent(searchQuery)}&`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        // API returns { data, total, limit, offset }
        setConcepts(data.data || data.concepts || data);
      }
    } catch (error) {
      console.error('Failed to fetch concepts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchConcepts(selectedCategory || undefined);
  };

  const getCategoryIcon = (key: string) => {
    const icons: Record<string, React.ReactNode> = {
      mindfulness: <Brain className="w-6 h-6" />,
      growth: <TrendingUp className="w-6 h-6" />,
      emotional: <Sparkles className="w-6 h-6" />,
      default: <BookOpen className="w-6 h-6" />,
    };
    return icons[key] || icons.default;
  };

  const getCategoryColor = (color?: string) => {
    const colors: Record<string, string> = {
      purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800',
      blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
      green: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
      orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800',
    };
    return colors[color || ''] || 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700';
  };

  const getDifficultyBadge = (difficulty: string) => {
    const badges: Record<string, { label: string; color: string }> = {
      BEGINNER: { label: 'Beginner', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
      INTERMEDIATE: { label: 'Intermediate', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
      ADVANCED: { label: 'Advanced', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
    };
    return badges[difficulty] || badges.BEGINNER;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {locale === 'vi' ? 'Thư Viện Khái Niệm' : 'Concept Library'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {locale === 'vi' 
              ? 'Khám phá các khái niệm tâm lý học và phát triển bản thân'
              : 'Explore psychology and personal development concepts'}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            {locale === 'vi' ? 'Tiến độ của tôi' : 'My Progress'}
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={locale === 'vi' ? 'Tìm kiếm khái niệm...' : 'Search concepts...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap"
          >
            {locale === 'vi' ? 'Tìm' : 'Search'}
          </button>
        </div>
        
        {/* Difficulty Filter */}
        <div className="flex items-center gap-2 mt-4">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {locale === 'vi' ? 'Độ khó:' : 'Difficulty:'}
          </span>
          {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                filter === level
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {level === 'all' ? (locale === 'vi' ? 'Tất cả' : 'All') : level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`p-4 rounded-lg border-2 transition-all ${
            selectedCategory === null
              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-900 dark:text-white">
                {locale === 'vi' ? 'Tất cả' : 'All'}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {concepts.length} {locale === 'vi' ? 'khái niệm' : 'concepts'}
              </div>
            </div>
          </div>
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedCategory === category.id
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${getCategoryColor(category.color)}`}>
                {getCategoryIcon(category.key)}
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900 dark:text-white">
                  {locale === 'vi' ? category.name : category.nameEn}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {category._count?.concepts || 0} {locale === 'vi' ? 'khái niệm' : 'concepts'}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Concepts Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      ) : concepts.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {locale === 'vi' ? 'Chưa có khái niệm' : 'No concepts found'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {locale === 'vi' 
              ? 'Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác'
              : 'Try changing filters or search with different keywords'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {concepts.map((concept) => {
            const difficultyBadge = getDifficultyBadge(concept.difficulty);
            return (
              <Link
                key={concept.id}
                href={`/dashboard/concepts/${concept.slug}`}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all hover:border-purple-300 dark:hover:border-purple-600 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {locale === 'vi' ? concept.title : concept.titleEn}
                  </h3>
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${difficultyBadge.color}`}>
                    {difficultyBadge.label}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                  {locale === 'vi' ? concept.summary : concept.summaryEn}
                </p>
                
                {concept.tags && concept.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {concept.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {concept.views || 0} {locale === 'vi' ? 'lượt xem' : 'views'}
                  </span>
                  <span className="text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform">
                    {locale === 'vi' ? 'Xem thêm →' : 'Learn more →'}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
