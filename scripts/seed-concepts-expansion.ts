import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function expandConcepts() {
  console.log('🌱 Expanding Concept Knowledge Base...\n');

  // Get existing categories
  const categories = await prisma.conceptCategory.findMany();
  const mindfulnessCategory = categories.find(c => c.key === 'mindfulness');
  const growthMindsetCategory = categories.find(c => c.key === 'growth_mindset');
  const emotionalIntelligenceCategory = categories.find(c => c.key === 'emotional_intelligence');
  const resilienceCategory = categories.find(c => c.key === 'resilience');

  // Create new categories
  console.log('📚 Creating new categories...');
  
  const productivityCategory = await prisma.conceptCategory.upsert({
    where: { key: 'productivity' },
    update: {},
    create: {
      key: 'productivity',
      name: 'Năng suất',
      nameEn: 'Productivity',
      description: 'Làm việc hiệu quả và đạt được mục tiêu',
      icon: 'zap',
      color: 'orange',
      order: 5,
    },
  });

  const relationshipsCategory = await prisma.conceptCategory.upsert({
    where: { key: 'relationships' },
    update: {},
    create: {
      key: 'relationships',
      name: 'Mối quan hệ',
      nameEn: 'Relationships',
      description: 'Xây dựng và duy trì mối quan hệ lành mạnh',
      icon: 'users',
      color: 'pink',
      order: 6,
    },
  });

  console.log('✅ Created 2 new categories\n');

  // ========== MINDFULNESS CONCEPTS ==========
  console.log('📖 Adding Mindfulness concepts...');

  // 1. Present Moment Awareness
  const presentMoment = await prisma.concept.upsert({
    where: { key: 'present_moment_awareness' },
    update: {},
    create: {
      key: 'present_moment_awareness',
      slug: 'present-moment-awareness',
      title: 'Tỉnh thức hiện tại',
      titleEn: 'Present Moment Awareness',
      summary: 'Tập trung hoàn toàn vào thời khắc hiện tại, không phán xét',
      summaryEn: 'Focus fully on the present moment without judgment',
      description: `Tỉnh thức hiện tại là khả năng đưa toàn bộ sự chú ý vào khoảnh khắc hiện tại, nhận biết những gì đang xảy ra trong và xung quanh mình mà không bị cuốn vào quá khứ hay tương lai.

Jon Kabat-Zinn, người sáng lập chương trình MBSR (Mindfulness-Based Stress Reduction), định nghĩa mindfulness là "chú ý một cách có mục đích vào hiện tại, không phán xét".

Lợi ích của tỉnh thức hiện tại:
- Giảm căng thẳng và lo âu
- Tăng khả năng tập trung
- Cải thiện chất lượng mối quan hệ
- Tăng cường sức khỏe tinh thần
- Giúp đưa ra quyết định tốt hơn

Khi sống trong hiện tại, chúng ta:
- Thoát khỏi vòng xoáy suy nghĩ tiêu cực
- Trải nghiệm cuộc sống đầy đủ hơn
- Phản ứng thay vì phản xạ
- Nhận ra và quản lý cảm xúc tốt hơn`,
      descriptionEn: `Present moment awareness is the ability to bring full attention to the current moment, recognizing what's happening in and around us without being pulled into past or future.

Jon Kabat-Zinn, founder of MBSR (Mindfulness-Based Stress Reduction), defines mindfulness as "paying attention in a particular way: on purpose, in the present moment, and non-judgmentally."

Benefits of present moment awareness:
- Reduces stress and anxiety
- Increases focus and concentration
- Improves relationship quality
- Enhances mental health
- Helps make better decisions

When living in the present, we:
- Break free from negative thought spirals
- Experience life more fully
- Respond instead of react
- Recognize and manage emotions better`,
      categoryId: mindfulnessCategory!.id,
      tags: ['mindfulness', 'awareness', 'presence', 'meditation'],
      difficulty: 'BEGINNER',
      aiContext: 'Use when user is anxious about future or dwelling on past',
      keywords: ['present', 'moment', 'now', 'awareness', 'here', 'mindful'],
      source: 'Jon Kabat-Zinn - Wherever You Go, There You Are',
    },
  });

  await prisma.conceptPractice.createMany({
    data: [
      {
        conceptId: presentMoment.id,
        title: 'Hơi thở 5-4-3-2-1',
        titleEn: '5-4-3-2-1 Breathing',
        description: 'Kỹ thuật grounding đưa bạn về hiện tại qua 5 giác quan',
        descriptionEn: 'Grounding technique to bring you to present through 5 senses',
        steps: [
          'Nhận biết 5 thứ bạn nhìn thấy',
          'Nhận biết 4 thứ bạn chạm được',
          'Nhận biết 3 thứ bạn nghe thấy',
          'Nhận biết 2 thứ bạn ngửi được',
          'Nhận biết 1 thứ bạn nếm được',
        ],
        stepsEn: [
          'Notice 5 things you see',
          'Notice 4 things you can touch',
          'Notice 3 things you hear',
          'Notice 2 things you smell',
          'Notice 1 thing you taste',
        ],
        duration: 3,
        difficulty: 'BEGINNER',
        order: 1,
      },
      {
        conceptId: presentMoment.id,
        title: 'Mindful Walking',
        titleEn: 'Mindful Walking',
        description: 'Đi bộ chánh niệm, chú ý từng bước chân',
        descriptionEn: 'Walking meditation, noticing each step',
        steps: [
          'Chọn một đoạn đường ngắn (10-15 bước)',
          'Đi chậm, chú ý cảm giác chân chạm đất',
          'Nhận biết: chân nhấc lên, di chuyển, đặt xuống',
          'Nếu tâm trí lang thang, nhẹ nhàng đưa về bước chân',
          'Lặp lại 5-10 phút',
        ],
        stepsEn: [
          'Choose a short path (10-15 steps)',
          'Walk slowly, notice feet touching ground',
          'Notice: lifting, moving, placing foot',
          'If mind wanders, gently return to steps',
          'Repeat for 5-10 minutes',
        ],
        duration: 10,
        difficulty: 'BEGINNER',
        order: 2,
      },
    ],
  });

  await prisma.conceptQuestion.createMany({
    data: [
      {
        conceptId: presentMoment.id,
        question: 'Bạn đang ở đâu trong đầu ngay lúc này: quá khứ, tương lai, hay hiện tại?',
        questionEn: 'Where is your mind right now: past, future, or present?',
        type: 'REFLECTIVE',
        order: 1,
      },
      {
        conceptId: presentMoment.id,
        question: 'Điều gì sẽ thay đổi nếu bạn dành 100% sự chú ý cho người đang nói chuyện với bạn?',
        questionEn: 'What would change if you gave 100% attention to the person talking to you?',
        type: 'PROVOCATIVE',
        order: 2,
      },
    ],
  });

  // 2. Non-Judgmental Observation
  const nonJudgmental = await prisma.concept.upsert({
    where: { key: 'non_judgmental_observation' },
    update: {},
    create: {
      key: 'non_judgmental_observation',
      slug: 'non-judgmental-observation',
      title: 'Quan sát không phán xét',
      titleEn: 'Non-Judgmental Observation',
      summary: 'Nhận biết suy nghĩ và cảm xúc mà không gán nhãn tốt/xấu',
      summaryEn: 'Observe thoughts and feelings without labeling good/bad',
      description: `Quan sát không phán xét là kỹ năng nhận biết suy nghĩ, cảm xúc và cảm giác của mình mà không gán cho chúng nhãn "tốt" hay "xấu", chỉ đơn giản là quan sát chúng như là.

Tại sao quan trọng:
- Phán xét tạo ra căng thẳng thêm
- "Tôi không nên cảm thấy buồn" → làm buồn thêm
- "Suy nghĩ này thật ngu ngốc" → tạo shame
- Quan sát không phán xét cho phép chúng ta xử lý cảm xúc lành mạnh hơn

Thay vì:
❌ "Tôi yếu đuối vì lo lắng"
✅ "Tôi đang trải qua cảm giác lo lắng"

❌ "Suy nghĩ này sai lầm"
✅ "Đây là một suy nghĩ đang xuất hiện"

Khi quan sát không phán xét, chúng ta tạo khoảng không gian giữa mình và cảm xúc, cho phép chọn lựa cách phản ứng thay vì tự động phản xạ.`,
      descriptionEn: `Non-judgmental observation is the skill of noticing thoughts, feelings, and sensations without labeling them as "good" or "bad", simply observing them as they are.

Why it matters:
- Judgment creates additional suffering
- "I shouldn't feel sad" → makes sadness worse
- "This thought is stupid" → creates shame
- Non-judgment allows healthier emotional processing

Instead of:
❌ "I'm weak for feeling anxious"
✅ "I'm experiencing anxiety"

❌ "This thought is wrong"
✅ "This is a thought arising"

With non-judgmental observation, we create space between ourselves and emotions, allowing choice in response rather than automatic reaction.`,
      categoryId: mindfulnessCategory!.id,
      tags: ['mindfulness', 'acceptance', 'awareness', 'emotions'],
      difficulty: 'INTERMEDIATE',
      aiContext: 'Use when user is being self-critical or judging emotions',
      keywords: ['judge', 'judgment', 'accept', 'observe', 'notice', 'aware'],
      source: 'Tara Brach - Radical Acceptance',
    },
  });

  await prisma.conceptPractice.createMany({
    data: [
      {
        conceptId: nonJudgmental.id,
        title: 'RAIN Technique',
        titleEn: 'RAIN Technique',
        description: 'Recognize, Allow, Investigate, Nurture - 4 bước xử lý cảm xúc',
        descriptionEn: 'Recognize, Allow, Investigate, Nurture - 4 steps for emotions',
        steps: [
          'R (Recognize): "Tôi đang cảm thấy gì?"',
          'A (Allow): "Được rồi, cảm giác này có mặt ở đây"',
          'I (Investigate): "Cảm giác này ở đâu trong cơ thể?"',
          'N (Nurture): "Tôi có thể ôm lấy bản thân với lòng từ bi"',
        ],
        stepsEn: [
          'R (Recognize): "What am I feeling?"',
          'A (Allow): "Okay, this feeling is here"',
          'I (Investigate): "Where is this in my body?"',
          'N (Nurture): "I can hold myself with compassion"',
        ],
        duration: 10,
        difficulty: 'INTERMEDIATE',
        order: 1,
      },
    ],
  });

  console.log('✅ Added 2 Mindfulness concepts\n');

  // ========== GROWTH MINDSET CONCEPTS ==========
  console.log('📖 Adding Growth Mindset concepts...');

  // 3. Embracing Challenges
  const embracingChallenges = await prisma.concept.upsert({
    where: { key: 'embracing_challenges' },
    update: {},
    create: {
      key: 'embracing_challenges',
      slug: 'embracing-challenges',
      title: 'Đón nhận thử thách',
      titleEn: 'Embracing Challenges',
      summary: 'Xem thử thách như cơ hội phát triển, không phải mối đe dọa',
      summaryEn: 'View challenges as growth opportunities, not threats',
      description: `Đón nhận thử thách là khả năng nhìn nhận khó khăn và thử thách như cơ hội để học hỏi và phát triển, thay vì né tránh vì sợ thất bại.

Carol Dweck phát hiện rằng người có growth mindset:
- Tìm kiếm thử thách để mở rộng khả năng
- Coi thất bại là feedback, không phải định nghĩa bản thân
- Hưng phấn khi đối mặt với điều khó khăn
- Hiểu rằng discomfort là dấu hiệu của growth

Ngược lại, fixed mindset:
- Tránh thử thách để bảo vệ ego
- Coi thất bại là bằng chứng về giới hạn của mình
- Dễ bỏ cuộc khi gặp khó khăn
- Thích ở trong comfort zone

"Nếu bạn không thất bại đôi khi, bạn đang chơi quá an toàn" - Woody Allen

Thử thách giúp chúng ta:
- Khám phá khả năng tiềm ẩn
- Xây dựng sức bền tâm lý
- Học được nhiều hơn là khi mọi thứ dễ dàng
- Phát triển confidence thật sự`,
      descriptionEn: `Embracing challenges is the ability to see difficulties as opportunities to learn and grow, rather than avoiding them from fear of failure.

Carol Dweck found that people with growth mindset:
- Seek challenges to expand abilities
- See failure as feedback, not self-definition
- Get excited when facing difficult things
- Understand discomfort is a sign of growth

In contrast, fixed mindset:
- Avoid challenges to protect ego
- See failure as evidence of limitations
- Give up easily when facing difficulty
- Prefer to stay in comfort zone

"If you're not failing every now and again, it's a sign you're playing it too safe" - Woody Allen

Challenges help us:
- Discover hidden potential
- Build mental resilience
- Learn more than when things are easy
- Develop genuine confidence`,
      categoryId: growthMindsetCategory!.id,
      tags: ['growth', 'challenge', 'courage', 'resilience'],
      difficulty: 'INTERMEDIATE',
      aiContext: 'Use when user is avoiding something difficult or expressing fear',
      keywords: ['challenge', 'difficult', 'hard', 'fear', 'avoid', 'scary'],
      source: 'Carol Dweck - Mindset',
    },
  });

  await prisma.conceptPractice.createMany({
    data: [
      {
        conceptId: embracingChallenges.id,
        title: 'Challenge Journal',
        titleEn: 'Challenge Journal',
        description: 'Ghi lại challenges và bài học từ mỗi tuần',
        descriptionEn: 'Record challenges and lessons from each week',
        steps: [
          'Mỗi tuần, chọn 1 điều bạn đang tránh né',
          'Viết: "Tôi sợ điều gì về challenge này?"',
          'Viết: "Nếu thành công, tôi sẽ học được gì?"',
          'Commit làm một bước nhỏ',
          'Cuối tuần, review: "Tôi đã học được gì?"',
        ],
        stepsEn: [
          'Each week, choose 1 thing you\'re avoiding',
          'Write: "What am I afraid of about this challenge?"',
          'Write: "If I succeed, what will I learn?"',
          'Commit to one small step',
          'End of week, review: "What did I learn?"',
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
        conceptId: embracingChallenges.id,
        question: 'Điều gì bạn đang tránh né vì sợ thất bại?',
        questionEn: 'What are you avoiding because you fear failure?',
        type: 'PROVOCATIVE',
        order: 1,
      },
      {
        conceptId: embracingChallenges.id,
        question: 'Lần cuối cùng bạn làm điều khiến bạn sợ, bạn đã học được gì?',
        questionEn: 'Last time you did something that scared you, what did you learn?',
        type: 'REFLECTIVE',
        order: 2,
      },
      {
        conceptId: embracingChallenges.id,
        question: 'Challenge nhỏ nào bạn có thể thử trong tuần này?',
        questionEn: 'What small challenge can you try this week?',
        type: 'ACTION_ORIENTED',
        order: 3,
      },
    ],
  });

  console.log('✅ Added 1 Growth Mindset concept\n');

  // ========== EMOTIONAL INTELLIGENCE CONCEPTS ==========
  console.log('📖 Adding Emotional Intelligence concepts...');

  // 4. Self-Awareness
  const selfAwareness = await prisma.concept.upsert({
    where: { key: 'self_awareness' },
    update: {},
    create: {
      key: 'self_awareness',
      slug: 'self-awareness',
      title: 'Tự nhận thức',
      titleEn: 'Self-Awareness',
      summary: 'Hiểu rõ cảm xúc, suy nghĩ, giá trị và động lực của bản thân',
      summaryEn: 'Understanding your emotions, thoughts, values, and motivations',
      description: `Tự nhận thức là nền tảng của trí tuệ cảm xúc - khả năng nhận biết và hiểu cảm xúc, suy nghĩ, giá trị và cách chúng ảnh hưởng đến hành vi của mình.

Daniel Goleman định nghĩa self-awareness có 3 khía cạnh:
1. **Emotional Awareness**: Nhận biết cảm xúc khi chúng xuất hiện
2. **Accurate Self-Assessment**: Hiểu điểm mạnh và hạn chế
3. **Self-Confidence**: Tin tưởng vào giá trị và khả năng của mình

Người có self-awareness cao:
- Nhận biết triggers (những gì kích hoạt cảm xúc)
- Hiểu pattern hành vi của mình
- Biết giá trị và mục tiêu thật sự
- Có thể tự điều chỉnh phản ứng

Thiếu self-awareness dẫn đến:
- Reactive thay vì responsive
- Không hiểu tại sao mình hành xử như vậy
- Khó kiểm soát cảm xúc
- Relationships kém hiệu quả

"Biết người biết ta, trăm trận trăm thắng" - Tôn Tử`,
      descriptionEn: `Self-awareness is the foundation of emotional intelligence - the ability to recognize and understand your emotions, thoughts, values, and how they influence behavior.

Daniel Goleman defines self-awareness with 3 aspects:
1. **Emotional Awareness**: Recognizing emotions as they arise
2. **Accurate Self-Assessment**: Understanding strengths and limitations
3. **Self-Confidence**: Trusting your worth and capabilities

People with high self-awareness:
- Recognize triggers (what activates emotions)
- Understand their behavior patterns
- Know their true values and goals
- Can self-regulate responses

Lack of self-awareness leads to:
- Being reactive rather than responsive
- Not understanding why you act certain ways
- Difficulty controlling emotions
- Ineffective relationships

"Know yourself and know your enemy, you will win every battle" - Sun Tzu`,
      categoryId: emotionalIntelligenceCategory!.id,
      tags: ['self-awareness', 'emotions', 'introspection', 'eq'],
      difficulty: 'INTERMEDIATE',
      aiContext: 'Use when user seems unaware of their emotional patterns',
      keywords: ['self', 'aware', 'emotion', 'feel', 'understand', 'why'],
      source: 'Daniel Goleman - Emotional Intelligence',
    },
  });

  await prisma.conceptPractice.createMany({
    data: [
      {
        conceptId: selfAwareness.id,
        title: 'Emotion Naming',
        titleEn: 'Emotion Naming',
        description: 'Đặt tên cụ thể cho cảm xúc thay vì "tốt/xấu"',
        descriptionEn: 'Name emotions specifically instead of "good/bad"',
        steps: [
          'Dừng lại khi cảm thấy cảm xúc mạnh',
          'Hỏi: "Mình đang cảm thấy gì CHÍNH XÁC?"',
          'Dùng từ cụ thể: lo lắng/sợ hãi/bực bội/thất vọng/hạnh phúc/hài lòng',
          'Đánh giá intensity: 1-10',
          'Ghi chép: "Tôi cảm thấy [cảm xúc] ở mức [số]"',
        ],
        stepsEn: [
          'Pause when feeling strong emotion',
          'Ask: "What EXACTLY am I feeling?"',
          'Use specific words: anxious/scared/frustrated/disappointed/happy/content',
          'Rate intensity: 1-10',
          'Note: "I feel [emotion] at level [number]"',
        ],
        duration: 5,
        difficulty: 'BEGINNER',
        order: 1,
      },
      {
        conceptId: selfAwareness.id,
        title: 'Values Clarification',
        titleEn: 'Values Clarification',
        description: 'Xác định 5 giá trị cốt lõi của bạn',
        descriptionEn: 'Identify your 5 core values',
        steps: [
          'List 20 giá trị quan trọng (gia đình, tự do, sáng tạo, v.v.)',
          'Chọn 10 quan trọng nhất',
          'Chọn 5 KHÔNG THỂ THIẾU',
          'Với mỗi value: "Tại sao điều này quan trọng?"',
          'Kiểm tra: "Cuộc sống hiện tại có align với values không?"',
        ],
        stepsEn: [
          'List 20 important values (family, freedom, creativity, etc.)',
          'Choose 10 most important',
          'Choose 5 ESSENTIAL ones',
          'For each value: "Why does this matter?"',
          'Check: "Does current life align with values?"',
        ],
        duration: 30,
        difficulty: 'INTERMEDIATE',
        order: 2,
      },
    ],
  });

  await prisma.conceptQuestion.createMany({
    data: [
      {
        conceptId: selfAwareness.id,
        question: 'Cảm xúc nào bạn thường xuyên trải qua nhất trong tuần qua?',
        questionEn: 'What emotion did you experience most frequently this week?',
        type: 'REFLECTIVE',
        order: 1,
      },
      {
        conceptId: selfAwareness.id,
        question: 'Điều gì trigger (kích hoạt) cảm xúc tiêu cực của bạn?',
        questionEn: 'What triggers your negative emotions?',
        type: 'EXPLORATORY',
        order: 2,
      },
    ],
  });

  // 5. Empathy
  const empathy = await prisma.concept.upsert({
    where: { key: 'empathy' },
    update: {},
    create: {
      key: 'empathy',
      slug: 'empathy',
      title: 'Đồng cảm',
      titleEn: 'Empathy',
      summary: 'Hiểu và cảm nhận cảm xúc của người khác',
      summaryEn: 'Understanding and feeling others\' emotions',
      description: `Empathy là khả năng đặt mình vào vị trí của người khác, hiểu và cảm nhận những gì họ đang trải qua.

Brené Brown phân biệt:
- **Empathy**: "Tôi hiểu bạn cảm thấy thế nào và tôi ở đây với bạn"
- **Sympathy**: "Tôi thương bạn" (từ xa, không kết nối sâu)

3 loại empathy:
1. **Cognitive Empathy**: Hiểu perspective của người khác
2. **Emotional Empathy**: Cảm nhận cùng cảm xúc
3. **Compassionate Empathy**: Hiểu + Cảm nhận + Hành động giúp đỡ

Empathy giúp:
- Xây dựng mối quan hệ sâu sắc
- Giải quyết conflict hiệu quả
- Lãnh đạo tốt hơn
- Tạo môi trường an toàn tâm lý

Cản trở empathy:
- Judgment và assumptions
- Bận rộn quá, không lắng nghe
- Defensive (tự vệ)
- Muốn "fix" thay vì "be with"

"Empathy is seeing with the eyes of another, listening with the ears of another, and feeling with the heart of another" - Alfred Adler`,
      descriptionEn: `Empathy is the ability to put yourself in someone else's position, understand and feel what they're experiencing.

Brené Brown distinguishes:
- **Empathy**: "I understand how you feel and I'm here with you"
- **Sympathy**: "I feel sorry for you" (from distance, no deep connection)

3 types of empathy:
1. **Cognitive Empathy**: Understanding others' perspective
2. **Emotional Empathy**: Feeling the same emotions
3. **Compassionate Empathy**: Understand + Feel + Act to help

Empathy helps:
- Build deep relationships
- Resolve conflicts effectively
- Lead better
- Create psychological safety

Barriers to empathy:
- Judgment and assumptions
- Too busy, not listening
- Being defensive
- Wanting to "fix" instead of "be with"

"Empathy is seeing with the eyes of another, listening with the ears of another, and feeling with the heart of another" - Alfred Adler`,
      categoryId: emotionalIntelligenceCategory!.id,
      tags: ['empathy', 'compassion', 'relationships', 'listening'],
      difficulty: 'INTERMEDIATE',
      aiContext: 'Use when user has relationship conflicts or misunderstandings',
      keywords: ['empathy', 'understand', 'feel', 'other', 'perspective', 'listen'],
      source: 'Brené Brown - Dare to Lead',
    },
  });

  await prisma.conceptPractice.createMany({
    data: [
      {
        conceptId: empathy.id,
        title: 'Active Listening',
        titleEn: 'Active Listening',
        description: 'Lắng nghe để hiểu, không để phản hồi',
        descriptionEn: 'Listen to understand, not to respond',
        steps: [
          'Khi ai đó nói, tập trung 100%',
          'Không chuẩn bị câu trả lời trong đầu',
          'Quan sát: ngôn ngữ cơ thể, giọng điệu',
          'Reflect back: "Bạn đang cảm thấy... vì..."',
          'Hỏi: "Bạn cần gì từ mình?"',
        ],
        stepsEn: [
          'When someone speaks, focus 100%',
          'Don\'t prepare response in mind',
          'Observe: body language, tone',
          'Reflect back: "You\'re feeling... because..."',
          'Ask: "What do you need from me?"',
        ],
        duration: 10,
        difficulty: 'INTERMEDIATE',
        order: 1,
      },
      {
        conceptId: empathy.id,
        title: 'Perspective Taking',
        titleEn: 'Perspective Taking',
        description: 'Thực hành nhìn từ góc độ người khác',
        descriptionEn: 'Practice seeing from others\' viewpoint',
        steps: [
          'Chọn một conflict/disagreement',
          'Viết: "Quan điểm của tôi: ..."',
          'Viết: "Nếu tôi là người kia, tôi có thể cảm thấy..."',
          'Viết: "Điều gì có thể là valid trong quan điểm của họ?"',
          'Hỏi họ: "Tôi hiểu đúng không khi..."',
        ],
        stepsEn: [
          'Choose a conflict/disagreement',
          'Write: "My perspective: ..."',
          'Write: "If I were them, I might feel..."',
          'Write: "What could be valid in their view?"',
          'Ask them: "Am I understanding correctly that..."',
        ],
        duration: 15,
        difficulty: 'INTERMEDIATE',
        order: 2,
      },
    ],
  });

  await prisma.conceptQuestion.createMany({
    data: [
      {
        conceptId: empathy.id,
        question: 'Lần cuối cùng bạn thực sự lắng nghe ai đó mà không suy nghĩ về phản hồi là khi nào?',
        questionEn: 'When was the last time you truly listened to someone without thinking about your response?',
        type: 'REFLECTIVE',
        order: 1,
      },
      {
        conceptId: empathy.id,
        question: 'Trong conflict gần đây, bạn đã cố gắng hiểu perspective của người kia chưa?',
        questionEn: 'In a recent conflict, did you try to understand the other person\'s perspective?',
        type: 'PROVOCATIVE',
        order: 2,
      },
    ],
  });

  console.log('✅ Added 2 Emotional Intelligence concepts\n');

  // ========== PRODUCTIVITY CONCEPTS ==========
  console.log('📖 Adding Productivity concepts...');

  // 6. Deep Work
  const deepWork = await prisma.concept.upsert({
    where: { key: 'deep_work' },
    update: {},
    create: {
      key: 'deep_work',
      slug: 'deep-work',
      title: 'Làm việc sâu',
      titleEn: 'Deep Work',
      summary: 'Tập trung cao độ vào công việc có giá trị mà không bị phân tâm',
      summaryEn: 'Intense focus on valuable work without distraction',
      description: `Deep Work là khả năng tập trung không bị phân tâm vào nhiệm vụ đòi hỏi nhận thức cao, tạo ra giá trị lớn và khó bị thay thế.

Cal Newport định nghĩa:
"Deep Work là các hoạt động chuyên môn được thực hiện trong trạng thái tập trung không bị phân tâm, đẩy khả năng nhận thức của bạn đến giới hạn. Những nỗ lực này tạo ra giá trị mới, cải thiện kỹ năng và khó bị nhân bản."

Ngược lại là Shallow Work:
- Email, meetings, admin tasks
- Có thể làm khi bị phân tâm
- Không tạo giá trị mới nhiều
- Dễ bị thay thế

Tại sao Deep Work quan trọng:
- Trong economy hiện đại, người thành thạo kỹ năng phức tạp có lợi thế lớn
- AI và automation thay thế shallow work
- Deep work tạo breakthrough và innovation
- Cải thiện kỹ năng nhanh chóng

4 quy tắc Deep Work:
1. Work Deeply - Tạo rituals và routines
2. Embrace Boredom - Luyện tập concentration
3. Quit Social Media - Giảm distraction
4. Drain the Shallows - Minimize shallow work`,
      descriptionEn: `Deep Work is the ability to focus without distraction on cognitively demanding tasks, creating significant value and being hard to replicate.

Cal Newport defines:
"Deep Work is professional activities performed in a state of distraction-free concentration that push your cognitive capabilities to their limit. These efforts create new value, improve your skill, and are hard to replicate."

Opposite is Shallow Work:
- Email, meetings, admin tasks
- Can be done while distracted
- Doesn't create much new value
- Easily replaceable

Why Deep Work matters:
- In modern economy, those who master complex skills have huge advantages
- AI and automation replace shallow work
- Deep work creates breakthroughs and innovation
- Improves skills rapidly

4 Rules of Deep Work:
1. Work Deeply - Create rituals and routines
2. Embrace Boredom - Train concentration
3. Quit Social Media - Reduce distraction
4. Drain the Shallows - Minimize shallow work`,
      categoryId: productivityCategory.id,
      tags: ['productivity', 'focus', 'concentration', 'flow'],
      difficulty: 'INTERMEDIATE',
      aiContext: 'Use when user struggles with focus or feels unproductive',
      keywords: ['focus', 'concentrate', 'distract', 'productive', 'work', 'deep'],
      source: 'Cal Newport - Deep Work',
    },
  });

  await prisma.conceptPractice.createMany({
    data: [
      {
        conceptId: deepWork.id,
        title: 'Deep Work Block',
        titleEn: 'Deep Work Block',
        description: 'Tạo block 90-120 phút deep work mỗi ngày',
        descriptionEn: 'Create 90-120 minute deep work blocks daily',
        steps: [
          'Chọn thời gian năng lượng cao nhất (thường buổi sáng)',
          'Block calendar, thông báo đồng nghiệp',
          'Tắt tất cả notifications (phone, email, chat)',
          'Chọn 1 nhiệm vụ quan trọng duy nhất',
          'Set timer 90 phút, làm việc chuyên sâu',
          'Break 15 phút sau mỗi block',
        ],
        stepsEn: [
          'Choose highest energy time (usually morning)',
          'Block calendar, notify colleagues',
          'Turn off all notifications (phone, email, chat)',
          'Choose ONE important task',
          'Set timer 90 minutes, work intensely',
          '15 minute break after each block',
        ],
        duration: 90,
        difficulty: 'INTERMEDIATE',
        order: 1,
      },
    ],
  });

  await prisma.conceptQuestion.createMany({
    data: [
      {
        conceptId: deepWork.id,
        question: 'Khi nào bạn tập trung tốt nhất trong ngày?',
        questionEn: 'When do you focus best during the day?',
        type: 'EXPLORATORY',
        order: 1,
      },
      {
        conceptId: deepWork.id,
        question: 'Bạn đang dành bao nhiêu % thời gian cho deep work vs shallow work?',
        questionEn: 'What % of your time is deep work vs shallow work?',
        type: 'REFLECTIVE',
        order: 2,
      },
    ],
  });

  console.log('✅ Added 1 Productivity concept\n');

  // ========== RELATIONSHIPS CONCEPTS ==========
  console.log('📖 Adding Relationships concepts...');

  // 7. Healthy Boundaries
  const boundaries = await prisma.concept.upsert({
    where: { key: 'healthy_boundaries' },
    update: {},
    create: {
      key: 'healthy_boundaries',
      slug: 'healthy-boundaries',
      title: 'Ranh giới lành mạnh',
      titleEn: 'Healthy Boundaries',
      summary: 'Thiết lập và duy trì giới hạn rõ ràng trong mối quan hệ',
      summaryEn: 'Establishing and maintaining clear limits in relationships',
      description: `Ranh giới lành mạnh là việc thiết lập các giới hạn rõ ràng về những gì bạn chấp nhận và không chấp nhận trong mối quan hệ, bảo vệ thời gian, năng lượng và giá trị của bạn.

Brené Brown nói:
"Ranh giới chính là những gì được phép và không được phép."

Các loại ranh giới:
1. **Physical**: Không gian cá nhân, chạm chạm
2. **Emotional**: Chia sẻ cảm xúc, intimacy
3. **Time**: Ưu tiên thời gian cho bản thân/người khác
4. **Mental**: Tôn trọng suy nghĩ, ý kiến
5. **Material**: Tiền bạc, tài sản

Dấu hiệu ranh giới kém:
- Nói "yes" khi muốn nói "no"
- Cảm thấy bị lợi dụng
- Burnout vì quá mức cam kết
- Resentment (oán giận) với người khác
- Mất bản sắc trong mối quan hệ

Ranh giới lành mạnh KHÔNG phải:
❌ Ích kỷ
❌ Xây tường ngăn cách
❌ Không quan tâm người khác

Ranh giới lành mạnh LÀ:
✅ Tự chăm sóc bản thân
✅ Rõ ràng về needs và limits
✅ Tôn trọng bản thân và người khác`,
      descriptionEn: `Healthy boundaries are establishing clear limits about what you accept and don't accept in relationships, protecting your time, energy, and values.

Brené Brown says:
"Boundaries are what's okay and what's not okay."

Types of boundaries:
1. **Physical**: Personal space, touch
2. **Emotional**: Sharing feelings, intimacy
3. **Time**: Prioritizing time for self/others
4. **Mental**: Respecting thoughts, opinions
5. **Material**: Money, possessions

Signs of poor boundaries:
- Saying "yes" when you want to say "no"
- Feeling taken advantage of
- Burnout from over-committing
- Resentment toward others
- Losing self in relationships

Healthy boundaries are NOT:
❌ Selfish
❌ Building walls
❌ Not caring about others

Healthy boundaries ARE:
✅ Self-care
✅ Clear about needs and limits
✅ Respecting self and others`,
      categoryId: relationshipsCategory.id,
      tags: ['boundaries', 'relationships', 'self-care', 'assertiveness'],
      difficulty: 'INTERMEDIATE',
      aiContext: 'Use when user feels overwhelmed, taken advantage of, or unable to say no',
      keywords: ['boundary', 'no', 'limit', 'overwhelm', 'people-pleasing', 'yes'],
      source: 'Brené Brown - Atlas of the Heart',
    },
  });

  await prisma.conceptPractice.createMany({
    data: [
      {
        conceptId: boundaries.id,
        title: 'Saying No Practice',
        titleEn: 'Saying No Practice',
        description: 'Luyện tập nói "không" một cách lịch sự nhưng firm',
        descriptionEn: 'Practice saying "no" politely but firmly',
        steps: [
          'Nhận diện khi bạn muốn nói no nhưng sắp nói yes',
          'Dùng template: "Cảm ơn đã nghĩ đến mình, nhưng..."',
          'Không cần giải thích dài dòng',
          'Alternatives: "Để mình kiểm tra lịch và trả lời sau"',
          'Practice với người an toàn trước',
        ],
        stepsEn: [
          'Notice when you want to say no but about to say yes',
          'Use template: "Thanks for thinking of me, but..."',
          'Don\'t over-explain',
          'Alternatives: "Let me check my calendar and get back"',
          'Practice with safe person first',
        ],
        duration: 10,
        difficulty: 'INTERMEDIATE',
        order: 1,
      },
    ],
  });

  await prisma.conceptQuestion.createMany({
    data: [
      {
        conceptId: boundaries.id,
        question: 'Bạn đang nói "yes" vì muốn hay vì cảm thấy phải làm?',
        questionEn: 'Are you saying "yes" because you want to or feel you have to?',
        type: 'PROVOCATIVE',
        order: 1,
      },
      {
        conceptId: boundaries.id,
        question: 'Ranh giới nào bạn cần thiết lập trong mối quan hệ hiện tại?',
        questionEn: 'What boundary do you need to set in your current relationships?',
        type: 'ACTION_ORIENTED',
        order: 2,
      },
    ],
  });

  console.log('✅ Added 1 Relationships concept\n');

  // ========== RESILIENCE CONCEPTS ==========
  console.log('📖 Adding Resilience concepts...');

  // 8. Stress Management
  const stressManagement = await prisma.concept.upsert({
    where: { key: 'stress_management' },
    update: {},
    create: {
      key: 'stress_management',
      slug: 'stress-management',
      title: 'Quản lý căng thẳng',
      titleEn: 'Stress Management',
      summary: 'Kỹ thuật giảm và kiểm soát stress hiệu quả',
      summaryEn: 'Techniques to reduce and control stress effectively',
      description: `Quản lý căng thẳng là khả năng nhận diện, giảm thiểu và phản ứng lành mạnh với stress, thay vì để stress kiểm soát cuộc sống.

Stress không phải lúc nào cũng xấu:
- **Eustress**: Stress tích cực (challenge, excitement)
- **Distress**: Stress tiêu cực (chronic, overwhelming)

4 chiến lược quản lý stress:
1. **Problem-focused**: Giải quyết nguyên nhân
2. **Emotion-focused**: Quản lý phản ứng cảm xúc
3. **Meaning-focused**: Tìm ý nghĩa trong khó khăn
4. **Social support**: Tìm kiếm sự hỗ trợ

Dấu hiệu stress mãn tính:
- Mệt mỏi liên tục
- Khó ngủ
- Irritability (cáu gắt)
- Đau đầu, đau cơ
- Khó tập trung
- Thay đổi appetite

Kỹ thuật evidence-based:
- Deep breathing (4-7-8)
- Progressive muscle relaxation
- Mindfulness meditation
- Physical exercise
- Social connection
- Time in nature

Quan trọng nhất: Stress là phản ứng của cơ thể với threat. Khi thay đổi perception (nhận thức), thay đổi response.`,
      descriptionEn: `Stress management is the ability to recognize, reduce, and respond healthily to stress, rather than letting stress control life.

Stress isn't always bad:
- **Eustress**: Positive stress (challenge, excitement)
- **Distress**: Negative stress (chronic, overwhelming)

4 stress management strategies:
1. **Problem-focused**: Address the cause
2. **Emotion-focused**: Manage emotional response
3. **Meaning-focused**: Find meaning in difficulty
4. **Social support**: Seek support

Signs of chronic stress:
- Constant fatigue
- Sleep problems
- Irritability
- Headaches, muscle pain
- Difficulty concentrating
- Appetite changes

Evidence-based techniques:
- Deep breathing (4-7-8)
- Progressive muscle relaxation
- Mindfulness meditation
- Physical exercise
- Social connection
- Time in nature

Most important: Stress is body's response to threat. When you change perception, you change response.`,
      categoryId: resilienceCategory!.id,
      tags: ['stress', 'anxiety', 'coping', 'wellness'],
      difficulty: 'BEGINNER',
      aiContext: 'Use when user expresses feeling overwhelmed or stressed',
      keywords: ['stress', 'anxious', 'overwhelm', 'pressure', 'worry', 'calm'],
      source: 'Kelly McGonigal - The Upside of Stress',
    },
  });

  await prisma.conceptPractice.createMany({
    data: [
      {
        conceptId: stressManagement.id,
        title: '4-7-8 Breathing',
        titleEn: '4-7-8 Breathing',
        description: 'Kỹ thuật thở giảm stress tức thì',
        descriptionEn: 'Breathing technique for instant stress relief',
        steps: [
          'Thở hết ra qua miệng',
          'Thở vào qua mũi, đếm 4',
          'Giữ hơi, đếm 7',
          'Thở ra qua miệng, đếm 8',
          'Lặp lại 4 chu kỳ',
        ],
        stepsEn: [
          'Exhale completely through mouth',
          'Inhale through nose, count 4',
          'Hold breath, count 7',
          'Exhale through mouth, count 8',
          'Repeat 4 cycles',
        ],
        duration: 5,
        difficulty: 'BEGINNER',
        order: 1,
      },
      {
        conceptId: stressManagement.id,
        title: 'Stress Journal',
        titleEn: 'Stress Journal',
        description: 'Tracking stress triggers và patterns',
        descriptionEn: 'Tracking stress triggers and patterns',
        steps: [
          'Mỗi khi cảm thấy stress, ghi lại:',
          '1. Tình huống gì xảy ra?',
          '2. Suy nghĩ gì trong đầu?',
          '3. Cảm xúc & cường độ (1-10)',
          '4. Phản ứng của bạn?',
          'Sau 1 tuần, tìm patterns',
        ],
        stepsEn: [
          'When feeling stressed, record:',
          '1. What situation happened?',
          '2. What thoughts?',
          '3. Emotions & intensity (1-10)',
          '4. Your response?',
          'After 1 week, find patterns',
        ],
        duration: 15,
        difficulty: 'BEGINNER',
        order: 2,
      },
    ],
  });

  await prisma.conceptQuestion.createMany({
    data: [
      {
        conceptId: stressManagement.id,
        question: 'Stress của bạn đến từ điều gì bạn có thể kiểm soát hay không thể kiểm soát?',
        questionEn: 'Is your stress from something you can control or cannot control?',
        type: 'EXPLORATORY',
        order: 1,
      },
      {
        conceptId: stressManagement.id,
        question: 'Bạn thường phản ứng với stress như thế nào? Cách đó có hiệu quả không?',
        questionEn: 'How do you typically respond to stress? Is it effective?',
        type: 'REFLECTIVE',
        order: 2,
      },
    ],
  });

  console.log('✅ Added 1 Resilience concept\n');

  // Create relations between concepts
  console.log('🔗 Creating concept relations...');

  await prisma.conceptRelation.createMany({
    data: [
      // Present Moment <-> Non-Judgmental
      { aId: presentMoment.id, bId: nonJudgmental.id, type: 'RELATED' },
      // Empathy <-> Self-Awareness
      { aId: empathy.id, bId: selfAwareness.id, type: 'RELATED' },
      // Deep Work <-> Embracing Challenges
      { aId: deepWork.id, bId: embracingChallenges.id, type: 'RELATED' },
      // Boundaries <-> Self-Awareness
      { aId: boundaries.id, bId: selfAwareness.id, type: 'RELATED' },
      // Stress Management <-> Present Moment
      { aId: stressManagement.id, bId: presentMoment.id, type: 'RELATED' },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Created concept relations\n');

  // Summary
  const conceptCount = await prisma.concept.count();
  const categoryCount = await prisma.conceptCategory.count();
  const practiceCount = await prisma.conceptPractice.count();
  const exampleCount = await prisma.conceptExample.count();
  const questionCount = await prisma.conceptQuestion.count();

  console.log('═══════════════════════════════════════');
  console.log('📊 Expansion Summary:');
  console.log('═══════════════════════════════════════');
  console.log(`   Categories:  ${categoryCount} (+2)`);
  console.log(`   Concepts:    ${conceptCount} (+8)`);
  console.log(`   Practices:   ${practiceCount} (+10)`);
  console.log(`   Examples:    ${exampleCount}`);
  console.log(`   Questions:   ${questionCount} (+13)`);
  console.log('═══════════════════════════════════════');
  console.log('\n✅ Content expansion completed!\n');
}

expandConcepts()
  .catch((e) => {
    console.error('❌ Error expanding concepts:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
