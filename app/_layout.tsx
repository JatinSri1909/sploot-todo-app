import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from '../redux/store';
import { initializeAuthState } from '../redux/authSlice';
import type { RootState, AppDispatch } from '../redux/store';

function RootLayoutNav() {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    dispatch(initializeAuthState());
  }, [dispatch]);

  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Login',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="dashboard" 
        options={{ 
          title: 'Todo List',
          headerShown: true,
          headerBackVisible: false,
        }} 
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutNav />
    </Provider>
  );
}
