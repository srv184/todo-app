import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { TaskProvider } from '../context/TaskContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import TaskListScreen from '../screens/TaskListScreen';
import AddTaskScreen from '../screens/AddTaskScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) return null; // could render a splash screen here

  return (
    <NavigationContainer>
      {user ? (
        <TaskProvider>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="TaskList" component={TaskListScreen} />
            <Stack.Screen
              name="AddTask"
              component={AddTaskScreen}
              options={{ headerShown: true, title: 'New Task', presentation: 'modal' }}
            />
          </Stack.Navigator>
        </TaskProvider>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
