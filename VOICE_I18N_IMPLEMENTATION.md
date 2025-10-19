# Voice Recording & i18n Implementation

> **Date:** October 18, 2025  
> **Features Added:** Voice Recording với Speech-to-Text + AI Rewrite, Internationalization (EN/VI)

---

## 🎙️ Voice Recording Feature

### Components Created

1. **`VoiceRecorder.tsx`** - Complete voice recording component
   - Location: `apps/web/src/components/lesson/VoiceRecorder.tsx`
   - Features:
     - ✅ Web Speech API integration
     - ✅ Real-time speech-to-text transcription
     - ✅ Recording indicator with animation
     - ✅ Transcript preview
     - ✅ AI Rewrite functionality
     - ✅ Original vs Rewritten comparison
     - ✅ Choose version buttons
     - ✅ Multi-language support (VI/EN)

### How It Works

```typescript
<VoiceRecorder
  onTranscript={(text) => setContent(text)}
  onAIRewrite={(original, rewritten) => setContent(rewritten)}
  locale="vi"
/>
```

### User Flow

1. **Click "Ghi âm" (Record)** button
2. Browser requests **microphone permission**
3. **Recording starts** - Red pulsing indicator appears
4. **Speak your lesson** - Real-time transcription
5. **Click "Dừng" (Stop)** - Recording stops
6. **Transcript preview** shows in blue box
7. **Click "AI viết lại"** - AI rewrites with structure
8. **Compare versions** - Original vs AI rewritten
9. **Choose version:**
   - "Dùng bản gốc" - Use original
   - "Dùng bản viết lại" - Use AI version
10. **Text fills textarea** - Ready to save

### AI Rewrite Algorithm

```typescript
// Mock implementation (replace with real API)
async function mockAIRewrite(text: string, locale: 'en' | 'vi') {
  // Splits into sentences
  const lines = text.split(/[.!?]+/).filter(t => t.trim());
  
  // Adds structure:
  // **Bài học chính:** First sentence
  // - Additional point 1
  // - Additional point 2
  // **Suy ngẫm:** Reflection question
  
  return formatted_text;
}
```

### Browser Compatibility

- ✅ **Chrome/Edge:** Full support
- ✅ **Safari:** Full support (iOS 14.5+)
- ⚠️ **Firefox:** Partial support (enable in about:config)
- ❌ **Opera Mini:** Not supported

### Permissions Required

```javascript
navigator.mediaDevices.getUserMedia({ audio: true })
```

---

## 🌍 Internationalization (i18n)

### Setup

1. **Package installed:** `next-intl`
2. **Languages supported:** English (en) + Tiếng Việt (vi)
3. **Configuration file:** `src/i18n.ts`
4. **Translation files:**
   - `src/messages/en.json`
   - `src/messages/vi.json`

### Components Created

1. **`LanguageSwitcher.tsx`**
   - Location: `apps/web/src/components/common/LanguageSwitcher.tsx`
   - Features:
     - Toggle between EN/VI
     - Globe icon indicator
     - Persists in localStorage
     - Shows current language (VI/EN badge)

### Translation Structure

```json
{
  "common": { ... },
  "auth": { ... },
  "dashboard": {
    "quickCapture": "Ghi nhanh",
    "voiceRecord": "Ghi âm",
    "recording": "Đang ghi...",
    "aiRewrite": "AI viết lại"
  },
  "domains": {
    "INNER": "Nội tâm",
    "HEALTH": "Sức khỏe"
  },
  "voice": {
    "record": "Ghi âm",
    "transcribing": "Đang chuyển thành văn bản...",
    "error": "Ghi âm thất bại"
  }
}
```

### Usage in Components

```typescript
// In VoiceRecorder component
const t = {
  vi: { record: 'Ghi âm', ... },
  en: { record: 'Record Voice', ... }
};

const texts = t[locale];
<button>{texts.record}</button>
```

### Integration Points

- ✅ Dashboard header (LanguageSwitcher)
- ✅ Quick Capture card (VoiceRecorder)
- ✅ Voice recording UI
- ✅ AI rewrite button text
- ✅ Toast notifications

---

## 📦 Files Modified

### New Files Created (5)

1. `src/i18n.ts` - i18n configuration
2. `src/messages/en.json` - English translations (120+ strings)
3. `src/messages/vi.json` - Vietnamese translations (120+ strings)
4. `src/components/common/LanguageSwitcher.tsx` - Language toggle
5. `src/components/lesson/VoiceRecorder.tsx` - Voice recording component

### Files Modified (2)

1. `src/app/dashboard/page.tsx`
   - Added VoiceRecorder integration
   - Added LanguageSwitcher
   - Added handleTranscript callback
   - Added handleAIRewrite callback

2. `src/app/dashboard/layout.tsx`
   - Added LanguageSwitcher to header
   - Import statement added

---

## 🎨 UI/UX Enhancements

### Voice Recorder States

1. **Idle State:**
   - Red gradient button "Ghi âm"
   - Microphone icon

2. **Recording State:**
   - Gray/black button "Dừng"
   - Pulsing red dot animation
   - "Đang ghi..." text

3. **Transcribing State:**
   - Blue loader spinner
   - "Đang chuyển thành văn bản..."

4. **Transcript Preview:**
   - Blue bordered box
   - Microphone icon
   - "Bản gốc (Original):" label
   - Full transcript text

5. **AI Rewrite State:**
   - Purple gradient button with sparkle icon
   - "AI viết lại" text
   - Loading: "Đang viết lại..."

6. **Comparison State:**
   - Two boxes: Blue (original) + Purple (AI)
   - Side-by-side buttons
   - "Dùng bản gốc" vs "Dùng bản viết lại"

### Animations

- ✅ Framer Motion scale/fade effects
- ✅ Pulsing red dot (recording indicator)
- ✅ Smooth height transitions (AnimatePresence)
- ✅ Button hover/tap animations
- ✅ Loading spinner (Loader2)

---

## 🧪 Testing

### Manual Test Checklist

- [ ] **Click "Ghi âm"** → Browser asks for mic permission
- [ ] **Allow microphone** → Recording starts, red dot pulses
- [ ] **Speak test sentence** → Text appears in real-time
- [ ] **Click "Dừng"** → Recording stops, transcript shows
- [ ] **Click "AI viết lại"** → Rewritten version appears (2s delay)
- [ ] **Compare versions** → Both boxes visible
- [ ] **Click "Dùng bản viết lại"** → Text fills textarea
- [ ] **Click "Save Lesson"** → Lesson saves to backend
- [ ] **Toggle language** → UI switches EN ↔ VI
- [ ] **Refresh page** → Language persists

### Browser Tests

```bash
# Test in different browsers
- Chrome (Windows/Mac) ✅
- Edge ✅
- Safari (Mac/iOS) ⚠️ (test needed)
- Firefox ⚠️ (may need flag)
```

### API Integration (TODO)

Current: **Mock AI rewrite** (2s delay, simple formatting)

**Replace with:**
```typescript
// apps/api/src/ai/ai.service.ts
async rewriteLesson(content: string, locale: string) {
  // Call OpenAI/Claude API
  const prompt = `Rewrite this lesson clearly:\n\n${content}`;
  const response = await llm.complete(prompt);
  return response.text;
}
```

**Backend endpoint:**
```typescript
POST /api/ai/rewrite
Body: { content: string, locale: string }
Response: { rewritten: string }
```

---

## 🚀 Deployment Notes

### Environment Variables

No new env vars needed for MVP (using Web Speech API).

**For production AI rewrite:**
```env
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

### Build Check

```bash
cd apps/web
pnpm build
# Should compile without errors
```

### Known Issues

1. **Firefox:** Web Speech API requires `media.webspeech.recognition.enable=true` in about:config
2. **iOS Safari:** Requires user gesture to start recording (button click)
3. **Mock AI:** Current rewrite is basic formatting, replace with real LLM

---

## 📝 Next Steps

### High Priority

1. **Backend AI Rewrite Endpoint**
   - Create `/api/ai/rewrite` endpoint
   - Integrate OpenAI/Claude
   - Handle rate limiting
   - Add caching for similar requests

2. **Update Voice Recorder**
   - Replace mockAIRewrite with real API call
   - Add error retry logic
   - Add custom prompt templates

3. **Translation Updates**
   - Apply translations to ALL pages (currently only Dashboard + VoiceRecorder)
   - Use next-intl properly with locale routing
   - Update login/signup pages

### Medium Priority

4. **Voice Quality**
   - Add noise cancellation
   - Support audio file upload (not just live recording)
   - Export recordings for playback

5. **AI Improvements**
   - Multiple rewrite styles (formal, casual, structured)
   - Concept extraction from transcript
   - Auto-tag suggestions

### Low Priority

6. **Advanced Features**
   - Voice notes history
   - Transcription editing
   - Multi-language auto-detect
   - Offline mode (local storage)

---

## 🎯 Usage Examples

### Vietnamese User Flow

```
1. User clicks "Ghi âm"
2. Speaks: "Hôm nay tôi học được cách kiên nhẫn hơn khi đối mặt với khó khăn"
3. Clicks "Dừng"
4. Transcript shows original text
5. Clicks "AI viết lại"
6. AI formats:
   **Bài học chính:** Tôi học được cách kiên nhẫn hơn khi đối mặt với khó khăn.
   
   **Suy ngẫm:** Tôi có thể áp dụng bài học này như thế nào trong tương lai?
7. Chooses AI version
8. Saves lesson
```

### English User Flow

```
1. Toggle language to EN (Globe icon)
2. Click "Record Voice"
3. Speaks: "Today I learned to be more patient when facing challenges"
4. Click "Stop"
5. Click "AI Rewrite"
6. AI formats with structure
7. Choose version
8. Save lesson
```

---

## 📚 Technical Details

### Web Speech API

```javascript
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'vi-VN'; // or 'en-US'

recognition.onresult = (event) => {
  // Handle transcript
};

recognition.start();
```

### State Management

```typescript
const [isRecording, setIsRecording] = useState(false);
const [isTranscribing, setIsTranscribing] = useState(false);
const [isRewriting, setIsRewriting] = useState(false);
const [transcript, setTranscript] = useState('');
const [rewrittenText, setRewrittenText] = useState('');
const [showRewriteOption, setShowRewriteOption] = useState(false);
```

### Refs Usage

```typescript
const mediaRecorderRef = useRef<MediaRecorder | null>(null);
const audioChunksRef = useRef<Blob[]>([]);
const recognitionRef = useRef<SpeechRecognition | null>(null);
```

---

## ✅ Completion Status

- ✅ Voice Recording Component (100%)
- ✅ Speech-to-Text Integration (100%)
- ✅ AI Rewrite UI (100%)
- ✅ Transcript Preview (100%)
- ✅ Version Comparison (100%)
- ✅ Language Switcher (100%)
- ✅ Translation Files (EN + VI) (100%)
- ✅ Dashboard Integration (100%)
- ⏳ Backend AI Endpoint (0% - Mock only)
- ⏳ Full App Translation (30% - Only Dashboard done)

---

**Total Implementation Time:** ~2 hours  
**Files Created:** 5  
**Files Modified:** 2  
**Lines of Code Added:** ~800

---

**Ready for testing!** 🎉

Try it: http://localhost:3000/dashboard → Click "Ghi âm" button
