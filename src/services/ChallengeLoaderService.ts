import { ChallengeWithTests } from './ChallengeService';
import challengesMeta from '../data/challengesMeta';

// Error logging utility to prevent sensitive information exposure
const logError = (message: string, error?: unknown): void => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[ChallengeLoaderService] ${message}`, error);
  }
};

/**
 * Service for dynamically loading challenge data
 * This improves performance by only loading detailed challenge data when needed
 */
export class ChallengeLoaderService {
  // Cache for loaded challenges to prevent repeated imports
  private static challengeCache: Record<string, ChallengeWithTests> = {};

  /**
   * Get basic metadata for all challenges
   * This is lightweight and can be loaded immediately
   */
  static getChallengeMeta() {
    return challengesMeta;
  }

  /**
   * Dynamically load detailed challenge data only when needed
   * @param challengeId The ID of the challenge to load
   */
  static async loadChallengeDetails(challengeId: string): Promise<ChallengeWithTests | null> {
    // Input validation
    if (!challengeId || typeof challengeId !== 'string' || challengeId.trim().length === 0) {
      throw new Error('Challenge ID is required and must be a non-empty string');
    }

    const sanitizedId = challengeId.trim();

    // Return from cache if already loaded
    if (this.challengeCache[sanitizedId]) {
      return this.challengeCache[sanitizedId];
    }

    try {
      // Dynamically import the full challenges data
      // This will be code-split by the bundler
      const { challenges } = await import('../data/challenges');

      // Find the requested challenge
      const challenge = challenges.find(c => c.id === sanitizedId);

      if (challenge) {
        // Store in cache for future requests
        this.challengeCache[sanitizedId] = challenge;
        return challenge;
      }

      return null;
    } catch (error) {
      logError('Error loading challenge details', error);
      return null;
    }
  }

  /**
   * Preload challenge details for a set of challenges
   * Useful for preloading challenges that are likely to be viewed soon
   * @param challengeIds Array of challenge IDs to preload
   */
  static async preloadChallenges(challengeIds: string[]): Promise<void> {
    // Input validation
    if (!Array.isArray(challengeIds)) {
      throw new Error('Challenge IDs must be provided as an array');
    }

    if (challengeIds.length === 0) {
      return; // Nothing to preload
    }

    // Validate and sanitize IDs
    const validIds = challengeIds
      .filter(id => typeof id === 'string' && id.trim().length > 0)
      .map(id => id.trim());

    if (validIds.length === 0) {
      throw new Error('At least one valid challenge ID must be provided');
    }

    try {
      // Only import once for all requested challenges
      const { challenges } = await import('../data/challenges');

      // Filter and cache the requested challenges
      validIds.forEach(id => {
        const challenge = challenges.find(c => c.id === id);
        if (challenge) {
          this.challengeCache[id] = challenge;
        }
      });
    } catch (error) {
      logError('Error preloading challenges', error);
    }
  }

  /**
   * Clear the challenge cache to free up memory
   */
  static clearCache(): void {
    this.challengeCache = {};
  }
}

export default ChallengeLoaderService;
