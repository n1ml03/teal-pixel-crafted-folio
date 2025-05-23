import { useState, useEffect, useCallback } from 'react';

interface AccessibilityState {
  reduceMotion: boolean;
  highContrast: boolean;
  focusVisible: boolean;
  screenReaderEnabled: boolean;
  fontSize: 'small' | 'medium' | 'large';
  keyboardNavigation: boolean;
}

interface AccessibilityPreferences {
  skipAnimations: boolean;
  announceChanges: boolean;
  enhanceFocus: boolean;
  simplifyInterface: boolean;
}

export function useAccessibility() {
  const [state, setState] = useState<AccessibilityState>({
    reduceMotion: false,
    highContrast: false,
    focusVisible: false,
    screenReaderEnabled: false,
    fontSize: 'medium',
    keyboardNavigation: false
  });

  const [preferences, setPreferences] = useState<AccessibilityPreferences>({
    skipAnimations: false,
    announceChanges: true,
    enhanceFocus: true,
    simplifyInterface: false
  });

  // Detect various accessibility preferences and capabilities
  const detectAccessibilityFeatures = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Detect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Detect high contrast preference
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    
    // Detect if user is using keyboard navigation
    let isUsingKeyboard = false;
    
    // Detect screen reader (heuristic approach)
    const hasScreenReader = !!(
      navigator.userAgent.includes('NVDA') ||
      navigator.userAgent.includes('JAWS') ||
      navigator.userAgent.includes('VoiceOver') ||
      // Check for accessibility tree presence
      document.createElement('div').setAttribute('aria-hidden', 'true')
    );

    setState(prev => ({
      ...prev,
      reduceMotion: prefersReducedMotion,
      highContrast: prefersHighContrast,
      screenReaderEnabled: hasScreenReader,
      keyboardNavigation: isUsingKeyboard
    }));

    setPreferences(prev => ({
      ...prev,
      skipAnimations: prefersReducedMotion,
      simplifyInterface: prefersHighContrast || hasScreenReader
    }));
  }, []);

  // Announce changes to screen readers
  const announceToScreenReader = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!preferences.announceChanges) return;

    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.cssText = `
      position: absolute !important;
      left: -10000px !important;
      width: 1px !important;
      height: 1px !important;
      overflow: hidden !important;
    `;
    
    document.body.appendChild(announcement);
    
    // Small delay to ensure screen reader picks it up
    setTimeout(() => {
      announcement.textContent = message;
    }, 100);

    // Clean up after announcement
    setTimeout(() => {
      if (announcement.parentNode) {
        announcement.parentNode.removeChild(announcement);
      }
    }, 2000);
  }, [preferences.announceChanges]);

  // Enhanced focus management
  const enhanceFocus = useCallback((element: HTMLElement) => {
    if (!preferences.enhanceFocus) return;

    element.style.outline = '3px solid #3B82F6';
    element.style.outlineOffset = '2px';
    element.style.borderRadius = '4px';
  }, [preferences.enhanceFocus]);

  // Skip to main content functionality
  const skipToMainContent = useCallback(() => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
      announceToScreenReader('Đã chuyển đến nội dung chính');
    }
  }, [announceToScreenReader]);

  // Keyboard event handlers
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    setState(prev => ({ ...prev, keyboardNavigation: true }));

    // Handle accessibility shortcuts
    switch (event.key) {
      case 'Escape':
        // Close modals, dropdowns, etc.
        const activeModal = document.querySelector('[role="dialog"][aria-hidden="false"]');
        if (activeModal) {
          (activeModal as HTMLElement).style.display = 'none';
          announceToScreenReader('Đã đóng hộp thoại');
        }
        break;
      
      case 'F6':
        // Skip between major page sections
        event.preventDefault();
        skipToMainContent();
        break;
    }
  }, [announceToScreenReader, skipToMainContent]);

  // Handle mouse usage (indicates not purely keyboard navigation)
  const handleMouseDown = useCallback(() => {
    setState(prev => ({ ...prev, keyboardNavigation: false }));
  }, []);

  // Initialize accessibility features
  useEffect(() => {
    detectAccessibilityFeatures();

    // Listen for media query changes
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setState(prev => ({ ...prev, reduceMotion: e.matches }));
      setPreferences(prev => ({ ...prev, skipAnimations: e.matches }));
    };

    const handleContrastChange = (e: MediaQueryListEvent) => {
      setState(prev => ({ ...prev, highContrast: e.matches }));
      setPreferences(prev => ({ ...prev, simplifyInterface: e.matches }));
    };

    motionQuery.addEventListener('change', handleMotionChange);
    contrastQuery.addEventListener('change', handleContrastChange);

    // Add keyboard and mouse event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    // Add focus visible detection
    const handleFocusVisible = () => {
      setState(prev => ({ ...prev, focusVisible: true }));
    };

    const handleFocusNotVisible = () => {
      setState(prev => ({ ...prev, focusVisible: false }));
    };

    document.addEventListener('focus', handleFocusVisible, true);
    document.addEventListener('blur', handleFocusNotVisible, true);

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      contrastQuery.removeEventListener('change', handleContrastChange);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('focus', handleFocusVisible, true);
      document.removeEventListener('blur', handleFocusNotVisible, true);
    };
  }, [detectAccessibilityFeatures, handleKeyDown, handleMouseDown]);

  // Apply font size changes
  const setFontSize = useCallback((size: AccessibilityState['fontSize']) => {
    setState(prev => ({ ...prev, fontSize: size }));
    
    const root = document.documentElement;
    switch (size) {
      case 'small':
        root.style.fontSize = '14px';
        break;
      case 'medium':
        root.style.fontSize = '16px';
        break;
      case 'large':
        root.style.fontSize = '18px';
        break;
    }
    
    announceToScreenReader(`Đã thay đổi cỡ chữ thành ${size === 'small' ? 'nhỏ' : size === 'large' ? 'lớn' : 'vừa'}`);
  }, [announceToScreenReader]);

  // Toggle preferences
  const togglePreference = useCallback((key: keyof AccessibilityPreferences) => {
    setPreferences(prev => {
      const newValue = !prev[key];
      announceToScreenReader(`Đã ${newValue ? 'bật' : 'tắt'} ${key}`);
      return { ...prev, [key]: newValue };
    });
  }, [announceToScreenReader]);

  return {
    state,
    preferences,
    announceToScreenReader,
    enhanceFocus,
    skipToMainContent,
    setFontSize,
    togglePreference,
    // Computed accessibility flags
    shouldSkipAnimations: state.reduceMotion || preferences.skipAnimations,
    shouldSimplifyInterface: state.highContrast || state.screenReaderEnabled || preferences.simplifyInterface,
    shouldEnhanceFocus: state.keyboardNavigation || preferences.enhanceFocus
  };
} 