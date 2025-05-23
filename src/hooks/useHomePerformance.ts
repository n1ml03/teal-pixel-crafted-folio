import { useState, useEffect, useCallback, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

interface PerformanceMetrics {
  deviceMemory?: number;
  hardwareConcurrency?: number;
  networkType?: string;
  batteryLevel?: number;
  isCharging?: boolean;
}

interface HomePerformanceState {
  isLoaded: boolean;
  isLowPerformanceDevice: boolean;
  prefersReducedMotion: boolean;
  performanceMetrics: PerformanceMetrics;
  visibleSections: Record<string, boolean>;
  shouldRenderEnhancedBackground: boolean;
}

export function useHomePerformance() {
  const [state, setState] = useState<HomePerformanceState>({
    isLoaded: false,
    isLowPerformanceDevice: false,
    prefersReducedMotion: false,
    performanceMetrics: {},
    visibleSections: {
      hero: true, // Hero luôn visible ngay từ đầu
      services: false,
      projects: false,
      experience: false,
      certifications: false,
      contact: false
    },
    shouldRenderEnhancedBackground: false
  });

  const observersRef = useRef<Map<string, IntersectionObserver>>(new Map());
  const frameworkMotionPreference = useReducedMotion();

  // Comprehensive device performance detection
  const detectDevicePerformance = useCallback(async (): Promise<boolean> => {
    const metrics: PerformanceMetrics = {};
    
    // Memory detection
    if ('deviceMemory' in navigator) {
      metrics.deviceMemory = (navigator as any).deviceMemory;
    }
    
    // CPU cores detection
    if (navigator.hardwareConcurrency) {
      metrics.hardwareConcurrency = navigator.hardwareConcurrency;
    }
    
    // Network type detection
    if ('connection' in navigator) {
      const conn = (navigator as any).connection;
      metrics.networkType = conn?.effectiveType;
    }
    
    // Battery status detection
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        metrics.batteryLevel = battery.level;
        metrics.isCharging = battery.charging;
      } catch (error) {
        console.warn('Battery API not available');
      }
    }

    // Performance scoring algorithm
    let performanceScore = 100;
    
    // Memory impact (40% weight)
    if (metrics.deviceMemory) {
      if (metrics.deviceMemory < 2) performanceScore -= 40;
      else if (metrics.deviceMemory < 4) performanceScore -= 25;
      else if (metrics.deviceMemory < 8) performanceScore -= 10;
    } else {
      performanceScore -= 20; // Unknown memory is risky
    }
    
    // CPU impact (30% weight)
    if (metrics.hardwareConcurrency) {
      if (metrics.hardwareConcurrency < 2) performanceScore -= 30;
      else if (metrics.hardwareConcurrency < 4) performanceScore -= 20;
      else if (metrics.hardwareConcurrency < 8) performanceScore -= 10;
    } else {
      performanceScore -= 15; // Unknown CPU is risky
    }
    
    // Network impact (20% weight)
    if (metrics.networkType) {
      if (metrics.networkType === 'slow-2g') performanceScore -= 20;
      else if (metrics.networkType === '2g') performanceScore -= 15;
      else if (metrics.networkType === '3g') performanceScore -= 10;
    }
    
    // Battery impact (10% weight)
    if (metrics.batteryLevel !== undefined) {
      if (metrics.batteryLevel < 0.15 && !metrics.isCharging) {
        performanceScore -= 10;
      }
    }
    
    // Mobile device detection (additional penalty)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) performanceScore -= 15;

    // Update metrics in state
    setState(prev => ({
      ...prev,
      performanceMetrics: metrics
    }));

    // Low performance if score < 70
    return performanceScore < 70;
  }, []);

  // Setup intersection observers for section visibility
  const setupIntersectionObservers = useCallback(() => {
    const sectionIds = ['services', 'projects', 'experience', 'certifications', 'contact'];
    
    sectionIds.forEach(sectionId => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setState(prev => ({
              ...prev,
              visibleSections: {
                ...prev.visibleSections,
                [sectionId]: true
              }
            }));
            // Disconnect after first intersection to save resources
            observer.disconnect();
          }
        },
        {
          rootMargin: '150px 0px', // Load 150px before section appears
          threshold: 0.1
        }
      );

      const element = document.getElementById(`${sectionId}-section`);
      if (element) {
        observer.observe(element);
        observersRef.current.set(sectionId, observer);
      }
    });
  }, []);

  // Initialize performance detection and observers
  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        // Detect device performance
        const isLowPerf = await detectDevicePerformance();
        
        if (!mounted) return;

        // Update motion preference
        const prefersReduced = frameworkMotionPreference || false;
        
        setState(prev => ({
          ...prev,
          isLowPerformanceDevice: isLowPerf,
          prefersReducedMotion: prefersReduced
        }));

        // Setup intersection observers after initial detection
        setTimeout(setupIntersectionObservers, 100);

        // Mark as loaded after critical initialization
        setTimeout(() => {
          if (mounted) {
            setState(prev => ({
              ...prev,
              isLoaded: true,
              shouldRenderEnhancedBackground: !isLowPerf && !prefersReduced
            }));
          }
        }, isLowPerf ? 1500 : 800); // Delay more for low-perf devices

      } catch (error) {
        console.warn('Performance detection failed:', error);
        if (mounted) {
          setState(prev => ({
            ...prev,
            isLoaded: true,
            isLowPerformanceDevice: true // Safe default
          }));
        }
      }
    };

    initialize();

    return () => {
      mounted = false;
      // Cleanup observers
      observersRef.current.forEach(observer => observer.disconnect());
      observersRef.current.clear();
    };
  }, [detectDevicePerformance, setupIntersectionObservers, frameworkMotionPreference]);

  // Enhanced section visibility checker
  const isSectionVisible = useCallback((sectionId: string): boolean => {
    return state.isLoaded || state.visibleSections[sectionId];
  }, [state.isLoaded, state.visibleSections]);

  return {
    ...state,
    isSectionVisible,
    // Helper methods
    refreshPerformanceDetection: detectDevicePerformance
  };
} 