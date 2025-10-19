import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedConcepts() {
  console.log('🌱 Seeding Concept Knowledge Base...\n');

  // Create Categories
  console.log('📚 Creating categories...');
  const categories = await Promise.all([
    prisma.conceptCategory.upsert({
      where: { key: 'mindfulness' },
      update: {},
      create: {
        key: 'mindfulness',
        name: 'Chánh niệm',
        nameEn: 'Mindfulness',
        description: 'Thực hành tỉnh thức trong hiện tại',
        icon: 'brain',
        color: 'purple',
        order: 1,
      },
    }),
    prisma.conceptCategory.upsert({
      where: { key: 'growth_mindset' },
      update: {},
      create: {
        key: 'growth_mindset',
        name: 'Tư duy phát triển',
        nameEn: 'Growth Mindset',
        description: 'Tin vào khả năng phát triển bản thân',
        icon: 'trending-up',
        color: 'green',
        order: 2,
      },
    }),
    prisma.conceptCategory.upsert({
      where: { key: 'emotional_intelligence' },
      update: {},
      create: {
        key: 'emotional_intelligence',
        name: 'Trí tuệ cảm xúc',
        nameEn: 'Emotional Intelligence',
        description: 'Hiểu và quản lý cảm xúc',
        icon: 'heart',
        color: 'blue',
        order: 3,
      },
    }),
    prisma.conceptCategory.upsert({
      where: { key: 'resilience' },
      update: {},
      create: {
        key: 'resilience',
        name: 'Sức bền tâm lý',
        nameEn: 'Resilience',
        description: 'Khả năng phục hồi sau khó khăn',
        icon: 'shield',
        color: 'orange',
        order: 4,
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories\n`);

  // Concept 1: Growth Mindset
  console.log('📖 Creating concepts...');
  const growthMindset = await prisma.concept.upsert({
    where: { key: 'growth_mindset_core' },
    update: {},
    create: {
      key: 'growth_mindset_core',
      slug: 'growth-mindset',
      title: 'Tư duy phát triển',
      titleEn: 'Growth Mindset',
      summary: 'Tin rằng khả năng có thể phát triển qua nỗ lực và học hỏi',
      summaryEn: 'The belief that abilities can be developed through effort and learning',
      description: `Tư duy phát triển là niềm tin rằng trí thông minh và tài năng không phải là cố định mà có thể được phát triển qua sự nỗ lực, học hỏi và kiên trì.

Carol Dweck, giáo sư tâm lý học tại Stanford, đã nghiên cứu và phát hiện ra rằng cách chúng ta nhìn nhận khả năng của mình có ảnh hưởng sâu sắc đến động lực, hiệu suất và thành công trong cuộc sống.

Người có tư duy phát triển:
- Xem thách thức là cơ hội để học hỏi
- Tin rằng nỗ lực dẫn đến sự thành thạo
- Học hỏi từ phản hồi và chỉ trích
- Lấy cảm hứng từ thành công của người khác

Ngược lại, người có tư duy cố định (fixed mindset):
- Tránh thách thức vì sợ thất bại
- Tin rằng tài năng là bẩm sinh
- Bỏ qua phản hồi hữu ích
- Cảm thấy bị đe dọa bởi thành công của người khác`,
      descriptionEn: `Growth mindset is the belief that intelligence and talents are not fixed but can be developed through effort, learning, and persistence.

Carol Dweck, a psychology professor at Stanford, discovered that how we view our abilities has a profound impact on our motivation, performance, and success in life.

People with a growth mindset:
- See challenges as opportunities to learn
- Believe effort leads to mastery
- Learn from feedback and criticism
- Find inspiration in others' success

In contrast, people with a fixed mindset:
- Avoid challenges for fear of failure
- Believe talent is innate
- Ignore useful feedback
- Feel threatened by others' success`,
      categoryId: categories.find(c => c.key === 'growth_mindset')!.id,
      tags: ['mindset', 'learning', 'development', 'psychology'],
      difficulty: 'BEGINNER',
      aiContext: 'Use when user shows fixed mindset language ("I can\'t", "I\'m not good at"), or when facing challenges',
      keywords: ['growth', 'learning', 'effort', 'challenge', 'mindset', 'development', 'ability'],
      source: 'Carol Dweck - Mindset: The New Psychology of Success',
    },
  });

  // Add Practices for Growth Mindset
  await prisma.conceptPractice.createMany({
    data: [
      {
        conceptId: growthMindset.id,
        title: 'Thay đổi ngôn ngữ "Chưa"',
        titleEn: 'The Power of "Yet"',
        description: 'Thêm từ "chưa" vào các câu tiêu cực để mở ra khả năng',
        descriptionEn: 'Add "yet" to negative statements to open possibilities',
        steps: [
          'Nhận diện các câu tiêu cực: "Tôi không thể làm điều này"',
          'Thêm "chưa" vào cuối: "Tôi chưa thể làm điều này"',
          'Thêm hành động: "Tôi chưa thể làm điều này, nhưng tôi có thể học"',
          'Lặp lại trong 21 ngày để hình thành thói quen',
        ],
        stepsEn: [
          'Identify negative statements: "I can\'t do this"',
          'Add "yet" at the end: "I can\'t do this yet"',
          'Add action: "I can\'t do this yet, but I can learn"',
          'Repeat for 21 days to form a habit',
        ],
        duration: 5,
        difficulty: 'BEGINNER',
        order: 1,
      },
      {
        conceptId: growthMindset.id,
        title: 'Nhật ký học hỏi',
        titleEn: 'Learning Journal',
        description: 'Ghi lại những gì bạn học được mỗi ngày',
        descriptionEn: 'Record what you learn each day',
        steps: [
          'Mỗi tối, dành 5 phút viết nhật ký',
          'Trả lời: "Hôm nay tôi đã học được gì?"',
          'Ghi lại cả những sai lầm và bài học',
          'Ghi nhận nỗ lực của bản thân, không chỉ kết quả',
          'Xem lại sau 1 tháng để thấy sự tiến bộ',
        ],
        stepsEn: [
          'Each evening, spend 5 minutes journaling',
          'Answer: "What did I learn today?"',
          'Record both mistakes and lessons',
          'Acknowledge your effort, not just results',
          'Review after 1 month to see progress',
        ],
        duration: 10,
        difficulty: 'BEGINNER',
        order: 2,
      },
    ],
  });

  // Add Examples
  await prisma.conceptExample.createMany({
    data: [
      {
        conceptId: growthMindset.id,
        title: 'Michael Jordan và thất bại',
        titleEn: 'Michael Jordan and Failure',
        text: 'Michael Jordan, một trong những cầu thủ bóng rổ vĩ đại nhất, từng nói: "Tôi đã thất bại hơn 9,000 cú ném trong sự nghiệp. Tôi đã thua gần 300 trận. 26 lần tôi được giao nhiệm vụ thực hiện cú ném quyết định và tôi đã thất bại. Tôi đã thất bại nhiều lần trong đời. Và đó chính là lý do tôi thành công."',
        textEn: 'Michael Jordan, one of the greatest basketball players, once said: "I\'ve missed more than 9,000 shots in my career. I\'ve lost almost 300 games. 26 times I\'ve been trusted to take the game-winning shot and missed. I\'ve failed over and over again in my life. And that is why I succeed."',
        source: 'Nike Commercial',
        order: 1,
      },
      {
        conceptId: growthMindset.id,
        title: 'Học ngôn ngữ mới',
        titleEn: 'Learning a New Language',
        text: 'An bắt đầu học tiếng Anh ở tuổi 35. Ban đầu cô rất ngại nói vì sợ sai. Sau khi tìm hiểu về growth mindset, An thay đổi cách nhìn: mỗi lỗi sai là một cơ hội học. Cô bắt đầu nói nhiều hơn, ghi chép lỗi sai và sửa. Sau 2 năm, An có thể giao tiếp tự tin bằng tiếng Anh.',
        textEn: 'An started learning English at age 35. Initially, she was afraid to speak for fear of making mistakes. After learning about growth mindset, An changed her perspective: every mistake is a learning opportunity. She started speaking more, noting errors and correcting them. After 2 years, An can communicate confidently in English.',
        order: 2,
      },
    ],
  });

  // Add Questions
  await prisma.conceptQuestion.createMany({
    data: [
      {
        conceptId: growthMindset.id,
        question: 'Lần gần đây nhất bạn nói "Tôi không thể" là khi nào? Điều gì sẽ thay đổi nếu bạn nói "Tôi chưa thể"?',
        questionEn: 'When was the last time you said "I can\'t"? What would change if you said "I can\'t yet"?',
        type: 'REFLECTIVE',
        context: 'Sử dụng khi người dùng thể hiện tư duy cố định',
        contextEn: 'Use when user shows fixed mindset thinking',
        order: 1,
      },
      {
        conceptId: growthMindset.id,
        question: 'Bạn đã học được gì từ một thất bại gần đây?',
        questionEn: 'What did you learn from a recent failure?',
        type: 'PROVOCATIVE',
        context: 'Sau khi người dùng chia sẻ về thất bại',
        contextEn: 'After user shares about a failure',
        order: 2,
      },
      {
        conceptId: growthMindset.id,
        question: 'Hành động cụ thể nào bạn có thể làm ngay hôm nay để phát triển kỹ năng bạn muốn cải thiện?',
        questionEn: 'What specific action can you take today to develop the skill you want to improve?',
        type: 'ACTION_ORIENTED',
        order: 3,
      },
    ],
  });

  console.log('✅ Created Growth Mindset concept\n');

  // Concept 2: Gratitude Practice
  const gratitude = await prisma.concept.upsert({
    where: { key: 'gratitude_practice' },
    update: {},
    create: {
      key: 'gratitude_practice',
      slug: 'gratitude-practice',
      title: 'Thực hành biết ơn',
      titleEn: 'Gratitude Practice',
      summary: 'Tập trung vào những điều tích cực để tăng hạnh phúc',
      summaryEn: 'Focus on positive aspects to increase happiness',
      description: `Thực hành biết ơn là việc chủ động nhận diện và trân trọng những điều tốt đẹp trong cuộc sống, dù lớn hay nhỏ.

Nghiên cứu khoa học cho thấy thực hành biết ơn thường xuyên có thể:
- Tăng mức độ hạnh phúc và sức khỏe tinh thần
- Giảm stress và trầm cảm
- Cải thiện chất lượng giấc ngủ
- Tăng cường mối quan hệ xã hội
- Nâng cao sức đề kháng với nghịch cảnh

Robert Emmons, chuyên gia hàng đầu về biết ơn, phát hiện rằng người viết nhật ký biết ơn mỗi tuần có mức độ lạc quan cao hơn 25% và cảm thấy tốt hơn về cuộc sống của họ.`,
      descriptionEn: `Gratitude practice is actively recognizing and appreciating the good things in life, whether big or small.

Scientific research shows that regular gratitude practice can:
- Increase happiness and mental health
- Reduce stress and depression
- Improve sleep quality
- Strengthen social relationships
- Enhance resilience to adversity

Robert Emmons, a leading gratitude expert, found that people who write gratitude journals weekly are 25% more optimistic and feel better about their lives.`,
      categoryId: categories.find(c => c.key === 'mindfulness')!.id,
      tags: ['gratitude', 'happiness', 'mindfulness', 'positive psychology'],
      difficulty: 'BEGINNER',
      aiContext: 'Use when user focuses on problems, complains, or shows negativity bias',
      keywords: ['gratitude', 'thankful', 'appreciate', 'blessing', 'positive', 'happy'],
      source: 'Robert Emmons - Thanks!: How the New Science of Gratitude Can Make You Happier',
    },
  });

  await prisma.conceptPractice.createMany({
    data: [
      {
        conceptId: gratitude.id,
        title: '3 điều tốt đẹp',
        titleEn: 'Three Good Things',
        description: 'Viết 3 điều tốt đẹp mỗi ngày trước khi ngủ',
        descriptionEn: 'Write 3 good things each day before sleep',
        steps: [
          'Mỗi tối trước khi ngủ, dành 5-10 phút',
          'Viết ra 3 điều tốt đẹp đã xảy ra trong ngày',
          'Với mỗi điều, ghi lại "Tại sao điều này xảy ra?"',
          'Thực hiện liên tục trong 2 tuần',
          'Chú ý sự thay đổi trong tâm trạng',
        ],
        stepsEn: [
          'Each evening before sleep, spend 5-10 minutes',
          'Write down 3 good things that happened today',
          'For each, note "Why did this happen?"',
          'Do this consistently for 2 weeks',
          'Notice the change in your mood',
        ],
        duration: 10,
        difficulty: 'BEGINNER',
        order: 1,
      },
    ],
  });

  await prisma.conceptExample.createMany({
    data: [
      {
        conceptId: gratitude.id,
        title: 'Nhật ký biết ơn của Oprah',
        titleEn: 'Oprah\'s Gratitude Journal',
        text: 'Oprah Winfrey đã viết nhật ký biết ơn trong suốt nhiều năm. Bà chia sẻ: "Tôi biết chắc chắn rằng việc trân trọng những gì bạn có là cách chắc chắn để có thêm nhiều điều tốt đẹp. Mỗi ngày viết 5 điều biết ơn đã thay đổi cả cuộc đời tôi."',
        textEn: 'Oprah Winfrey has kept a gratitude journal for many years. She shares: "I know for sure that appreciating what you have is a sure way to have more. Writing 5 things to be grateful for each day has changed my entire life."',
        source: 'The Oprah Winfrey Show',
        order: 1,
      },
    ],
  });

  await prisma.conceptQuestion.createMany({
    data: [
      {
        conceptId: gratitude.id,
        question: '3 điều bạn biết ơn nhất hôm nay là gì?',
        questionEn: 'What are 3 things you\'re most grateful for today?',
        type: 'REFLECTIVE',
        order: 1,
      },
      {
        conceptId: gratitude.id,
        question: 'Ai là người đã giúp đỡ bạn gần đây mà bạn chưa nói "cảm ơn"?',
        questionEn: 'Who helped you recently that you haven\'t thanked yet?',
        type: 'ACTION_ORIENTED',
        order: 2,
      },
    ],
  });

  console.log('✅ Created Gratitude Practice concept\n');

  // Concept 3: Reframing
  const reframing = await prisma.concept.upsert({
    where: { key: 'cognitive_reframing' },
    update: {},
    create: {
      key: 'cognitive_reframing',
      slug: 'cognitive-reframing',
      title: 'Tái khung nhận thức',
      titleEn: 'Cognitive Reframing',
      summary: 'Thay đổi cách nhìn nhận tình huống để thay đổi cảm xúc',
      summaryEn: 'Change how you view situations to change emotions',
      description: `Tái khung nhận thức là kỹ thuật tâm lý học nhận thức để thay đổi cách chúng ta suy nghĩ về một tình huống, từ đó thay đổi cách chúng ta cảm nhận về nó.

Ý tưởng cốt lõi: Không phải sự kiện tạo ra cảm xúc, mà cách chúng ta giải thích sự kiện mới tạo ra cảm xúc.

Ví dụ:
- Tình huống: Bị từ chối công việc
- Khung tiêu cực: "Tôi không đủ giỏi"
- Khung tích cực: "Đây là cơ hội tìm công việc phù hợp hơn"

Các bước tái khung:
1. Nhận diện suy nghĩ tiêu cực
2. Thách thức suy nghĩ đó: "Có bằng chứng gì không?"
3. Tìm cách nhìn thay thế tích cực hơn
4. Chọn khung phù hợp với giá trị và mục tiêu`,
      descriptionEn: `Cognitive reframing is a cognitive psychology technique to change how we think about a situation, thereby changing how we feel about it.

Core idea: It's not events that create emotions, but how we interpret events.

Example:
- Situation: Rejected from a job
- Negative frame: "I'm not good enough"
- Positive frame: "This is an opportunity to find a better fit"

Reframing steps:
1. Identify negative thought
2. Challenge it: "What's the evidence?"
3. Find a more positive alternative view
4. Choose a frame aligned with values and goals`,
      categoryId: categories.find(c => c.key === 'emotional_intelligence')!.id,
      tags: ['cognitive', 'reframing', 'perspective', 'emotions'],
      difficulty: 'INTERMEDIATE',
      aiContext: 'Use when user expresses negative interpretation of events',
      keywords: ['perspective', 'reframe', 'interpretation', 'cognitive', 'thinking'],
    },
  });

  await prisma.conceptPractice.createMany({
    data: [
      {
        conceptId: reframing.id,
        title: 'Kỹ thuật ABC',
        titleEn: 'ABC Technique',
        description: 'Phân tích và thay đổi chuỗi suy nghĩ',
        descriptionEn: 'Analyze and change thought patterns',
        steps: [
          'A (Activating event): Sự kiện gì đã xảy ra?',
          'B (Belief): Bạn nghĩ gì về sự kiện đó?',
          'C (Consequence): Bạn cảm thấy và hành động thế nào?',
          'D (Dispute): Thách thức niềm tin: "Điều này có đúng không?"',
          'E (Effect): Niềm tin mới và cảm xúc mới',
        ],
        stepsEn: [
          'A (Activating event): What happened?',
          'B (Belief): What did you think about it?',
          'C (Consequence): How did you feel and act?',
          'D (Dispute): Challenge the belief: "Is this true?"',
          'E (Effect): New belief and new emotion',
        ],
        duration: 15,
        difficulty: 'INTERMEDIATE',
        order: 1,
      },
    ],
  });

  await prisma.conceptQuestion.createMany({
    data: [
      {
        conceptId: reframing.id,
        question: 'Cách khác để nhìn nhận tình huống này là gì?',
        questionEn: 'What\'s another way to view this situation?',
        type: 'PROVOCATIVE',
        order: 1,
      },
      {
        conceptId: reframing.id,
        question: 'Nếu điều tồi tệ nhất xảy ra, bạn sẽ học được gì?',
        questionEn: 'If the worst happens, what would you learn?',
        type: 'EXPLORATORY',
        order: 2,
      },
    ],
  });

  console.log('✅ Created Cognitive Reframing concept\n');

  // Add some relations (with upsert to avoid duplicates)
  try {
    await prisma.conceptRelation.upsert({
      where: {
        aId_bId_type: {
          aId: growthMindset.id,
          bId: reframing.id,
          type: 'RELATED',
        },
      },
      update: {},
      create: {
        aId: growthMindset.id,
        bId: reframing.id,
        type: 'RELATED',
      },
    });

    await prisma.conceptRelation.upsert({
      where: {
        aId_bId_type: {
          aId: gratitude.id,
          bId: reframing.id,
          type: 'RELATED',
        },
      },
      update: {},
      create: {
        aId: gratitude.id,
        bId: reframing.id,
        type: 'RELATED',
      },
    });
  } catch (error) {
    console.log('Note: Some relations may already exist');
  }

  console.log('✅ Created concept relations\n');

  // Summary
  const conceptCount = await prisma.concept.count();
  const categoryCount = await prisma.conceptCategory.count();
  const practiceCount = await prisma.conceptPractice.count();
  const exampleCount = await prisma.conceptExample.count();
  const questionCount = await prisma.conceptQuestion.count();

  console.log('📊 Seed Summary:');
  console.log(`   Categories: ${categoryCount}`);
  console.log(`   Concepts: ${conceptCount}`);
  console.log(`   Practices: ${practiceCount}`);
  console.log(`   Examples: ${exampleCount}`);
  console.log(`   Questions: ${questionCount}`);
  console.log('\n✅ Concept seeding completed!\n');
}

seedConcepts()
  .catch((e) => {
    console.error('❌ Error seeding concepts:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
