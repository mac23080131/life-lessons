// Test community service directly
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testCommunityService() {
  try {
    console.log('🧪 Testing CommunityService.getPublicFeed()...\n');
    
    const limit = 20;
    const offset = 0;
    
    console.log('Query parameters:', { limit, offset });
    console.log('Filter: visibility = PUBLIC_ANON\n');
    
    const lessons = await prisma.lesson.findMany({
      where: {
        visibility: 'PUBLIC_ANON',
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
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

    const total = await prisma.lesson.count({
      where: { visibility: 'PUBLIC_ANON' },
    });

    console.log(`✅ Success!`);
    console.log(`   Found ${lessons.length} lessons`);
    console.log(`   Total PUBLIC_ANON: ${total}\n`);
    
    if (lessons.length > 0) {
      console.log('First lesson:');
      const first = lessons[0];
      console.log(JSON.stringify({
        id: first.id,
        domain: first.domain,
        contentPreview: first.contentRaw.substring(0, 50) + '...',
        tags: first.tags,
        mood: first.mood,
        resonance: first.resonance,
        reactionsCount: first.reactions.length
      }, null, 2));
    }
    
    const result = { lessons, total };
    console.log('\n📤 API would return:', JSON.stringify({ total: result.total, lessonsCount: result.lessons.length }, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

testCommunityService();
