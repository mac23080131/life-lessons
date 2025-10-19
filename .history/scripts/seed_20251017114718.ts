import { PrismaClient, Domain, Privacy } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo user
  console.log('Creating demo user...');
  const passwordHash = await bcrypt.hash('Passw0rd!', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@lifelessons.app' },
    update: {},
    create: {
      email: 'demo@lifelessons.app',
      passwordHash,
      name: 'Demo User',
      locale: 'vi',
      tz: 'Asia/Bangkok',
      privacyDefault: Privacy.PRIVATE,
    },
  });

  console.log(`✓ Created user: ${user.email}`);

  // Create sample lessons
  console.log('Creating sample lessons...');
  
  const sampleLessons = [
    // INNER domain
    {
      contentRaw: 'Hôm nay mình nhận ra rằng việc dành thời gian suy ngẫm mỗi ngày giúp mình hiểu bản thân hơn. Khi viết nhật ký, mình có thể nhìn lại những suy nghĩ và cảm xúc của mình một cách khách quan hơn.',
      domain: Domain.INNER,
      tags: ['reflection', 'journaling', 'self-awareness'],
      mood: 1,
      resonance: 2,
      gratitude: 'Biết ơn vì đã có thời gian tĩnh lặng để suy ngẫm',
      visibility: Privacy.PRIVATE,
    },
    {
      contentRaw: 'Mình học được rằng lo lắng về tương lai thường làm mình quên mất hiện tại. Thực hành mindfulness giúp mình tập trung vào những gì đang diễn ra ngay lúc này.',
      domain: Domain.INNER,
      tags: ['mindfulness', 'anxiety', 'present-moment'],
      mood: 0,
      resonance: 3,
      visibility: Privacy.PUBLIC_ANON,
    },
    {
      contentRaw: 'Chấp nhận những điều mình không thể thay đổi mang lại sự bình an. Mình đã dành quá nhiều năng lượng vào việc cố gắng kiểm soát mọi thứ.',
      domain: Domain.INNER,
      tags: ['acceptance', 'control', 'peace'],
      mood: 1,
      resonance: 2,
      gratitude: 'Biết ơn vì bài học về buông bỏ',
      visibility: Privacy.PRIVATE,
    },
    // HEALTH domain
    {
      contentRaw: 'Ngủ đủ 7-8 tiếng thực sự tạo ra sự khác biệt lớn trong ngày hôm sau. Mình cảm thấy tỉnh táo hơn, tâm trạng tốt hơn và năng suất cao hơn.',
      domain: Domain.HEALTH,
      tags: ['sleep', 'energy', 'productivity'],
      mood: 2,
      resonance: 3,
      visibility: Privacy.PRIVATE,
    },
    {
      contentRaw: 'Tập thể dục buổi sáng không chỉ giúp cơ thể khỏe mạnh mà còn cải thiện tâm trạng cả ngày. Endorphins thực sự có tác dụng!',
      domain: Domain.HEALTH,
      tags: ['exercise', 'morning-routine', 'mood'],
      mood: 2,
      resonance: 2,
      gratitude: 'Biết ơn vì có sức khỏe để vận động',
      visibility: Privacy.PUBLIC_ANON,
    },
    {
      contentRaw: 'Uống đủ nước trong ngày giúp mình tập trung tốt hơn. Nhiều khi mình tưởng mình đói nhưng thực ra chỉ là khát nước.',
      domain: Domain.HEALTH,
      tags: ['hydration', 'focus', 'health-basics'],
      mood: 1,
      resonance: 1,
      visibility: Privacy.PRIVATE,
    },
    // RELATIONSHIP domain
    {
      contentRaw: 'Lắng nghe thật sự (không chỉ chờ đến lượt nói) giúp mình kết nối sâu hơn với người khác. Hôm nay mình đã thực hành điều này và cảm nhận được sự khác biệt.',
      domain: Domain.RELATIONSHIP,
      tags: ['listening', 'communication', 'empathy'],
      mood: 1,
      resonance: 3,
      visibility: Privacy.PRIVATE,
    },
    {
      contentRaw: 'Nói "cảm ơn" chân thành tạo ra sự kết nối tức thì. Mình đã cảm ơn đồng nghiệp và thấy không khí làm việc ấm áp hơn.',
      domain: Domain.RELATIONSHIP,
      tags: ['gratitude', 'appreciation', 'workplace'],
      mood: 2,
      resonance: 2,
      gratitude: 'Biết ơn những người quanh mình',
      visibility: Privacy.PUBLIC_ANON,
    },
    {
      contentRaw: 'Đặt ranh giới lành mạnh không phải là ích kỷ. Mình có quyền nói không khi cần thiết để bảo vệ năng lượng của mình.',
      domain: Domain.RELATIONSHIP,
      tags: ['boundaries', 'self-care', 'saying-no'],
      mood: 0,
      resonance: 2,
      visibility: Privacy.PRIVATE,
    },
    // FINANCE domain
    {
      contentRaw: 'Theo dõi chi tiêu hàng ngày giúp mình nhận ra những khoản chi vô thức. Mình đã tiết kiệm được 20% chi phí tháng này.',
      domain: Domain.FINANCE,
      tags: ['budgeting', 'tracking', 'savings'],
      mood: 2,
      resonance: 2,
      visibility: Privacy.PRIVATE,
    },
    {
      contentRaw: 'Đầu tư vào bản thân (sách, khóa học) là khoản đầu tư sinh lời nhất. Kiến thức và kỹ năng không ai lấy đi được.',
      domain: Domain.FINANCE,
      tags: ['investing', 'education', 'self-development'],
      mood: 1,
      resonance: 3,
      gratitude: 'Biết ơn vì cơ hội học hỏi',
      visibility: Privacy.PUBLIC_ANON,
    },
    {
      contentRaw: 'Có quỹ dự phòng khẩn cấp mang lại sự an tâm lớn. Mình không còn lo lắng về những chi phí bất ngờ nữa.',
      domain: Domain.FINANCE,
      tags: ['emergency-fund', 'financial-security', 'planning'],
      mood: 1,
      resonance: 2,
      visibility: Privacy.PRIVATE,
    },
  ];

  for (const lessonData of sampleLessons) {
    await prisma.lesson.create({
      data: {
        ...lessonData,
        userId: user.id,
        language: 'vi',
        aiConcepts: [],
      },
    });
  }

  console.log(`✓ Created ${sampleLessons.length} sample lessons`);

  // Create goal
  console.log('Creating goal...');
  const goal = await prisma.goal.create({
    data: {
      userId: user.id,
      type: 'lesson_count',
      target: 10000,
      current: sampleLessons.length,
      sprintSize: 100,
      cadence: 'daily',
      status: 'active',
    },
  });

  console.log(`✓ Created goal with target: ${goal.target}`);

  // Create first sprint
  console.log('Creating sprint...');
  const now = new Date();
  const sprint = await prisma.sprint.create({
    data: {
      goalId: goal.id,
      index: 1,
      startAt: now,
      endAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days
      target: 100,
      done: sampleLessons.length,
    },
  });

  console.log(`✓ Created sprint #${sprint.index}`);

  // Create reminder
  console.log('Creating reminder...');
  await prisma.reminder.create({
    data: {
      userId: user.id,
      type: 'DAILY_EVENING',
      hour: 21,
      channel: 'email',
      enabled: true,
    },
  });

  console.log('✓ Created daily reminder');

  // Create concept categories
  console.log('Creating concept categories...');
  const categories = [
    { key: 'inner', title: 'Inner Development' },
    { key: 'health', title: 'Health & Wellness' },
    { key: 'relationship', title: 'Relationships' },
    { key: 'finance', title: 'Finance & Career' },
  ];

  for (const cat of categories) {
    await prisma.conceptCategory.upsert({
      where: { key: cat.key },
      update: {},
      create: cat,
    });
  }

  console.log(`✓ Created ${categories.length} concept categories`);

  // Create sample concepts
  console.log('Creating sample concepts...');
  const innerCategory = await prisma.conceptCategory.findUnique({ where: { key: 'inner' } });
  
  if (innerCategory) {
    await prisma.concept.create({
      data: {
        key: 'gratitude_refocus',
        slug: 'gratitude-refocus',
        title: 'Tái tập trung vào biết ơn',
        summary: 'Nhìn lại điều mình đã có thay vì điều mình thiếu',
        definition: 'Thực hành chuyển sự chú ý về những gì đang có và đang học được, thay vì tập trung vào những gì còn thiếu.',
        language: 'vi',
        tags: ['gratitude', 'mindset', 'reframe'],
        categoryId: innerCategory.id,
        source: 'seed_v1',
        version: 1,
      },
    });

    console.log('✓ Created sample concept');
  }

  console.log('\n✅ Seeding completed!');
  console.log('\nDemo credentials:');
  console.log('  Email: demo@lifelessons.app');
  console.log('  Password: Passw0rd!\n');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
