import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  ArrowRight,
  ChevronDown,
  Loader2
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
import { MotionButton } from "@/components/ui/motion-button";
import { useAuth } from '@/contexts/AuthContext';
import { UserProgressService } from '@/services/UserProgressService';
import EnhancedBackground from '@/components/utils/EnhancedBackground';
import { useIsMobile } from '@/hooks/use-mobile';

// Import lightweight challenge metadata instead of full challenge data
import challengesMeta from '@/data/challengesMeta';
import { ChallengeLoaderService } from '@/services/ChallengeLoaderService';

// Helper function to calculate level progress percentage
const calculateLevelProgress = (user: { level: number; points: number }) => {
  const currentLevelPoints = Math.pow(user.level, 2) * 100;
  const nextLevelPoints = Math.pow(user.level + 1, 2) * 100;
  const pointsNeeded = nextLevelPoints - currentLevelPoints;
  const pointsGained = user.points - currentLevelPoints;
  return Math.round((pointsGained / pointsNeeded) * 100);
};

const Challenges = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState('');
  const [savedChallenges, setSavedChallenges] = useState<string[]>([]);
  const [filter, setFilter] = useState('all');
  const [isLoadingProgress, setIsLoadingProgress] = useState(false);
  const [userChallenges, setUserChallenges] = useState<{ challengeId: string; progress: number }[]>([]);

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

  const handleSaveChallenge = (id: string) => {
    setSavedChallenges(prev =>
      prev.includes(id)
        ? prev.filter(cid => cid !== id)
        : [...prev, id]
    );
  };

  const handleStartChallenge = async (id: string) => {
    // Preload challenge details before navigating
    await ChallengeLoaderService.loadChallengeDetails(id);
    navigate(`/playground/challenge/${id}`);
  };

  const handleDetailsClick = async (id: string) => {
    // Preload challenge details before navigating
    await ChallengeLoaderService.loadChallengeDetails(id);
    navigate(`/playground/challenge-details/${id}`);
  };

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

  // Filter challenges based on search query and filter
  const filteredChallenges = challengesWithProgress.filter(challenge => {
    // First check if the challenge matches the search query
    const searchTerms = searchQuery.toLowerCase().trim();
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

  // Find the featured or in-progress challenge to highlight
  const featuredChallenge = challengesWithProgress.find(c => c.featured || (c.progress > 0 && c.progress < 100));

  return (
    <div className="min-h-screen relative">
      {/* Enhanced background with gradient and animated elements */}
      <EnhancedBackground optimizeForLowPerformance={true} reducedAnimations={true} />

      <main className="container py-6 pt-24 relative z-10">
        {/* Hero Section */}
        <section className="mb-8">
          <div className="rounded-lg border bg-card p-4 md:p-6 shadow-sm">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold mb-2`}>
                  {user ? `Welcome back, ${user.displayName}!` : 'Welcome to Testing Playground!'}
                </h1>

                {user && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className={isMobile ? 'text-xs' : ''}>Level {user.level + 1}</span>
                      <span className={isMobile ? 'text-xs' : ''}>{calculateLevelProgress(user)}%</span>
                    </div>
                    <Progress
                      value={calculateLevelProgress(user)}
                      className="h-2"
                    />
                  </div>
                )}

                <p className={`text-muted-foreground mb-4 ${isMobile ? 'text-sm' : ''}`}>
                  {user
                    ? 'Continue your learning journey with recommended challenges.'
                    : 'Start your testing journey with our curated challenges.'}
                </p>
              </div>

              {featuredChallenge && (
                <div className={`flex flex-col ${isMobile ? 'mt-2' : 'justify-center'}`}>
                  <div className="mb-2">
                    <Badge variant="outline" className="mb-2">Recommended</Badge>
                    <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold`}>{featuredChallenge.title}</h3>
                    <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'} mb-4 line-clamp-2`}>
                      {featuredChallenge.description}
                    </p>
                  </div>

                  <MotionButton
                    onClick={() => handleStartChallenge(featuredChallenge.id)}
                    className="w-full sm:w-auto"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    size={isMobile ? "sm" : "default"}
                  >
                    {featuredChallenge.progress ? 'Continue' : 'Start Challenge'}
                    <ArrowRight className={`ml-2 ${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                  </MotionButton>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Challenge Library */}
        <section className="mb-8">
          <div className={`${isMobile ? 'flex flex-col gap-3' : 'flex justify-between items-center'} mb-4`}>
            <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>Challenge Library</h2>

            <div className={`flex ${isMobile ? 'flex-col w-full gap-2' : 'items-center space-x-2'}`}>
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search challenges..."
                  className="w-full md:w-[200px] pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setSearchQuery('');
                    }
                  }}
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className={`flex items-center ${isMobile ? 'w-full justify-between' : ''}`}>
                    <div className="flex items-center">
                      <Filter className={`${isMobile ? 'h-3.5 w-3.5 mr-1.5' : 'h-4 w-4 mr-2'}`} />
                      {filter === 'all' ? 'Filter' :
                       filter === 'saved' ? 'Saved' :
                       filter === 'in-progress' ? 'In Progress' :
                       filter === 'completed' ? 'Completed' :
                       filter === 'beginner' || filter === 'intermediate' || filter === 'advanced' ?
                         `${isMobile ? '' : 'Difficulty: '}${filter.charAt(0).toUpperCase() + filter.slice(1)}` : 'Filter'}
                    </div>
                    <ChevronDown className={`${isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4 ml-2'}`} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={isMobile ? "center" : "end"} className={isMobile ? "w-[90vw]" : "w-[200px]"}>
                  <DropdownMenuLabel>Filter Challenges</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={filter} onValueChange={setFilter}>
                    <DropdownMenuRadioItem value="all">
                      All Challenges
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="saved">
                      Saved Challenges
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="in-progress">
                      In Progress
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="completed">
                      Completed
                    </DropdownMenuRadioItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Difficulty</DropdownMenuLabel>
                    <DropdownMenuRadioItem value="beginner">
                      Beginner
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="intermediate">
                      Intermediate
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="advanced">
                      Advanced
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {isLoadingProgress ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} animate-spin text-primary`} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredChallenges.length > 0 ? (
                filteredChallenges.map((challenge, index) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onSave={handleSaveChallenge}
                    onStart={handleStartChallenge}
                    onDetails={handleDetailsClick}
                    isSaved={savedChallenges.includes(challenge.id)}
                    index={index}
                  />
                ))
              ) : (
                <div className="col-span-full py-8 text-center">
                  <p className="text-muted-foreground">No challenges match your search criteria.</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery('');
                      setFilter('all');
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Challenges;
