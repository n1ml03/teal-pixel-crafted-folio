/**
 * Zod initialization helper
 * Ensures zod is properly initialized in all environments
 */

import { z } from 'zod';

// Ensure zod is properly initialized
export const initializeZod = () => {
  try {
    // Test zod functionality
    const testSchema = z.string();
    testSchema.parse('test');
    return true;
  } catch (error) {
    console.error('Zod initialization failed:', error);
    return false;
  }
};

// Pre-initialize zod
initializeZod();

// Re-export zod for consistent usage
export { z };
export default z; 