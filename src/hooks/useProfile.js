import { useState } from 'react';

// Manages user profile data
export const useProfile = () => {
  const [userProfile, setUserProfile] = useState({});
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  // TODO: Implement load profile, save profile, calculate daily goals

  const updateProfile = (profile) => setUserProfile(profile);
  const saveProfile = async () => {};
  const getDailyGoals = () => ({});

  return {
    userProfile,
    hasCompletedOnboarding,
    updateProfile,
    saveProfile,
    getDailyGoals,
  };
};
