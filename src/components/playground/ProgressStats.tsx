import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  ArrowUpRight,
  Clock,
  Target,
  Trophy,
  CheckCircle} from 'lucide-react';

// Types for progress data
export interface ChallengeStats {
  completed: number;
  inProgress: number;
  notStarted: number;
}

export interface TestStats {
  passed: number;
  failed: number;
  total: number;
}

export interface TimeStats {
  averageCompletionTime: number; // in minutes
  totalTimeSpent: number; // in minutes
  fastestCompletion: number; // in minutes
}

export interface ActivityData {
  date: string;
  challenges: number;
  tests: number;
}

export interface ProgressStatsProps {
  challengeStats: ChallengeStats;
  testStats: TestStats;
  timeStats: TimeStats;
  activityData: ActivityData[];
  className?: string;
  onViewDetails?: () => void;
}

/**
 * ProgressStats - A component to visualize user progress with charts and statistics
 */
export const ProgressStats = ({
  challengeStats,
  testStats,
  timeStats,
  activityData,
  className,
  onViewDetails
}: ProgressStatsProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const isMobile = useIsMobile();

  // Prepare data for charts
  const challengeData = [
    { name: 'Completed', value: challengeStats.completed, color: '#10b981' },
    { name: 'In Progress', value: challengeStats.inProgress, color: '#3b82f6' },
    { name: 'Not Started', value: challengeStats.notStarted, color: '#6b7280' }
  ];

  const testData = [
    { name: 'Passed', value: testStats.passed, color: '#10b981' },
    { name: 'Failed', value: testStats.failed, color: '#ef4444' }
  ];

  // Calculate percentages
  const completionRate = Math.round((challengeStats.completed /
    (challengeStats.completed + challengeStats.inProgress + challengeStats.notStarted)) * 100) || 0;

  const passRate = Math.round((testStats.passed / testStats.total) * 100) || 0;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Progress Statistics</CardTitle>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList className="grid w-auto grid-cols-3 h-8">
              <TabsTrigger value="overview" className="text-xs px-2">
                <BarChart3 className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline-block">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="challenges" className="text-xs px-2">
                <PieChartIcon className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline-block">Challenges</span>
              </TabsTrigger>
              <TabsTrigger value="activity" className="text-xs px-2">
                <LineChartIcon className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline-block">Activity</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <CardDescription>
          Track your progress and performance metrics
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <TabsContent value="overview" className="m-0 p-6 space-y-4">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                {/* Completion Rate */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium flex items-center">
                      <Target className="h-4 w-4 mr-1 text-primary" />
                      Completion Rate
                    </h4>
                    <Badge variant={completionRate > 50 ? "default" : "outline"}>
                      {completionRate}%
                    </Badge>
                  </div>
                  <Progress value={completionRate} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {challengeStats.completed} of {challengeStats.completed + challengeStats.inProgress + challengeStats.notStarted} challenges completed
                  </p>
                </div>

                {/* Test Pass Rate */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1 text-primary" />
                      Test Pass Rate
                    </h4>
                    <Badge variant={passRate > 70 ? "default" : "outline"}>
                      {passRate}%
                    </Badge>
                  </div>
                  <Progress value={passRate} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {testStats.passed} of {testStats.total} tests passed
                  </p>
                </div>
              </div>

              {/* Time Stats */}
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                <div className="border rounded-md p-3">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">Total Time</span>
                  </div>
                  <p className="text-2xl font-bold mt-2">
                    {Math.floor(timeStats.totalTimeSpent / 60)}h {timeStats.totalTimeSpent % 60}m
                  </p>
                </div>

                <div className="border rounded-md p-3">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">Avg. Completion</span>
                  </div>
                  <p className="text-2xl font-bold mt-2">
                    {timeStats.averageCompletionTime}m
                  </p>
                </div>

                <div className="border rounded-md p-3">
                  <div className="flex items-center">
                    <Trophy className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">Fastest</span>
                  </div>
                  <p className="text-2xl font-bold mt-2">
                    {timeStats.fastestCompletion}m
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="challenges" className="m-0 space-y-4">
              <div className="h-[250px] w-full p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={challengeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={isMobile ? 40 : 60}
                      outerRadius={isMobile ? 80 : 90}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {challengeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="m-0 space-y-4">
              <div className="h-[250px] w-full p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="challenges"
                      stroke="#3b82f6"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="tests"
                      stroke="#10b981"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </CardContent>

      {onViewDetails && (
        <CardFooter className="p-4 pt-0">
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto"
            onClick={onViewDetails}
          >
            View Details
            <ArrowUpRight className="h-4 w-4 ml-1" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ProgressStats;
