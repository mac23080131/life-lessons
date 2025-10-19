'use client';

import { motion } from 'framer-motion';

interface StatItemProps {
  value: string;
  label: string;
  index: number;
}

export function StatItem({ value, label, index }: StatItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 400, damping: 20 }}
      className="text-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 + 0.2 }}
        className="text-5xl md:text-6xl font-bold mb-2 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 bg-clip-text text-transparent"
      >
        {value}
      </motion.div>
      <div className="text-sm md:text-base text-muted-foreground font-medium">
        {label}
      </div>
    </motion.div>
  );
}

interface StatsProps {
  stats: Array<{ value: string; label: string }>;
}

export function Stats({ stats }: StatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
      {stats.map((stat, index) => (
        <StatItem key={stat.label} {...stat} index={index} />
      ))}
    </div>
  );
}
