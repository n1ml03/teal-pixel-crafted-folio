import { UserActivity, ActivityType, Achievement, UserAchievement } from '../types/playground';
import LocalStorageService from './LocalStorageService';

// Local storage keys
const USER_PROGRESS_KEY = 'testing_playground_user_progress';
const USER_CHALLENGES_KEY = 'testing_playground_user_challenges';
const USER_ACHIEVEMENTS_KEY = 'testing_playground_user_achievements';
const USER_ACTIVITIES_KEY = 'testing_playground_user_activities';

// Types for progress tracking
interface ChallengeProgress {
  challengeId: string;
  userId: string;
  startedAt: string;
  lastUpdatedAt: string;
  completedAt?: string;
  progress: number; // 0-100
  completedObjectives: string[];
  testResults: Record<string, boolean>;
  timeSpent: number; // in seconds
  codeSnapshots: {
    timestamp: string;
    code: string;
  }[];
  notes?: string;
}

// Mock storage
const challengeProgressStorage: Record<string, ChallengeProgress[]> = {};
const userAchievementsStorage: Record<string, UserAchievement[]> = {};
const userActivitiesStorage: Record<string, UserActivity[]> = {};

// Mock achievements
const achievements: Achievement[] = [
  {
    id: 'first_challenge',
    title: 'First Steps',
    description: 'Complete your first challenge',
    icon: 'award',
    criteria: {
      type: 'challenge_completion',
      value: 'any',
      count: 1
    },
    points: 50
  },
  {
    id: 'bug_hunter',
    title: 'Bug Hunter',
    description: 'Report your first bug',
    icon: 'bug',
    criteria: {
      type: 'custom',
      value: 'bug_reported',
      count: 1
    },
    points: 30
  },
  {
    id: 'test_master',
    title: 'Test Master',
    description: 'Pass 10 tests successfully',
    icon: 'check-circle',
    criteria: {
      type: 'custom',
      value: 'test_passed',
      count: 10
    },
    points: 100
  },
  {
    id: 'persistent',
    title: 'Persistent Tester',
    description: 'Spend at least 1 hour on challenges',
    icon: 'clock',
    criteria: {
      type: 'custom',
      value: 'time_spent',
      count: 3600 // 1 hour in seconds
    },
    points: 75
  },
  {
    id: 'level_5',
    title: 'Rising Star',
    description: 'Reach level 5',
    icon: 'star',
    criteria: {
      type: 'level',
      value: 5
    },
    points: 150
  }
];

// Helper to generate a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
};

// Initialize from local storage if available
const initializeFromLocalStorage = () => {
  try {
    const progressData = localStorage.getItem(USER_CHALLENGES_KEY);
    if (progressData) {
      const parsed = JSON.parse(progressData);
      Object.assign(challengeProgressStorage, parsed);
    }

    const achievementsData = localStorage.getItem(USER_ACHIEVEMENTS_KEY);
    if (achievementsData) {
      const parsed = JSON.parse(achievementsData);
      Object.assign(userAchievementsStorage, parsed);
    }

    const activitiesData = localStorage.getItem(USER_ACTIVITIES_KEY);
    if (activitiesData) {
      const parsed = JSON.parse(activitiesData);
      Object.assign(userActivitiesStorage, parsed);
    }
  } catch (error) {
    console.error('Error initializing from local storage:', error);
  }
};

// Save to local storage
const saveToLocalStorage = () => {
  try {
    localStorage.setItem(USER_CHALLENGES_KEY, JSON.stringify(challengeProgressStorage));
    localStorage.setItem(USER_ACHIEVEMENTS_KEY, JSON.stringify(userAchievementsStorage));
    localStorage.setItem(USER_ACTIVITIES_KEY, JSON.stringify(userActivitiesStorage));
  } catch (error) {
    console.error('Error saving to local storage:', error);
  }
};

// Initialize
initializeFromLocalStorage();

export class UserProgressService {
  // Get all challenges for a user
  static async getUserChallenges(userId: string): Promise<ChallengeProgress[]> {
    return challengeProgressStorage[userId] || [];
  }

  // Get a specific challenge progress
  static async getChallengeProgress(
    userId: string,
    challengeId: string
  ): Promise<ChallengeProgress | null> {
    const userChallenges = challengeProgressStorage[userId] || [];
    return userChallenges.find(c => c.challengeId === challengeId) || null;
  }

  // Start or resume a challenge
  static async startChallenge(
    userId: string,
    challengeId: string
  ): Promise<ChallengeProgress> {
    // Check if challenge already exists
    const existingProgress = await this.getChallengeProgress(userId, challengeId);

    if (existingProgress) {
      // Update last updated time
      existingProgress.lastUpdatedAt = new Date().toISOString();
      saveToLocalStorage();

      // Log activity if resuming
      await this.logActivity(userId, 'challenge_started', {
        challengeId,
        message: 'Resumed challenge'
      });

      return existingProgress;
    }

    // Create new challenge progress
    const newProgress: ChallengeProgress = {
      challengeId,
      userId,
      startedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      progress: 0,
      completedObjectives: [],
      testResults: {},
      timeSpent: 0,
      codeSnapshots: []
    };

    // Add to storage
    if (!challengeProgressStorage[userId]) {
      challengeProgressStorage[userId] = [];
    }

    challengeProgressStorage[userId].push(newProgress);
    saveToLocalStorage();

    // Log activity
    await this.logActivity(userId, 'challenge_started', {
      challengeId,
      message: 'Started challenge'
    });

    return newProgress;
  }

  // Update challenge progress
  static async updateChallengeProgress(
    userId: string,
    challengeId: string,
    updates: Partial<Omit<ChallengeProgress, 'userId' | 'challengeId'>>
  ): Promise<ChallengeProgress | null> {
    const existingProgress = await this.getChallengeProgress(userId, challengeId);

    if (!existingProgress) {
      return null;
    }

    // Update progress
    const updatedProgress = {
      ...existingProgress,
      ...updates,
      lastUpdatedAt: new Date().toISOString()
    };

    // Replace in storage
    const userChallenges = challengeProgressStorage[userId] || [];
    const index = userChallenges.findIndex(c => c.challengeId === challengeId);

    if (index !== -1) {
      userChallenges[index] = updatedProgress;
      saveToLocalStorage();
    }

    // Check if challenge was completed
    if (updatedProgress.progress === 100 && !existingProgress.completedAt) {
      updatedProgress.completedAt = new Date().toISOString();

      // Log activity
      await this.logActivity(userId, 'challenge_completed', {
        challengeId,
        points: 50 // Award points for completion
      });

      // Check for achievements
      await this.checkAchievements(userId);

      // Award points
      LocalStorageService.addPoints(50);
    }

    return updatedProgress;
  }

  // Save code snapshot
  static async saveCodeSnapshot(
    userId: string,
    challengeId: string,
    code: string
  ): Promise<boolean> {
    const existingProgress = await this.getChallengeProgress(userId, challengeId);

    if (!existingProgress) {
      return false;
    }

    // Add snapshot
    existingProgress.codeSnapshots.push({
      timestamp: new Date().toISOString(),
      code
    });

    // Update last updated time
    existingProgress.lastUpdatedAt = new Date().toISOString();
    saveToLocalStorage();

    return true;
  }

  // Update time spent
  static async updateTimeSpent(
    userId: string,
    challengeId: string,
    seconds: number
  ): Promise<boolean> {
    const existingProgress = await this.getChallengeProgress(userId, challengeId);

    if (!existingProgress) {
      return false;
    }

    // Update time spent
    existingProgress.timeSpent += seconds;

    // Update last updated time
    existingProgress.lastUpdatedAt = new Date().toISOString();
    saveToLocalStorage();

    // Check for time-based achievements
    if (existingProgress.timeSpent >= 3600) { // 1 hour
      await this.checkAchievements(userId);
    }

    return true;
  }

  // Log user activity
  static async logActivity(
    userId: string,
    type: ActivityType,
    details: Record<string, string | number | boolean> = {}
  ): Promise<UserActivity> {
    const activity: UserActivity = {
      id: generateId(),
      userId,
      type,
      timestamp: new Date().toISOString(),
      details
    };

    // Add to storage
    if (!userActivitiesStorage[userId]) {
      userActivitiesStorage[userId] = [];
    }

    userActivitiesStorage[userId].push(activity);
    saveToLocalStorage();

    return activity;
  }

  // Get user activities
  static async getUserActivities(userId: string): Promise<UserActivity[]> {
    return userActivitiesStorage[userId] || [];
  }

  // Get user achievements
  static async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    return userAchievementsStorage[userId] || [];
  }

  // Check and award achievements
  static async checkAchievements(userId: string): Promise<UserAchievement[]> {
    const user = LocalStorageService.getCurrentUser();

    const userChallenges = await this.getUserChallenges(userId);
    const userActivities = await this.getUserActivities(userId);
    const userAchievements = await this.getUserAchievements(userId) || [];

    const newAchievements: UserAchievement[] = [];

    // Check each achievement
    for (const achievement of achievements) {
      // Skip if already unlocked
      if (userAchievements.some(ua => ua.achievementId === achievement.id)) {
        continue;
      }

      let unlocked = false;

      switch (achievement.criteria.type) {
        case 'challenge_completion': {
          const completedChallenges = userChallenges.filter(c => c.completedAt);
          unlocked = completedChallenges.length >= (achievement.criteria.count || 1);
          break;
        }

        case 'level':
          unlocked = user.level >= (achievement.criteria.value as number);
          break;

        case 'points':
          unlocked = user.points >= (achievement.criteria.value as number);
          break;

        case 'custom':
          if (achievement.criteria.value === 'bug_reported') {
            const bugReports = userActivities.filter(a => a.type === 'bug_reported');
            unlocked = bugReports.length >= (achievement.criteria.count || 1);
          } else if (achievement.criteria.value === 'test_passed') {
            const testsPassed = userActivities.filter(a => a.type === 'test_passed');
            unlocked = testsPassed.length >= (achievement.criteria.count || 1);
          } else if (achievement.criteria.value === 'time_spent') {
            const totalTimeSpent = userChallenges.reduce((total, c) => total + c.timeSpent, 0);
            unlocked = totalTimeSpent >= (achievement.criteria.count || 0);
          }
          break;
      }

      if (unlocked) {
        // Create new achievement
        const userAchievement: UserAchievement = {
          id: generateId(),
          userId,
          achievementId: achievement.id,
          unlockedAt: new Date().toISOString()
        };

        // Add to storage
        if (!userAchievementsStorage[userId]) {
          userAchievementsStorage[userId] = [];
        }

        userAchievementsStorage[userId].push(userAchievement);
        newAchievements.push(userAchievement);

        // Log activity
        await this.logActivity(userId, 'achievement_unlocked', {
          achievementId: achievement.id,
          points: achievement.points
        });

        // Award points
        LocalStorageService.addPoints(achievement.points);
      }
    }

    if (newAchievements.length > 0) {
      saveToLocalStorage();
    }

    return newAchievements;
  }

  // Get all available achievements
  static async getAchievements(): Promise<Achievement[]> {
    return achievements;
  }

  // Get achievement by ID
  static async getAchievementById(id: string): Promise<Achievement | null> {
    return achievements.find(a => a.id === id) || null;
  }
}

export default UserProgressService;
