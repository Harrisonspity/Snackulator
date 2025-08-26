import React, { createContext, useState, useEffect } from 'react';
import { loadUserProfile, saveUserProfile, checkOnboardingStatus } from '../services/userService';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  useEffect(() => {
    checkOnboardingStatus().then(setHasCompletedOnboarding);
    loadUserProfile().then(profile => {
      if (profile) {
        setUserProfile(profile);
      }
    });
  }, []);

  const handleProfileComplete = async () => {
    await saveUserProfile(userProfile);
    setHasCompletedOnboarding(true);
    setShowProfileSetup(false);
  };

  return (
    <UserContext.Provider value={{
      userProfile,
      setUserProfile,
      hasCompletedOnboarding,
      setHasCompletedOnboarding,
      showProfileSetup,
      setShowProfileSetup,
      handleProfileComplete,
    }}>
      {children}
    </UserContext.Provider>
  );
};
