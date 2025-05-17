import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/playground';
import LocalStorageService from '@/services/LocalStorageService';
import { toast } from '@/components/ui/sonner';

interface AuthContextType {
  user: User;
  isLoading: boolean;
  isAuthenticated: boolean;
  updateProfile: (updates: Partial<Pick<User, 'displayName' | 'avatar'>>) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(LocalStorageService.getCurrentUser());
  const [isLoading, setIsLoading] = useState(false);

  // Update profile function
  const updateProfile = (
    updates: Partial<Pick<User, 'displayName' | 'avatar'>>
  ): boolean => {
    try {
      const updatedUser = LocalStorageService.updateProfile(updates);
      setUser(updatedUser);
      toast.success('Profile updated successfully.');
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('An error occurred while updating your profile. Please try again.');
      return false;
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: true, // Always authenticated with guest user
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default AuthContext;
