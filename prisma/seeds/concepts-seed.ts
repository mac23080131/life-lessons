import { PrismaClient, ConceptDifficulty, ConceptRelType, QuestionType } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedConcepts() {
  console.log('🌱 Seeding Concept Knowledge Base...');

  // Create Categories
  const categories = await Promise.all([
    prisma.conceptCategory.upsert({
      where: { key: 'mindfulness' },
      update: {},
      create: {
        key: 'mindfulness',
        name: 'Chánh niệm',
        nameEn: 'Mindfulness',
        description: 'Thực hành nhận thức và sống tỉnh thức trong hiện tại',
        icon: '🧘',
        color: '#8B5CF6',
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
        description: 'Niềm tin về khả năng phát triển và học hỏi',
        icon: '🌱',
        color: '#10B981',
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
        description: 'Hiểu và quản lý cảm xúc bản thân và người khác',
        icon: '💙',
        color: '#3B82F6',
        order: 3,
      },
    }),
    prisma.conceptCategory.upsert({
      where: { key: 'resilience' },
      update: {},
      create: {
        key: 'resilience',
        name: 'Khả năng phục hồi',
        nameEn: 'Resilience',
        description: 'Sức mạnh vượt qua thử thách và phát triển',
        icon: '💪',
        color: '#F59E0B',
        order: 4,
      },
    }),
    prisma.conceptCategory.upsert({
      where: { key: 'relationships' },
      update: {},
      create: {
        key: 'relationships',
        name: 'Mối quan hệ',
        nameEn: 'Relationships',
        description: 'Kỹ năng giao tiếp và xây dựng mối quan hệ',
        icon: '🤝',
        color: '#EC4899',
        order: 5,
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // Create Sample Concepts
  const concepts = [];

  // 1. Growth Mindset - Tư duy phát triển
  const growthMindset = await prisma.concept.upsert({
    where: { key: 'growth_mindset_core' },
    update: {},
    create: {
      key: 'growth_mindset_core',
      slug: 'growth-mindset-core',
      title: 'Tư duy phát triển',
      titleEn: 'Growth Mindset',
      summary: 'Niềm tin rằng khả năng và trí tuệ có thể phát triển qua nỗ lực và học hỏi',
      summaryEn: 'The belief that abilities and intelligence can be developed through effort and learning',
      description: 'Tư duy phát triển là niềm tin cốt lõi rằng khả năng của bạn không cố định mà có thể được phát triển qua thời gian. Người có tư duy phát triển nhìn nhận thất bại như cơ hội học hỏi, chấp nhận thử thách, và tin rằng nỗ lực là con đường đến thành thạo. Ngược lại với tư duy cố định (fixed mindset), tư duy phát triển giúp bạn không bị giới hạn bởi khả năng hiện tại mà luôn tin vào tiềm năng phát triển.',
      descriptionEn: 'Growth mindset is the core belief that your abilities are not fixed but can be developed over time. People with a growth mindset see failure as an opportunity to learn, embrace challenges, and believe that effort is the path to mastery. In contrast to a fixed mindset, growth mindset helps you not be limited by current abilities but always believe in potential for growth.',
      categoryId: categories[1].id, // growth_mindset
      tags: ['mindset', 'learning', 'development', 'resilience'],
      keywords: ['phát triển', 'học hỏi', 'nỗ lực', 'growth', 'mindset'],
      difficulty: ConceptDifficulty.BEGINNER,
      aiContext: 'Sử dụng khi phát hiện user đang tự giới hạn hoặc sợ thất bại. Gợi ý rằng thất bại là cơ hội học, không phải đánh giá năng lực.',
      source: 'Carol Dweck - Mindset: The New Psychology of Success',
      sourceUrl: 'https://www.mindsetworks.com/',
    },
  });
  concepts.push(growthMindset);

  // Add practices for Growth Mindset
  await prisma.conceptPractice.create({
    data: {
      conceptId: growthMindset.id,
      title: 'Thay đổi ngôn ngữ tự nói',
      titleEn: 'Change Your Self-Talk',
      description: 'Thay thế "Tôi không thể" bằng "Tôi chưa thể"',
      descriptionEn: 'Replace "I can\'t" with "I can\'t yet"',
      steps: [
        'Nhận diện khi bạn nói "Tôi không thể làm điều này"',
        'Tạm dừng và thêm từ "chưa" vào cuối câu',
        'Tự hỏi: "Tôi cần học gì để có thể làm được?"',
        'Viết ra 1-2 bước nhỏ có thể bắt đầu ngay',
      ],
      stepsEn: [
        'Notice when you say "I can\'t do this"',
        'Pause and add "yet" to the end',
        'Ask yourself: "What do I need to learn to be able to do this?"',
        'Write down 1-2 small steps you can start right away',
      ],
      duration: 5,
      difficulty: ConceptDifficulty.BEGINNER,
      order: 1,
    },
  });

  await prisma.conceptPractice.create({
    data: {
      conceptId: growthMindset.id,
      title: 'Nhật ký học hỏi từ thất bại',
      titleEn: 'Learning from Failure Journal',
      description: 'Ghi lại bài học từ những lần "thất bại"',
      descriptionEn: 'Document lessons from "failures"',
      steps: [
        'Khi gặp thất bại, viết ra: "Điều gì đã xảy ra?"',
        'Tiếp theo: "Tôi đã học được gì?"',
        'Cuối cùng: "Lần tới tôi sẽ thử cách nào?"',
        'Review lại mỗi tháng để thấy sự tiến bộ',
      ],
      stepsEn: [
        'When facing failure, write: "What happened?"',
        'Next: "What did I learn?"',
        'Finally: "What will I try next time?"',
        'Review monthly to see progress',
      ],
      duration: 10,
      difficulty: ConceptDifficulty.BEGINNER,
      order: 2,
    },
  });

  // Add examples
  await prisma.conceptExample.create({
    data: {
      conceptId: growthMindset.id,
      title: 'Michael Jordan và thất bại',
      titleEn: 'Michael Jordan and Failure',
      text: 'Michael Jordan từng nói: "Tôi đã miss hơn 9,000 cú ném trong sự nghiệp. Tôi đã thua gần 300 trận. 26 lần tôi được giao phó cú ném quyết định và miss. Tôi đã thất bại hết lần này đến lần khác trong cuộc đời. Và đó là lý do tôi thành công."',
      textEn: 'Michael Jordan once said: "I\'ve missed more than 9,000 shots in my career. I\'ve lost almost 300 games. 26 times I\'ve been trusted to take the game-winning shot and missed. I\'ve failed over and over and over again in my life. And that is why I succeed."',
      source: 'Nike Ad',
      order: 1,
    },
  });

  await prisma.conceptExample.create({
    data: {
      conceptId: growthMindset.id,
      title: 'Học lập trình sau 30 tuổi',
      titleEn: 'Learning Programming After 30',
      text: 'Nhiều người nghĩ họ "quá già" để học lập trình. Nhưng hàng nghìn người đã chuyển nghề thành công ở độ tuổi 30, 40, thậm chí 50. Chìa khóa không phải tuổi tác mà là niềm tin rằng họ có thể học được nếu đầu tư thời gian và nỗ lực.',
      textEn: 'Many people think they\'re "too old" to learn programming. But thousands have successfully switched careers at 30, 40, even 50. The key isn\'t age but the belief that they can learn with time and effort.',
      order: 2,
    },
  });

  // Add questions
  await prisma.conceptQuestion.create({
    data: {
      conceptId: growthMindset.id,
      question: 'Lần gần đây nhất bạn tránh một thử thách vì sợ thất bại là khi nào? Điều gì sẽ khác nếu bạn nhìn nhận đó là cơ hội học hỏi?',
      questionEn: 'When was the last time you avoided a challenge because you feared failure? What would be different if you saw it as a learning opportunity?',
      type: QuestionType.REFLECTIVE,
      context: 'Hỏi khi user thể hiện sự né tránh hoặc tự giới hạn',
      contextEn: 'Ask when user shows avoidance or self-limitation',
      order: 1,
    },
  });

  await prisma.conceptQuestion.create({
    data: {
      conceptId: growthMindset.id,
      question: 'Bạn tin rằng điều gì trong bạn là "cố định" và không thể thay đổi? Có bằng chứng nào cho niềm tin này không?',
      questionEn: 'What do you believe about yourself that is "fixed" and cannot change? Is there evidence for this belief?',
      type: QuestionType.PROVOCATIVE,
      context: 'Thách thức niềm tin cố định về bản thân',
      contextEn: 'Challenge fixed beliefs about self',
      order: 2,
    },
  });

  // 2. Gratitude Practice
  const gratitude = await prisma.concept.upsert({
    where: { key: 'gratitude_practice' },
    update: {},
    create: {
      key: 'gratitude_practice',
      slug: 'gratitude-practice',
      title: 'Thực hành biết ơn',
      titleEn: 'Gratitude Practice',
      summary: 'Rèn luyện thói quen nhận diện và trân trọng những điều tốt đẹp trong cuộc sống',
      summaryEn: 'Cultivate the habit of recognizing and appreciating good things in life',
      description: 'Thực hành biết ơn là việc cố ý chú ý và ghi nhận những điều tích cực, dù nhỏ nhặt, trong cuộc sống hàng ngày. Nghiên cứu cho thấy thực hành biết ơn thường xuyên giúp tăng hạnh phúc, giảm lo âu trầm cảm, cải thiện giấc ngủ và tăng cường sức khỏe tổng thể. Đây không phải là phủ nhận khó khăn mà là chủ động nhìn nhận cả mặt tích cực.',
      descriptionEn: 'Gratitude practice is intentionally noticing and acknowledging positive things, even small ones, in daily life. Research shows regular gratitude practice increases happiness, reduces anxiety and depression, improves sleep, and enhances overall health. This is not about denying difficulties but proactively seeing the positive side as well.',
      categoryId: categories[0].id, // mindfulness
      tags: ['gratitude', 'wellbeing', 'mindfulness', 'positive psychology'],
      keywords: ['biết ơn', 'tri ân', 'hạnh phúc', 'tích cực'],
      difficulty: ConceptDifficulty.BEGINNER,
      aiContext: 'Gợi ý khi user có xu hướng tiêu cực hoặc tập trung vào thiếu thốn. Giúp shift perspective.',
    },
  });
  concepts.push(gratitude);

  // Add practices
  await prisma.conceptPractice.create({
    data: {
      conceptId: gratitude.id,
      title: '3 điều biết ơn buổi tối',
      titleEn: '3 Good Things at Night',
      description: 'Mỗi tối trước khi ngủ, viết ra 3 điều bạn biết ơn trong ngày',
      descriptionEn: 'Each night before bed, write down 3 things you\'re grateful for',
      steps: [
        'Chuẩn bị sổ tay hoặc app ghi chú',
        'Trước khi ngủ 10 phút, hỏi bản thân: "Hôm nay điều gì khiến tôi mỉm cười?"',
        'Viết ra 3 điều, có thể rất nhỏ: tách cà phê ngon, lời cảm ơn từ đồng nghiệp, ánh nắng chiều đẹp',
        'Không cần dài, chỉ 1 câu cho mỗi điều',
        'Đọc lại vào cuối tuần để thấy pattern',
      ],
      stepsEn: [
        'Prepare notebook or note app',
        '10 minutes before sleep, ask yourself: "What made me smile today?"',
        'Write 3 things, can be very small: good coffee, thank you from colleague, beautiful evening sun',
        'No need to be long, just one sentence each',
        'Review at end of week to see patterns',
      ],
      duration: 5,
      difficulty: ConceptDifficulty.BEGINNER,
      order: 1,
    },
  });

  // 3. Self-Compassion
  const selfCompassion = await prisma.concept.upsert({
    where: { key: 'self_compassion' },
    update: {},
    create: {
      key: 'self_compassion',
      slug: 'self-compassion',
      title: 'Tự thương xót',
      titleEn: 'Self-Compassion',
      summary: 'Đối xử với bản thân bằng sự tử tế và thấu hiểu như bạn làm với người bạn thân',
      summaryEn: 'Treating yourself with kindness and understanding like you would treat a close friend',
      description: 'Tự thương xót là khả năng đối xử với bản thân bằng sự ân cần, đặc biệt trong lúc mắc lỗi hay đau khổ, thay vì tự phê phán khắc nghiệt. Theo Tiến sĩ Kristin Neff, tự thương xót bao gồm 3 yếu tố: tự tử tế (self-kindness), ý thức về điểm chung của con người (common humanity), và chánh niệm (mindfulness). Khác với lòng tự trọng dựa vào thành tích, tự thương xót là vô điều kiện.',
      descriptionEn: 'Self-compassion is the ability to treat yourself with care, especially when making mistakes or suffering, rather than harsh self-criticism. According to Dr. Kristin Neff, self-compassion includes 3 elements: self-kindness, common humanity, and mindfulness. Unlike self-esteem based on achievement, self-compassion is unconditional.',
      categoryId: categories[2].id, // emotional_intelligence
      tags: ['self-care', 'compassion', 'emotional health', 'mindfulness'],
      keywords: ['tự thương', 'tử tế', 'chấp nhận', 'compassion'],
      difficulty: ConceptDifficulty.INTERMEDIATE,
      aiContext: 'Dùng khi user tự phê phán bản thân quá mức hoặc cảm thấy "không đủ tốt". Nhắc nhở rằng mọi người đều mắc lỗi.',
      source: 'Kristin Neff - Self-Compassion',
      sourceUrl: 'https://self-compassion.org/',
    },
  });
  concepts.push(selfCompassion);

  // Add practice
  await prisma.conceptPractice.create({
    data: {
      conceptId: selfCompassion.id,
      title: 'Bức thư gửi bản thân',
      titleEn: 'Letter to Yourself',
      description: 'Viết thư cho bản thân như viết cho người bạn đang gặp khó khăn',
      descriptionEn: 'Write a letter to yourself as you would to a struggling friend',
      steps: [
        'Nghĩ về một tình huống bạn đang tự trách mình',
        'Tưởng tượng người bạn thân đang trải qua điều tương tự',
        'Viết thư cho "người bạn" đó: bạn sẽ nói gì? An ủi thế nào?',
        'Bây giờ đọc lại thư này, nhưng hiểu rằng đó là dành cho chính bạn',
        'Chú ý cảm giác thay đổi thế nào',
      ],
      stepsEn: [
        'Think of a situation where you\'re blaming yourself',
        'Imagine a close friend going through the same thing',
        'Write a letter to that "friend": what would you say? How would you comfort them?',
        'Now read the letter again, understanding it\'s for yourself',
        'Notice how the feeling changes',
      ],
      duration: 15,
      difficulty: ConceptDifficulty.INTERMEDIATE,
      order: 1,
    },
  });

  // 4. Cognitive Reframing
  const reframing = await prisma.concept.upsert({
    where: { key: 'cognitive_reframing' },
    update: {},
    create: {
      key: 'cognitive_reframing',
      slug: 'cognitive-reframing',
      title: 'Tái khung nhận thức',
      titleEn: 'Cognitive Reframing',
      summary: 'Thay đổi cách giải thích một sự kiện để thấy góc nhìn khác tích cực hoặc hữu ích hơn',
      summaryEn: 'Changing the way you interpret an event to see a different, more positive or useful perspective',
      description: 'Tái khung nhận thức là kỹ thuật tâm lý nhận thức hành vi (CBT) giúp thay đổi cách bạn giải thích một tình huống. Cùng một sự kiện, tuỳ cách nhìn, có thể là "thảm hoạ" hoặc "thử thách". Reframing không phải tự lừa dối mà là chủ động tìm góc nhìn cân bằng hơn. Ví dụ: "Tôi bị từ chối" → "Tôi được phản hồi để cải thiện".',
      descriptionEn: 'Cognitive reframing is a CBT technique that helps change how you interpret a situation. The same event can be a "disaster" or a "challenge" depending on perspective. Reframing is not self-deception but actively seeking a more balanced view. Example: "I was rejected" → "I received feedback to improve".',
      categoryId: categories[2].id, // emotional_intelligence
      tags: ['CBT', 'perspective', 'resilience', 'thinking'],
      keywords: ['tái khung', 'góc nhìn', 'suy nghĩ', 'reframe'],
      difficulty: ConceptDifficulty.INTERMEDIATE,
      aiContext: 'Dùng khi user có suy nghĩ tiêu cực hoặc catastrophizing. Gợi ý cách nhìn khác.',
    },
  });
  concepts.push(reframing);

  await prisma.conceptPractice.create({
    data: {
      conceptId: reframing.id,
      title: 'Bài tập 3 cột',
      titleEn: 'Three Column Exercise',
      description: 'Ghi tình huống, suy nghĩ tự động, và suy nghĩ thay thế',
      descriptionEn: 'Write situation, automatic thought, and alternative thought',
      steps: [
        'Cột 1: Tình huống (Ví dụ: "Sếp không reply email của tôi")',
        'Cột 2: Suy nghĩ tự động (Ví dụ: "Sếp không quan tâm đến tôi")',
        'Cột 3: Giải thích khác có thể (Ví dụ: "Sếp đang bận, hoặc email bị chìm")',
        'Tự hỏi: "Bằng chứng cho suy nghĩ nào nhiều hơn?"',
        'Chọn cách giải thích cân bằng nhất',
      ],
      stepsEn: [
        'Column 1: Situation (e.g., "Boss didn\'t reply to my email")',
        'Column 2: Automatic thought (e.g., "Boss doesn\'t care about me")',
        'Column 3: Alternative explanation (e.g., "Boss is busy, or email got buried")',
        'Ask: "Which thought has more evidence?"',
        'Choose the most balanced explanation',
      ],
      duration: 10,
      difficulty: ConceptDifficulty.INTERMEDIATE,
      order: 1,
    },
  });

  // 5. Active Listening
  const activeListening = await prisma.concept.upsert({
    where: { key: 'active_listening' },
    update: {},
    create: {
      key: 'active_listening',
      slug: 'active-listening',
      title: 'Lắng nghe tích cực',
      titleEn: 'Active Listening',
      summary: 'Kỹ năng lắng nghe với toàn bộ sự chú ý, không phán xét, để thực sự hiểu người khác',
      summaryEn: 'The skill of listening with full attention, without judgment, to truly understand others',
      description: 'Lắng nghe tích cực là kỹ năng giao tiếp cốt lõi: tập trung hoàn toàn vào người nói, không ngắt lời, không chuẩn bị phản bác trong đầu. Bạn lắng nghe để hiểu, không phải để trả lời. Các kỹ thuật bao gồm: gật đầu, paraphrase lại, hỏi làm rõ, và thể hiện empathy. Nghiên cứu cho thấy lắng nghe tích cực cải thiện đáng kể chất lượng mối quan hệ.',
      descriptionEn: 'Active listening is a core communication skill: focusing entirely on the speaker, not interrupting, not preparing rebuttals in your head. You listen to understand, not to respond. Techniques include: nodding, paraphrasing, asking clarifying questions, and showing empathy. Research shows active listening significantly improves relationship quality.',
      categoryId: categories[4].id, // relationships
      tags: ['communication', 'empathy', 'relationships', 'listening'],
      keywords: ['lắng nghe', 'giao tiếp', 'thấu hiểu', 'listening'],
      difficulty: ConceptDifficulty.INTERMEDIATE,
      aiContext: 'Gợi ý khi user gặp xung đột giao tiếp hoặc cảm thấy không được hiểu.',
    },
  });
  concepts.push(activeListening);

  await prisma.conceptPractice.create({
    data: {
      conceptId: activeListening.id,
      title: '2 phút lắng nghe không ngắt lời',
      titleEn: '2 Minutes of Uninterrupted Listening',
      description: 'Lắng nghe ai đó trong 2 phút mà không ngắt lời hoặc phản hồi',
      descriptionEn: 'Listen to someone for 2 minutes without interrupting or responding',
      steps: [
        'Chọn người bạn muốn hiểu hơn (bạn đời, con cái, đồng nghiệp)',
        'Nói: "Tôi muốn hiểu bạn hơn. Bạn có thể chia sẻ 2 phút về [topic] không?"',
        'Trong 2 phút đó: chỉ lắng nghe, gật đầu, tránh ngắt lời',
        'Sau 2 phút, paraphrase: "Tôi nghe bạn nói rằng... đúng không?"',
        'Hỏi: "Tôi có hiểu đúng không? Có gì tôi bỏ sót không?"',
      ],
      stepsEn: [
        'Choose someone you want to understand better (partner, child, colleague)',
        'Say: "I want to understand you better. Can you share 2 minutes about [topic]?"',
        'For those 2 minutes: just listen, nod, avoid interrupting',
        'After 2 minutes, paraphrase: "I hear you saying... is that right?"',
        'Ask: "Did I understand correctly? Did I miss anything?"',
      ],
      duration: 5,
      difficulty: ConceptDifficulty.INTERMEDIATE,
      order: 1,
    },
  });

  console.log(`✅ Created ${concepts.length} concepts with practices, examples, and questions`);

  // Create Relations
  await prisma.conceptRelation.create({
    data: {
      aId: growthMindset.id,
      bId: reframing.id,
      type: ConceptRelType.RELATED,
    },
  });

  await prisma.conceptRelation.create({
    data: {
      aId: gratitude.id,
      bId: reframing.id,
      type: ConceptRelType.RELATED,
    },
  });

  await prisma.conceptRelation.create({
    data: {
      aId: selfCompassion.id,
      bId: activeListening.id,
      type: ConceptRelType.RELATED,
    },
  });

  console.log('✅ Created concept relations');

  console.log('🎉 Concept Knowledge Base seeded successfully!');
}
