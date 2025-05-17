import { useState, useEffect } from 'react';
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

// Import challenges from data file
import challenges from '@/data/challenges';

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

  const handleStartChallenge = (id: string) => {
    navigate(`/playground/challenge/${id}`);
  };

  const handleDetailsClick = (id: string) => {
    navigate(`/playground/challenge-details/${id}`);
  };

  // Create a map for faster lookup of user progress
  const userProgressMap = userChallenges.reduce((map, progress) => {
    map[progress.challengeId] = progress.progress;
    return map;
  }, {} as Record<string, number>);

  // Add progress information to challenges more efficiently
  const challengesWithProgress = challenges.map(challenge => ({
    ...challenge,
    progress: userProgressMap[challenge.id] || 0
  }));

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
      <EnhancedBackground optimizeForLowPerformance={false} />

      <main className="container py-6 pt-24 relative z-10">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {user ? `Welcome back, ${user.displayName}!` : 'Welcome to Testing Playground!'}
                </h1>

                {user && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress to Level {user.level + 1}</span>
                      <span>{calculateLevelProgress(user)}%</span>
                    </div>
                    <Progress
                      value={calculateLevelProgress(user)}
                      className="h-2"
                    />
                  </div>
                )}

                <p className="text-muted-foreground mb-4">
                  {user
                    ? 'Continue your learning journey with recommended challenges based on your progress.'
                    : 'Start your testing journey with our curated challenges designed to build your skills.'}
                </p>
              </div>

              {featuredChallenge && (
                <div className="flex flex-col justify-center">
                  <div className="mb-2">
                    <Badge variant="outline" className="mb-2">Recommended for you</Badge>
                    <h3 className="text-xl font-bold">{featuredChallenge.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{featuredChallenge.description}</p>
                  </div>

                  <MotionButton
                    onClick={() => handleStartChallenge(featuredChallenge.id)}
                    className="w-full sm:w-auto"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {featuredChallenge.progress ? 'Continue Challenge' : 'Start Challenge'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </MotionButton>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Challenge Library */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Challenge Library</h2>

            <div className="flex items-center space-x-2">
              <div className="relative">
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
                  <Button variant="outline" className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    {filter === 'all' ? 'Filter' :
                     filter === 'saved' ? 'Saved' :
                     filter === 'in-progress' ? 'In Progress' :
                     filter === 'completed' ? 'Completed' :
                     filter === 'beginner' || filter === 'intermediate' || filter === 'advanced' ?
                       `Difficulty: ${filter.charAt(0).toUpperCase() + filter.slice(1)}` : 'Filter'}
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
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
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChallenges.map((challenge, index) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onSave={handleSaveChallenge}
                  onStart={handleStartChallenge}
                  onDetails={handleDetailsClick}
                  isSaved={savedChallenges.includes(challenge.id)}
                  index={index}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Challenges;
