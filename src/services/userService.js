import AsyncStorage from '@react-native-async-storage/async-storage';

export const loadUserProfile = async () => {
  const profile = await AsyncStorage.getItem('userProfile');
  return profile ? JSON.parse(profile) : {};
};

export const saveUserProfile = async (profile) => {
  await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
  await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
};

export const checkOnboardingStatus = async () => {
  const hasCompleted = await AsyncStorage.getItem('hasCompletedOnboarding');
  return hasCompleted === 'true';
};
