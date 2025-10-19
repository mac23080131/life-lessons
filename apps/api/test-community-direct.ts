import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

async function test() {
  try {
    console.log('🧪 Testing community service query...\n');

    const lessons = await prisma.lesson.findMany({
      where: {
        visibility: 'PUBLIC_ANON',
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        contentRaw: true,
        contentSummary: true,
        domain: true,
        tags: true,
        mood: true,
        resonance: true,
        aiConcepts: true,
        createdAt: true,
        reactions: {
          select: {
            id: true,
            type: true,
            userId: true,
          },
        },
      },
    });

    console.log(`✅ Found ${lessons.length} PUBLIC_ANON lessons\n`);
    
    if (lessons.length > 0) {
      console.log('📝 First lesson:');
      console.log(JSON.stringify(lessons[0], null, 2));
    }

    const total = await prisma.lesson.count({
      where: { visibility: 'PUBLIC_ANON' },
    });

    console.log(`\n📊 Total PUBLIC_ANON: ${total}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
