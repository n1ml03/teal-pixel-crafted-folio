import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNavigateWithTransition } from '@/hooks/useNavigateWithTransition';import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Smartphone, Monitor } from 'lucide-react';
import ResizablePanelLayout from '@/components/playground/ResizablePanelLayout';
import InstructionsPanel, { Objective, Hint } from '@/components/playground/InstructionsPanel';
import TestingEnvironment from '@/components/playground/TestingEnvironment';
import BugReportingTool, { BugReport } from '@/components/playground/BugReportingTool';

import CompletionAnimation from '@/components/playground/CompletionAnimation';
import { LazyCodeEditor } from '@/components/playground/LazyCodeEditor';
import EnhancedBackground from '@/components/utils/EnhancedBackground';
import { useAuth } from '@/contexts/auth-utils';
import { UserProgressService } from '@/services/UserProgressService';
import { ChallengeLoaderService } from '@/services/ChallengeLoaderService';
import { useIsMobile } from '@/hooks/use-mobile';

// Default fallback sandbox URL in case a challenge doesn't have one
const DEFAULT_SANDBOX_URL = 'https://jsonplaceholder.typicode.com/';

const TestingPlayground = () => {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();
  const navigateWithTransition = useNavigateWithTransition();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [challenge, setChallenge] = useState<{
    id: string;
    title: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    description: string;
    objectives: Objective[];
    hints: Hint[];
    sandboxUrl: string;
  } | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isBugReportOpen, setIsBugReportOpen] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const autoSaveIntervalRef = useRef<number | null>(null);

  // Animation states
  const [showObjectiveAnimation, setShowObjectiveAnimation] = useState(false);
  const [showChallengeAnimation, setShowChallengeAnimation] = useState(false);
  const [showTestAnimation, setShowTestAnimation] = useState(false);
  const [animationMessage, setAnimationMessage] = useState('');

  // Code editor state
  const [testCode, setTestCode] = useState(`// Write your test code here
function testElement(selector) {
  const element = document.querySelector(selector);
  return {
    exists: () => element !== null,
    hasText: (text) => element?.textContent?.includes(text) || false,
    hasAttribute: (attr, value) => element?.getAttribute(attr) === value
  };
}

// Example test
console.log('Testing if header exists...');
const header = testElement('header');
if (header.exists()) {
  console.log('✅ Header found');
} else {
  console.log('❌ Header not found');
}`);

  // Define handleSave callback first
  const handleSave = useCallback(async (isAutoSave = false) => {
    if (!user || !challengeId || !challenge) {
      if (!isAutoSave) {
        toast.warning("You need to be logged in to save progress");
      }
      return;
    }

    setIsSaving(true);

    try {
      // Get completed objectives
      const completedObjectives = challenge.objectives
        .filter(obj => obj.completed)
        .map(obj => obj.id);

      // Calculate progress percentage
      const progressPercentage = Math.round(
        (completedObjectives.length / challenge.objectives.length) * 100
      );

      // Save code snapshot
      await UserProgressService.saveCodeSnapshot(user.id, challengeId, testCode);

      // Update challenge progress
      await UserProgressService.updateChallengeProgress(user.id, challengeId, {
        progress: progressPercentage,
        completedObjectives,
        timeSpent: timeElapsed
      });

      // Update last saved time
      setLastSaved(new Date());

      if (!isAutoSave) {
        toast.success("Progress saved successfully!");
      }
    } catch (error) {
      console.error('Error saving progress:', error);
      if (!isAutoSave) {
        toast.error("Failed to save progress. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  }, [user, challengeId, challenge, testCode, timeElapsed]);

  // Load challenge progress if user is logged in
  useEffect(() => {
    const loadChallengeProgress = async () => {
      if (!user || !challengeId || !challenge) return;

      try {
        // Start or resume challenge
        await UserProgressService.startChallenge(user.id, challengeId);

        // Get challenge progress
        const progress = await UserProgressService.getChallengeProgress(user.id, challengeId);

        if (progress) {
          // Update time elapsed
          setTimeElapsed(progress.timeSpent);

          // Update completed objectives
          if (progress.completedObjectives.length > 0) {
            setChallenge(prev => prev && ({
              ...prev,
              objectives: prev.objectives.map(obj => ({
                ...obj,
                completed: progress.completedObjectives.includes(obj.id)
              }))
            }));
          }

          // Load latest code snapshot if available
          if (progress.codeSnapshots && progress.codeSnapshots.length > 0) {
            const latestSnapshot = progress.codeSnapshots[progress.codeSnapshots.length - 1];
            setTestCode(latestSnapshot.code);
          }

          // Set last saved time
          setLastSaved(new Date(progress.lastUpdatedAt));
        }
      } catch (error) {
        console.error('Error loading challenge progress:', error);
        toast.error("Failed to load your progress for this challenge");
      }
    };

    loadChallengeProgress();
  }, [user, challengeId, challenge]);

  // Set up auto-save interval
  useEffect(() => {
    if (user && challengeId) {
      // Auto-save every 30 seconds
      autoSaveIntervalRef.current = window.setInterval(() => {
        handleSave(true);
      }, 30000);
    }

    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [user, challengeId, handleSave]);

  // Update time spent (single timer effect)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

        // Format the challenge data for the playground
        const formattedChallenge = {
          id: foundChallenge.id,
          title: foundChallenge.title,
          difficulty: foundChallenge.difficulty as 'beginner' | 'intermediate' | 'advanced',
          description: foundChallenge.description,
          objectives: foundChallenge.objectives.map(obj => ({
            id: obj.id,
            description: obj.description,
            completed: false // Initialize all objectives as not completed
          })),
          hints: foundChallenge.hints.map(hint => ({
            id: hint.id,
            level: hint.level,
            content: hint.content
          })),
          sandboxUrl: foundChallenge.sandboxUrl || DEFAULT_SANDBOX_URL
        };

        setChallenge(formattedChallenge);
        setIsLoading(false);
        setError(null);
      } catch (error) {
        console.error('Error loading challenge:', error);
        setError('Failed to load challenge data. Please try again.');
        setIsLoading(false);
      }
    };

    loadChallenge();
  }, [challengeId]);

  const handleObjectiveToggle = (id: string) => {
    if (!challenge) return;

    // Find the objective being toggled
    const objective = challenge.objectives.find(obj => obj.id === id);
    const isCompleting = objective ? !objective.completed : false;

    setChallenge(prev => prev && ({
      ...prev,
      objectives: prev.objectives.map(obj =>
        obj.id === id ? { ...obj, completed: !obj.completed } : obj
      )
    }));

    // Show animation when completing an objective
    if (isCompleting) {
      setAnimationMessage(`Completed: ${objective?.description.substring(0, 40)}...`);
      setShowObjectiveAnimation(true);

      // Fallback to browser notification if available
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Objective Completed!');
      }
    }

    // Check if this completes the challenge
    const updatedObjectives = challenge.objectives.map(obj =>
      obj.id === id ? { ...obj, completed: !obj.completed } : obj
    );

    const allCompleted = updatedObjectives.every(obj => obj.completed);
    if (allCompleted) {
      // Show challenge completion animation
      setAnimationMessage("You've mastered all objectives in this challenge!");
      setShowChallengeAnimation(true);

      // Fallback to browser notification if available
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Challenge Completed!', {
          body: 'Congratulations! You completed all objectives!'
        });
      }

      toast.success("Congratulations! You've completed all objectives!");
    }
  };

  const handleReset = () => {
    setChallenge(prev => prev && ({
      ...prev,
      objectives: prev.objectives.map(obj => ({ ...obj, completed: false }))
    }));
    setTimeElapsed(0);
    toast.info("Challenge has been reset");
  };

  const handleExit = async () => {
    // Navigate back to dashboard
    if (window.confirm("Are you sure you want to exit? Your progress will be saved.")) {
      await handleSave();

      // Update time spent before exiting
      if (user && challengeId) {
        try {
          await UserProgressService.updateTimeSpent(user.id, challengeId, timeElapsed);
        } catch (error) {
          console.error('Error updating time spent:', error);
        }
      }

      navigateWithTransition('/playground/dashboard');
    }
  };

  const handleSubmit = async () => {
    if (!challenge) return;

    const completedCount = challenge.objectives.filter(obj => obj.completed).length;
    const totalCount = challenge.objectives.length;

    if (completedCount === totalCount) {
      // Show challenge completion animation if not already shown
      setAnimationMessage("Challenge completed successfully! Great job!");
      setShowChallengeAnimation(true);

      // Save progress with 100% completion
      if (user && challengeId) {
        try {
          // Get completed objectives
          const completedObjectives = challenge.objectives.map(obj => obj.id);

          // Update challenge progress with completed status
          await UserProgressService.updateChallengeProgress(user.id, challengeId, {
            progress: 100,
            completedObjectives,
            timeSpent: timeElapsed,
            completedAt: new Date().toISOString()
          });

          // Log activity
          await UserProgressService.logActivity(user.id, 'challenge_completed', {
            challengeId,
            timeSpent: timeElapsed,
            message: 'Challenge completed successfully'
          });

          // Check for achievements
          const newAchievements = await UserProgressService.checkAchievements(user.id);

          // Show achievement notifications
          if (newAchievements.length > 0) {
            setTimeout(() => {
              newAchievements.forEach(achievement => {
                toast.success(`Achievement Unlocked: ${achievement.achievementId}!`);
              });
            }, 2000); // Show after challenge completion animation
          }
        } catch (error) {
          console.error('Error updating challenge completion:', error);
        }
      }

      toast.success("Challenge completed successfully! Great job!");
    } else {
      toast.warning(`You've completed ${completedCount} of ${totalCount} objectives. Try to complete all objectives before submitting.`);
    }
  };

  // Handle running test code
  const handleRunTestCode = async (code: string) => {
    try {
      // In a real implementation, this would run the code in a sandbox
      // For now, we'll simulate a successful test
      console.log('Running test code:', code);

      // Show test completion animation
      setAnimationMessage("Test passed successfully!");
      setShowTestAnimation(true);

      // Save code snapshot
      if (user && challengeId) {
        await UserProgressService.saveCodeSnapshot(user.id, challengeId, code);

        // Log test activity
        await UserProgressService.logActivity(user.id, 'test_passed', {
          challengeId,
          message: 'Test executed successfully'
        });

        // Check for test-related achievements
        await UserProgressService.checkAchievements(user.id);
      }

      toast.success("Test executed successfully!");
    } catch (error) {
      console.error('Error running test code:', error);

      if (user && challengeId) {
        // Log test failure
        await UserProgressService.logActivity(user.id, 'test_failed', {
          challengeId,
          message: 'Test execution failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      toast.error("Error executing test code");
    }
  };

  const handleTakeScreenshot = () => {
    // In a real app, capture actual screenshot
    // For demo, we'll use a placeholder image
    setScreenshotUrl('https://via.placeholder.com/800x600?text=Screenshot+Placeholder');
  };

  const handleBugReport = () => {
    setIsBugReportOpen(true);
  };

  const handleSubmitBugReport = async (bugReport: BugReport) => {
    // In a real app, send bug report to backend
    console.log('Bug report submitted:', bugReport);

    // Log bug report activity
    if (user && challengeId) {
      try {
        await UserProgressService.logActivity(user.id, 'bug_reported', {
          challengeId,
          bugType: bugReport.type,
          description: bugReport.description.substring(0, 100) // Truncate for activity log
        });

        // Check for bug reporting achievements
        await UserProgressService.checkAchievements(user.id);
      } catch (error) {
        console.error('Error logging bug report activity:', error);
      }
    }
  };

  // Reset animation states after they're shown
  const handleAnimationComplete = () => {
    setTimeout(() => {
      setShowObjectiveAnimation(false);
      setShowChallengeAnimation(false);
      setShowTestAnimation(false);
    }, 500);
  };

  return (
    <div className="min-h-screen relative">
      {/* Enhanced background with gradient and animated elements */}
      <EnhancedBackground optimizeForLowPerformance={true} reducedAnimations={true} />

      <div className="flex-1 overflow-hidden pt-24">
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {error && (
          <div className={`container py-8 ${isMobile ? 'px-4' : ''}`}>
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <button
              className="px-4 py-2 bg-primary text-white rounded-md"
              onClick={() => navigateWithTransition('/playground/challenges')}
            >
              Back to Challenges
            </button>
          </div>
        )}

        {!isLoading && !error && challenge && (
          <ResizablePanelLayout
            leftPanel={
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto">
                  <InstructionsPanel
                    title={challenge.title}
                    difficulty={challenge.difficulty}
                    description={challenge.description}
                    objectives={challenge.objectives}
                    hints={challenge.hints}
                    timeElapsed={timeElapsed}
                    onObjectiveToggle={handleObjectiveToggle}
                    onReset={handleReset}
                    onSave={handleSave}
                    onExit={handleExit}
                    onSubmit={handleSubmit}
                  >
                    {lastSaved && (
                      <div className="text-xs text-muted-foreground mt-2 flex items-center">
                        <div className={isSaving ? "animate-pulse mr-1 h-2 w-2 rounded-full bg-green-500" : "mr-1 h-2 w-2 rounded-full bg-green-500"} />
                        Last saved: {lastSaved.toLocaleTimeString()}
                      </div>
                    )}
                  </InstructionsPanel>
                </div>

                {/* Code Editor Section - Mobile Optimized */}
                <div className={`${isMobile ? 'mt-2 p-3' : 'mt-4 p-4'} border-t bg-card/50 backdrop-blur-sm`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className={`${isMobile ? 'text-sm' : 'text-sm'} font-medium`}>Custom Test Script</h3>
                    {isMobile && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Monitor className="w-3 h-3" />
                        <span>Swipe to test environment</span>
                      </div>
                    )}
                  </div>
                  <div className="overflow-hidden rounded-md border bg-background">
                    <LazyCodeEditor
                      value={testCode}
                      onChange={setTestCode}
                      language="javascript"
                      height={isMobile ? "150px" : "200px"}
                      showRunButton
                      onRun={handleRunTestCode}
                      className={isMobile ? "text-sm" : ""}
                      fontSize={isMobile ? "12px" : "14px"}
                      lineHeight={isMobile ? "1.4" : "1.5"}
                      showLineNumbers={!isMobile}
                      showFoldGutter={!isMobile}
                      responsive={isMobile}
                    />
                  </div>
                  
                  {/* Mobile Helper Text */}
                  {isMobile && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      <p>💡 Tip: Use the run button to test your code in the environment</p>
                    </div>
                  )}
                </div>
              </div>
            }
            rightPanel={
              <div className="h-full">
                {isMobile && (
                  <div className="flex items-center justify-between p-3 border-b bg-card/50 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Testing Environment</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Swipe to instructions
                    </div>
                  </div>
                )}
                                 <TestingEnvironment
                   initialUrl={challenge.sandboxUrl}
                   onScreenshot={handleTakeScreenshot}
                   onBugReport={handleBugReport}
                 />
              </div>
            }
            defaultLeftSize={isMobile ? 100 : 40}
            defaultRightSize={isMobile ? 100 : 60}
            minLeftSize={isMobile ? 100 : 25}
            minRightSize={isMobile ? 100 : 40}
            mobileView="stacked"
            leftPanelLabel="Instructions & Code"
            rightPanelLabel="Testing Environment"
          />
        )}
      </div>

      {/* Completion Animations */}
      <CompletionAnimation
        show={showObjectiveAnimation}
        type="objective"
        message={animationMessage}
        onComplete={handleAnimationComplete}
      />

      <CompletionAnimation
        show={showChallengeAnimation}
        type="challenge"
        message={animationMessage}
        onComplete={handleAnimationComplete}
      />

      <CompletionAnimation
        show={showTestAnimation}
        type="test"
        message={animationMessage}
        onComplete={handleAnimationComplete}
      />

      <BugReportingTool
        open={isBugReportOpen}
        onOpenChange={setIsBugReportOpen}
        screenshotUrl={screenshotUrl}
        onTakeScreenshot={handleTakeScreenshot}
        onSubmit={handleSubmitBugReport}
      />
    </div>
  );
};

export default TestingPlayground;
