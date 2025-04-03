import React, { useEffect, useState, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
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
import { useDebounce } from '../hooks/useDebounce';
import { useApi } from '../hooks/useApi';

interface TodoFormData {
  title: string;
  completed: boolean;
}

const TodoFormModal = memo(({ 
  visible, 
  onClose, 
  onSubmit, 
  title,
  initialData,
}: { 
  visible: boolean; 
  onClose: () => void; 
  onSubmit: (data: TodoFormData) => void; 
  title: string;
  initialData: TodoFormData;
}) => {
  const [localFormData, setLocalFormData] = useState(initialData);

  useEffect(() => {
    setLocalFormData(initialData);
  }, [initialData]);

  const handleSubmit = () => {
    onSubmit(localFormData);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Todo title"
            value={localFormData.title}
            onChangeText={(text) => setLocalFormData({ ...localFormData, title: text })}
          />
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setLocalFormData({ ...localFormData, completed: !localFormData.completed })}
          >
            <View style={[styles.checkbox, localFormData.completed && styles.checked]}>
              {localFormData.completed && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>Completed</Text>
          </TouchableOpacity>
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButton, !localFormData.title.trim() && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={!localFormData.title.trim()}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
});

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, searchQuery, filter } = useSelector(
    (state: RootState) => state.todos
  );
  
  // Use debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Use API hook for todo operations
  const addTodoApi = useApi<Todo>();
  const updateTodoApi = useApi<Todo>();
  const deleteTodoApi = useApi<number>();
  
  // Modal states
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [formData, setFormData] = useState<TodoFormData>({
    title: '',
    completed: false,
  });

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  useEffect(() => {
    // Update search when debounced value changes
    dispatch(setSearchQuery(debouncedSearchQuery));
  }, [debouncedSearchQuery, dispatch]);

  const handleAddTodo = async (data: TodoFormData) => {
    if (data.title.trim()) {
      try {
        await dispatch(
          addTodo({
            title: data.title,
            completed: data.completed,
            userId: 1,
          })
        ).unwrap();
        dispatch(fetchTodos());
        setFormData({ title: '', completed: false });
        setIsAddModalVisible(false);
      } catch (error) {
        Alert.alert('Error', 'Failed to add todo. Please try again.');
      }
    }
  };

  const handleEditTodo = async (data: TodoFormData) => {
    if (selectedTodo && data.title.trim()) {
      try {
        await dispatch(
          updateTodo({
            ...selectedTodo,
            title: data.title,
            completed: data.completed,
          })
        ).unwrap();
        dispatch(fetchTodos());
        setSelectedTodo(null);
        setFormData({ title: '', completed: false });
        setIsEditModalVisible(false);
      } catch (error) {
        Alert.alert('Error', 'Failed to update todo. Please try again.');
      }
    }
  };

  const handleDeleteTodo = async (id: number) => {
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
          onPress: async () => {
            try {
              await dispatch(deleteTodo(id)).unwrap();
              dispatch(fetchTodos());
            } catch (error) {
              Alert.alert('Error', 'Failed to delete todo. Please try again.');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const openEditModal = (todo: Todo) => {
    setSelectedTodo(todo);
    setFormData({
      title: todo.title,
      completed: todo.completed,
    });
    setIsEditModalVisible(true);
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

  const renderTodoCard = ({ item }: { item: Todo }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <TouchableOpacity
          style={[styles.checkbox, item.completed && styles.checked]}
          onPress={() => dispatch(updateTodo({ ...item, completed: !item.completed }))}
        >
          {item.completed && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>
        <Text
          style={[
            styles.cardTitle,
            item.completed && styles.completedTodo,
          ]}
        >
          {item.title}
        </Text>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => openEditModal(item)}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteTodo(item.id)}
        >
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
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
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
          onPress={() => dispatch(setFilter('all'))}
        >
          <Text style={filter === 'all' ? styles.activeFilterText : styles.filterText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'completed' && styles.activeFilter,
          ]}
          onPress={() => dispatch(setFilter('completed'))}
        >
          <Text style={filter === 'completed' ? styles.activeFilterText : styles.filterText}>Completed</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'incomplete' && styles.activeFilter,
          ]}
          onPress={() => dispatch(setFilter('incomplete'))}
        >
          <Text style={filter === 'incomplete' ? styles.activeFilterText : styles.filterText}>Incomplete</Text>
        </TouchableOpacity>
      </View>

      {status === 'loading' ? (
        <Text style={styles.statusText}>Loading...</Text>
      ) : (
        <FlatList
          data={filteredTodos}
          renderItem={renderTodoCard}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
          contentContainerStyle={styles.listContent}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setFormData({ title: '', completed: false });
          setIsAddModalVisible(true);
        }}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <TodoFormModal
        visible={isAddModalVisible}
        onClose={() => {
          setIsAddModalVisible(false);
          setFormData({ title: '', completed: false });
        }}
        onSubmit={handleAddTodo}
        title="Add New Todo"
        initialData={formData}
      />

      <TodoFormModal
        visible={isEditModalVisible}
        onClose={() => {
          setIsEditModalVisible(false);
          setFormData({ title: '', completed: false });
        }}
        onSubmit={handleEditTodo}
        title="Edit Todo"
        initialData={formData}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterButton: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeFilter: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    color: '#666',
  },
  activeFilterText: {
    color: 'white',
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
    width: '100%',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#007AFF',
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  completedTodo: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  editButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#666',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 16,
  },
  statusText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});
