import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import TaskItem from '../components/TaskItem';
import FocusModeTimer from '../components/FocusModeTimer';
import type { SortMode, Task } from '../types';

const SORT_OPTIONS: { key: SortMode; label: string }[] = [
  { key: 'smart', label: 'Smart' },
  { key: 'deadline', label: 'Deadline' },
  { key: 'priority', label: 'Priority' },
];

export default function TaskListScreen({ navigation }: any) {
  const { tasks, sortMode, setSortMode, refreshTasks, toggleComplete, deleteTask } = useTasks();
  const { logout } = useAuth();
  const [focusTask, setFocusTask] = useState<Task | null>(null);

  useFocusEffect(
    useCallback(() => {
      refreshTasks();
    }, [refreshTasks])
  );

  useEffect(() => {
    refreshTasks();
  }, [sortMode]);

  const pending = tasks.filter((t) => !t.completed).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Tasks</Text>
          <Text style={styles.headerSubtitle}>{pending} pending</Text>
        </View>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logout}>Log out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sortRow}>
        {SORT_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.key}
            style={[styles.sortChip, sortMode === opt.key && styles.sortChipActive]}
            onPress={() => setSortMode(opt.key)}
          >
            <Text style={styles.sortChipText}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={styles.empty}>No tasks yet. Add your first one!</Text>}
        renderItem={({ item }) => (
          <TaskItem task={item} onToggle={toggleComplete} onDelete={deleteTask} onFocus={setFocusTask} />
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddTask')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <FocusModeTimer task={focusTask} onClose={() => setFocusTask(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1115' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 24,
  },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: '700' },
  headerSubtitle: { color: '#9AA0AC', marginTop: 2 },
  logout: { color: '#FF6B6B', fontWeight: '600' },
  sortRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginBottom: 4 },
  sortChip: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 16, backgroundColor: '#1C1F26' },
  sortChipActive: { backgroundColor: '#6C5CE7' },
  sortChipText: { color: '#fff', fontSize: 13 },
  empty: { color: '#9AA0AC', textAlign: 'center', marginTop: 60 },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6C5CE7',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  fabText: { color: '#fff', fontSize: 30, marginTop: -2 },
});
