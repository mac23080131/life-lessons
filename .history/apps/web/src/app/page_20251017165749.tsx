'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Brain, 
  Target, 
  TrendingUp, 
  Users, 
  Shield,
  Zap,
  Heart,
  BookOpen,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { FeatureCard } from '@/components/landing/FeatureCard';
import { Stats } from '@/components/landing/Stats';

export default function HomePage() {
  const features = [
    {
      icon: Sparkles,
      title: 'Quick Capture',
      description: 'Ghi lại bài học trong vài giây với text hoặc voice input. AI sẽ tự động phân tích và gợi ý.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Brain,
      title: 'AI Analysis',
      description: 'Nhận insights sâu sắc, tóm tắt thông minh và câu hỏi reflection từ AI coach của bạn.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Target,
      title: 'Goal Tracking',
      description: 'Theo dõi tiến độ 10,000 bài học với hệ thống sprint, milestone và achievement badges.',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: TrendingUp,
      title: 'Analytics',
      description: 'Biểu đồ trực quan, heatmap hoạt động, và insights về các lĩnh vực phát triển của bạn.',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Chia sẻ ẩn danh, học hỏi từ người khác, và tham gia challenges nhóm để động lực.',
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Dữ liệu của bạn hoàn toàn riêng tư. Chọn chia sẻ theo link hoặc giữ kín 100%.',
      gradient: 'from-gray-500 to-slate-500',
    },
  ];

  const stats = [
    { value: '10K', label: 'Mục tiêu bài học' },
    { value: '100', label: 'Bài/Sprint' },
    { value: 'AI', label: 'Phân tích thông minh' },
    { value: '∞', label: 'Không giới hạn' },
  ];

  const benefits = [
    'Ghi chép nhanh chóng, không cần suy nghĩ nhiều',
    'AI coach giúp bạn reflection sâu hơn',
    'Theo dõi tiến độ với gamification',
    'Tạo thói quen học tập bền vững',
    'Phát triển đều đặn qua 4 lĩnh vực',
    'Cộng đồng hỗ trợ và động viên',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        {/* Animated background gradients */}
        <div className="absolute inset-0 -z-10">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
            className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 2,
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Logo/Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8"
            >
              <Sparkles className="text-purple-500" size={20} />
              <span className="text-sm font-medium">Hành trình 10,000 bài học</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
                Life Lessons
              </span>
              <br />
              <span className="text-3xl md:text-5xl">
                Ghi chép • Phân tích • Thành công
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Capture every insight, analyze with AI, and transform your life through
              <span className="text-purple-600 dark:text-purple-400 font-semibold"> 10,000 lessons </span>
              of continuous learning
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Link href="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-modern px-8 py-4 text-lg rounded-xl flex items-center gap-2 shadow-2xl"
                >
                  Bắt đầu miễn phí
                  <ArrowRight size={20} />
                </motion.button>
              </Link>
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 text-lg rounded-xl border-2 border-border bg-background/50 backdrop-blur-sm hover:bg-background transition-all flex items-center gap-2"
                >
                  Đã có tài khoản
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Stats stats={stats} />
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-border rounded-full flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-purple-500 rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Tính năng nổi bật ✨
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Công cụ hoàn hảo để ghi nhận, phân tích và học hỏi từ mọi trải nghiệm
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} {...feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Cách hoạt động 🚀
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Chỉ 3 bước đơn giản để bắt đầu hành trình 10,000 bài học
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-8">
            {[
              {
                step: '1',
                title: 'Ghi chép nhanh',
                description: 'Mở app, nhập hoặc nói bài học của bạn. Mất chưa đến 30 giây!',
                icon: Zap,
              },
              {
                step: '2',
                title: 'AI phân tích',
                description: 'Nhận tóm tắt, insights và câu hỏi reflection từ AI coach.',
                icon: Brain,
              },
              {
                step: '3',
                title: 'Theo dõi & Phát triển',
                description: 'Xem tiến độ, đạt milestones, và học hỏi từ patterns của bạn.',
                icon: TrendingUp,
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="flex items-start gap-6 glass-card p-8 rounded-2xl"
                >
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon className="text-purple-500" size={28} />
                      <h3 className="text-2xl font-bold">{item.title}</h3>
                    </div>
                    <p className="text-muted-foreground text-lg">{item.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Tại sao chọn Life Lessons? 💎
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-4 rounded-xl hover:bg-background/50 transition-colors"
                >
                  <CheckCircle2 className="text-green-500 flex-shrink-0 mt-0.5" size={24} />
                  <span className="text-lg">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto glass-card p-12 md:p-16 rounded-3xl text-center"
          >
            <Heart className="w-20 h-20 mx-auto mb-6 text-purple-500" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Sẵn sàng bắt đầu chưa? 🚀
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Tham gia ngay hôm nay và bắt đầu hành trình 10,000 bài học.
              Hoàn toàn miễn phí, không cần thẻ tín dụng.
            </p>
            <Link href="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-modern px-12 py-5 text-xl rounded-2xl shadow-2xl"
              >
                <Sparkles className="inline mr-2" size={24} />
                Tạo tài khoản miễn phí
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="text-purple-500" size={24} />
              <span className="font-bold text-xl">Life Lessons</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 Life Lessons. Made with 💜 for lifelong learners.
            </div>
            <div className="flex gap-6">
              <Link href="/login" className="text-sm hover:text-purple-500 transition-colors">
                Đăng nhập
              </Link>
              <Link href="/signup" className="text-sm hover:text-purple-500 transition-colors">
                Đăng ký
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
