import { useState, useEffect, memo, useCallback } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { softSpringTransition } from '@/lib/motion';
import {
  CheckCircle,
  Award,
  Star,
  Clock,
  Trophy,
  Target,
  BarChart,
  Calendar,
  Zap,
  ArrowUpRight,
  ChevronRight,
  Bug,
  Server} from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from '@/contexts/auth-utils';
import { UserProgressService } from '@/services/UserProgressService';
import { UserActivity, UserAchievement, Achievement, ChallengeProgress } from '@/types/playground';
import { formatDistanceToNow } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';

interface UserDashboardProps {
  className?: string;
}

// Icon mappings for better performance
const achievementIconMap = {
  award: Award,
  bug: Bug,
  'check-circle': CheckCircle,
  clock: Clock,
  star: Star,
  trophy: Trophy,
  target: Target,
  zap: Zap,
  server: Server,
} as const;

const activityIconMap = {
  challenge_started: Target,
  challenge_completed: Trophy,
  achievement_unlocked: Award,
  level_up: ArrowUpRight,
  bug_reported: Bug,
  test_passed: CheckCircle,
  test_failed: Zap,
  default: Calendar,
} as const;

export const UserDashboard = memo(({ className }: UserDashboardProps) => {
  const { user } = useAuth();
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [achievements, setAchievements] = useState<{
    unlocked: (UserAchievement & { achievement: Achievement })[];
    locked: Achievement[];
  }>({
    unlocked: [],
    locked: []
  });
  const [challenges, setChallenges] = useState<ChallengeProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.07,
        delayChildren: 0.1
      }
    }
  };

  // Animation variants for individual cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        ...softSpringTransition,
        duration: 0.5
      }
    }
  };

  // Calculate points needed for next level
  const pointsForNextLevel = user ? Math.pow((user.level + 1), 2) * 100 : 0;
  const currentLevelPoints = user ? Math.pow(user.level, 2) * 100 : 0;
  const pointsNeeded = pointsForNextLevel - currentLevelPoints;
  const progressToNextLevel = user ? Math.min(100, Math.max(0, ((user.points - currentLevelPoints) / (pointsNeeded)) * 100)) : 0;

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        // Load user activities
        const userActivities = await UserProgressService.getUserActivities(user.id);
        setActivities(userActivities.sort((a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ).slice(0, 10)); // Get most recent 10 activities

        // Load user achievements
        const userAchievements = await UserProgressService.getUserAchievements(user.id);
        const allAchievements = await UserProgressService.getAchievements();

        const unlockedAchievements = await Promise.all(
          userAchievements.map(async (ua) => {
            const achievement = await UserProgressService.getAchievementById(ua.achievementId);
            return {
              ...ua,
              achievement: achievement!
            };
          })
        );

        const lockedAchievements = allAchievements.filter(
          a => !userAchievements.some(ua => ua.achievementId === a.id)
        );

        setAchievements({
          unlocked: unlockedAchievements,
          locked: lockedAchievements
        });

        // Load user challenges
        const userChallenges = await UserProgressService.getUserChallenges(user.id);
        setChallenges(userChallenges.sort((a, b) =>
          new Date(b.lastUpdatedAt).getTime() - new Date(a.lastUpdatedAt).getTime()
        ));
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  // Memoized icon functions for better performance
  const getAchievementIcon = useCallback((iconName: string) => {
    const IconComponent = achievementIconMap[iconName as keyof typeof achievementIconMap] || Award;
    return <IconComponent className="h-6 w-6" />;
  }, []);

  const getActivityIcon = useCallback((type: string) => {
    const IconComponent = activityIconMap[type as keyof typeof activityIconMap] || Calendar;
    return <IconComponent className="h-4 w-4" />;
  }, []);

  // Memoized activity message formatter for better performance
  const formatActivityMessage = useCallback((activity: UserActivity): string => {
    switch (activity.type) {
      case 'challenge_started':
        return `Started a new challenge`;
      case 'challenge_completed':
        return `Completed a challenge and earned ${(activity.details.points as number) || 0} points`;
      case 'achievement_unlocked':
        return `Unlocked the "${activity.details.achievementId as string}" achievement`;
      case 'level_up':
        return `Leveled up to level ${activity.details.level as number}`;
      case 'bug_reported':
        return `Reported a bug`;
      case 'test_passed':
        return `Passed a test successfully`;
      case 'test_failed':
        return `Failed a test`;
      default:
        return (activity.details.message as string) || 'Activity recorded';
    }
  }, []);

  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <div className={`${className} flex items-center justify-center min-h-[400px]`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // User will always be available with localStorage implementation
  if (!user) {
    return (
      <div className={`${className} flex items-center justify-center min-h-[400px]`}>
        <div className="text-center">
          <p className="text-muted-foreground">Please log in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-5 w-full flex flex-wrap justify-center gap-1 sm:gap-2 max-w-full overflow-visible">
          <TabsTrigger
            value="overview"
            className={"flex-grow flex-shrink-0 min-w-0 text-sm px-2 sm:px-3 py-1.5"}
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="achievements"
            className={"flex-grow flex-shrink-0 min-w-0 text-sm px-2 sm:px-3 py-1.5"}
          >
            Achievements
          </TabsTrigger>
          <TabsTrigger
            value="progress"
            className={"flex-grow flex-shrink-0 min-w-0 text-sm px-2 sm:px-3 py-1.5"}
          >
            {isMobile ? 'Progress' : 'Challenge Progress'}
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className={"flex-grow flex-shrink-0 min-w-0 text-sm px-2 sm:px-3 py-1.5"}
          >
            {isMobile ? 'Activity' : 'Recent Activity'}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* User Stats */}
          <AnimatePresence mode="wait">
            <motion.div
              className="grid gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              key="overview-stats"
            >
              <motion.div
                variants={cardVariants}
                whileHover={!prefersReducedMotion ? { y: -5, transition: { duration: 0.2 } } : {}}
                className="will-change-transform"
              >
                <Card className="h-full transition-shadow duration-300 hover:shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>Level</CardTitle>
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className={isMobile ? 'p-3' : ''}>
                    <div className="text-2xl font-bold">{user.level}</div>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className={isMobile ? 'text-[10px]' : ''}>Level {user.level + 1}</span>
                        <span className={isMobile ? 'text-[10px]' : ''}>{Math.round(progressToNextLevel)}%</span>
                      </div>
                      <Progress value={progressToNextLevel} className="h-2" />
                    </div>
                    <p className={`text-xs text-muted-foreground mt-2 ${isMobile ? 'text-[10px]' : ''}`}>
                      {pointsNeeded - (user.points - currentLevelPoints)} pts needed
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                variants={cardVariants}
                whileHover={!prefersReducedMotion ? { y: -5, transition: { duration: 0.2 } } : {}}
                className="will-change-transform"
              >
                <Card className="h-full transition-shadow duration-300 hover:shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>Total Points</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className={isMobile ? 'p-3' : ''}>
                    <div className="text-2xl font-bold">{user.points}</div>
                    <p className={`text-xs text-muted-foreground mt-2 ${isMobile ? 'text-[10px]' : ''}`}>
                      {isMobile ? 'From challenges & achievements' : 'Earned from challenges and achievements'}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                variants={cardVariants}
                whileHover={!prefersReducedMotion ? { y: -5, transition: { duration: 0.2 } } : {}}
                className="will-change-transform"
              >
                <Card className="h-full transition-shadow duration-300 hover:shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>Challenges</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className={isMobile ? 'p-3' : ''}>
                    <div className="text-2xl font-bold">
                      {challenges.filter(c => c.completedAt).length}/{challenges.length}
                    </div>
                    <p className={`text-xs text-muted-foreground mt-2 ${isMobile ? 'text-[10px]' : ''}`}>
                      {challenges.filter(c => c.progress > 0 && !c.completedAt).length} in progress
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                variants={cardVariants}
                whileHover={!prefersReducedMotion ? { y: -5, transition: { duration: 0.2 } } : {}}
                className="will-change-transform"
              >
                <Card className="h-full transition-shadow duration-300 hover:shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>Achievements</CardTitle>
                    <Award className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className={isMobile ? 'p-3' : ''}>
                    <div className="text-2xl font-bold">
                      {achievements.unlocked.length}/{achievements.unlocked.length + achievements.locked.length}
                    </div>
                    <p className={`text-xs text-muted-foreground mt-2 ${isMobile ? 'text-[10px]' : ''}`}>
                      {achievements.locked.length} more to unlock
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Recent Activity and Achievements */}
          <motion.div
            className="grid gap-4 grid-cols-1 md:grid-cols-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <motion.div
              variants={cardVariants}
              whileHover={!prefersReducedMotion ? { y: -5, transition: { duration: 0.2 } } : {}}
              className="col-span-1 will-change-transform"
            >
              <Card className="h-full transition-shadow duration-300 hover:shadow-md">
                <CardHeader className={isMobile ? 'pb-2 pt-4 px-4' : ''}>
                  <CardTitle className={isMobile ? 'text-lg' : ''}>Recent Activity</CardTitle>
                  <CardDescription className={isMobile ? 'text-xs' : ''}>Your latest actions and progress</CardDescription>
                </CardHeader>
                <CardContent className={isMobile ? 'p-4 pt-0' : ''}>
                  <ScrollArea className={isMobile ? 'h-[150px]' : 'h-[200px]'}>
                    <div className="space-y-4">
                      {activities.slice(0, 5).map((activity, index) => (
                        <motion.div
                          key={activity.id}
                          className="flex items-start"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: prefersReducedMotion ? 0 : 0.1 + (index * 0.05),
                            duration: 0.3
                          }}
                        >
                          <div className="mr-2 mt-0.5 rounded-full bg-primary/10 p-1">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="space-y-1 flex-1 min-w-0">
                            <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium leading-tight line-clamp-2`}>
                              {formatActivityMessage(activity)}
                            </p>
                            <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-muted-foreground`}>
                              {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter className={isMobile ? 'p-2 pt-0' : ''}>
                  <motion.div
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full"
                  >
                    <Button variant="ghost" size={isMobile ? 'sm' : 'sm'} className="w-full text-xs">
                      View All Activity
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </motion.div>
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div
              variants={cardVariants}
              whileHover={!prefersReducedMotion ? { y: -5, transition: { duration: 0.2 } } : {}}
              className="col-span-1 will-change-transform"
            >
              <Card className="h-full transition-shadow duration-300 hover:shadow-md">
                <CardHeader className={isMobile ? 'pb-2 pt-4 px-4' : ''}>
                  <CardTitle className={isMobile ? 'text-lg' : ''}>Recent Achievements</CardTitle>
                  <CardDescription className={isMobile ? 'text-xs' : ''}>Badges and rewards you've earned</CardDescription>
                </CardHeader>
                <CardContent className={isMobile ? 'p-4 pt-0' : ''}>
                  <ScrollArea className={isMobile ? 'h-[150px]' : 'h-[200px]'}>
                    <div className="space-y-4">
                      {achievements.unlocked.slice(0, 5).map((achievement, index) => (
                        <motion.div
                          key={achievement.id}
                          className="flex items-start"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: prefersReducedMotion ? 0 : 0.2 + (index * 0.05),
                            duration: 0.3,
                            type: "spring",
                            stiffness: 300,
                            damping: 20
                          }}
                        >
                          <motion.div
                            className={`mr-2 rounded-full bg-primary/10 ${isMobile ? 'p-1.5' : 'p-2'} text-primary`}
                            whileHover={{ rotate: [0, -5, 5, -5, 0], scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                          >
                            {getAchievementIcon(achievement.achievement.icon)}
                          </motion.div>
                          <div className="space-y-1 flex-1 min-w-0">
                            <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium leading-tight line-clamp-1`}>
                              {achievement.achievement.title}
                            </p>
                            <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-muted-foreground line-clamp-2`}>
                              {achievement.achievement.description}
                            </p>
                            <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-muted-foreground`}>
                              Unlocked {formatDistanceToNow(new Date(achievement.unlockedAt), { addSuffix: true })}
                            </p>
                          </div>
                        </motion.div>
                      ))}

                      {achievements.unlocked.length === 0 && (
                        <motion.div
                          className="text-center py-8 text-muted-foreground"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <Award className="h-8 w-8 mx-auto mb-2 opacity-20" />
                          <p className={isMobile ? 'text-sm' : ''}>No achievements unlocked yet</p>
                        </motion.div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter className={isMobile ? 'p-2 pt-0' : ''}>
                  <motion.div
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full"
                  >
                    <Button variant="ghost" size={isMobile ? 'sm' : 'sm'} className="w-full text-xs">
                      View All Achievements
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </motion.div>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Your Achievements</CardTitle>
                <CardDescription>
                  Badges and rewards you've earned through your testing journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <motion.div
                  className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {achievements.unlocked.map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      variants={cardVariants}
                      whileHover={!prefersReducedMotion ? {
                        scale: 1.03,
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
                      } : {}}
                      className="border rounded-lg p-4 bg-card will-change-transform transition-shadow duration-300 hover:shadow-md"
                      custom={index}
                    >
                      <div className="flex items-center space-x-3">
                        <motion.div
                          className={`rounded-full bg-primary/10 ${isMobile ? 'p-2' : 'p-3'} text-primary flex-shrink-0`}
                          whileHover={!prefersReducedMotion ? { rotate: [0, -5, 5, 0], scale: 1.1 } : {}}
                          transition={{ duration: 0.5 }}
                        >
                          {getAchievementIcon(achievement.achievement.icon)}
                        </motion.div>
                        <div className="min-w-0 flex-1">
                          <h3 className={`font-medium ${isMobile ? 'text-sm' : ''} line-clamp-1`}>{achievement.achievement.title}</h3>
                          <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground line-clamp-2`}>
                            {achievement.achievement.description}
                          </p>
                          <div className={`${isMobile ? 'mt-1 flex flex-col space-y-1' : 'mt-2 flex items-center'}`}>
                            <Badge variant="secondary" className={isMobile ? 'text-xs self-start' : 'mr-2'}>
                              +{achievement.achievement.points} points
                            </Badge>
                            <span className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-muted-foreground`}>
                              Unlocked {formatDistanceToNow(new Date(achievement.unlockedAt), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {achievements.unlocked.length === 0 && (
                  <motion.div
                    className="text-center py-8 text-muted-foreground"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0.5 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        delay: 0.3,
                        duration: 0.5,
                        type: "spring",
                        stiffness: 200
                      }}
                    >
                      <Award className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    </motion.div>
                    <p>No achievements unlocked yet</p>
                    <p className="text-sm">Complete challenges to earn achievements</p>
                  </motion.div>
                )}

                {achievements.locked.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <h3 className="font-medium mt-8 mb-4">Locked Achievements</h3>
                    <motion.div
                      className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delayChildren: 0.4, staggerChildren: 0.05 }}
                    >
                      {achievements.locked.map((achievement, index) => (
                        <motion.div
                          key={achievement.id}
                          variants={cardVariants}
                          className="border rounded-lg p-4 bg-muted/30 will-change-transform"
                          custom={index}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`rounded-full bg-muted ${isMobile ? 'p-2' : 'p-3'} text-muted-foreground flex-shrink-0`}>
                              {getAchievementIcon(achievement.icon)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className={`font-medium ${isMobile ? 'text-sm' : ''} line-clamp-1`}>{achievement.title}</h3>
                              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground line-clamp-2`}>
                                {achievement.description}
                              </p>
                              <div className="mt-2">
                                <Badge variant="outline" className={`text-muted-foreground ${isMobile ? 'text-xs' : ''}`}>
                                  +{achievement.points} points
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Challenge Progress Tab */}
        <TabsContent value="progress" className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Challenge Progress</CardTitle>
                <CardDescription>
                  Track your progress across all challenges
                </CardDescription>
              </CardHeader>
              <CardContent>
                {challenges.length > 0 ? (
                  <motion.div
                    className="space-y-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {challenges.map((challenge, index) => (
                      <motion.div
                        key={challenge.challengeId}
                        className="border rounded-lg p-4 will-change-transform"
                        variants={cardVariants}
                        whileHover={!prefersReducedMotion ? { y: -3, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" } : {}}
                        transition={{ delay: prefersReducedMotion ? 0 : 0.05 * index }}
                      >
                        <div className={`flex ${isMobile ? 'flex-col' : 'justify-between items-start'} mb-2`}>
                          <div>
                            <h3 className={`font-medium ${isMobile ? 'text-sm' : ''}`}>Challenge #{challenge.challengeId}</h3>
                            <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                              Started {formatDistanceToNow(new Date(challenge.startedAt), { addSuffix: true })}
                            </p>
                          </div>
                          <Badge
                            variant={challenge.completedAt ? "default" : "secondary"}
                            className={`${challenge.completedAt ? "bg-green-500 hover:bg-green-600" : ""} ${isMobile ? 'self-start mt-2' : ''}`}
                          >
                            {challenge.completedAt ? "Completed" : "In Progress"}
                          </Badge>
                        </div>

                        <div className="mt-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span className={isMobile ? 'text-[10px]' : ''}>Progress</span>
                            <span className={isMobile ? 'text-[10px]' : ''}>{challenge.progress}%</span>
                          </div>
                          <motion.div
                            initial={{ scaleX: 0, originX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{
                              delay: prefersReducedMotion ? 0 : 0.2 + (0.05 * index),
                              duration: 0.5,
                              ease: "easeOut"
                            }}
                          >
                            <Progress value={challenge.progress} className="h-2" />
                          </motion.div>
                        </div>

                        <div className={`mt-4 flex ${isMobile ? 'flex-col space-y-2' : 'flex-wrap gap-2'}`}>
                          <motion.div
                            className="flex items-center text-xs"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: prefersReducedMotion ? 0 : 0.3 + (0.05 * index) }}
                          >
                            <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className={isMobile ? 'text-[10px]' : ''}>
                              {Math.floor(challenge.timeSpent / 60)} minutes spent
                            </span>
                          </motion.div>

                          <motion.div
                            className="flex items-center text-xs"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: prefersReducedMotion ? 0 : 0.35 + (0.05 * index) }}
                          >
                            <CheckCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className={isMobile ? 'text-[10px]' : ''}>
                              {challenge.completedObjectives.length} objectives completed
                            </span>
                          </motion.div>

                          <motion.div
                            className="flex items-center text-xs"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: prefersReducedMotion ? 0 : 0.4 + (0.05 * index) }}
                          >
                            <BarChart className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className={isMobile ? 'text-[10px]' : ''}>
                              {Object.values(challenge.testResults).filter(Boolean).length} tests passed
                            </span>
                          </motion.div>
                        </div>

                        <motion.div
                          className="mt-4"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: prefersReducedMotion ? 0 : 0.45 + (0.05 * index) }}
                        >
                          <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <Button size="sm" variant="outline" className={isMobile ? 'text-xs' : ''}>
                              {challenge.completedAt ? "Review Challenge" : "Continue Challenge"}
                            </Button>
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    className="text-center py-8 text-muted-foreground"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      <Target className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    </motion.div>
                    <motion.p
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      No challenges started yet
                    </motion.p>
                    <motion.p
                      className="text-sm"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      Start a challenge to track your progress
                    </motion.p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest actions and progress on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activities.length > 0 ? (
                  <motion.div
                    className="space-y-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {activities.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        className="flex items-start border-b pb-4 last:border-0"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: prefersReducedMotion ? 0 : 0.1 + (index * 0.05),
                          duration: 0.4,
                          ease: "easeOut"
                        }}
                        whileHover={{ x: 3, transition: { duration: 0.2 } }}
                      >
                        <motion.div
                          className={`${isMobile ? 'mr-3 p-1.5' : 'mr-4 p-2'} mt-0.5 rounded-full bg-primary/10 flex-shrink-0`}
                          whileHover={{ rotate: 15, scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          {getActivityIcon(activity.type)}
                        </motion.div>
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className={`${isMobile ? 'flex flex-col' : 'flex justify-between'}`}>
                            <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium line-clamp-2`}>
                              {formatActivityMessage(activity)}
                            </p>
                            <span className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-muted-foreground`}>
                              {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                            </span>
                          </div>

                          {activity.details.challengeId && (
                            <motion.p
                              className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-muted-foreground`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: prefersReducedMotion ? 0 : 0.2 + (index * 0.05) }}
                            >
                              Challenge #{activity.details.challengeId as string}
                            </motion.p>
                          )}

                          {activity.details.achievementId && (
                            <motion.p
                              className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-muted-foreground`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: prefersReducedMotion ? 0 : 0.2 + (index * 0.05) }}
                            >
                              Achievement: {activity.details.achievementId as string}
                            </motion.p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    className="text-center py-8 text-muted-foreground"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      <Calendar className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    </motion.div>
                    <motion.p
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      No activity recorded yet
                    </motion.p>
                    <motion.p
                      className="text-sm"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      Your actions will be tracked here
                    </motion.p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
});

UserDashboard.displayName = 'UserDashboard';

export default UserDashboard;
