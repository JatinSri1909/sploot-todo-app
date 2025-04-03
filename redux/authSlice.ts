import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: {
    username: string;
    email: string;
  } | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  user: null,
};

// Load initial state from AsyncStorage
const loadAuthState = async () => {
  try {
    const authState = await AsyncStorage.getItem('auth');
    return authState ? JSON.parse(authState) : initialState;
  } catch (error) {
    console.error('Error loading auth state:', error);
    return initialState;
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        username: string;
        email: string;
        token: string;
      }>
    ) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = {
        username: action.payload.username,
        email: action.payload.email,
      };
      // Save to AsyncStorage
      AsyncStorage.setItem('auth', JSON.stringify(state)).catch((error) =>
        console.error('Error saving auth state:', error)
      );
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      // Remove from AsyncStorage
      AsyncStorage.removeItem('auth').catch((error) =>
        console.error('Error removing auth state:', error)
      );
    },
    // Initialize state from AsyncStorage
    initializeAuth: (state, action: PayloadAction<AuthState>) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
  },
});

export const { login, logout, initializeAuth } = authSlice.actions;

// Initialize auth state from AsyncStorage
export const initializeAuthState = () => async (dispatch: any) => {
  const authState = await loadAuthState();
  dispatch(initializeAuth(authState));
};

export default authSlice.reducer; 