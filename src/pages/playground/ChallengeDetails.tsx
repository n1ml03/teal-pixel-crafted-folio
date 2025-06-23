import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNavigateWithTransition } from '@/hooks/useNavigateWithTransition';
import {
  Clock,
  ArrowLeft,
  Star,
  BookmarkPlus,
  BookmarkCheck,
  CheckCircle,
  Users,
  ExternalLink,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
  AlertCircle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { MotionButton } from "@/components/ui/motion-button";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import EnhancedBackground from '@/components/utils/EnhancedBackground';
import challengesMeta from '@/data/challengesMeta';
import { ChallengeLoaderService } from '@/services/ChallengeLoaderService';
import { ChallengeWithTests } from '@/services/ChallengeService';

// Interface for the extended challenge data needed in ChallengeDetails
interface ExtendedChallenge extends ChallengeWithTests {
  longDescription?: string;
  prerequisites?: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  resources?: {
    id: string;
    title: string;
    url: string;
  }[];
  relatedChallenges?: {
    id: string;
    title: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
  }[];
  communityStats?: {
    completionRate: number;
    averageTime: string;
    rating: number;
    totalRatings: number;
  };
  reviews?: {
    id: string;
    user: {
      name: string;
      avatar: string;
    };
    rating: number;
    comment: string;
    date: string;
    helpfulCount: number;
  }[];
}

// Helper function to generate a long description from objectives and hints
const generateLongDescription = (challenge: ChallengeWithTests): string => {
  const objectivesList = challenge.objectives
    .map(obj => `<li>${obj.description}</li>`)
    .join('');

  const basicHints = challenge.hints
    .filter(hint => hint.level === 'basic')
    .map(hint => `<li>${hint.content}</li>`)
    .join('');

  return `
    <p>${challenge.description}</p>

    <h3>Objectives:</h3>
    <ul>
      ${objectivesList}
    </ul>

    <h3>Tips to get started:</h3>
    <ul>
      ${basicHints || '<li>Start by exploring the interface and understanding the requirements.</li>'}
    </ul>

    <p>This challenge will help you build practical skills that you can apply in real-world testing scenarios.</p>
  `;
};

// Helper function to find related challenges
const findRelatedChallenges = (currentChallenge: ChallengeWithTests): ExtendedChallenge['relatedChallenges'] => {
  // Find challenges with the same category or tags using the lightweight metadata
  return challengesMeta
    .filter(c =>
      c.id !== currentChallenge.id &&
      (c.category === currentChallenge.category ||
       c.tags.some(tag => currentChallenge.tags.includes(tag)))
    )
    .slice(0, 3) // Limit to 3 related challenges
    .map(c => ({
      id: c.id,
      title: c.title,
      difficulty: c.difficulty
    }));
};

// Default community stats and reviews for all challenges
const defaultCommunityStats = {
  completionRate: 75,
  averageTime: '40 min',
  rating: 4.5,
  totalRatings: 120
};

const defaultReviews = [
  {
    id: 'rev1',
    user: { name: 'Alex Johnson', avatar: 'https://i.pravatar.cc/150?img=1' },
    rating: 5,
    comment: 'Excellent challenge! I learned a lot of techniques that I can apply immediately in my work.',
    date: '2023-11-15',
    helpfulCount: 24
  },
  {
    id: 'rev2',
    user: { name: 'Sarah Miller', avatar: 'https://i.pravatar.cc/150?img=5' },
    rating: 4,
    comment: 'Very informative challenge. The hints were helpful without giving away too much.',
    date: '2023-10-28',
    helpfulCount: 18
  }
];

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-amber-100 text-amber-800',
  advanced: 'bg-red-100 text-red-800'
};

const ChallengeDetails = () => {
  const navigate = useNavigate();
  const navigateWithTransition = useNavigateWithTransition();
  const { challengeId } = useParams<{ challengeId: string }>();
  const [challenge, setChallenge] = useState<ExtendedChallenge | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Load challenge data based on ID
  useEffect(() => {
    const loadChallenge = async () => {
      if (!challengeId) {
        setError("Challenge ID is missing");
        setIsLoading(false);
        return;
      }

      try {
        // Dynamically load the challenge details
        const foundChallenge = await ChallengeLoaderService.loadChallengeDetails(challengeId);

        if (!foundChallenge) {
          setError(`Challenge with ID ${challengeId} not found`);
          setIsLoading(false);
          return;
        }

        // Extend the challenge with additional data
        const extendedChallenge: ExtendedChallenge = {
          ...foundChallenge,
          longDescription: generateLongDescription(foundChallenge),
          prerequisites: [
            { id: 'prereq1', title: 'Basic Testing Concepts', completed: true },
            { id: 'prereq2', title: `Basic ${foundChallenge.category} Knowledge`, completed: true }
          ],
          resources: [
            {
              id: 'res1',
              title: `${foundChallenge.category} Documentation`,
              url: 'https://developer.mozilla.org/en-US/docs/Web/API'
            },
            {
              id: 'res2',
              title: 'Testing Best Practices',
              url: 'https://testautomationu.applitools.com/'
            }
          ],
          relatedChallenges: findRelatedChallenges(foundChallenge),
          communityStats: defaultCommunityStats,
          reviews: defaultReviews
        };

        setChallenge(extendedChallenge);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading challenge:', error);
        setError('Failed to load challenge data. Please try again.');
        setIsLoading(false);
      }
    };

    loadChallenge();
  }, [challengeId]);

  const handleSaveChallenge = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? "Challenge removed from saved" : "Challenge saved for later");
  };

  const handleStartChallenge = async () => {
    // Preload challenge details before navigating
    if (challengeId) {
      await ChallengeLoaderService.loadChallengeDetails(challengeId);
    }
    // Use navigate instead of window.location for better SPA experience
    navigateWithTransition(`/playground/challenge/${challengeId}`);
  };

  const handleReviewHelpful = (_reviewId: string, isHelpful: boolean) => {
    toast.success(`Marked review as ${isHelpful ? 'helpful' : 'not helpful'}`);
    // In a real app, update the review's helpful count
  };

  return (
    <div className="min-h-screen relative">
      {/* Enhanced background with gradient and animated elements */}
      <EnhancedBackground optimizeForLowPerformance={true} reducedAnimations={true} />

      <div className="container py-8 pt-24 relative z-10">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigateWithTransition('/playground/challenges')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Challenges
        </Button>

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && challenge && (
        <div className="grid gap-8 md:grid-cols-3">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            <div className="rounded-lg overflow-hidden border bg-card shadow-sm">
              <div className="relative aspect-video">
                <img
                  src={challenge.thumbnail}
                  alt={challenge.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{challenge.title}</h1>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge className={difficultyColors[challenge.difficulty]}>
                        {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                      </Badge>
                      <Badge variant="outline" className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {challenge.duration}
                      </Badge>
                      {challenge.tags.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSaveChallenge}
                    aria-label={isSaved ? "Remove from saved" : "Save for later"}
                  >
                    {isSaved ? (
                      <BookmarkCheck className="h-5 w-5 text-primary" />
                    ) : (
                      <BookmarkPlus className="h-5 w-5" />
                    )}
                  </Button>
                </div>

                <p className="text-muted-foreground mb-6">{challenge.description}</p>

                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap">{challenge.longDescription?.replace(/<[^>]*>/g, '')}</div>
                </div>

                <div className="mt-8">
                  <h2 className="text-xl font-bold mb-4">Prerequisites</h2>
                  <div className="space-y-3 mb-6">
                    {challenge.prerequisites.map(prereq => (
                      <div key={prereq.id} className="flex items-center">
                        {prereq.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-muted-foreground mr-2" />
                        )}
                        <span className={prereq.completed ? "" : "text-muted-foreground"}>
                          {prereq.title}
                        </span>
                      </div>
                    ))}
                  </div>

                  <h2 className="text-xl font-bold mb-4">Helpful Resources</h2>
                  <div className="space-y-3 mb-6">
                    {challenge.resources.map(resource => (
                      <a
                        key={resource.id}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-primary hover:underline"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {resource.title}
                      </a>
                    ))}
                  </div>

                  <h2 className="text-xl font-bold mb-4">Related Challenges</h2>
                  <div className="space-y-3">
                    {challenge.relatedChallenges.map(related => (
                      <a
                        key={related.id}
                        href={`/playground/challenge-details/${related.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          navigateWithTransition(`/playground/challenge-details/${related.id}`);
                        }}
                        className="flex items-center justify-between p-3 rounded-md border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center">
                          <span>{related.title}</span>
                          <Badge className={`ml-2 ${difficultyColors[related.difficulty]}`}>
                            {related.difficulty.charAt(0).toUpperCase() + related.difficulty.slice(1)}
                          </Badge>
                        </div>
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <h2 className="text-xl font-bold mb-4">Community Reviews</h2>

                  <div className="space-y-6">
                    {challenge.reviews.map(review => (
                      <div key={review.id} className="border-b pb-4 last:border-0">
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage src={review.user.avatar} alt={review.user.name} />
                              <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{review.user.name}</div>
                              <div className="text-xs text-muted-foreground">{review.date}</div>
                            </div>
                          </div>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted'}`}
                              />
                            ))}
                          </div>
                        </div>

                        <p className="text-sm mb-2">{review.comment}</p>

                        <div className="flex items-center justify-between">
                          <div className="text-xs text-muted-foreground">
                            {review.helpfulCount} people found this helpful
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs"
                              onClick={() => handleReviewHelpful(review.id, true)}
                            >
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              Helpful
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs"
                              onClick={() => handleReviewHelpful(review.id, false)}
                            >
                              <ThumbsDown className="h-3 w-3 mr-1" />
                              Not Helpful
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-lg border bg-card p-6 shadow-sm sticky top-20">
              <MotionButton
                className="w-full mb-4"
                onClick={handleStartChallenge}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Challenge
                <ArrowRight className="ml-2 h-4 w-4" />
              </MotionButton>

              <Button
                variant="outline"
                className="w-full mb-6"
                onClick={handleSaveChallenge}
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck className="mr-2 h-4 w-4" />
                    Saved
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="mr-2 h-4 w-4" />
                    Save for Later
                  </>
                )}
              </Button>

              <Separator className="my-4" />

              <h3 className="font-medium mb-3">Community Stats</h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Completion Rate</span>
                    <span>{challenge.communityStats.completionRate}%</span>
                  </div>
                  <Progress value={challenge.communityStats.completionRate} className="h-1.5" />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Time</span>
                  <Badge variant="outline" className="flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
                    {challenge.communityStats.averageTime}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">User Rating</span>
                  <div className="flex items-center">
                    <div className="flex mr-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < Math.floor(challenge.communityStats.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted'}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs">
                      {challenge.communityStats.rating} ({challenge.communityStats.totalRatings})
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Active Users</span>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>42 currently active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default ChallengeDetails;
