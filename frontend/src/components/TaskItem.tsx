import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Task } from '../types';

const PRIORITY_COLORS: Record<Task['priority'], string> = {
  high: '#FF6B6B',
  medium: '#FDCB6E',
  low: '#55EFC4',
};

interface Props {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onFocus: (task: Task) => void; // Creative feature 2 trigger
}

export default function TaskItem({ task, onToggle, onDelete, onFocus }: Props) {
  const deadline = new Date(task.deadline);
  // Completed tasks are never labelled overdue, even if their deadline has
  // passed, because their status takes precedence in the task presentation.
  const overdue = !task.completed && deadline.getTime() < Date.now();

  return (
    <View style={[styles.card, task.completed && styles.cardCompleted]}>
      <TouchableOpacity onPress={() => onToggle(task._id)} style={styles.checkbox}>
        {/* Completion is delegated to shared task state so the API and every list item stay synchronized. */}
        <View style={[styles.checkboxInner, task.completed && styles.checkboxChecked]} />
      </TouchableOpacity>

      <View style={{ flex: 1 }}>
        <Text style={[styles.title, task.completed && styles.strikethrough]}>{task.title}</Text>
        {!!task.description && <Text style={styles.desc}>{task.description}</Text>}
        <View style={styles.metaRow}>
          <View style={[styles.priorityDot, { backgroundColor: PRIORITY_COLORS[task.priority] }]} />
          <Text style={styles.meta}>{task.category}</Text>
          <Text style={[styles.meta, overdue && styles.overdue]}>
            {overdue ? 'Overdue' : `Due ${deadline.toLocaleDateString()}`}
          </Text>
          {/* The Smart Priority Score makes the combined priority/deadline rank visible to the user. */}
          <Text style={styles.score}>Score {task.priorityScore}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onFocus(task)} style={styles.actionBtn}>
          <Text style={styles.actionText}>Focus</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(task._id)} style={styles.actionBtn}>
          {/* Delete is handled by shared task state, which removes the task locally and on the backend. */}
          <Text style={[styles.actionText, { color: '#FF6B6B' }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#1C1F26',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  cardCompleted: { opacity: 0.5 },
  checkbox: { marginRight: 12, marginTop: 4 },
  checkboxInner: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#6C5CE7',
  },
  checkboxChecked: { backgroundColor: '#6C5CE7' },
  title: { color: '#fff', fontSize: 16, fontWeight: '600' },
  strikethrough: { textDecorationLine: 'line-through' },
  desc: { color: '#9AA0AC', marginTop: 2, fontSize: 13 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 },
  priorityDot: { width: 8, height: 8, borderRadius: 4 },
  meta: { color: '#9AA0AC', fontSize: 12 },
  overdue: { color: '#FF6B6B', fontWeight: '700' },
  score: { color: '#A29BFE', fontSize: 12, marginLeft: 'auto' },
  actions: { marginLeft: 8 },
  actionBtn: { marginBottom: 8 },
  actionText: { color: '#74B9FF', fontSize: 12, fontWeight: '600' },
});
