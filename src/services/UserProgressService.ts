/**
 * Optimized UserProgressService using well-established libraries
 * Replaced custom implementations with battle-tested packages
 */
import { UserActivity, ActivityType, Achievement, UserAchievement } from '../types/playground';
import { LocalStorageService } from './LocalStorageService';
import { nanoid } from 'nanoid';
import { get, set, del, clear } from 'idb-keyval';
import { formatDistanceToNow, isValid, parseISO } from 'date-fns';
import { groupBy, countBy, sumBy, orderBy } from 'lodash-es';

// Storage keys with consistent naming
const STORAGE_KEYS = {
  USER_PROGRESS: 'user_progress_service_progress',
  USER_CHALLENGES: 'user_progress_service_challenges',
  USER_ACHIEVEMENTS: 'user_progress_service_achievements',
  USER_ACTIVITIES: 'user_progress_service_activities'
} as const;

// Types for progress tracking with enhanced validation
interface ChallengeProgress {
  id: string;
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
    id: string;
    timestamp: string;
    code: string;
  }[];
  notes?: string;
}

// Enhanced achievements with better structure
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
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Complete a challenge in under 5 minutes',
    icon: 'zap',
    criteria: {
      type: 'custom',
      value: 'fast_completion',
      count: 1
    },
    points: 200
  }
];

/**
 * Optimized UserProgressService using established libraries
 */
export class UserProgressService {
  // Storage helper methods using idb-keyval for consistency
  private static async getStorageValue<T>(key: string): Promise<T[]> {
    try {
      return await get(key) || [];
    } catch (error) {
      console.error(`Error getting ${key} from storage:`, error);
      return [];
    }
  }

  private static async setStorageValue<T>(key: string, value: T[]): Promise<void> {
    try {
      await set(key, value);
    } catch (error) {
      console.error(`Error setting ${key} to storage:`, error);
    }
  }

  // Get all challenges for a user with enhanced filtering
  static async getUserChallenges(userId: string): Promise<ChallengeProgress[]> {
    const allChallenges = await this.getStorageValue<ChallengeProgress>(STORAGE_KEYS.USER_CHALLENGES);
    const userChallenges = allChallenges.filter(c => c.userId === userId);
    
    // Sort by last updated date (most recent first)
    return orderBy(userChallenges, ['lastUpdatedAt'], ['desc']);
  }

  // Get a specific challenge progress with validation
  static async getChallengeProgress(
    userId: string,
    challengeId: string
  ): Promise<ChallengeProgress | null> {
    const userChallenges = await this.getUserChallenges(userId);
    return userChallenges.find(c => c.challengeId === challengeId) || null;
  }

  // Start or resume a challenge with enhanced tracking
  static async startChallenge(
    userId: string,
    challengeId: string
  ): Promise<ChallengeProgress> {
    // Check if challenge already exists
    const existingProgress = await this.getChallengeProgress(userId, challengeId);

    if (existingProgress) {
      // Update last updated time using date-fns for consistency
      existingProgress.lastUpdatedAt = new Date().toISOString();
      
      // Update storage
      const allChallenges = await this.getStorageValue<ChallengeProgress>(STORAGE_KEYS.USER_CHALLENGES);
      const updatedChallenges = allChallenges.map(c => 
        c.id === existingProgress.id ? existingProgress : c
      );
      await this.setStorageValue(STORAGE_KEYS.USER_CHALLENGES, updatedChallenges);

      // Log activity if resuming
      await this.logActivity(userId, 'challenge_started', {
        challengeId,
        message: 'Resumed challenge'
      });

      return existingProgress;
    }

    // Create new challenge progress with nanoid
    const now = new Date().toISOString();
    const newProgress: ChallengeProgress = {
      id: nanoid(),
      challengeId,
      userId,
      startedAt: now,
      lastUpdatedAt: now,
      progress: 0,
      completedObjectives: [],
      testResults: {},
      timeSpent: 0,
      codeSnapshots: []
    };

    // Add to storage
    const allChallenges = await this.getStorageValue<ChallengeProgress>(STORAGE_KEYS.USER_CHALLENGES);
    allChallenges.push(newProgress);
    await this.setStorageValue(STORAGE_KEYS.USER_CHALLENGES, allChallenges);

    // Log activity
    await this.logActivity(userId, 'challenge_started', {
      challengeId,
      message: 'Started new challenge'
    });

    return newProgress;
  }

  // Update challenge progress with enhanced validation
  static async updateChallengeProgress(
    userId: string,
    challengeId: string,
    updates: Partial<Omit<ChallengeProgress, 'id' | 'userId' | 'challengeId'>>
  ): Promise<ChallengeProgress | null> {
    const existingProgress = await this.getChallengeProgress(userId, challengeId);
    if (!existingProgress) return null;

    // Validate progress value
    if (updates.progress !== undefined) {
      updates.progress = Math.max(0, Math.min(100, updates.progress));
    }

    // Update with current timestamp
    const updatedProgress: ChallengeProgress = {
      ...existingProgress,
      ...updates,
      lastUpdatedAt: new Date().toISOString()
    };

    // Check for completion
    if (updates.progress === 100 && !existingProgress.completedAt) {
      updatedProgress.completedAt = new Date().toISOString();
      
      // Log completion activity
      await this.logActivity(userId, 'challenge_completed', {
        challengeId,
        timeSpent: updatedProgress.timeSpent.toString(),
        message: 'Challenge completed successfully'
      });

      // Check for speed demon achievement
      const completionTime = updatedProgress.timeSpent;
      if (completionTime < 300) { // 5 minutes
        await this.logActivity(userId, 'achievement_unlocked', {
          achievementId: 'speed_demon',
          message: 'Completed challenge in under 5 minutes'
        });
      }

      // Check achievements
      await this.checkAchievements(userId);
    }

    // Update storage
    const allChallenges = await this.getStorageValue<ChallengeProgress>(STORAGE_KEYS.USER_CHALLENGES);
    const updatedChallenges = allChallenges.map(c => 
      c.id === existingProgress.id ? updatedProgress : c
    );
    await this.setStorageValue(STORAGE_KEYS.USER_CHALLENGES, updatedChallenges);

    return updatedProgress;
  }

  // Save code snapshot with enhanced metadata
  static async saveCodeSnapshot(
    userId: string,
    challengeId: string,
    code: string
  ): Promise<boolean> {
    try {
      const progress = await this.getChallengeProgress(userId, challengeId);
      if (!progress) return false;

      const snapshot = {
        id: nanoid(),
        timestamp: new Date().toISOString(),
        code: code.trim()
      };

      // Limit snapshots to prevent excessive storage usage
      const maxSnapshots = 20;
      progress.codeSnapshots.push(snapshot);
      
      // Keep only the most recent snapshots
      if (progress.codeSnapshots.length > maxSnapshots) {
        progress.codeSnapshots = orderBy(
          progress.codeSnapshots, 
          ['timestamp'], 
          ['desc']
        ).slice(0, maxSnapshots);
      }

      progress.lastUpdatedAt = new Date().toISOString();

      // Update storage
      const allChallenges = await this.getStorageValue<ChallengeProgress>(STORAGE_KEYS.USER_CHALLENGES);
      const updatedChallenges = allChallenges.map(c => 
        c.id === progress.id ? progress : c
      );
      await this.setStorageValue(STORAGE_KEYS.USER_CHALLENGES, updatedChallenges);

      return true;
    } catch (error) {
      console.error('Error saving code snapshot:', error);
      return false;
    }
  }

  // Update time spent with validation
  static async updateTimeSpent(
    userId: string,
    challengeId: string,
    seconds: number
  ): Promise<boolean> {
    try {
      // Validate input
      if (seconds < 0 || seconds > 86400) { // Max 24 hours per session
        throw new Error('Invalid time value');
      }

      const progress = await this.getChallengeProgress(userId, challengeId);
      if (!progress) return false;

      progress.timeSpent += seconds;
      progress.lastUpdatedAt = new Date().toISOString();

      // Update storage
      const allChallenges = await this.getStorageValue<ChallengeProgress>(STORAGE_KEYS.USER_CHALLENGES);
      const updatedChallenges = allChallenges.map(c => 
        c.id === progress.id ? progress : c
      );
      await this.setStorageValue(STORAGE_KEYS.USER_CHALLENGES, updatedChallenges);

      // Check for time-based achievements
      if (progress.timeSpent >= 3600) { // 1 hour
        await this.logActivity(userId, 'achievement_unlocked', {
          achievementId: 'persistent',
          message: 'Spent 1 hour on challenges'
        });
        await this.checkAchievements(userId);
      }

      return true;
    } catch (error) {
      console.error('Error updating time spent:', error);
      return false;
    }
  }

  // Enhanced activity logging with nanoid
  static async logActivity(
    userId: string,
    type: ActivityType,
    details: Record<string, string | number | boolean> = {}
  ): Promise<UserActivity> {
    const activity: UserActivity = {
      id: nanoid(),
      userId,
      type,
      timestamp: new Date().toISOString(),
      details: {
        ...details,
        userAgent: navigator.userAgent,
        timestamp: Date.now()
      }
    };

    const allActivities = await this.getStorageValue<UserActivity>(STORAGE_KEYS.USER_ACTIVITIES);
    allActivities.push(activity);

    // Limit activities to prevent excessive storage usage
    const maxActivities = 1000;
    if (allActivities.length > maxActivities) {
      const sortedActivities = orderBy(allActivities, ['timestamp'], ['desc']);
      await this.setStorageValue(STORAGE_KEYS.USER_ACTIVITIES, sortedActivities.slice(0, maxActivities));
    } else {
      await this.setStorageValue(STORAGE_KEYS.USER_ACTIVITIES, allActivities);
    }

    return activity;
  }

  // Get user activities with enhanced filtering
  static async getUserActivities(
    userId: string,
    limit?: number,
    activityType?: ActivityType
  ): Promise<UserActivity[]> {
    const allActivities = await this.getStorageValue<UserActivity>(STORAGE_KEYS.USER_ACTIVITIES);
    let userActivities = allActivities.filter(a => a.userId === userId);

    // Filter by type if specified
    if (activityType) {
      userActivities = userActivities.filter(a => a.type === activityType);
    }

    // Sort by timestamp (most recent first)
    userActivities = orderBy(userActivities, ['timestamp'], ['desc']);

    // Apply limit if specified
    if (limit) {
      userActivities = userActivities.slice(0, limit);
    }

    return userActivities;
  }

  // Get user achievements with enhanced data
  static async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    const allAchievements = await this.getStorageValue<UserAchievement>(STORAGE_KEYS.USER_ACHIEVEMENTS);
    const userAchievements = allAchievements.filter(a => a.userId === userId);
    
    return orderBy(userAchievements, ['unlockedAt'], ['desc']);
  }

  // Enhanced achievement checking with better logic
  static async checkAchievements(userId: string): Promise<UserAchievement[]> {
    const existingAchievements = await this.getUserAchievements(userId);
    const existingIds = new Set(existingAchievements.map(a => a.achievementId));
    const newAchievements: UserAchievement[] = [];

    for (const achievement of achievements) {
      if (existingIds.has(achievement.id)) continue;

      let isUnlocked = false;

      switch (achievement.criteria.type) {
        case 'challenge_completion': {
          const userChallenges = await this.getUserChallenges(userId);
          const completedChallenges = userChallenges.filter(c => c.completedAt);
          isUnlocked = completedChallenges.length >= achievement.criteria.count!;
          break;
        }

        case 'level': {
          const user = await LocalStorageService.getCurrentUser();
          const requiredLevel = typeof achievement.criteria.value === 'number' 
            ? achievement.criteria.value 
            : parseInt(achievement.criteria.value.toString(), 10);
          isUnlocked = user.level >= requiredLevel;
          break;
        }

        case 'custom': {
          const userActivities = await this.getUserActivities(userId);
          
          switch (achievement.criteria.value) {
            case 'bug_reported': {
              const bugReports = userActivities.filter(a => a.type === 'bug_reported');
              isUnlocked = bugReports.length >= achievement.criteria.count!;
              break;
            }
            
            case 'test_passed': {
              const testsPassed = userActivities.filter(a => a.type === 'test_passed');
              isUnlocked = testsPassed.length >= achievement.criteria.count!;
              break;
            }
            
            case 'time_spent': {
              const userChallenges = await this.getUserChallenges(userId);
              const totalTime = sumBy(userChallenges, 'timeSpent');
              isUnlocked = totalTime >= achievement.criteria.count!;
              break;
            }
            
            case 'fast_completion': {
              const userChallenges = await this.getUserChallenges(userId);
              const fastCompletions = userChallenges.filter(c => 
                c.completedAt && c.timeSpent < 300 // 5 minutes
              );
              isUnlocked = fastCompletions.length >= achievement.criteria.count!;
              break;
            }
          }
          break;
        }
      }

      if (isUnlocked) {
        const userAchievement: UserAchievement = {
          id: nanoid(),
          userId,
          achievementId: achievement.id,
          unlockedAt: new Date().toISOString(),
          progress: 100,
        };

        newAchievements.push(userAchievement);

        // Add points to user
        await LocalStorageService.addPoints(achievement.points);

        // Log achievement unlock
        await this.logActivity(userId, 'achievement_unlocked', {
          achievementId: achievement.id,
          points: achievement.points.toString(),
          message: `Unlocked: ${achievement.title}`
        });
      }
    }

    if (newAchievements.length > 0) {
      const allAchievements = await this.getStorageValue<UserAchievement>(STORAGE_KEYS.USER_ACHIEVEMENTS);
      allAchievements.push(...newAchievements);
      await this.setStorageValue(STORAGE_KEYS.USER_ACHIEVEMENTS, allAchievements);
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

  // Get user progress statistics using lodash for data analysis
  static async getUserStats(userId: string): Promise<{
    totalChallenges: number;
    completedChallenges: number;
    totalTimeSpent: number;
    averageTimePerChallenge: number;
    totalActivities: number;
    activitiesByType: Record<string, number>;
    challengesByStatus: Record<string, number>;
    recentActivity: UserActivity[];
  }> {
    const [challenges, activities] = await Promise.all([
      this.getUserChallenges(userId),
      this.getUserActivities(userId, 10)
    ]);

    const completedChallenges = challenges.filter(c => c.completedAt);
    const totalTimeSpent = sumBy(challenges, 'timeSpent');
    
    return {
      totalChallenges: challenges.length,
      completedChallenges: completedChallenges.length,
      totalTimeSpent,
      averageTimePerChallenge: completedChallenges.length > 0 
        ? totalTimeSpent / completedChallenges.length 
        : 0,
      totalActivities: activities.length,
      activitiesByType: countBy(activities, 'type'),
      challengesByStatus: {
        completed: completedChallenges.length,
        inProgress: challenges.filter(c => !c.completedAt && c.progress > 0).length,
        notStarted: challenges.filter(c => c.progress === 0).length
      },
      recentActivity: activities
    };
  }

  // Clear all user data
  static async clearAllUserData(userId: string): Promise<void> {
    try {
      const [allChallenges, allActivities, allAchievements] = await Promise.all([
        this.getStorageValue<ChallengeProgress>(STORAGE_KEYS.USER_CHALLENGES),
        this.getStorageValue<UserActivity>(STORAGE_KEYS.USER_ACTIVITIES),
        this.getStorageValue<UserAchievement>(STORAGE_KEYS.USER_ACHIEVEMENTS)
      ]);

      // Filter out user's data
      const filteredChallenges = allChallenges.filter(c => c.userId !== userId);
      const filteredActivities = allActivities.filter(a => a.userId !== userId);
      const filteredAchievements = allAchievements.filter(a => a.userId !== userId);

      // Save filtered data
      await Promise.all([
        this.setStorageValue(STORAGE_KEYS.USER_CHALLENGES, filteredChallenges),
        this.setStorageValue(STORAGE_KEYS.USER_ACTIVITIES, filteredActivities),
        this.setStorageValue(STORAGE_KEYS.USER_ACHIEVEMENTS, filteredAchievements)
      ]);
    } catch (error) {
      console.error('Error clearing user data:', error);
      throw error;
    }
  }
}

export default UserProgressService;
