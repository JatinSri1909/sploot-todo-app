# React Native Todo App

A modern, feature-rich Todo application built with React Native, Expo, TypeScript, and Redux Toolkit. The app includes authentication, persistent storage, and a beautiful card-based UI for managing your tasks.

## Features

- 🔐 User Authentication (Mock)
- 📝 CRUD operations for todos
- 🔍 Search and filter functionality with debouncing
- 💾 Persistent storage using AsyncStorage
- 🎨 Modern, card-based UI design
- 🔄 State management with Redux Toolkit
- 📱 Cross-platform (iOS & Android)
- 🎣 Custom hooks for API calls and debouncing

## Custom Hooks

The application uses several custom hooks to enhance functionality and maintain clean code:

### useDebounce
- Implements debouncing for search functionality
- Prevents excessive API calls while typing
- Customizable delay parameter

### useApi
- Generic hook for handling API calls
- Manages loading and error states
- Provides type-safe response handling
- Includes success and error callbacks

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or newer)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [iOS Simulator](https://docs.expo.dev/workflow/ios-simulator/) (for Mac users)
- [Android Studio and Android SDK](https://docs.expo.dev/workflow/android-studio-emulator/) (for Android development)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd sploot-todo-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the App

1. Start the development server:
   ```bash
   npx expo start
   ```

2. Run on specific platforms:
   - Press `i` to run on iOS Simulator
   - Press `a` to run on Android Emulator
   - Scan the QR code with Expo Go app on your physical device

## Development Build

To create a development build:

```bash
npx expo prebuild
```

Then run on your preferred platform:

```bash
# For iOS
npx expo run:ios

# For Android
npx expo run:android
```

## Testing Credentials

Use these credentials to log in to the app:
- Username: `user`
- Password: `password`

## Project Structure

```
📦 sploot-todo-app
 ┣ 📂 app                  # Main application screens
 ┣ 📂 hooks               # Custom React hooks
 ┣ 📂 redux               # Redux store and slices
```

## Key Features Implementation

### Authentication
- Mock authentication system with hardcoded credentials
- Persistent login state using AsyncStorage
- Protected routes for authenticated users

### Todo Management
- Create, read, update, and delete todos
- Search todos by title
- Filter todos by completion status
- Persistent storage of todos
- Card-based UI with smooth animations

### State Management
- Centralized state management with Redux Toolkit
- Async operations using Redux Thunks
- Type-safe state with TypeScript

## Troubleshooting

1. If you encounter build issues:
   ```bash
   npm cache clean --force
   rm -rf node_modules
   npm install
   ```

2. For iOS build issues:
   ```bash
   cd ios
   pod install
   cd ..
   ```

3. For Android build issues:
   - Ensure Android SDK is properly configured
   - Check that ANDROID_HOME environment variable is set

## Performance Considerations

- Memoized components for optimal rendering
- Debounced search functionality
- Efficient state updates with Redux Toolkit
- AsyncStorage for persistent data

## Future Improvements

- [ ] Add real authentication backend
- [ ] Implement data synchronization
- [ ] Add due dates and priorities for todos
- [ ] Include push notifications
- [ ] Add offline support
- [ ] Implement data backup

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
