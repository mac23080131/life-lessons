'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  index: number;
}

export function FeatureCard({ icon: Icon, title, description, gradient, index }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 300, damping: 30 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="group glass-card p-8 rounded-3xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
    >
      <motion.div
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.6 }}
        className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}
      >
        <Icon className="text-white" size={32} />
      </motion.div>
      
      <h3 className="text-xl font-bold mb-3 text-center group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
        {title}
      </h3>
      
      <p className="text-muted-foreground text-center leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
