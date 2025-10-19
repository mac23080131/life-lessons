'use client';

import { useLessons, useDeleteLesson } from '@/lib/hooks/useLessons';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Plus, Grid3x3, List, SortAsc } from 'lucide-react';
import { LessonCard } from '@/components/journal/LessonCard';
import { FilterChips } from '@/components/journal/FilterChips';
import { LessonGridSkeleton } from '@/components/journal/LessonSkeleton';

type ViewMode = 'grid' | 'list';
type SortBy = 'newest' | 'oldest' | 'resonance';

export default function JournalPage() {
  const router = useRouter();
  const [domain, setDomain] = useState('');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('newest');
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useLessons({ 
    domain: domain || undefined, 
    q: search || undefined 
  });
  const deleteLesson = useDeleteLesson();

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc muốn xóa bài học này?')) {
      await deleteLesson.mutateAsync(id);
    }
  };

  const handleRemoveFilter = (type: 'domain' | 'tag' | 'mood', value?: string) => {
    if (type === 'domain') setDomain('');
  };

  const handleClearAll = () => {
    setDomain('');
    setSearch('');
  };

  const sortedLessons = data?.lessons ? [...data.lessons].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortBy === 'resonance') return b.resonance - a.resonance;
    return 0;
  }) : [];

  return (
    <div className="min-h-screen pb-12">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-8 mb-8 glass-card"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Nhật ký bài học 📚</h1>
            <p className="text-muted-foreground text-lg">
              {data?.total || 0} bài học • {data?.lessons?.length || 0} đang hiển thị
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/dashboard')}
            className="btn-modern flex items-center gap-2 px-6 py-3 rounded-xl"
          >
            <Plus size={20} />
            Tạo bài học mới
          </motion.button>
        </div>
      </motion.div>

      {/* Search & Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4 rounded-2xl mb-6"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm bài học..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-border rounded-xl bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          {/* Domain Filter */}
          <select
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="px-4 py-3 border-2 border-border rounded-xl bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary focus:border-transparent lg:w-48"
          >
            <option value="">Tất cả lĩnh vực</option>
            <option value="INNER">🧠 Nội tâm</option>
            <option value="HEALTH">💪 Sức khỏe</option>
            <option value="RELATIONSHIP">❤️ Mối quan hệ</option>
            <option value="FINANCE">💰 Tài chính</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="px-4 py-3 border-2 border-border rounded-xl bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary focus:border-transparent lg:w-44"
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="resonance">Resonance cao</option>
          </select>

          {/* View Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-xl transition-all ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-background/50 hover:bg-background'
              }`}
            >
              <Grid3x3 size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-xl transition-all ${
                viewMode === 'list'
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-background/50 hover:bg-background'
              }`}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Active Filters */}
      <FilterChips
        activeFilters={{ domain }}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={handleClearAll}
      />

      {/* Loading State */}
      {isLoading && <LessonGridSkeleton count={6} />}

      {/* Empty State */}
      {!isLoading && sortedLessons.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <span className="text-6xl">📝</span>
          </div>
          <h3 className="text-2xl font-bold mb-2">Chưa có bài học nào</h3>
          <p className="text-muted-foreground mb-6">
            {search || domain ? 'Thử thay đổi bộ lọc hoặc tìm kiếm' : 'Bắt đầu hành trình 10,000 bài học của bạn!'}
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="btn-modern px-6 py-3 rounded-xl"
          >
            Tạo bài học đầu tiên
          </button>
        </motion.div>
      )}

      {/* Lessons Grid/List */}
      {!isLoading && sortedLessons.length > 0 && (
        <motion.div
          layout
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'flex flex-col gap-4'
          }
        >
          <AnimatePresence mode="popLayout">
            {sortedLessons.map((lesson: any, index: number) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                index={index}
                onEdit={(id) => router.push(`/journal/${id}`)}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Stats Footer */}
      {!isLoading && sortedLessons.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center text-sm text-muted-foreground"
        >
          Hiển thị {sortedLessons.length} / {data?.total || 0} bài học
        </motion.div>
      )}
    </div>
  );
}
