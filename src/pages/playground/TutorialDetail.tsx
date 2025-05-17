import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  ArrowLeft,
  BookOpen,
  HelpCircle,
  Info,
  AlertCircle,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Navigation from '@/components/playground/Navigation';
import CodeEditor from '@/components/playground/CodeEditor';
import { useAuth } from '@/contexts/AuthContext';
import { tutorials } from '../../data/tutorials';
import { toast } from '@/components/ui/sonner';

const TutorialDetail = () => {
  const { tutorialId } = useParams<{ tutorialId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Find the tutorial by ID
  const tutorial = tutorials.find(t => t.id === tutorialId);

  // State for current step
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [code, setCode] = useState('');

  // If tutorial not found, show error
  if (!tutorial) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <div className="container py-12 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
          <h1 className="text-2xl font-bold mb-2">Tutorial Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The tutorial you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/playground/tutorials')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tutorials
          </Button>
        </div>
      </div>
    );
  }

  // Get current step
  const currentStep = tutorial.steps[currentStepIndex];

  // Calculate progress percentage
  const progressPercentage = Math.round((completedSteps.length / tutorial.steps.length) * 100);

  // Format time spent
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // Initialize code from current step
  useEffect(() => {
    if (currentStep && currentStep.initialCode) {
      setCode(currentStep.initialCode);
    }
  }, [currentStep]);

  // Handle step completion
  const markStepAsCompleted = () => {
    if (!completedSteps.includes(currentStep.id)) {
      setCompletedSteps(prev => [...prev, currentStep.id]);
      toast.success('Step completed!');

      // If this is the last step, show completion message
      if (currentStepIndex === tutorial.steps.length - 1) {
        toast.success('Tutorial completed! Great job!');
      }
    }
  };

  // Navigate to next step
  const goToNextStep = () => {
    if (currentStepIndex < tutorial.steps.length - 1) {
      // Mark current step as completed if not already
      if (!completedSteps.includes(currentStep.id)) {
        markStepAsCompleted();
      }

      // Go to next step
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  // Navigate to previous step
  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  // Reset tutorial progress
  const resetTutorial = () => {
    if (window.confirm('Are you sure you want to reset your progress for this tutorial?')) {
      setCompletedSteps([]);
      setCurrentStepIndex(0);
      setTimeSpent(0);
      toast.info('Tutorial progress has been reset');
    }
  };

  // Toggle timer
  const toggleTimer = () => {
    setIsTimerRunning(prev => !prev);
  };



  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <div className="container flex-1 py-6 pt-24">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <h1 className="text-3xl font-bold">{tutorial.title}</h1>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatTime(timeSpent)}
                </Badge>
                <Button variant="ghost" size="icon" onClick={toggleTimer}>
                  {isTimerRunning ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs mb-1">
                <span>Progress</span>
                <span>{progressPercentage}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            {/* Step Content */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    Step {currentStepIndex + 1}: {currentStep.title}
                    {completedSteps.includes(currentStep.id) && (
                      <CheckCircle className="ml-2 h-4 w-4 text-green-500" />
                    )}
                  </CardTitle>
                  <Badge>{currentStepIndex + 1} of {tutorial.steps.length}</Badge>
                </div>
                <CardDescription>{currentStep.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: currentStep.content }} />

                  {currentStep.tip && (
                    <Alert className="mt-4">
                      <Info className="h-4 w-4" />
                      <AlertTitle>Tip</AlertTitle>
                      <AlertDescription>{currentStep.tip}</AlertDescription>
                    </Alert>
                  )}

                  {currentStep.warning && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Warning</AlertTitle>
                      <AlertDescription>{currentStep.warning}</AlertDescription>
                    </Alert>
                  )}
                </ScrollArea>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={goToPreviousStep}
                  disabled={currentStepIndex === 0}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="default"
                    onClick={markStepAsCompleted}
                    disabled={completedSteps.includes(currentStep.id)}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Complete Step
                  </Button>

                  <Button
                    variant="default"
                    onClick={goToNextStep}
                    disabled={currentStepIndex === tutorial.steps.length - 1}
                  >
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>

            {/* Code Editor (if step has code) */}
            {currentStep.hasCodeEditor && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Code Editor</h2>
                <CodeEditor
                  value={code}
                  onChange={setCode}
                  language={currentStep.codeLanguage || 'javascript'}
                  height="300px"
                  showRunButton
                  onRun={(code) => {
                    toast.success('Code executed successfully!');
                    // In a real implementation, this would validate the code against the expected solution
                    if (!completedSteps.includes(currentStep.id)) {
                      markStepAsCompleted();
                    }
                  }}
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-64 space-y-6">
            {/* Tutorial Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tutorial Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Difficulty</p>
                  <Badge variant="outline" className="mt-1">{tutorial.difficulty}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">Category</p>
                  <Badge variant="outline" className="mt-1">{tutorial.category}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">Estimated Duration</p>
                  <Badge variant="outline" className="mt-1 flex items-center w-fit">
                    <Clock className="h-3 w-3 mr-1" />
                    {tutorial.duration}
                  </Badge>
                </div>

                <Separator />

                <Button variant="outline" className="w-full" onClick={resetTutorial}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset Progress
                </Button>
              </CardContent>
            </Card>

            {/* Steps Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-2">
                    {tutorial.steps.map((step, index) => (
                      <Button
                        key={step.id}
                        variant={currentStepIndex === index ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setCurrentStepIndex(index)}
                      >
                        <div className="flex items-center">
                          {completedSteps.includes(step.id) ? (
                            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          ) : (
                            <span className="h-4 w-4 mr-2 flex items-center justify-center text-xs">
                              {index + 1}
                            </span>
                          )}
                          <span className="truncate">{step.title}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialDetail;
