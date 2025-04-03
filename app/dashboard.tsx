import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { router } from 'expo-router';
import { RootState } from '../redux/store';
import {
  fetchTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  setSearchQuery,
  setFilter,
  Todo,
} from '../redux/todoSlice';
import { logout } from '../redux/authSlice';
import { AppDispatch } from '../redux/store';

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, searchQuery, filter } = useSelector(
    (state: RootState) => state.todos
  );
  const [newTodoTitle, setNewTodoTitle] = useState('');

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleAddTodo = () => {
    if (newTodoTitle.trim()) {
      dispatch(
        addTodo({
          title: newTodoTitle,
          completed: false,
          userId: 1,
        })
      );
      setNewTodoTitle('');
    }
  };

  const handleToggleTodo = (todo: Todo) => {
    dispatch(
      updateTodo({
        ...todo,
        completed: !todo.completed,
      })
    );
  };

  const handleDeleteTodo = (id: number) => {
    Alert.alert(
      'Delete Todo',
      'Are you sure you want to delete this todo?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => dispatch(deleteTodo(id)),
          style: 'destructive',
        },
      ]
    );
  };

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/');
  };

  const filteredTodos = items
    .filter((todo: Todo) =>
      todo.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((todo: Todo) => {
      if (filter === 'completed') return todo.completed;
      if (filter === 'incomplete') return !todo.completed;
      return true;
    });

  const renderItem = ({ item }: { item: Todo }) => (
    <View style={styles.todoItem}>
      <TouchableOpacity
        style={styles.todoCheckbox}
        onPress={() => handleToggleTodo(item)}
      >
        <Text>{item.completed ? '✓' : '○'}</Text>
      </TouchableOpacity>
      <Text
        style={[
          styles.todoTitle,
          item.completed && styles.completedTodo,
        ]}
      >
        {item.title}
      </Text>
      <TouchableOpacity
        onPress={() => handleDeleteTodo(item.id)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search todos..."
          value={searchQuery}
          onChangeText={(text) => dispatch(setSearchQuery(text))}
        />
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
          onPress={() => dispatch(setFilter('all'))}
        >
          <Text>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'completed' && styles.activeFilter,
          ]}
          onPress={() => dispatch(setFilter('completed'))}
        >
          <Text>Completed</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'incomplete' && styles.activeFilter,
          ]}
          onPress={() => dispatch(setFilter('incomplete'))}
        >
          <Text>Incomplete</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.addTodoContainer}>
        <TextInput
          style={styles.addTodoInput}
          placeholder="Add a new todo..."
          value={newTodoTitle}
          onChangeText={setNewTodoTitle}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddTodo}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {status === 'loading' ? (
        <Text style={styles.statusText}>Loading...</Text>
      ) : (
        <FlatList
          data={filteredTodos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    padding: 10,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  filterButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activeFilter: {
    backgroundColor: '#007AFF',
  },
  addTodoContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  addTodoInput: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addButton: {
    backgroundColor: '#34c759',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  todoItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  todoCheckbox: {
    marginRight: 10,
  },
  todoTitle: {
    flex: 1,
  },
  completedTodo: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
    padding: 8,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 12,
  },
  statusText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});
