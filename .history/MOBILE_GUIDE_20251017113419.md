# 📱 Mobile App Scaffold - TODO Guide

> **Status**: Scaffold structure ready, implementation TODO in Phase 2

## 🎯 Mục tiêu Mobile App

Life Lessons mobile app (React Native + Expo) với:
- Quick Capture với voice input
- Offline-first với SQLite
- Sync với backend API
- Push notifications
- Native sharing

## 🏗️ Cấu trúc dự kiến

```
apps/mobile/ (Expo)
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx           # Dashboard/Home
│   │   ├── journal.tsx         # Journal list
│   │   ├── goals.tsx           # Goals view
│   │   └── settings.tsx        # Settings
│   ├── lesson/
│   │   └── [id].tsx            # Lesson detail
│   ├── _layout.tsx             # Root layout
│   └── +not-found.tsx
├── components/
│   ├── QuickCapture.tsx        # Voice + text input
│   ├── LessonCard.tsx          # List item
│   ├── ProgressRing.tsx        # SVG circle
│   └── Heatmap.tsx             # Calendar view
├── lib/
│   ├── api.ts                  # API client
│   ├── db.ts                   # SQLite setup
│   ├── sync.ts                 # Offline sync logic
│   └── notifications.ts        # Push setup
├── store/
│   └── lessons.ts              # Zustand store
├── app.json                    # Expo config
└── package.json
```

## 📦 Dependencies cần cài

```json
{
  "dependencies": {
    "expo": "~50.0.0",
    "expo-router": "~3.4.0",
    "expo-sqlite": "~13.0.0",
    "expo-notifications": "~0.27.0",
    "expo-av": "~13.10.0",
    "expo-file-system": "~16.0.0",
    "react-native-gesture-handler": "~2.14.0",
    "react-native-reanimated": "~3.6.0",
    "@tanstack/react-query": "^5.0.0",
    "zustand": "^4.4.0",
    "axios": "^1.6.0",
    "date-fns": "^3.0.0"
  }
}
```

## 🚀 Setup Commands (TODO)

```bash
# Tạo Expo project
cd apps
npx create-expo-app@latest mobile --template tabs

# Cài dependencies
cd mobile
pnpm install

# Start development
pnpm start

# Run on iOS simulator
pnpm ios

# Run on Android emulator
pnpm android
```

## 📱 Features Phase-by-Phase

### Phase 1: Basic Structure (2-3 days)
- [ ] Expo Router setup (tabs navigation)
- [ ] Auth flow (login/signup screens)
- [ ] API client (axios với token storage)
- [ ] Basic styling (Tailwind RN hoặc NativeWind)

### Phase 2: Core Features (1 week)
- [ ] Dashboard với Quick Capture
- [ ] Journal list (FlatList với pagination)
- [ ] Lesson detail view
- [ ] Create/Edit lesson form
- [ ] Goals progress view

### Phase 3: Offline Support (3-4 days)
- [ ] SQLite setup (expo-sqlite)
- [ ] Offline storage schema
- [ ] Sync queue (pending actions)
- [ ] Conflict resolution strategy
- [ ] Background sync trigger

### Phase 4: Advanced Features (1 week)
- [ ] Voice recording (expo-av)
- [ ] Voice-to-text (cloud service)
- [ ] Push notifications setup
- [ ] Local notifications (reminders)
- [ ] File attachments (images)

### Phase 5: Polish (2-3 days)
- [ ] Loading skeletons
- [ ] Pull-to-refresh
- [ ] Haptic feedback
- [ ] Dark mode
- [ ] Error boundaries

## 🗄️ Offline Database Schema (SQLite)

```sql
-- Lessons table (local copy)
CREATE TABLE lessons (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  content_raw TEXT NOT NULL,
  content_summary TEXT,
  domain TEXT NOT NULL,
  mood INTEGER,
  resonance INTEGER,
  tags TEXT, -- JSON array
  created_at TEXT,
  updated_at TEXT,
  synced INTEGER DEFAULT 0,
  deleted INTEGER DEFAULT 0
);

-- Sync queue
CREATE TABLE sync_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  action TEXT NOT NULL, -- 'create' | 'update' | 'delete'
  entity TEXT NOT NULL, -- 'lesson' | 'goal'
  entity_id TEXT NOT NULL,
  payload TEXT, -- JSON
  created_at TEXT,
  status TEXT DEFAULT 'pending' -- 'pending' | 'syncing' | 'done' | 'error'
);

-- User settings (cached)
CREATE TABLE user_settings (
  key TEXT PRIMARY KEY,
  value TEXT
);
```

## 🔄 Sync Strategy

### Upload (Device → Server)
1. Check network connectivity
2. Get pending actions from `sync_queue`
3. For each action:
   - Try API call
   - On success: mark as 'done', update local lesson
   - On error: mark as 'error', retry later
4. Clean up old 'done' records

### Download (Server → Device)
1. Get last sync timestamp
2. Fetch lessons modified since last sync
3. Merge with local database:
   - Server version wins (unless editing now)
   - Mark as synced
4. Update last sync timestamp

### Conflict Resolution
- **Simple approach** (v1): Server wins
- **Advanced** (v1.1): 
  - Show conflict UI
  - Let user choose which version
  - Or auto-merge (prefer newer)

## 📲 Push Notifications Setup

### Expo Notifications
```typescript
// lib/notifications.ts
import * as Notifications from 'expo-notifications';

export async function registerForPushNotifications() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return null;
  }

  const token = await Notifications.getExpoPushTokenAsync();
  return token.data;
}

// Send token to backend
export async function savePushToken(token: string) {
  await api.post('/me/push-token', { token });
}
```

### Backend Integration (TODO)
```typescript
// apps/api/src/users/users.service.ts
async updatePushToken(userId: string, token: string) {
  return this.prisma.user.update({
    where: { id: userId },
    data: { pushToken: token }
  });
}
```

## 🎤 Voice Recording

### Expo AV Setup
```typescript
// components/QuickCapture.tsx
import { Audio } from 'expo-av';

const [recording, setRecording] = useState<Audio.Recording>();

async function startRecording() {
  await Audio.requestPermissionsAsync();
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
  });

  const { recording } = await Audio.Recording.createAsync(
    Audio.RecordingOptionsPresets.HIGH_QUALITY
  );
  setRecording(recording);
}

async function stopRecording() {
  await recording.stopAndUnloadAsync();
  const uri = recording.getURI();
  
  // TODO: Send to speech-to-text API
  // Or use local Whisper model
}
```

## 🔐 Auth Token Storage

```typescript
// lib/storage.ts
import * as SecureStore from 'expo-secure-store';

export async function saveToken(token: string) {
  await SecureStore.setItemAsync('access_token', token);
}

export async function getToken() {
  return await SecureStore.getItemAsync('access_token');
}

export async function deleteToken() {
  await SecureStore.deleteItemAsync('access_token');
}
```

## 🎨 UI Framework Options

### Option 1: NativeWind (Tailwind for RN)
```bash
pnpm add nativewind
pnpm add -D tailwindcss
```

**Pros**: Familiar Tailwind syntax
**Cons**: Limited native component support

### Option 2: React Native Paper
```bash
pnpm add react-native-paper react-native-vector-icons
```

**Pros**: Material Design, many components
**Cons**: Heavier bundle

### Option 3: React Native Elements
```bash
pnpm add @rneui/themed @rneui/base
```

**Pros**: Lightweight, customizable
**Cons**: Less polished than Paper

**Recommendation**: NativeWind + shadcn-style custom components

## 📊 State Management

### Zustand Store
```typescript
// store/lessons.ts
import { create } from 'zustand';

interface LessonsState {
  lessons: Lesson[];
  loading: boolean;
  fetchLessons: () => Promise<void>;
  addLesson: (lesson: Lesson) => void;
  updateLesson: (id: string, updates: Partial<Lesson>) => void;
  deleteLesson: (id: string) => void;
}

export const useLessonsStore = create<LessonsState>((set, get) => ({
  lessons: [],
  loading: false,
  
  fetchLessons: async () => {
    set({ loading: true });
    const lessons = await api.get('/lessons');
    set({ lessons, loading: false });
  },
  
  addLesson: (lesson) => {
    set((state) => ({ lessons: [lesson, ...state.lessons] }));
  },
  
  updateLesson: (id, updates) => {
    set((state) => ({
      lessons: state.lessons.map((l) => 
        l.id === id ? { ...l, ...updates } : l
      )
    }));
  },
  
  deleteLesson: (id) => {
    set((state) => ({
      lessons: state.lessons.filter((l) => l.id !== id)
    }));
  },
}));
```

## 🧪 Testing Strategy

### Unit Tests
```bash
pnpm add -D @testing-library/react-native jest
```

Test:
- Sync logic
- API client
- Store actions
- Utility functions

### E2E Tests
```bash
pnpm add -D detox
```

Test:
- Auth flow
- Create lesson flow
- Offline sync
- Push notifications

## 📈 Performance Optimization

- [ ] FlatList with `getItemLayout` for 60fps scroll
- [ ] Image optimization (`expo-image`)
- [ ] Lazy load heavy components
- [ ] Debounce sync triggers
- [ ] SQLite indexing on `created_at`, `synced`
- [ ] Background fetch for periodic sync

## 🚀 Build & Deploy

### Development Build
```bash
# iOS
eas build --profile development --platform ios

# Android
eas build --profile development --platform android
```

### Production Release
```bash
# iOS TestFlight
eas build --profile production --platform ios
eas submit -p ios

# Android Play Store
eas build --profile production --platform android
eas submit -p android
```

## 📱 Device Permissions

```json
// app.json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSMicrophoneUsageDescription": "Ghi âm bài học bằng giọng nói",
        "NSCameraUsageDescription": "Chụp ảnh đính kèm bài học",
        "NSPhotoLibraryUsageDescription": "Chọn ảnh từ thư viện"
      }
    },
    "android": {
      "permissions": [
        "android.permission.RECORD_AUDIO",
        "android.permission.CAMERA",
        "android.permission.READ_EXTERNAL_STORAGE"
      ]
    }
  }
}
```

## 🎯 MVP Mobile Checklist

### Must-Have (v1.0)
- [ ] Auth (login/signup)
- [ ] Quick Capture (text only)
- [ ] Journal list & detail
- [ ] Basic offline storage
- [ ] Manual sync button

### Nice-to-Have (v1.1)
- [ ] Voice recording
- [ ] Auto sync
- [ ] Push notifications
- [ ] Camera capture
- [ ] Share to app

### Future (v2.0)
- [ ] Widgets
- [ ] Apple Watch app
- [ ] Siri shortcuts
- [ ] iCloud/Google Drive backup

## 🔗 Resources

- [Expo Docs](https://docs.expo.dev/)
- [React Native](https://reactnative.dev/)
- [Expo Router](https://expo.github.io/router/)
- [SQLite Tutorial](https://www.sqlitetutorial.net/)
- [Push Notifications Guide](https://docs.expo.dev/push-notifications/overview/)

---

## 🚧 Current Status

**Mobile app is NOT yet implemented.** This document serves as:
1. Planning guide for Phase 2
2. Architecture reference
3. Technology decisions

**Estimated effort**: 3-4 weeks full-time development

**Next action when ready**:
```bash
cd apps
npx create-expo-app@latest mobile --template tabs
# Then follow this guide step-by-step
```

---

**Related docs**:
- [NEXT_STEPS.md](../NEXT_STEPS.md) - Overall roadmap
- [PROGRESS.md](../PROGRESS.md) - Current status
