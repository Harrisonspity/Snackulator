import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { UserProvider } from './src/context/UserContext';
import { NutritionProvider } from './src/context/NutritionContext';
import globalStyles from './src/styles/globalStyles';

export default function App() {
  return (
    <UserProvider>
      <NutritionProvider>
        <SafeAreaView style={globalStyles.container}>
          <StatusBar style="auto" />
          <AppNavigator />
        </SafeAreaView>
      </NutritionProvider>
    </UserProvider>
  );
}