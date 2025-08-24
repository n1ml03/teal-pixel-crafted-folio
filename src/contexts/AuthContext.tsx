import React, { createContext, useState, ReactNode } from 'react';
import { User } from '../types/playground';
import LocalStorageService from '@/services/LocalStorageService';
import { toast } from 'sonner';

interface AuthContextType {
  user: User;
  isLoading: boolean;
  isAuthenticated: boolean;
  updateProfile: (updates: Partial<Pick<User, 'displayName' | 'avatar'>>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>({
    id: '1',
    email: 'guest@example.com',
    displayName: 'Guest User',
    role: 'user',
    avatar: '',
    isOnline: true,
    lastActive: new Date().toISOString()
  });
  const [isLoading, setIsLoading] = useState(false);

  // Update profile function
  const updateProfile = async (
    updates: Partial<Pick<User, 'displayName' | 'avatar'>>
  ): Promise<boolean> => {
    try {
      const updatedUser = await LocalStorageService.updateProfile(updates);
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



export default AuthContext;
