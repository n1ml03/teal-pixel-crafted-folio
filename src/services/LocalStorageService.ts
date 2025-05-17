import { User } from '../types/playground';

// Local storage keys
const USER_KEY = 'testing_playground_user';
const USER_PROGRESS_KEY = 'testing_playground_user_progress';
const USER_CHALLENGES_KEY = 'testing_playground_user_challenges';
const USER_ACHIEVEMENTS_KEY = 'testing_playground_user_achievements';
const USER_ACTIVITIES_KEY = 'testing_playground_user_activities';

// Helper to generate a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
};

// Default guest user
const createGuestUser = (): User => {
  const userId = generateId();
  return {
    id: userId,
    username: 'guest',
    email: 'guest@example.com',
    displayName: 'Guest User',
    role: 'user',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    level: 1,
    points: 0,
    badges: ['newcomer']
  };
};

// LocalStorageService class
export class LocalStorageService {
  // Get current user
  static getCurrentUser(): User {
    try {
      const userData = localStorage.getItem(USER_KEY);
      if (userData) {
        return JSON.parse(userData);
      }
      
      // Create a new guest user if none exists
      const guestUser = createGuestUser();
      localStorage.setItem(USER_KEY, JSON.stringify(guestUser));
      return guestUser;
    } catch (error) {
      console.error('Error getting user from localStorage:', error);
      const guestUser = createGuestUser();
      localStorage.setItem(USER_KEY, JSON.stringify(guestUser));
      return guestUser;
    }
  }

  // Update user profile
  static updateProfile(updates: Partial<Pick<User, 'displayName' | 'avatar'>>): User {
    try {
      const user = this.getCurrentUser();
      const updatedUser = {
        ...user,
        ...updates
      };
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      console.error('Error updating user profile in localStorage:', error);
      throw error;
    }
  }

  // Add points to user
  static addPoints(points: number): User {
    try {
      const user = this.getCurrentUser();
      
      // Add points
      const newPoints = user.points + points;

      // Check if user should level up (simple formula: level = sqrt(points / 100))
      const newLevel = Math.floor(Math.sqrt(newPoints / 100)) + 1;
      
      // Update user
      const updatedUser = {
        ...user,
        points: newPoints,
        level: newLevel
      };
      
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      console.error('Error adding points in localStorage:', error);
      throw error;
    }
  }

  // Add badge to user
  static addBadge(badge: string): User {
    try {
      const user = this.getCurrentUser();
      
      // Check if user already has this badge
      if (user.badges.includes(badge)) {
        return user;
      }
      
      // Add badge
      const updatedUser = {
        ...user,
        badges: [...user.badges, badge]
      };
      
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      console.error('Error adding badge in localStorage:', error);
      throw error;
    }
  }

  // Save user progress
  static saveUserProgress(key: string, data: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }

  // Get user progress
  static getUserProgress(key: string): any {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error getting ${key} from localStorage:`, error);
      return null;
    }
  }

  // Clear all user data
  static clearAllUserData(): void {
    try {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(USER_PROGRESS_KEY);
      localStorage.removeItem(USER_CHALLENGES_KEY);
      localStorage.removeItem(USER_ACHIEVEMENTS_KEY);
      localStorage.removeItem(USER_ACTIVITIES_KEY);
    } catch (error) {
      console.error('Error clearing user data from localStorage:', error);
    }
  }
}

export default LocalStorageService;
