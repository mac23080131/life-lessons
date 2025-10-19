import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding predefined challenges...\n');

  const challenges = [
    {
      name: '7-Day Lesson Challenge',
      description: 'Write 1 lesson every day for 7 days. Perfect for beginners to build the habit.',
      type: 'COMMUNITY',
      scope: 'LESSON_COUNT',
      target: 7,
      duration: 7,
      difficulty: 'EASY',
      isActive: true,
    },
    {
      name: '21-Day Habit Builder',
      description: 'Build a lasting habit with 21 consecutive days of learning. One lesson per day.',
      type: 'COMMUNITY',
      scope: 'STREAK',
      target: 21,
      duration: 21,
      difficulty: 'MEDIUM',
      isActive: true,
    },
    {
      name: '30-Day Mastery Challenge',
      description: 'Become a master of self-reflection with 30 lessons in 30 days.',
      type: 'COMMUNITY',
      scope: 'LESSON_COUNT',
      target: 30,
      duration: 30,
      difficulty: 'HARD',
      isActive: true,
    },
    {
      name: 'Balanced Life - 1 Week',
      description: 'Write at least 1 lesson in each domain (Inner, Health, Relationship, Finance) within 7 days.',
      type: 'COMMUNITY',
      scope: 'DOMAIN_BALANCE',
      target: 4,
      duration: 7,
      difficulty: 'MEDIUM',
      isActive: true,
    },
    {
      name: 'Daily Practice - 14 Days',
      description: 'Build consistency with at least 1 lesson every day for 2 weeks.',
      type: 'COMMUNITY',
      scope: 'DAILY_PRACTICE',
      target: 14,
      duration: 14,
      difficulty: 'MEDIUM',
      isActive: true,
    },
  ];

  for (const challenge of challenges) {
    const existing = await prisma.challenge.findFirst({
      where: { name: challenge.name },
    });

    if (existing) {
      console.log(`⏭️  Skipping "${challenge.name}" (already exists)`);
      continue;
    }

    await prisma.challenge.create({ data: challenge as any });
    console.log(`✅ Created "${challenge.name}"`);
  }

  console.log('\n✨ Seeding complete!\n');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
