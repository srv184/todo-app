import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Task } from '../types';
import { useTasks } from '../context/TaskContext';

/**
 * Creative Feature 2: "Focus Mode"
 * A distraction-free countdown timer bound to a single task. Running a session
 * logs elapsed minutes back onto the task (task.focusMinutes), turning the
 * to-do list into a lightweight time-tracker: users see not just what's due,
 * but how much real focus time they've actually invested per task.
 */
const SESSION_MINUTES = 25;

interface Props {
  task: Task | null;
  onClose: () => void;
}

export default function FocusModeTimer({ task, onClose }: Props) {
  const { logFocusMinutes } = useTasks();
  const [secondsLeft, setSecondsLeft] = useState(SESSION_MINUTES * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (task) {
      setSecondsLeft(SESSION_MINUTES * 60);
      setRunning(false);
    }
  }, [task]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            handleSessionComplete();
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const handleSessionComplete = async () => {
    if (task) await logFocusMinutes(task._id, SESSION_MINUTES);
  };

  const handleClose = async () => {
    const elapsedMinutes = SESSION_MINUTES - Math.floor(secondsLeft / 60);
    if (task && elapsedMinutes > 0) {
      await logFocusMinutes(task._id, elapsedMinutes);
    }
    setRunning(false);
    onClose();
  };

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');

  return (
    <Modal visible={!!task} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.taskTitle}>{task?.title}</Text>
          <Text style={styles.timer}>
            {mm}:{ss}
          </Text>
          <View style={styles.row}>
            <TouchableOpacity style={styles.button} onPress={() => setRunning((r) => !r)}>
              <Text style={styles.buttonText}>{running ? 'Pause' : 'Start'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={handleClose}>
              <Text style={styles.buttonText}>End Session</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.hint}>Logged focus time saves automatically on this task.</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 24 },
  card: { backgroundColor: '#1C1F26', borderRadius: 20, padding: 28, alignItems: 'center' },
  taskTitle: { color: '#fff', fontSize: 18, fontWeight: '600', marginBottom: 12, textAlign: 'center' },
  timer: { color: '#A29BFE', fontSize: 56, fontWeight: '700', marginBottom: 20 },
  row: { flexDirection: 'row', gap: 12 },
  button: { backgroundColor: '#6C5CE7', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 20 },
  buttonSecondary: { backgroundColor: '#2D3139' },
  buttonText: { color: '#fff', fontWeight: '700' },
  hint: { color: '#9AA0AC', fontSize: 12, marginTop: 16, textAlign: 'center' },
});
