import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

interface TodoState {
  items: Todo[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  searchQuery: string;
  filter: 'all' | 'completed' | 'incomplete';
}

const initialState: TodoState = {
  items: [],
  status: 'idle',
  error: null,
  searchQuery: '',
  filter: 'all',
};

// Load todos from AsyncStorage
const loadTodosFromStorage = async () => {
  try {
    const todosString = await AsyncStorage.getItem('todos');
    return todosString ? JSON.parse(todosString) : [];
  } catch (error) {
    console.error('Error loading todos from storage:', error);
    return [];
  }
};

// Save todos to AsyncStorage
const saveTodosToStorage = async (todos: Todo[]) => {
  try {
    await AsyncStorage.setItem('todos', JSON.stringify(todos));
  } catch (error) {
    console.error('Error saving todos to storage:', error);
  }
};

// Async thunks
export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  // First try to load from storage
  const storedTodos = await loadTodosFromStorage();
  if (storedTodos.length > 0) {
    return storedTodos;
  }

  // If no stored todos, fetch from API
  const response = await fetch('https://jsonplaceholder.typicode.com/todos');
  const data = await response.json();
  
  // Filter to get only first 10 todos and modify titles to be more meaningful in English
  const englishTodos = data.slice(0, 10).map((todo: Todo) => ({
    ...todo,
    title: [
      'Complete project documentation',
      'Review code changes',
      'Update dependencies',
      'Write unit tests',
      'Fix UI bugs',
      'Implement new feature',
      'Optimize database queries',
      'Setup CI/CD pipeline',
      'Create user documentation',
      'Deploy to production'
    ][todo.id % 10],
  }));

  // Save fetched todos to storage
  await saveTodosToStorage(englishTodos);
  return englishTodos;
});

export const addTodo = createAsyncThunk('todos/addTodo', async (todo: Omit<Todo, 'id'>) => {
  const storedTodos = await loadTodosFromStorage();
  const newTodo = {
    ...todo,
    id: Date.now(), // Generate unique ID
  };
  const updatedTodos = [...storedTodos, newTodo];
  await saveTodosToStorage(updatedTodos);
  return newTodo;
});

export const updateTodo = createAsyncThunk(
  'todos/updateTodo',
  async (todo: Todo) => {
    const storedTodos = await loadTodosFromStorage();
    const updatedTodos = storedTodos.map((t: Todo) =>
      t.id === todo.id ? todo : t
    );
    await saveTodosToStorage(updatedTodos);
    return todo;
  }
);

export const deleteTodo = createAsyncThunk(
  'todos/deleteTodo',
  async (id: number) => {
    const storedTodos = await loadTodosFromStorage();
    const updatedTodos = storedTodos.filter((todo: Todo) => todo.id !== id);
    await saveTodosToStorage(updatedTodos);
    return id;
  }
);

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilter: (state, action: PayloadAction<'all' | 'completed' | 'incomplete'>) => {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch todos';
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        const index = state.items.findIndex((todo) => todo.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.items = state.items.filter((todo) => todo.id !== action.payload);
      });
  },
});

export const { setSearchQuery, setFilter } = todoSlice.actions;
export default todoSlice.reducer; 