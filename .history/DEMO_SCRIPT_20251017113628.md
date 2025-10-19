# 🎬 Demo Script - Life Lessons App

Quick demo walkthrough cho showcase hoặc testing.

## ⏱️ 5-Minute Demo Flow

### 1. Login (30 seconds)
1. Mở http://localhost:3000
2. Click "Đăng nhập"
3. Enter credentials:
   - Email: `demo@lifelessons.app`
   - Password: `Passw0rd!`
4. **Expected**: Dashboard loads with progress ring showing 12 lessons

---

### 2. Dashboard Overview (1 minute)
**Point out:**
- 📝 Quick Capture card (left) - ghi bài học nhanh
- 📊 Progress section (right):
  - Big number: 12/10,000
  - Streak counter
  - Domain stats (4 cards)
- 🎯 Navigation cards at bottom

**Say**: "Người dùng có thể nhanh chóng ghi lại bài học ngay từ dashboard mà không cần vào trang riêng."

---

### 3. Create Lesson (1 minute)
1. In Quick Capture, type:
   ```
   Hôm nay tôi học được rằng việc chia nhỏ mục tiêu lớn 
   thành các sprint 100 bài giúp dễ theo dõi và duy trì động lực.
   ```
2. Select domain: **Nội tâm**
3. Set mood: **+1** (positive)
4. Set resonance: **2** (moderate)
5. Click "Lưu bài học"
6. **Expected**: Success, form clears, count → 13

**Say**: "Mất dưới 30 giây để ghi một bài học. Form tự động validate và có thể thêm tags, gratitude tùy chọn."

---

### 4. Journal & AI Analysis (1.5 minutes)
1. Click "Nhật ký" card
2. **Point out** list features:
   - Filter by domain/tags/search
   - Each card shows preview + metadata
   - 13 lessons now (12 seed + 1 new)
3. Click "Chi tiết" on the lesson just created
4. **Show** full content + metadata display
5. Click "🤖 Phân tích với AI"
6. Wait ~1 second
7. **Expected**: 3 colored boxes appear:
   - 🔵 Tóm tắt AI
   - 🟣 Khái niệm chính (chips)
   - 🟢 Câu hỏi tiếp theo

**Say**: "AI mock service trích xuất summary, concepts và đề xuất câu hỏi suy nghĩ tiếp. Production sẽ dùng LLM thật như GPT-4 hoặc Claude."

---

### 5. Goals & Roadmap (1 minute)
1. Go back, click "Mục tiêu"
2. **Point out**:
   - Big progress ring: 13/10,000 (0.13%)
   - Stats: Sprint còn lại, bài học/sprint
   - Current sprint section:
     - Progress bar: 13/100
     - Start/End dates
   - Sprint history (Sprint #1)

**Say**: "Hệ thống tự động chia mục tiêu 10,000 thành các sprint 100 bài. Khi hoàn thành sprint, tự động tạo sprint mới. Thiết kế này giúp người dùng không bị overwhelm với con số lớn."

---

### 6. Settings (30 seconds)
1. Navigate to "Cài đặt"
2. Quick tour of tabs:
   - **Tài khoản**: Name, locale, timezone
   - **Riêng tư**: Privacy default (Private/Group/Link/Public)
   - **Nhắc nhở**: Daily evening reminder (21:00)
   - **Xuất dữ liệu**: 3 formats (Markdown/CSV/JSON)

**Say**: "User có full control về privacy và notification. Export cho phép backup hoặc migrate data."

---

### 7. Wrap-up (30 seconds)
**Summary talking points:**
- ✅ **Quick capture** - ghi lesson < 30s
- ✅ **AI analysis** - tự động tóm tắt và đề xuất
- ✅ **10,000 goal** - chia nhỏ thành sprint dễ quản lý
- ✅ **Analytics** - streak, heatmap, domain insights
- ✅ **Privacy-first** - default private
- ✅ **Export-friendly** - dữ liệu luôn thuộc về user

**Tech highlights:**
- 🏗️ Monorepo: NestJS + Next.js 15 + Prisma
- 🎨 Modern stack: TypeScript end-to-end
- 📱 Mobile-ready: Expo scaffold planned
- 🧠 AI-ready: Mock service dễ swap LLM

---

## 🎯 Demo Scenarios

### Scenario A: Personal Growth Journey
**Story**: "Sarah muốn theo dõi hành trình phát triển bản thân 10 năm với mục tiêu 10,000 lessons."

**Flow**: Login → Create lesson → Analyze → Show progress → Explain sprint system

### Scenario B: Daily Reflection Habit
**Story**: "John dùng app mỗi tối để ghi lại điều học được trong ngày."

**Flow**: Quick Capture từ Dashboard → Show streak counter → Enable reminder → Export data

### Scenario C: Domain-Focused Learning
**Story**: "Lisa tập trung cải thiện sức khỏe, muốn track riêng domain Health."

**Flow**: Journal → Filter Health → Show Health stats → Create Health lesson

---

## 🔥 "Wow" Moments

### 1. Quick Capture Speed
- Type lesson → Save
- **Timing**: < 30 seconds
- **Impact**: "Không còn lý do để skip ghi chép"

### 2. AI Analysis
- Click Analyze → Instant results
- **Timing**: ~1 second (mock)
- **Impact**: "AI giúp tôi nhìn nhận lại từ góc độ khác"

### 3. Sprint Auto-Creation
- Explain: "Khi đạt 100, tự động tạo Sprint #2"
- **Impact**: "Không cần quản lý thủ công, chỉ tập trung viết"

### 4. Domain Distribution
- Show 4 stat cards
- **Impact**: "Visualize ngay mình đang thiếu cân bằng domain nào"

### 5. Dark Mode
- Toggle system theme
- **Impact**: "UI adapt tự động, bảo vệ mắt khi dùng ban đêm"

---

## 🐛 Known Limitations (Preempt Questions)

### "Can I share lessons with friends?"
✅ Yes - Privacy settings: Link sharing or Public anonymous
⏳ Group features coming in v1.1

### "Does mobile app work offline?"
⏳ Mobile app not built yet, but architecture planned with SQLite + sync queue

### "Can AI integrate with ChatGPT?"
✅ Yes - Mock service is adapter, can swap to OpenAI/Anthropic API (env flag)

### "What about data privacy?"
✅ Default private
✅ Export anytime (Markdown/CSV/JSON)
✅ Self-hostable (Docker Compose)
⏳ E2E encryption planned v2.0

---

## 📊 Demo Data Seeded

- **1 user**: demo@lifelessons.app
- **12 lessons**: 3 per domain (INNER, HEALTH, RELATIONSHIP, FINANCE)
- **1 goal**: 10,000 target, sprint size 100
- **1 sprint**: Sprint #1 (current: 12/100)
- **Concepts**: 4 categories, 8+ concepts

---

## 🎬 Presenter Tips

### Energy Points
1. **Open strong**: "Imagine tracking 10,000 life lessons over 10 years..."
2. **Show speed**: "Watch how fast I can capture a lesson" → Type & save < 30s
3. **Highlight AI**: "AI analyzes and asks me a thought-provoking question"
4. **End inspiring**: "This isn't just an app, it's a companion for lifelong learning"

### Body Language
- **Point at screen** when showing key features
- **Pause** after each "wow" moment (AI analysis, auto sprint)
- **Make eye contact** when explaining impact

### Tone
- Conversational, not robotic
- Enthusiastic but not salesy
- Honest about "TODO" items

---

## 🚀 Setup Before Demo

### 10 Minutes Before
- [ ] Start Docker containers
- [ ] Start backend (check http://localhost:3001/docs)
- [ ] Start frontend (check http://localhost:3000)
- [ ] Open browser, go to login page
- [ ] Test demo credentials work
- [ ] Clear browser cache if needed
- [ ] Have Swagger open in another tab (technical audience)

### 2 Minutes Before
- [ ] Close unnecessary windows
- [ ] Set browser zoom to 100%
- [ ] Disable notifications
- [ ] Open Notes app with demo script
- [ ] Take a deep breath 😊

### During Demo
- [ ] Speak clearly, not too fast
- [ ] Pause for questions
- [ ] Have fun!

---

## 🎤 Q&A Prep

### Likely Questions

**Q: How long did this take to build?**
A: MVP ~6-8 hours. Backend + Frontend + Database schema + Seed data.

**Q: What's the tech stack?**
A: NestJS (API) + Next.js 15 (Web) + Prisma (ORM) + PostgreSQL + Redis. TypeScript end-to-end.

**Q: Can I deploy this?**
A: Yes, Docker Compose for dev. Production needs env vars + cloud DB (Neon, Supabase, etc.)

**Q: Is code open source?**
A: (Depends on your decision) Currently private/internal. May open-source later.

**Q: How does AI work?**
A: V1 = Mock (rule-based). V1.1 = Real LLM via API (OpenAI, Anthropic). Adapter pattern makes swap easy.

**Q: Mobile app?**
A: Planned Phase 2 with React Native + Expo. Offline-first with SQLite sync.

**Q: What about security?**
A: JWT auth, bcrypt passwords, Helmet middleware, input validation. Rate limiting ready. Production needs SSL + env secrets.

---

**Good luck with your demo! 🎉**

*Estimated demo time: 5-7 minutes (with talking). 10-12 minutes with Q&A.*
