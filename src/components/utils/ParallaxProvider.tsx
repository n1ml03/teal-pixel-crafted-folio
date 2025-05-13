import { ParallaxProvider as ScrollParallaxProvider } from 'react-scroll-parallax';

/**
 * ParallaxProvider component that wraps the ScrollParallaxProvider
 * with a relative positioned container to ensure scroll offset is calculated correctly
 */
export function ParallaxProvider({ children }: { children: React.ReactNode }) {
  return (
    <ScrollParallaxProvider>
      <div className="relative w-full h-full">
        {children}
      </div>
    </ScrollParallaxProvider>
  );
}
