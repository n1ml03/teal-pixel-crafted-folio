/**
 * Font loading utilities to prevent layout shifts
 */
import { resourceManager } from './resource-manager';

/**
 * Loads fonts and adds a class to the document when they're ready
 * This helps prevent layout shifts caused by font loading
 */
export function loadFonts(): void {
  // Add fonts-loaded class immediately to use system fonts first
  // This prevents layout shifts while waiting for custom fonts
  document.documentElement.classList.add('fonts-loaded');

  // Check if the browser supports the Font Loading API
  if ('fonts' in document) {
    // Define the fonts we want to load
    const fontFamilies = [
      { family: 'Inter', weights: ['400', '500', '600', '700'] },
      { family: 'Source Code Pro', weights: ['400', '500', '600'] }
    ];

    // Create promises for each font
    const fontPromises: Promise<FontFace>[] = [];

    fontFamilies.forEach(font => {
      font.weights.forEach(weight => {
        // Create a promise for each font weight
        const fontPromise = (document as Document & { fonts?: { load: (font: string) => Promise<FontFace[]> } }).fonts?.load(`${weight} 1em ${font.family}`);
        if (fontPromise) {
          fontPromises.push(fontPromise);
        }
      });
    });

    // When critical fonts are loaded, add the custom-fonts-loaded class
    // This will swap from system fonts to custom fonts
    Promise.all(fontPromises)
      .then(() => {
        document.documentElement.classList.add('custom-fonts-loaded');
        console.log('All fonts loaded successfully');
      })
      .catch(error => {
        // If fonts fail to load, still add the class to use fallbacks
        document.documentElement.classList.add('custom-fonts-loaded');
        console.warn('Error loading fonts:', error);
      });
  } else {
    // For browsers that don't support the Font Loading API
    // Add the class after a short timeout to use fallbacks
    setTimeout(() => {
      document.documentElement.classList.add('custom-fonts-loaded');
    }, 300);
  }
}

/**
 * @deprecated Use resourceManager.preloadMany() from resource-manager.ts instead
 * Preloads critical fonts to reduce layout shifts
 * @param fontUrls Array of font URLs to preload
 */
export function preloadFonts(fontUrls: string[]): void {
  console.warn('preloadFonts is deprecated. Use resourceManager from resource-manager.ts instead.');

  const resources = fontUrls.map(url => ({
    href: url,
    as: 'font' as const,
    type: 'font/woff2',
    crossorigin: 'anonymous' as const,
    fetchPriority: 'high' as const
  }));

  resourceManager.preloadMany(resources);
}
