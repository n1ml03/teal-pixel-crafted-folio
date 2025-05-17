/**
 * Font loading utilities to prevent layout shifts
 */

/**
 * Loads fonts and adds a class to the document when they're ready
 * This helps prevent layout shifts caused by font loading
 */
export function loadFonts(): void {
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
        const fontPromise = (document as any).fonts.load(`${weight} 1em ${font.family}`);
        fontPromises.push(fontPromise);
      });
    });

    // When all fonts are loaded, add the class to the document
    Promise.all(fontPromises)
      .then(() => {
        document.documentElement.classList.add('fonts-loaded');
        console.log('All fonts loaded successfully');
      })
      .catch(error => {
        // If fonts fail to load, still add the class to use fallbacks
        document.documentElement.classList.add('fonts-loaded');
        console.warn('Error loading fonts:', error);
      });
  } else {
    // For browsers that don't support the Font Loading API
    // Add the class after a short timeout to use fallbacks
    setTimeout(() => {
      document.documentElement.classList.add('fonts-loaded');
    }, 300);
  }
}

/**
 * Preloads critical fonts to reduce layout shifts
 * @param fontUrls Array of font URLs to preload
 */
export function preloadFonts(fontUrls: string[]): void {
  fontUrls.forEach(url => {
    const link = document.createElement('link');
    link.href = url;
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}
