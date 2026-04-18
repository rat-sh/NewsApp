# React Native News App

A clean, production-ready React Native application built to demonstrate core mobile development principles including API integration, state management, offline persistence, and performance optimization.

## 📱 App Functionality

- **Home Feed**: Displays top headlines across various categories (Top, Tech, Sports, etc.) pulled from a public News API.
- **Search**: Real-time debounced search to find articles on any topic.
- **Offline Bookmarks**: Users can save articles. Bookmarks are persisted locally and survive app restarts.
- **Dynamic Theming**: Full Light and Dark mode support that applies globally across the app.
- **App Lifecycle Handling**: The app actively monitors background/foreground states. If the app is brought to the foreground and the news feed is older than 5 minutes, it automatically silently refreshes the data.

## 🚀 How to Run the Project

### Prerequisites
- Node.js (v18+)
- Java JDK 17
- Android Studio / Android SDK
- Ruby & CocoaPods (for iOS)
- Bun (or npm/yarn)

### Installation

1. **Clone the repository and install dependencies:**
   ```bash
   git clone https://github.com/rat-sh/NewsApp.git
   cd NewsApp
   bun install
   ```

2. **Add your API Key:**
   Create a `.env` file in the root directory and add your NewsAPI key:
   ```
   NEWS_API_KEY=your_api_key_here
   ```

3. **Run on Android:**
   ```bash
   bun run android
   ```

4. **Run on iOS:**
   ```bash
   cd ios && pod install && cd ..
   bun run ios
   ```

## 🛠️ Key Technical Decisions

- **React Native CLI (No Expo)**: Used bare React Native to maintain full control over native modules and build pipelines.
- **State Management (Redux Toolkit)**: Chose Redux Toolkit for predictable state transitions, combined with `createAsyncThunk` for organized API data fetching.
- **Offline Persistence**: Used `react-native-mmkv` combined with `redux-persist`. MMKV was chosen over AsyncStorage because it uses JNI directly, making it significantly faster and synchronous for restoring the app state instantly on boot.
- **Performance Optimizations**: 
  - `FlatList` components are heavily optimized using `removeClippedSubviews`, `maxToRenderPerBatch`, `windowSize`, and `initialNumToRender`.
  - List items (`ArticleCard`) are wrapped in `React.memo` to prevent unnecessary re-renders during scrolling.
  - Search queries are debounced to prevent API rate-limiting.
- **Custom UI (No 3rd Party Libraries)**: All UI components (Tabs, Cards, Search Bars) were built completely from scratch using core React Native primitives (`View`, `Text`, `Animated`, `StyleSheet`) to keep the bundle size small and demonstrate layout proficiency.

## 🔮 Improvements with More Time

If I had more time, I would consider implementing:
1. **Network Resilience**: Adding a reliable offline mode (e.g., using `react-native-offline`) to cache recent API payloads so users can read the latest loaded headlines even in airplane mode.
2. **E2E Testing**: Adding End-to-End tests using Detox to programmatically verify critical flows like searching and bookmarking.
3. **Animations**: Incorporating `react-native-reanimated` for 60fps gesture-driven animations (e.g., swipe-to-delete for bookmarks).
4. **Deep Linking**: Setting up deep links so users can share an article via URL and the app automatically routes to the `ArticleDetail` screen upon opening.
