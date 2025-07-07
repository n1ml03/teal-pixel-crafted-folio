import { Challenge } from '@/components/playground/ChallengeCard';
import { TestResult } from '../types/playground';
import { ChallengeLoaderService } from './ChallengeLoaderService';
import challengesMeta from '@/data/challengesMeta';
import { get, set, del } from 'idb-keyval';
import { v4 as uuidv4 } from 'uuid';

// Error logging utility to prevent sensitive information exposure
const logError = (message: string, error?: unknown): void => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[ChallengeService] ${message}`, error);
  }
};

// Challenge progress interface
export interface ChallengeProgress {
  id: string;
  userId: string;
  challengeId: string;
  startedAt: string;
  completedAt?: string;
  completedObjectives: string[];
  timeSpent: number; // in seconds
  attempts: number;
  testResults?: Record<string, TestResult>;
  score?: number;
}

// Challenge test interface
export interface ChallengeTest {
  id: string;
  name: string;
  description: string;
  weight: number; // importance of this test in the overall score
  testFunction: (env: Record<string, unknown>) => Promise<TestResult>;
}

// Challenge with tests
export interface ChallengeWithTests extends Challenge {
  objectives: {
    id: string;
    description: string;
    required: boolean;
  }[];
  tests: ChallengeTest[];
  hints: {
    id: string;
    level: 'basic' | 'detailed' | 'solution';
    content: string;
  }[];
  sandboxUrl: string;
  sandboxMode: 'secure' | 'open';
  passingScore: number; // minimum score to pass the challenge (0-100)
}

// Storage keys
const STORAGE_KEYS = {
  CHALLENGES: 'challenge_service_challenges',
  PROGRESS: 'challenge_service_progress'
} as const;

// Helper to generate a unique ID using uuid
const generateId = (): string => {
  return uuidv4();
};

// Input validation helpers
const validateChallengeId = (challengeId: string): void => {
  if (!challengeId || typeof challengeId !== 'string' || challengeId.trim().length === 0) {
    throw new Error('Challenge ID is required and must be a non-empty string');
  }
};

const validateUserId = (userId: string): void => {
  if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
    throw new Error('User ID is required and must be a non-empty string');
  }
};

const validateChallengeProgress = (progress: Partial<ChallengeProgress>): string[] => {
  const errors: string[] = [];

  if (!progress.challengeId || typeof progress.challengeId !== 'string') {
    errors.push('Challenge ID is required and must be a string');
  }

  if (!progress.userId || typeof progress.userId !== 'string') {
    errors.push('User ID is required and must be a string');
  }

  if (progress.timeSpent !== undefined && (typeof progress.timeSpent !== 'number' || progress.timeSpent < 0)) {
    errors.push('Time spent must be a non-negative number');
  }

  if (progress.attempts !== undefined && (typeof progress.attempts !== 'number' || progress.attempts < 0)) {
    errors.push('Attempts must be a non-negative number');
  }

  if (progress.score !== undefined && (typeof progress.score !== 'number' || progress.score < 0 || progress.score > 100)) {
    errors.push('Score must be a number between 0 and 100');
  }

  return errors;
};

// ChallengeService class
export class ChallengeService {
  // Storage helper methods with improved error handling
  private static async getStoredChallenges(): Promise<Record<string, ChallengeWithTests>> {
    try {
      return await get(STORAGE_KEYS.CHALLENGES) || {};
    } catch (error) {
      logError('Error getting stored challenges', error);
      return {};
    }
  }

  private static async saveStoredChallenges(challenges: Record<string, ChallengeWithTests>): Promise<boolean> {
    try {
      await set(STORAGE_KEYS.CHALLENGES, challenges);
      return true;
    } catch (error) {
      logError('Error saving stored challenges', error);
      return false;
    }
  }

  private static async getStoredProgress(): Promise<Record<string, ChallengeProgress>> {
    try {
      return await get(STORAGE_KEYS.PROGRESS) || {};
    } catch (error) {
      logError('Error getting stored progress', error);
      return {};
    }
  }

  private static async saveStoredProgress(progress: Record<string, ChallengeProgress>): Promise<boolean> {
    try {
      await set(STORAGE_KEYS.PROGRESS, progress);
      return true;
    } catch (error) {
      logError('Error saving stored progress', error);
      return false;
    }
  }

  // Get all challenges - use lightweight metadata
  static async getChallenges(): Promise<Challenge[]> {
    return challengesMeta;
  }

  // Get challenge by ID - use dynamic loading with validation
  static async getChallenge(id: string): Promise<ChallengeWithTests | null> {
    validateChallengeId(id);
    return ChallengeLoaderService.loadChallengeDetails(id);
  }

  // Create a new challenge with validation
  static async createChallenge(challenge: Omit<ChallengeWithTests, 'id'>): Promise<ChallengeWithTests> {
    if (!challenge || typeof challenge !== 'object') {
      throw new Error('Challenge data is required and must be an object');
    }

    if (!challenge.title || typeof challenge.title !== 'string') {
      throw new Error('Challenge title is required and must be a string');
    }

    if (!challenge.difficulty || !['beginner', 'intermediate', 'advanced'].includes(challenge.difficulty)) {
      throw new Error('Challenge difficulty must be one of: beginner, intermediate, advanced');
    }

    const id = generateId();
    const newChallenge = { ...challenge, id };

    const challenges = await this.getStoredChallenges();
    challenges[id] = newChallenge;
    const success = await this.saveStoredChallenges(challenges);

    if (!success) {
      throw new Error('Failed to save challenge to storage');
    }

    return newChallenge;
  }

  // Update a challenge with validation
  static async updateChallenge(id: string, challenge: Partial<ChallengeWithTests>): Promise<ChallengeWithTests | null> {
    validateChallengeId(id);

    if (!challenge || typeof challenge !== 'object') {
      throw new Error('Challenge update data is required and must be an object');
    }

    const challenges = await this.getStoredChallenges();
    if (!challenges[id]) return null;

    challenges[id] = {
      ...challenges[id],
      ...challenge
    };

    const success = await this.saveStoredChallenges(challenges);
    if (!success) {
      throw new Error('Failed to save updated challenge to storage');
    }

    return challenges[id];
  }

  // Delete a challenge with validation
  static async deleteChallenge(id: string): Promise<boolean> {
    validateChallengeId(id);

    const challenges = await this.getStoredChallenges();
    if (!challenges[id]) return false;

    delete challenges[id];
    const success = await this.saveStoredChallenges(challenges);
    if (!success) {
      throw new Error('Failed to save challenges after deletion');
    }
    return true;
  }

  // Start a challenge for a user with validation
  static async startChallenge(userId: string, challengeId: string): Promise<ChallengeProgress> {
    validateUserId(userId);
    validateChallengeId(challengeId);

    const progressData = await this.getStoredProgress();
    
    // Check if the user has already started this challenge
    const existingProgress = Object.values(progressData).find(
      p => p.userId === userId && p.challengeId === challengeId
    );

    if (existingProgress) {
      // If already completed, don't modify
      if (existingProgress.completedAt) {
        return existingProgress;
      }

      // If in progress, update the attempts
      existingProgress.attempts += 1;
      progressData[existingProgress.id] = existingProgress;
      const success = await this.saveStoredProgress(progressData);
      if (!success) {
        throw new Error('Failed to save updated progress');
      }
      return existingProgress;
    }

    // Create new progress
    const progressId = generateId();
    const progress: ChallengeProgress = {
      id: progressId,
      userId,
      challengeId,
      startedAt: new Date().toISOString(),
      completedObjectives: [],
      timeSpent: 0,
      attempts: 1
    };

    progressData[progressId] = progress;
    const success = await this.saveStoredProgress(progressData);
    if (!success) {
      throw new Error('Failed to save new progress');
    }
    return progress;
  }

  // Update challenge progress with validation
  static async updateProgress(
    userId: string,
    challengeId: string,
    updates: Partial<Omit<ChallengeProgress, 'id' | 'userId' | 'challengeId'>>
  ): Promise<ChallengeProgress | null> {
    validateUserId(userId);
    validateChallengeId(challengeId);

    if (!updates || typeof updates !== 'object') {
      throw new Error('Progress updates are required and must be an object');
    }

    const progressData = await this.getStoredProgress();
    
    // Find the progress
    const progress = Object.values(progressData).find(
      p => p.userId === userId && p.challengeId === challengeId
    );

    if (!progress) return null;

    // Validate the updates
    const validationErrors = validateChallengeProgress({ ...progress, ...updates });
    if (validationErrors.length > 0) {
      throw new Error(`Progress validation failed: ${validationErrors.join(', ')}`);
    }

    // Update the progress
    const updatedProgress = {
      ...progress,
      ...updates
    };

    progressData[progress.id] = updatedProgress;
    const success = await this.saveStoredProgress(progressData);
    if (!success) {
      throw new Error('Failed to save updated progress');
    }
    return updatedProgress;
  }

  // Complete a challenge objective with validation
  static async completeObjective(
    userId: string,
    challengeId: string,
    objectiveId: string
  ): Promise<ChallengeProgress | null> {
    validateUserId(userId);
    validateChallengeId(challengeId);

    if (!objectiveId || typeof objectiveId !== 'string' || objectiveId.trim().length === 0) {
      throw new Error('Objective ID is required and must be a non-empty string');
    }

    const progressData = await this.getStoredProgress();

    // Find the progress
    const progress = Object.values(progressData).find(
      p => p.userId === userId && p.challengeId === challengeId
    );

    if (!progress) return null;

    // Check if objective is already completed
    if (progress.completedObjectives.includes(objectiveId)) {
      return progress;
    }

    // Add the objective to completed list
    const updatedObjectives = [...progress.completedObjectives, objectiveId];

    // Update the progress
    return this.updateProgress(userId, challengeId, {
      completedObjectives: updatedObjectives
    });
  }

  // Submit challenge for completion with validation
  static async submitChallenge(
    userId: string,
    challengeId: string,
    testResults: Record<string, TestResult>
  ): Promise<{ success: boolean; score: number; message: string }> {
    validateUserId(userId);
    validateChallengeId(challengeId);

    if (!testResults || typeof testResults !== 'object') {
      throw new Error('Test results are required and must be an object');
    }
    // Find the challenge
    const challenges = await this.getStoredChallenges();
    const challenge = challenges[challengeId];
    if (!challenge) {
      return {
        success: false,
        score: 0,
        message: 'Challenge not found'
      };
    }

    // Find the progress
    const progressData = await this.getStoredProgress();
    const progress = Object.values(progressData).find(
      p => p.userId === userId && p.challengeId === challengeId
    );

    if (!progress) {
      return {
        success: false,
        score: 0,
        message: 'Challenge not started'
      };
    }

    // Calculate score based on test results
    let totalWeight = 0;
    let weightedScore = 0;

    challenge.tests.forEach(test => {
      const result = testResults[test.id];
      if (result) {
        totalWeight += test.weight;
        if (result.passed) {
          weightedScore += test.weight;
        }
      }
    });

    const score = totalWeight > 0
      ? Math.round((weightedScore / totalWeight) * 100)
      : 0;

    // Check if all required objectives are completed
    const requiredObjectives = challenge.objectives
      .filter(obj => obj.required)
      .map(obj => obj.id);

    const allRequiredCompleted = requiredObjectives.every(
      objId => progress.completedObjectives.includes(objId)
    );

    // Determine if challenge is passed
    const passed = score >= challenge.passingScore && allRequiredCompleted;

    // Update progress
    await this.updateProgress(userId, challengeId, {
      testResults,
      score,
      completedAt: passed ? new Date().toISOString() : undefined
    });

    return {
      success: passed,
      score,
      message: passed
        ? `Congratulations! You've completed the challenge with a score of ${score}%.`
        : `Challenge not completed. Your current score is ${score}%. Required score: ${challenge.passingScore}%.`
    };
  }

  // Get user progress for a challenge with validation
  static async getUserProgress(
    userId: string,
    challengeId: string
  ): Promise<ChallengeProgress | null> {
    validateUserId(userId);
    validateChallengeId(challengeId);

    const progressData = await this.getStoredProgress();
    return Object.values(progressData).find(
      p => p.userId === userId && p.challengeId === challengeId
    ) || null;
  }

  // Get all user progress with validation
  static async getUserProgressAll(userId: string): Promise<ChallengeProgress[]> {
    validateUserId(userId);

    const progressData = await this.getStoredProgress();
    return Object.values(progressData).filter(
      p => p.userId === userId
    );
  }
}

export default ChallengeService;
