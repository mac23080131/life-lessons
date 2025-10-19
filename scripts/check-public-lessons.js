// Quick script to check PUBLIC_ANON lessons
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkPublicLessons() {
  try {
    console.log('🔍 Checking for PUBLIC_ANON lessons...\n');
    
    // Count all lessons
    const totalLessons = await prisma.lesson.count();
    console.log(`📊 Total lessons in database: ${totalLessons}`);
    
    // Count PUBLIC_ANON lessons
    const publicLessons = await prisma.lesson.count({
      where: { visibility: 'PUBLIC_ANON' }
    });
    console.log(`🌐 PUBLIC_ANON lessons: ${publicLessons}`);
    
    // Get all lessons with their visibility
    const allLessons = await prisma.lesson.findMany({
      select: {
        id: true,
        visibility: true,
        contentRaw: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    
    console.log('\n📝 Recent lessons (top 10):');
    allLessons.forEach((lesson, i) => {
      console.log(`${i + 1}. ${lesson.id.substring(0, 8)}... | ${lesson.visibility} | ${lesson.contentRaw.substring(0, 50)}...`);
    });
    
    // Try to get public feed
    console.log('\n🔍 Testing getPublicFeed query...');
    const feed = await prisma.lesson.findMany({
      where: { visibility: 'PUBLIC_ANON' },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        contentRaw: true,
        domain: true,
        visibility: true
      }
    });
    
    console.log(`✅ Found ${feed.length} public lessons`);
    if (feed.length > 0) {
      console.log('\nPublic lessons:');
      feed.forEach((l, i) => {
        console.log(`${i + 1}. ${l.domain} | ${l.contentRaw.substring(0, 40)}...`);
      });
    } else {
      console.log('⚠️  No PUBLIC_ANON lessons found!');
      console.log('💡 Try sharing a lesson to community first.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPublicLessons();
