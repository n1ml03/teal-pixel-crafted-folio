import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { MotionButton } from "@/components/ui/motion-button";
import { useAuth } from '@/contexts/auth-utils';
import { UserProgressService } from '@/services/UserProgressService';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMediaQuery } from '@/lib';
import { motion } from 'framer-motion';

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
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
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
      <main className="container py-6 pt-24 relative z-10" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 800px' }}>
        {/* Hero Section */}
        <motion.section 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={`${isMobile ? 'p-4' : 'p-8'} bg-gradient-to-r from-blue-500/10 via-teal-500/10 to-purple-500/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg`}>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <motion.h1 
                  className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  {user ? `Welcome back, ${user.displayName}!` : 'Welcome to Testing Playground!'}
                </motion.h1>

                {user && (
                  <motion.div 
                    className="mb-4 bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-white/50"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <div className="flex justify-between text-sm mb-2">
                      <span className={`font-medium ${isMobile ? 'text-xs' : ''}`}>Level {user.level + 1}</span>
                      <span className={`text-teal-600 font-semibold ${isMobile ? 'text-xs' : ''}`}>{calculateLevelProgress(user)}%</span>
                    </div>
                    <Progress
                      value={calculateLevelProgress(user)}
                      className="h-2"
                    />
                  </motion.div>
                )}

                {/* User Stats */}
                {user && (
                  <motion.div 
                    className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 text-center shadow-sm border border-white/50">
                      <Trophy className="w-4 h-4 text-yellow-500 mx-auto mb-1" />
                      <div className="text-lg font-bold text-gray-800">{userStats.completed}</div>
                      <div className="text-xs text-gray-600">Completed</div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 text-center shadow-sm border border-white/50">
                      <BookOpen className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                      <div className="text-lg font-bold text-gray-800">{userStats.inProgress}</div>
                      <div className="text-xs text-gray-600">In Progress</div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 text-center shadow-sm border border-white/50">
                      <Target className="w-4 h-4 text-teal-500 mx-auto mb-1" />
                      <div className="text-lg font-bold text-gray-800">{userStats.total}</div>
                      <div className="text-xs text-gray-600">Total</div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 text-center shadow-sm border border-white/50">
                      <Star className="w-4 h-4 text-purple-500 mx-auto mb-1" />
                      <div className="text-lg font-bold text-gray-800">{userStats.completionRate}%</div>
                      <div className="text-xs text-gray-600">Success</div>
                    </div>
                  </motion.div>
                )}

                <motion.p 
                  className={`text-gray-700 mb-4 ${isMobile ? 'text-sm' : ''}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  {user
                    ? 'Continue your learning journey with recommended challenges.'
                    : 'Start your testing journey with our curated challenges.'}
                </motion.p>
              </div>

              {featuredChallenge && (
                <motion.div 
                  className={`flex flex-col ${isMobile ? 'mt-2' : 'justify-center'}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-white/50">
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

                    <MotionButton
                      onClick={() => handleStartChallenge(featuredChallenge.id)}
                      className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg"
                      whileHover={!prefersReducedMotion ? { scale: 1.02, y: -2 } : {}}
                      whileTap={{ scale: 0.98 }}
                    >
                      {featuredChallenge.progress > 0 ? 'Continue Challenge' : 'Start Challenge'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </MotionButton>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.section>

        {/* Search and Filter Section */}
        <motion.section 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-white/50">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search challenges..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/70 border-gray-200"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-white/70 border-gray-200 hover:bg-white/90">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white/95 backdrop-blur-sm">
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
        </motion.section>

        {/* Challenges Grid */}
        <section>
          {isLoadingProgress ? (
            <div className="flex justify-center items-center py-12">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-gray-600 text-center">Loading challenges...</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredChallenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className={`${prefersReducedMotion ? '' : 'animate-in fade-in duration-300'}`}
                >
                  <ChallengeCard
                    challenge={challenge}
                    isSaved={savedChallenges.includes(challenge.id)}
                    onSave={() => handleSaveChallenge(challenge.id)}
                    onStart={() => handleStartChallenge(challenge.id)}
                    onDetails={() => handleDetailsClick(challenge.id)}
                  />
                </div>
              ))}
            </div>
          )}

          {filteredChallenges.length === 0 && !isLoadingProgress && (
            <div className="text-center py-12">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
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
                  className="bg-white/70 border-gray-200 hover:bg-white/90"
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
};

export default Challenges;
