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
  // Get current user with validation
  static getCurrentUser(): User {
    try {
      const userData = localStorage.getItem(USER_KEY);
      if (userData) {
        const parsedUser = JSON.parse(userData);

        // Validate user data structure to prevent tampering
        if (this.isValidUserData(parsedUser)) {
          return parsedUser;
        } else {
          console.warn('Invalid user data detected, creating new guest user');
          const guestUser = createGuestUser();
          localStorage.setItem(USER_KEY, JSON.stringify(guestUser));
          return guestUser;
        }
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

  // Validate user data structure
  private static isValidUserData(data: unknown): data is User {
    return (
      data &&
      typeof data === 'object' &&
      data !== null &&
      'id' in data &&
      'name' in data &&
      'email' in data &&
      'points' in data &&
      'level' in data &&
      'badges' in data &&
      typeof (data as Record<string, unknown>).id === 'string' &&
      typeof (data as Record<string, unknown>).name === 'string' &&
      typeof (data as Record<string, unknown>).email === 'string' &&
      typeof (data as Record<string, unknown>).points === 'number' &&
      typeof (data as Record<string, unknown>).level === 'number' &&
      Array.isArray((data as Record<string, unknown>).badges) &&
      ((data as Record<string, unknown>).badges as unknown[]).every((badge: unknown) => typeof badge === 'string') &&
      (data as Record<string, unknown>).points >= 0 &&
      (data as Record<string, unknown>).level >= 1 &&
      (data as Record<string, unknown>).points <= 1000000 && // Reasonable upper limit
      (data as Record<string, unknown>).level <= 100 // Reasonable upper limit
    );
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

  // Add points to user with validation
  static addPoints(points: number): User {
    try {
      // Validate points input
      if (typeof points !== 'number' || points < 0 || points > 10000) {
        throw new Error('Invalid points value. Points must be a positive number less than 10000.');
      }

      const user = this.getCurrentUser();

      // Add points with overflow protection
      const newPoints = Math.min(user.points + points, 1000000);

      // Check if user should level up (simple formula: level = sqrt(points / 100))
      const newLevel = Math.min(Math.floor(Math.sqrt(newPoints / 100)) + 1, 100);

      // Update user
      const updatedUser = {
        ...user,
        points: newPoints,
        level: newLevel
      };

      // Validate the updated user before saving
      if (!this.isValidUserData(updatedUser)) {
        throw new Error('Invalid user data after update');
      }

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
  static saveUserProgress(key: string, data: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }

  // Get user progress
  static getUserProgress(key: string): unknown {
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
