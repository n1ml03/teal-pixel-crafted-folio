import { ChallengeWithTests } from './ChallengeService';
import challengesMeta from '../data/challengesMeta';

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
    // Return from cache if already loaded
    if (this.challengeCache[challengeId]) {
      return this.challengeCache[challengeId];
    }

    try {
      // Dynamically import the full challenges data
      // This will be code-split by the bundler
      const { challenges } = await import('../data/challenges');
      
      // Find the requested challenge
      const challenge = challenges.find(c => c.id === challengeId);
      
      if (challenge) {
        // Store in cache for future requests
        this.challengeCache[challengeId] = challenge;
        return challenge;
      }
      
      return null;
    } catch (error) {
      console.error('Error loading challenge details:', error);
      return null;
    }
  }

  /**
   * Preload challenge details for a set of challenges
   * Useful for preloading challenges that are likely to be viewed soon
   * @param challengeIds Array of challenge IDs to preload
   */
  static async preloadChallenges(challengeIds: string[]): Promise<void> {
    try {
      // Only import once for all requested challenges
      const { challenges } = await import('../data/challenges');
      
      // Filter and cache the requested challenges
      challengeIds.forEach(id => {
        const challenge = challenges.find(c => c.id === id);
        if (challenge) {
          this.challengeCache[id] = challenge;
        }
      });
    } catch (error) {
      console.error('Error preloading challenges:', error);
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
