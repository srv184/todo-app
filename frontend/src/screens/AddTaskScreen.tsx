import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useTasks } from '../context/TaskContext';
import type { Priority } from '../types';

const PRIORITIES: Priority[] = ['low', 'medium', 'high'];

export default function AddTaskScreen({ navigation }: any) {
  const { addTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');
  const [priority, setPriority] = useState<Priority>('medium');
  const [deadline, setDeadline] = useState(''); // simple text input, e.g. 2026-08-30T18:00
  const [submitting, setSubmitting] = useState(false);

  const handleSave = async () => {
    if (!title.trim() || !deadline) {
      Alert.alert('Missing info', 'Title and deadline are required.');
      return;
    }
    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
      Alert.alert('Invalid date', 'Use format YYYY-MM-DDTHH:mm, e.g. 2026-08-30T18:00');
      return;
    }
    try {
      setSubmitting(true);
      await addTask({
        title: title.trim(),
        description,
        category: category || 'General',
        priority,
        dateTime: new Date().toISOString(),
        deadline: deadlineDate.toISOString(),
      });
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Failed to add task', err?.response?.data?.message ?? 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.label}>Title</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="e.g. Finish DSA sheet" />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={description}
        onChangeText={setDescription}
        placeholder="Optional details"
        multiline
      />

      <Text style={styles.label}>Category / Tag</Text>
      <TextInput style={styles.input} value={category} onChangeText={setCategory} placeholder="Work, Personal..." />

      <Text style={styles.label}>Deadline (YYYY-MM-DDTHH:mm)</Text>
      <TextInput
        style={styles.input}
        value={deadline}
        onChangeText={setDeadline}
        placeholder="2026-08-30T18:00"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Priority</Text>
      <View style={styles.priorityRow}>
        {PRIORITIES.map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.priorityChip, priority === p && styles.priorityChipActive]}
            onPress={() => setPriority(p)}
          >
            <Text style={styles.priorityChipText}>{p}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={submitting}>
        <Text style={styles.saveButtonText}>{submitting ? 'Saving...' : 'Save Task'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1115' },
  label: { color: '#9AA0AC', fontSize: 13, marginBottom: 6, marginTop: 14 },
  input: { backgroundColor: '#1C1F26', color: '#fff', borderRadius: 12, padding: 14, fontSize: 15 },
  priorityRow: { flexDirection: 'row', gap: 10 },
  priorityChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#1C1F26',
  },
  priorityChipActive: { backgroundColor: '#6C5CE7' },
  priorityChipText: { color: '#fff', textTransform: 'capitalize' },
  saveButton: { backgroundColor: '#6C5CE7', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 28 },
  saveButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
