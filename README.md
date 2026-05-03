# MiniLMS - Advanced Learning Management Mobile App

A high-polish, production-grade Learning Management System (LMS) built with **React Native Expo**, demonstrating proficiency in native features, sophisticated WebView integration, and robust state management.

## 🚀 Key Features

### 1. Course Discovery & Catalog
- **Smart Catalog**: Browse a wide range of courses with optimized lists using `@legendapp/list`.
- **Search & Filter**: Real-time search and category filtering for a seamless discovery experience.
- **Pull-to-Refresh**: Easily refresh the catalog to get the latest course offerings.
- **Persistent Bookmarks**: Save courses for later with local persistence using **MMKV**.

### 2. Premium User Experience
- **Tailwind Styling**: Modern, clean, and responsive UI built with **Nativewind (Tailwind CSS)**.
- **Animated Navigation**: Custom animated tab bar using **Reanimated** for a premium look and feel.
- **Dynamic Orientation**: Full support for both **Portrait and Landscape** modes across all screens.
- **Offline Mode**: Real-time connectivity detection with a global offline banner and network-aware API logic.

### 3. Native Integrations
- **Profile Image Picker**: Update your profile avatar using `expo-image-picker`.
- **Engagement Notifications**: 
  - **Milestones**: Automatic local notification when reaching 5+ bookmarks.
  - **Inactivity Reminders**: Scheduled 24-hour reminder to keep users engaged.
  - **Action Alerts**: Immediate feedback for profile updates and course enrollments.
- **Secure Authentication**: Encrypted token management using **Expo SecureStore**.

### 4. Advanced WebView Portal
- **Enrolment System**: Dedicated WebView portal for course content and enrolment.
- **Two-Way Communication**: Native-to-Web communication via custom headers and Web-to-Native communication via `postMessage`.
- **Dynamic Sync**: Enrollment actions in the WebView instantly update the native profile statistics.

---

## 🛠 Tech Stack

| Category | Library |
|---|---|
| **Framework** | [Expo](https://expo.dev/) (SDK 54) |
| **Styling** | [Nativewind](https://www.nativewind.dev/) (Tailwind CSS) |
| **State Management** | [Zustand](https://github.com/pmndrs/zustand) |
| **Persistence** | [MMKV](https://github.com/mrousavy/react-native-mmkv) |
| **Secure Storage** | [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/) |
| **Animations** | [Reanimated 3](https://docs.swmansion.com/react-native-reanimated/) |
| **Data Fetching** | [Axios](https://axios-http.com/) + [React Query](https://tanstack.com/query) |
| **i18n** | [i18next](https://www.i18next.com/) (English & Hindi support) |

---

## 🏗 Project Architecture

```
├── src/
│   ├── api/                  # Axios client, Query hooks, and API interceptors
│   ├── components/           # Reusable UI components (Typography, Button, BottomAlert)
│   ├── hooks/                # Custom hooks (Notifications, AppState, Offline detection)
│   ├── localization/         # i18n configuration and JSON translations (EN/HI)
│   ├── store/                # Zustand stores with MMKV persistence
│   ├── theme/                # Design system tokens (Colors, Fonts)
│   └── utils/                # Utility functions and toast configurations
├── app/                      # Expo Router (file-based routing)
│   ├── (auth)/               # Login & Registration flow
│   ├── (tabs)/               # Main application navigation
│   └── portal/               # WebView course portal
```

---

## 🛠 Getting Started

### Prerequisites
- Node.js ≥ 20
- Yarn v1
- Expo Go (or development build)

### Installation
1. **Clone and Install**:
   ```bash
   git clone <repository-url>
   cd OmProject
   yarn install
   ```

2. **Environment Setup**:
   Create a `.env.development` file based on `.env.example` and add your API base URL:
   ```bash
   EXPO_PUBLIC_API_URL=https://api.freeapi.app/api/v1
   ```

3. **Run the App**:
   ```bash
   yarn ios      # Run on iOS Simulator
   yarn android  # Run on Android Emulator
   ```

---

## 🏆 Assignment Highlights

- **Custom BottomAlert**: A premium, Tailwind-styled logout confirmation sheet built from scratch using Native Modal.
- **Performance Optimized**: Usage of `@legendapp/list` ensures buttery-smooth scrolling even with large course catalogs.
- **Crash-Resistant**: Implemented permanent patches for `react-native-mmkv` and fixed Android-specific Firebase initialization issues.
- **Deep Localization**: Full bilingual support (English/Hindi) covering every user-facing string, including notifications.

---

## 👨‍💻 Author
**Om Shankar Shah**

## 📄 License
Private Assignment Submission.
