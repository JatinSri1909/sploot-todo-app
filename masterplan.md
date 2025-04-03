# React Native Todo App - Master Plan

## 📌 Overview
This project is a **React Native Todo App** built with **TypeScript**, **Redux Toolkit**, and **Expo**. The app includes **mock authentication**, full **CRUD functionality**, **state management**, **custom hooks**, and **persisted data storage** using AsyncStorage.

## 🎯 Objectives
- Implement **mock authentication** with hardcoded credentials
- Fetch and manage todos from **JSONPlaceholder API**
- Provide full **CRUD operations** (Create, Read, Update, Delete)
- Implement **search and filter** functionalities
- Maintain **global state** using **Redux Toolkit**
- Persist authentication and todos using **AsyncStorage**
- Ensure proper **form validation** and **error handling**
- Implement a **responsive UI** using React Native Paper (or custom styling)

---

## 👥 Target Audience
- React Native developers looking to practice **state management** and **API integration**
- Users who need a simple cross-platform todo management app
- Hiring managers assessing a candidate's **React Native, Redux, and TypeScript** skills

---

## 🏗️ Features & Functionality

### **1️⃣ Authentication**
- Login with **hardcoded credentials**
- Store a **mock auth token** in AsyncStorage
- Redirect users to the **dashboard** upon successful login
- Logout functionality to clear user session

### **2️⃣ Todo Management**
- Fetch **todos** from [JSONPlaceholder API](https://jsonplaceholder.typicode.com/todos)
- Display todos in a **card-based UI**
- **Create new todos** via a form with input validation
- **Edit existing todos** (update title/completion status)
- **Delete todos** with a confirmation prompt
- Implement **filtering** (e.g., show only completed/incomplete todos)
- Implement **search functionality** (use a custom hook for debouncing)

### **3️⃣ State Management (Redux Toolkit)**
- `authSlice` → Manages authentication state
- `todoSlice` → Handles fetching, adding, updating, and deleting todos

### **4️⃣ UI/UX Considerations**
- **React Native Paper** for prebuilt components (or custom styling with StyleSheet)
- Smooth **animations and transitions** for better UX
- Responsive layout for different screen sizes

---

## 🔧 Tech Stack
- **Frontend Framework:** React Native (Expo)
- **State Management:** Redux Toolkit
- **Language:** TypeScript
- **Navigation:** React Navigation (Stack Navigator)
- **Storage:** AsyncStorage (for persisting auth & todos)
- **API Integration:** JSONPlaceholder API
- **UI Library:** React Native Paper (or custom styles)

---

## 📂 Project Structure
```
📦 sploot-todo-app
 ┣ 📂 app                       // Expo Router pages
 ┃ ┣ 📄 _layout.tsx             // Navigation container
 ┃ ┣ 📄 index.tsx               // Entry point/Login
 ┃ ┣ 📄 dashboard.tsx           // Dashboard screen
 ┃ ┣ 📄 todo/[id].tsx           // Todo details with dynamic route
 ┣ 📂 components                // Reusable UI components
 ┣ 📂 hooks                     // Custom hooks
 ┣ 📂 redux                     // State management
 ┃ ┣ 📄 store.ts
 ┃ ┣ 📄 authSlice.ts
 ┃ ┣ 📄 todoSlice.ts
 ┣ 📂 utils                     // Helper functions
 ┣ 📄 package.json
 ┣ 📄 README.md
```

---

## 🔐 Security Considerations
- Protect sensitive data by using **AsyncStorage securely**
- Implement **error handling** for API failures
- Prevent unauthenticated access to protected screens

---

## 🚀 Development Phases
### **Phase 1: Authentication**
- Implement **LoginScreen** with hardcoded credentials
- Store & retrieve auth token using **AsyncStorage**
- Implement **Redux store** for authentication state

### **Phase 2: Todo Management**
- Fetch todos from API and display them
- Implement **Redux store** for managing todos
- Implement **Create/Edit/Delete** functionality
- Add **form validation** for todo input

### **Phase 3: Additional Features & UI Enhancements**
- Implement **search (debounced)** and **filtering by status**
- Enhance UI using **React Native Paper**
- Implement **logout functionality**
- Persist todos and auth state using **AsyncStorage**

---

## 🚧 Potential Challenges & Solutions
| Challenge | Solution |
|-----------|----------|
| API rate limits on JSONPlaceholder | Implement caching with AsyncStorage |
| Redux boilerplate complexity | Use Redux Toolkit for simplified state management |
| Performance issues with large todo lists | Implement pagination or virtualized lists |
| Managing async state updates | Use custom hooks and Redux middleware |

---