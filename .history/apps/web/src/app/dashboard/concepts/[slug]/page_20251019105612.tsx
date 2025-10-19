'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { 
  BookOpen, 
  ArrowLeft, 
  Lightbulb, 
  CheckCircle2, 
  MessageCircle,
  Star,
  BookmarkPlus,
  Share2,
  TrendingUp,
  Link as LinkIcon
} from 'lucide-react';
import Link from 'next/link';

interface Concept {
  id: string;
  key: string;
  slug: string;
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
  description: string;
  descriptionEn: string;
  difficulty: string;
  tags: string[];
  views: number;
  category: {
    id: string;
    name: string;
    nameEn: string;
  };
  practices: Practice[];
  examples: Example[];
  questions: Question[];
  relationsA: Relation[];
  relationsB: Relation[];
}

interface Practice {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  steps: string[];
  stepsEn: string[];
  duration?: number;
  difficulty: string;
}

interface Example {
  id: string;
  title: string;
  titleEn: string;
  text: string;
  textEn: string;
  source?: string;
}

interface Question {
  id: string;
  question: string;
  questionEn: string;
  type: string;
  context?: string;
  contextEn?: string;
}

interface Relation {
  id: string;
  type: string;
  a?: { id: string; title: string; titleEn: string; slug: string };
  b?: { id: string; title: string; titleEn: string; slug: string };
}

export default function ConceptDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t, locale } = useTranslation();
  const [concept, setConcept] = useState<Concept | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'practices' | 'examples' | 'questions'>('overview');
  const [userProgress, setUserProgress] = useState<any>(null);

  useEffect(() => {
    if (params.slug) {
      fetchConcept(params.slug as string);
    }
  }, [params.slug]);

  const fetchConcept = async (slug: string) => {
    setLoading(true);
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      // Search by slug
      const searchResponse = await fetch(`${apiBaseUrl}/api/concepts/search?slug=${slug}`);
      if (searchResponse.ok) {
        const searchData = await searchResponse.json();
        if (searchData.data && searchData.data.length > 0) {
          const conceptId = searchData.data[0].id;
          // Now fetch full details
          const detailResponse = await fetch(`${apiBaseUrl}/api/concepts/${conceptId}`);
          if (detailResponse.ok) {
            const data = await detailResponse.json();
            setConcept(data);
            // Update views
            incrementViews(conceptId);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch concept:', error);
    } finally {
      setLoading(false);
    }
  };

  const incrementViews = async (conceptId: string) => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      await fetch(`${apiBaseUrl}/api/concepts/${conceptId}/views`, { method: 'POST' });
    } catch (error) {
      // Silent fail
    }
  };

  const updateProgress = async (status: string) => {
    if (!concept) return;
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      const response = await fetch(`${apiBaseUrl}/api/concepts/${concept.id}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        setUserProgress(await response.json());
      }
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!concept) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {locale === 'vi' ? 'Không tìm thấy khái niệm' : 'Concept not found'}
        </h3>
        <Link href="/dashboard/concepts" className="text-purple-600 hover:text-purple-700">
          {locale === 'vi' ? '← Quay lại thư viện' : '← Back to library'}
        </Link>
      </div>
    );
  }

  const relatedConcepts = [
    ...concept.relationsA.map(r => ({ ...r.b!, type: r.type })),
    ...concept.relationsB.map(r => ({ ...r.a!, type: r.type }))
  ].filter(Boolean);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Link
        href="/dashboard/concepts"
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {locale === 'vi' ? 'Quay lại thư viện' : 'Back to library'}
      </Link>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-sm font-medium">
                {locale === 'vi' ? concept.category.name : concept.category.nameEn}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                concept.difficulty === 'BEGINNER' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : concept.difficulty === 'INTERMEDIATE'
                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {concept.difficulty.toLowerCase()}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              {locale === 'vi' ? concept.title : concept.titleEn}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {locale === 'vi' ? concept.summary : concept.summaryEn}
            </p>
          </div>
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => updateProgress('BOOKMARKED')}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              title={locale === 'vi' ? 'Lưu' : 'Bookmark'}
            >
              <BookmarkPlus className="w-5 h-5" />
            </button>
            <button
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              title={locale === 'vi' ? 'Chia sẻ' : 'Share'}
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {concept.tags && concept.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {concept.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            {concept.views} {locale === 'vi' ? 'lượt xem' : 'views'}
          </span>
          <span className="flex items-center gap-1">
            <Lightbulb className="w-4 h-4" />
            {concept.practices?.length || 0} {locale === 'vi' ? 'thực hành' : 'practices'}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            {concept.questions?.length || 0} {locale === 'vi' ? 'câu hỏi' : 'questions'}
          </span>
        </div>

        {/* Progress Actions */}
        <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => updateProgress('IN_PROGRESS')}
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            {locale === 'vi' ? 'Bắt đầu học' : 'Start Learning'}
          </button>
          <button
            onClick={() => updateProgress('COMPLETED')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            {locale === 'vi' ? 'Đánh dấu hoàn thành' : 'Mark Complete'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px">
            {[
              { key: 'overview', label: locale === 'vi' ? 'Tổng quan' : 'Overview', icon: BookOpen },
              { key: 'practices', label: locale === 'vi' ? 'Thực hành' : 'Practices', icon: Lightbulb },
              { key: 'examples', label: locale === 'vi' ? 'Ví dụ' : 'Examples', icon: Star },
              { key: 'questions', label: locale === 'vi' ? 'Câu hỏi' : 'Questions', icon: MessageCircle },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="prose dark:prose-invert max-w-none">
              <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {locale === 'vi' ? concept.description : concept.descriptionEn}
              </div>
            </div>
          )}

          {/* Practices Tab */}
          {activeTab === 'practices' && (
            <div className="space-y-6">
              {concept.practices && concept.practices.length > 0 ? (
                concept.practices.map((practice, idx) => (
                  <div key={practice.id} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {idx + 1}. {locale === 'vi' ? practice.title : practice.titleEn}
                      </h3>
                      {practice.duration && (
                        <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-sm">
                          {practice.duration} {locale === 'vi' ? 'phút' : 'min'}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {locale === 'vi' ? practice.description : practice.descriptionEn}
                    </p>
                    {practice.steps && practice.steps.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          {locale === 'vi' ? 'Các bước:' : 'Steps:'}
                        </h4>
                        <ol className="space-y-2 list-decimal list-inside text-gray-700 dark:text-gray-300">
                          {(locale === 'vi' ? practice.steps : practice.stepsEn).map((step, stepIdx) => (
                            <li key={stepIdx}>{step}</li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  {locale === 'vi' ? 'Chưa có thực hành nào' : 'No practices yet'}
                </div>
              )}
            </div>
          )}

          {/* Examples Tab */}
          {activeTab === 'examples' && (
            <div className="space-y-4">
              {concept.examples && concept.examples.length > 0 ? (
                concept.examples.map((example) => (
                  <div key={example.id} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {locale === 'vi' ? example.title : example.titleEn}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {locale === 'vi' ? example.text : example.textEn}
                    </p>
                    {example.source && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {locale === 'vi' ? 'Nguồn:' : 'Source:'} {example.source}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  {locale === 'vi' ? 'Chưa có ví dụ nào' : 'No examples yet'}
                </div>
              )}
            </div>
          )}

          {/* Questions Tab */}
          {activeTab === 'questions' && (
            <div className="space-y-4">
              {concept.questions && concept.questions.length > 0 ? (
                concept.questions.map((question, idx) => (
                  <div key={question.id} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                    <div className="flex items-start gap-3">
                      <MessageCircle className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-gray-900 dark:text-white font-medium mb-2">
                          {locale === 'vi' ? question.question : question.questionEn}
                        </p>
                        {question.context && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {locale === 'vi' ? question.context : question.contextEn}
                          </p>
                        )}
                        <span className="inline-block mt-2 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded text-xs">
                          {question.type.replace('_', ' ').toLowerCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  {locale === 'vi' ? 'Chưa có câu hỏi nào' : 'No questions yet'}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related Concepts */}
      {relatedConcepts.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <LinkIcon className="w-5 h-5" />
            {locale === 'vi' ? 'Khái niệm liên quan' : 'Related Concepts'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedConcepts.map((related) => (
              <Link
                key={related.id}
                href={`/dashboard/concepts/${related.slug}`}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-600 transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {locale === 'vi' ? related.title : related.titleEn}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 inline-block">
                      {related.type.replace('_', ' ').toLowerCase()}
                    </span>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-gray-400 transform rotate-180 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
