/**
 * Utilities for optimizing and monitoring the browser's back/forward cache (bfcache)
 *
 * The bfcache is a performance optimization that allows instant back and forward
 * navigation by storing a complete snapshot of a page in memory.
 *
 * These utilities help ensure the application is compatible with bfcache and
 * provide monitoring to track bfcache hits and misses.
 */

/**
 * Initializes bfcache monitoring and optimization
 * @returns A cleanup function to remove event listeners
 */
export function initBfCacheOptimization(): () => void {
  // Track if the page was restored from bfcache
  let wasRestoredFromBfCache = false;

  // Handle pageshow event which fires when a page is loaded or restored from bfcache
  const handlePageShow = (event: PageTransitionEvent) => {
    // If persisted is true, the page was restored from bfcache
    if (event.persisted) {
      console.log('Page restored from bfcache');
      wasRestoredFromBfCache = true;

      // Dispatch a custom event that components can listen for
      window.dispatchEvent(new CustomEvent('bfcacheRestore'));

      // Report bfcache hit to analytics if needed
      reportBfCacheEvent('hit');
    }
  };

  // Handle pagehide event which fires when navigating away from a page
  const handlePageHide = (event: PageTransitionEvent) => {
    // Report whether the page is eligible for bfcache
    // Note: document.wasDiscarded is not a standard property
    // Instead, we can check if the page is being persisted for bfcache
    if (event.persisted === false) {
      console.log('Page was not persisted in bfcache');
      reportBfCacheEvent('miss');
    } else {
      console.log('Page hidden, may be stored in bfcache');
    }
  };

  // Use visibilitychange instead of beforeunload when possible
  // beforeunload can prevent bfcache in some browsers
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      // Save any necessary state to localStorage here
      // This is more bfcache-friendly than using beforeunload
      saveStateForBfCache();
    } else if (document.visibilityState === 'visible' && wasRestoredFromBfCache) {
      // Page became visible after being restored from bfcache
      // Refresh any stale data here
      refreshStaleData();
      wasRestoredFromBfCache = false;
    }
  };

  // Add event listeners
  window.addEventListener('pageshow', handlePageShow);
  window.addEventListener('pagehide', handlePageHide);
  document.addEventListener('visibilitychange', handleVisibilityChange);

  // Return cleanup function
  return () => {
    window.removeEventListener('pageshow', handlePageShow);
    window.removeEventListener('pagehide', handlePageHide);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}

/**
 * Saves application state for bfcache restoration
 */
function saveStateForBfCache(): void {
  try {
    // Get current route
    const currentRoute = window.location.pathname;

    // Save timestamp to detect stale data on restore
    const timestamp = Date.now();

    // Save to localStorage
    localStorage.setItem('bfcache_state', JSON.stringify({
      route: currentRoute,
      timestamp,
    }));
  } catch (error) {
    console.error('Error saving state for bfcache:', error);
  }
}

/**
 * Refreshes any stale data after bfcache restoration
 */
function refreshStaleData(): void {
  try {
    // Get saved state
    const stateJson = localStorage.getItem('bfcache_state');
    if (!stateJson) return;

    const state = JSON.parse(stateJson);
    const timestamp = state.timestamp;
    const currentTime = Date.now();

    // If data is older than 5 minutes, consider it stale
    const isStale = currentTime - timestamp > 5 * 60 * 1000;

    if (isStale) {
      console.log('Detected stale data after bfcache restoration, refreshing...');

      // Dispatch event for components to refresh their data
      window.dispatchEvent(new CustomEvent('refreshStaleData'));

      // For specific routes, you might want to refresh specific data
      if (state.route.includes('/playground')) {
        // Refresh playground-specific data
        window.dispatchEvent(new CustomEvent('refreshPlaygroundData'));
      }
    }
  } catch (error) {
    console.error('Error refreshing stale data:', error);
  }
}

/**
 * Reports bfcache events for analytics
 * @param eventType The type of bfcache event
 */
function reportBfCacheEvent(eventType: 'hit' | 'miss' | 'discard'): void {
  // In a real implementation, this would send data to an analytics service
  console.log(`BFCache event: ${eventType}`);

  // Example of sending to analytics
  // Use a safer check for gtag existence
  const gtag = (window as any).gtag;
  if (typeof gtag === 'function') {
    gtag('event', 'bfcache', {
      event_category: 'performance',
      event_label: eventType,
      non_interaction: true
    });
  }
}

/**
 * Checks if the current page is likely to be eligible for bfcache
 * @returns An object with eligibility status and reasons for ineligibility
 */
export function checkBfCacheEligibility(): { eligible: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // Check for beforeunload event listeners
  const hasBeforeUnloadListener = typeof window.onbeforeunload === 'function';

  // We can't reliably detect all event listeners, so we just check for the common ones
  if (hasBeforeUnloadListener) {
    reasons.push('Page has beforeunload event listeners');
  }

  // Check for service worker
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    // Note: Having a service worker doesn't necessarily prevent bfcache,
    // but it can if not properly configured
    reasons.push('Page is controlled by a service worker (may need configuration)');
  }

  // Check for IndexedDB availability - we can't reliably check for open connections
  // but we can warn if IndexedDB is being used at all
  if ('indexedDB' in window) {
    reasons.push('Page uses IndexedDB (may affect bfcache if connections remain open)');
  }

  // Check for cross-origin iframes
  if (document.querySelectorAll('iframe[src*="http"]:not([src*="' + window.location.hostname + '"])').length > 0) {
    reasons.push('Page has cross-origin iframes');
  }

  // Check for open WebSocket connections
  // This is a best-effort check, as we can't access all WebSockets
  const hasWebSockets = typeof WebSocket !== 'undefined' &&
                        Array.from(document.querySelectorAll('script'))
                          .some(script => script.textContent?.includes('new WebSocket'));
  if (hasWebSockets) {
    reasons.push('Page may have WebSocket connections');
  }

  return {
    eligible: reasons.length === 0,
    reasons
  };
}
