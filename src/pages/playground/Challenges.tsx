import { useState, useEffect, useMemo, memo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavigateWithTransition } from '@/hooks/useNavigateWithTransition';
import {
  Search,
  Filter,
  ArrowRight,
  ChevronDown,
  Loader2,
  Target,
  Trophy,
  Star,
  BookOpen
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import ChallengeCard from '@/components/playground/ChallengeCard';
import { useAuth } from '@/contexts/auth-utils';
import { UserProgressService } from '@/services/UserProgressService';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMediaQuery } from '@/lib';

// Import lightweight challenge metadata instead of full challenge data
import challengesMeta from '@/data/challengesMeta';
import { ChallengeLoaderService } from '@/services/ChallengeLoaderService';

// Custom hook for debounced value
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Lazy loading wrapper component for challenge cards
const LazyChallenge = memo(({ challenge, isSaved, onSave, onStart, onDetails }: {
  challenge: unknown;
  isSaved: boolean;
  onSave: () => void;
  onStart: () => void;
  onDetails: () => void;
}) => {
  const [isInView, setIsInView] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          // Use requestAnimationFrame to defer the state update
          requestAnimationFrame(() => {
            setIsInView(true);
            setHasLoaded(true);
          });
        }
      },
      {
        threshold: 0.05, // Lower threshold for better performance
        rootMargin: '100px 0px', // Load cards even earlier for smoother scrolling
      }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [hasLoaded]);

  return (
    <div ref={elementRef} style={{ minHeight: hasLoaded ? 'auto' : '300px' }}>
      {isInView || hasLoaded ? (
        <ChallengeCard
          challenge={challenge}
          isSaved={isSaved}
          onSave={onSave}
          onStart={onStart}
          onDetails={onDetails}
        />
      ) : (
        <div className="bg-white/90 rounded-lg p-6 shadow-sm border border-white/50 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6 mb-4"></div>
          <div className="flex gap-2 mb-4">
            <div className="h-6 bg-gray-200 rounded w-16"></div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-24"></div>
        </div>
      )}
    </div>
  );
});

LazyChallenge.displayName = 'LazyChallenge';

// Helper function to calculate level progress percentage
const calculateLevelProgress = (user: { level: number; points: number }) => {
  const currentLevelPoints = Math.pow(user.level, 2) * 100;
  const nextLevelPoints = Math.pow(user.level + 1, 2) * 100;
  const pointsNeeded = nextLevelPoints - currentLevelPoints;
  const pointsGained = user.points - currentLevelPoints;
  return Math.round((pointsGained / pointsNeeded) * 100);
};

const Challenges = memo(() => {
  const navigate = useNavigate();
  const navigateWithTransition = useNavigateWithTransition();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedChallenges, setSavedChallenges] = useState<string[]>([]);
  const [filter, setFilter] = useState('all');
  const [isLoadingProgress, setIsLoadingProgress] = useState(false);
  const [userChallenges, setUserChallenges] = useState<{ challengeId: string; progress: number }[]>([]);
  
  // Debounce search query to avoid frequent re-filtering
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Load user progress data
  useEffect(() => {
    const loadUserProgress = async () => {
      if (!user) return;

      setIsLoadingProgress(true);
      try {
        const challenges = await UserProgressService.getUserChallenges(user.id);
        setUserChallenges(challenges);

        // Update saved challenges from progress data
        const savedIds = challenges
          .filter(c => c.progress > 0)
          .map(c => c.challengeId);

        setSavedChallenges(savedIds);
      } catch (error) {
        console.error('Error loading user progress:', error);
      } finally {
        setIsLoadingProgress(false);
      }
    };

    if (user) {
      loadUserProgress();
    }
  }, [user]);

  const handleSaveChallenge = useCallback((id: string) => {
    setSavedChallenges(prev =>
      prev.includes(id)
        ? prev.filter(cid => cid !== id)
        : [...prev, id]
    );
  }, []);

  const handleStartChallenge = useCallback(async (id: string) => {
    // Preload challenge details before navigating
    await ChallengeLoaderService.loadChallengeDetails(id);
    navigateWithTransition(`/playground/challenge/${id}`);
  }, [navigateWithTransition]);

  const handleDetailsClick = useCallback(async (id: string) => {
    // Preload challenge details before navigating
    await ChallengeLoaderService.loadChallengeDetails(id);
    navigateWithTransition(`/playground/challenge-details/${id}`);
  }, [navigateWithTransition]);

  // Create a map for faster lookup of user progress
  const userProgressMap = useMemo(() => {
    return userChallenges.reduce((map, progress) => {
      map[progress.challengeId] = progress.progress;
      return map;
    }, {} as Record<string, number>);
  }, [userChallenges]);

  // Add progress information to challenges more efficiently
  const challengesWithProgress = useMemo(() => {
    return challengesMeta.map(challenge => ({
      ...challenge,
      progress: userProgressMap[challenge.id] || 0
    }));
  }, [userProgressMap]);

  // Filter challenges based on debounced search query and filter
  const filteredChallenges = useMemo(() => {
    return challengesWithProgress.filter(challenge => {
      // First check if the challenge matches the search query
      const searchTerms = debouncedSearchQuery.toLowerCase().trim();
      const matchesSearch = searchTerms === '' ||
        challenge.title.toLowerCase().includes(searchTerms) ||
        challenge.description.toLowerCase().includes(searchTerms) ||
        challenge.tags.some(tag => tag.toLowerCase().includes(searchTerms));

      // If it doesn't match the search, no need to check filters
      if (!matchesSearch) return false;

      // Apply filters based on the selected filter type
      switch (filter) {
        case 'all':
          return true;
        case 'saved':
          return savedChallenges.includes(challenge.id);
        case 'in-progress':
          return challenge.progress > 0 && challenge.progress < 100;
        case 'completed':
          return challenge.progress === 100;
        case 'beginner':
        case 'intermediate':
        case 'advanced':
          return challenge.difficulty === filter;
        default:
          return true;
      }
    });
  }, [challengesWithProgress, debouncedSearchQuery, filter, savedChallenges]);

  // Find the featured or in-progress challenge to highlight
  const featuredChallenge = challengesWithProgress.find(c => c.featured || (c.progress > 0 && c.progress < 100));

  // Stats for the user
  const userStats = useMemo(() => {
    const completed = challengesWithProgress.filter(c => c.progress === 100).length;
    const inProgress = challengesWithProgress.filter(c => c.progress > 0 && c.progress < 100).length;
    const total = challengesWithProgress.length;
    
    return {
      completed,
      inProgress,
      total,
      completionRate: Math.round((completed / total) * 100)
    };
  }, [challengesWithProgress]);

  return (
    <div className="relative">
      <main className="container py-6 pt-24 relative z-10" style={{ 
        willChange: 'scroll-position',
        transform: 'translateZ(0)',
      }}>
        {/* Hero Section */}
        <section className="mb-8">
          <div className={`${isMobile ? 'p-4' : 'p-8'} bg-gradient-to-r from-blue-500/5 via-teal-500/5 to-purple-500/5 rounded-xl border border-white/20 shadow-sm`}>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600`}>
                  {user ? `Welcome back, ${user.displayName}!` : 'Welcome to Testing Playground!'}
                </h1>

                {user && (
                  <div className="mb-4 bg-white/90 rounded-lg p-4 shadow-sm border border-white/50">
                    <div className="flex justify-between text-sm mb-2">
                      <span className={`font-medium ${isMobile ? 'text-xs' : ''}`}>Level {user.level + 1}</span>
                      <span className={`text-teal-600 font-semibold ${isMobile ? 'text-xs' : ''}`}>{calculateLevelProgress(user)}%</span>
                    </div>
                    <Progress
                      value={calculateLevelProgress(user)}
                      className="h-2"
                    />
                  </div>
                )}

                {/* User Stats */}
                {user && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div className="bg-white/90 rounded-lg p-3 text-center shadow-sm border border-white/50">
                      <Trophy className="w-4 h-4 text-yellow-500 mx-auto mb-1" />
                      <div className="text-lg font-bold text-gray-800">{userStats.completed}</div>
                      <div className="text-xs text-gray-600">Completed</div>
                    </div>
                    <div className="bg-white/90 rounded-lg p-3 text-center shadow-sm border border-white/50">
                      <BookOpen className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                      <div className="text-lg font-bold text-gray-800">{userStats.inProgress}</div>
                      <div className="text-xs text-gray-600">In Progress</div>
                    </div>
                    <div className="bg-white/90 rounded-lg p-3 text-center shadow-sm border border-white/50">
                      <Target className="w-4 h-4 text-teal-500 mx-auto mb-1" />
                      <div className="text-lg font-bold text-gray-800">{userStats.total}</div>
                      <div className="text-xs text-gray-600">Total</div>
                    </div>
                    <div className="bg-white/90 rounded-lg p-3 text-center shadow-sm border border-white/50">
                      <Star className="w-4 h-4 text-purple-500 mx-auto mb-1" />
                      <div className="text-lg font-bold text-gray-800">{userStats.completionRate}%</div>
                      <div className="text-xs text-gray-600">Success</div>
                    </div>
                  </div>
                )}

                <p className={`text-gray-700 mb-4 ${isMobile ? 'text-sm' : ''}`}>
                  {user
                    ? 'Continue your learning journey with recommended challenges.'
                    : 'Start your testing journey with our curated challenges.'}
                </p>
              </div>

              {featuredChallenge && (
                <div className={`flex flex-col ${isMobile ? 'mt-2' : 'justify-center'}`}>
                  <div className="bg-white/90 rounded-lg p-4 shadow-sm border border-white/50">
                    <div className="mb-2">
                      <Badge variant="outline" className="mb-2 bg-teal-50 border-teal-200 text-teal-700">
                        <Star className="w-3 h-3 mr-1" />
                        Recommended
                      </Badge>
                      <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-gray-800`}>{featuredChallenge.title}</h3>
                      <p className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'} mb-4 line-clamp-2`}>
                        {featuredChallenge.description}
                      </p>
                    </div>

                    <Button
                      onClick={() => handleStartChallenge(featuredChallenge.id)}
                      className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg transition-colors"
                    >
                      {featuredChallenge.progress > 0 ? 'Continue Challenge' : 'Start Challenge'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="mb-6">
          <div className="bg-white/90 rounded-lg p-4 shadow-sm border border-white/50">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search challenges..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/70 border"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-white/70 border hover:bg-white/90">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white/95">
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={filter} onValueChange={setFilter}>
                    <DropdownMenuRadioItem value="all">All Challenges</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="saved">Saved</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="in-progress">In Progress</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="completed">Completed</DropdownMenuRadioItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioItem value="beginner">Beginner</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="intermediate">Intermediate</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="advanced">Advanced</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </section>

        {/* Challenges Grid */}
        <section>
          {isLoadingProgress ? (
            <div className="flex justify-center items-center py-12">
              <div className="bg-white/90 rounded-2xl p-8 shadow-sm border border-white/50">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-gray-600 text-center">Loading challenges...</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredChallenges.map((challenge) => (
                <LazyChallenge
                  key={challenge.id}
                  challenge={challenge}
                  isSaved={savedChallenges.includes(challenge.id)}
                  onSave={() => handleSaveChallenge(challenge.id)}
                  onStart={() => handleStartChallenge(challenge.id)}
                  onDetails={() => handleDetailsClick(challenge.id)}
                />
              ))}
            </div>
          )}

          {filteredChallenges.length === 0 && !isLoadingProgress && (
            <div className="text-center py-12">
              <div className="bg-white/90 rounded-2xl p-8 shadow-sm border border-white/50">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No challenges found</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery 
                    ? "Try adjusting your search terms or filters"
                    : "No challenges match the selected filters"}
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setFilter('all');
                  }}
                  className="bg-white/70 border hover:bg-white/90"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
});

Challenges.displayName = 'Challenges';

export default Challenges;
