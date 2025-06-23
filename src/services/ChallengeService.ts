import { Challenge } from '@/components/playground/ChallengeCard';
import { TestResult } from '../types/playground';
import { ChallengeLoaderService } from './ChallengeLoaderService';
import challengesMeta from '@/data/challengesMeta';

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

// Mock storage for challenges and progress
const challengesStorage: Record<string, ChallengeWithTests> = {};
const progressStorage: Record<string, ChallengeProgress> = {};

// Helper to generate a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
};

// ChallengeService class
export class ChallengeService {
  // Get all challenges - use lightweight metadata
  static async getChallenges(): Promise<Challenge[]> {
    return challengesMeta;
  }

  // Get challenge by ID - use dynamic loading
  static async getChallenge(id: string): Promise<ChallengeWithTests | null> {
    return ChallengeLoaderService.loadChallengeDetails(id);
  }

  // Create a new challenge
  static async createChallenge(challenge: Omit<ChallengeWithTests, 'id'>): Promise<ChallengeWithTests> {
    const id = generateId();
    const newChallenge = { ...challenge, id };
    challengesStorage[id] = newChallenge;
    return newChallenge;
  }

  // Update a challenge
  static async updateChallenge(id: string, challenge: Partial<ChallengeWithTests>): Promise<ChallengeWithTests | null> {
    if (!challengesStorage[id]) return null;

    challengesStorage[id] = {
      ...challengesStorage[id],
      ...challenge
    };

    return challengesStorage[id];
  }

  // Delete a challenge
  static async deleteChallenge(id: string): Promise<boolean> {
    if (!challengesStorage[id]) return false;

    delete challengesStorage[id];
    return true;
  }

  // Start a challenge for a user
  static async startChallenge(userId: string, challengeId: string): Promise<ChallengeProgress> {
    // Check if the user has already started this challenge
    const existingProgress = Object.values(progressStorage).find(
      p => p.userId === userId && p.challengeId === challengeId
    );

    if (existingProgress) {
      // If already completed, don't modify
      if (existingProgress.completedAt) {
        return existingProgress;
      }

      // If in progress, update the attempts
      existingProgress.attempts += 1;
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

    progressStorage[progressId] = progress;
    return progress;
  }

  // Update challenge progress
  static async updateProgress(
    userId: string,
    challengeId: string,
    updates: Partial<Omit<ChallengeProgress, 'id' | 'userId' | 'challengeId'>>
  ): Promise<ChallengeProgress | null> {
    // Find the progress
    const progress = Object.values(progressStorage).find(
      p => p.userId === userId && p.challengeId === challengeId
    );

    if (!progress) return null;

    // Update the progress
    const updatedProgress = {
      ...progress,
      ...updates
    };

    progressStorage[progress.id] = updatedProgress;
    return updatedProgress;
  }

  // Complete a challenge objective
  static async completeObjective(
    userId: string,
    challengeId: string,
    objectiveId: string
  ): Promise<ChallengeProgress | null> {
    // Find the progress
    const progress = Object.values(progressStorage).find(
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

  // Submit challenge for completion
  static async submitChallenge(
    userId: string,
    challengeId: string,
    testResults: Record<string, TestResult>
  ): Promise<{ success: boolean; score: number; message: string }> {
    // Find the challenge
    const challenge = challengesStorage[challengeId];
    if (!challenge) {
      return {
        success: false,
        score: 0,
        message: 'Challenge not found'
      };
    }

    // Find the progress
    const progress = Object.values(progressStorage).find(
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

  // Get user progress for a challenge
  static async getUserProgress(
    userId: string,
    challengeId: string
  ): Promise<ChallengeProgress | null> {
    return Object.values(progressStorage).find(
      p => p.userId === userId && p.challengeId === challengeId
    ) || null;
  }

  // Get all user progress
  static async getUserProgressAll(userId: string): Promise<ChallengeProgress[]> {
    return Object.values(progressStorage).filter(
      p => p.userId === userId
    );
  }
}

export default ChallengeService;
