import { useState, ReactNode } from 'react';
import {
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Save,
  X,
  HelpCircle,
  Target,
  Trophy,
  Lightbulb,
  Play,
  Sparkles
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

export interface Objective {
  id: string;
  description: string;
  completed: boolean;
}

export interface Hint {
  id: string;
  level: 'basic' | 'detailed' | 'solution';
  content: string;
}

interface InstructionsPanelProps {
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  objectives: Objective[];
  hints: Hint[];
  timeElapsed: number; // in seconds
  onObjectiveToggle: (id: string) => void;
  onReset: () => void;
  onSave: () => void;
  onExit: () => void;
  onSubmit: () => void;
  children?: ReactNode;
}

const difficultyColors = {
  beginner: 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-700 border-emerald-200 dark:text-emerald-300 dark:border-emerald-800',
  intermediate: 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700 border-amber-200 dark:text-amber-300 dark:border-amber-800',
  advanced: 'bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-700 border-red-200 dark:text-red-300 dark:border-red-800'
};

const hintColors = {
  basic: 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-800',
  detailed: 'bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200 dark:from-purple-900/20 dark:to-violet-900/20 dark:border-purple-800',
  solution: 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 dark:from-amber-900/20 dark:to-yellow-900/20 dark:border-amber-800'
};

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const InstructionsPanel = ({
  title,
  difficulty,
  description,
  objectives,
  hints,
  timeElapsed,
  onObjectiveToggle,
  onReset,
  onSave,
  onExit,
  onSubmit,
  children
}: InstructionsPanelProps) => {
  const [hintsOpen, setHintsOpen] = useState(false);
  const completedCount = objectives.filter(obj => obj.completed).length;
  const totalCount = objectives.length;
  const progressPercentage = Math.round((completedCount / totalCount) * 100);
  const isCompleted = completedCount === totalCount;

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-muted/20 border-r border/50 backdrop-blur-sm">
      {/* Header with glassmorphism effect */}
      <div className="relative p-6 border-b border/50 bg-gradient-to-r from-background/80 to-muted/20 backdrop-blur-md">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-t-lg"></div>
        <div className="relative">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1 pr-3">
              <h2 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent line-clamp-2">
                {title}
              </h2>
              <Badge 
                className={cn(
                  "mt-2 font-medium border transition-all duration-300 hover:scale-105",
                  difficultyColors[difficulty]
                )}
              >
                <Sparkles className="w-3 h-3 mr-1" />
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-muted-foreground">
              <div className="flex items-center bg-muted/50 px-3 py-1.5 rounded-full border border/50">
                <Clock className="w-4 h-4 mr-2 text-primary" />
                <span className="font-medium">{formatTime(timeElapsed)}</span>
              </div>
            </div>
            
            {isCompleted && (
              <div className="flex items-center text-sm text-emerald-600 dark:text-emerald-400">
                <Trophy className="w-4 h-4 mr-1 animate-pulse" />
                <span className="font-medium">Completed!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-6">
        <div className="space-y-8">
          {/* Description Section */}
          <div className="group">
            <h3 className="text-sm font-semibold mb-3 flex items-center text-foreground/80">
              <div className="w-1 h-4 bg-gradient-to-b from-primary to-primary/50 rounded-full mr-2"></div>
              Description
            </h3>
            <div className="bg-gradient-to-br from-muted/30 to-muted/10 p-4 rounded-xl border border/50 group-hover:border transition-all duration-300">
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
          </div>

          <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* Objectives Section */}
          <div className="group">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold flex items-center text-foreground/80">
                <div className="w-1 h-4 bg-gradient-to-b from-accent to-accent/50 rounded-full mr-2"></div>
                <Target className="w-4 h-4 mr-2 text-accent" />
                Objectives
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground px-2 py-1 bg-muted/50 rounded-full">
                  {completedCount} of {totalCount}
                </span>
                {isCompleted && (
                  <Trophy className="w-4 h-4 text-emerald-500 animate-bounce" />
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-muted/20 to-background/50 p-4 rounded-xl border border/50 group-hover:border transition-all duration-300">
              <Progress 
                value={progressPercentage} 
                className="h-2 mb-5 bg-muted/50"
              />

              <ul className="space-y-3">
                {objectives.map((objective, index) => (
                  <li
                    key={objective.id}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg transition-all duration-300 cursor-pointer group/item",
                      "hover:shadow-md hover:scale-[1.02] hover:border-primary/30",
                      objective.completed 
                        ? "bg-gradient-to-r from-emerald-500/10 to-green-500/5 border border-emerald-200/50 dark:border-emerald-800/50" 
                        : "bg-gradient-to-r from-background to-muted/20 border border/30 hover:border/60"
                    )}
                    onClick={() => onObjectiveToggle(objective.id)}
                  >
                    <div className={cn(
                      "flex items-center justify-center w-6 h-6 rounded-full border-2 mt-0.5 flex-shrink-0 transition-all duration-300",
                      objective.completed
                        ? "bg-gradient-to-br from-emerald-500 to-green-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                        : "border-muted-foreground/40 group-hover/item:border-primary/60 group-hover/item:bg-primary/5"
                    )}>
                      {objective.completed && <CheckCircle2 className="w-4 h-4" />}
                      {!objective.completed && (
                        <span className="text-xs font-semibold">{index + 1}</span>
                      )}
                    </div>
                    <span className={cn(
                      "text-sm break-words transition-all duration-300",
                      objective.completed 
                        ? "text-muted-foreground line-through" 
                        : "text-foreground group-hover/item:text-primary"
                    )}>
                      {objective.description}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* Hints Section */}
          <Collapsible open={hintsOpen} onOpenChange={setHintsOpen} className="group">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold flex items-center text-foreground/80">
                <div className="w-1 h-4 bg-gradient-to-b from-accent to-accent/50 rounded-full mr-2"></div>
                <Lightbulb className="w-4 h-4 mr-2 text-accent" />
                Hints ({hints.length})
              </h3>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 hover:bg-accent/20 transition-all duration-300 hover:scale-110"
                >
                  {hintsOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent className="mt-4">
              <div className="space-y-4">
                {hints.map((hint, index) => (
                  <div
                    key={hint.id}
                    className={cn(
                      "p-4 rounded-xl border transition-all duration-300 hover:shadow-md hover:scale-[1.01]",
                      hintColors[hint.level]
                    )}
                  >
                    <div className="flex items-center mb-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mr-3">
                        <HelpCircle className="w-4 h-4 text-primary" />
                      </div>
                      <Badge variant="secondary" className="text-xs font-medium capitalize">
                        {hint.level} Hint
                      </Badge>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/80 pl-9">{hint.content}</p>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>

      {/* Action Buttons with enhanced styling */}
      <div className="p-6 border-t border/50 mt-auto bg-gradient-to-r from-background/80 to-muted/20 backdrop-blur-md">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Button
            variant="default"
            className={cn(
              "w-full group transition-all duration-300 hover:scale-105 hover:shadow-lg",
              isCompleted 
                ? "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg shadow-emerald-500/25" 
                : "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25"
            )}
            onClick={onSubmit}
          >
            <Play className="w-4 h-4 mr-2 group-hover:translate-x-0.5 transition-transform" />
            <span className="truncate font-medium">Submit Solution</span>
          </Button>
          <Button
            variant="outline"
            className="w-full group hover:bg-muted/50 hover:scale-105 transition-all duration-300 border/50"
            onClick={onReset}
          >
            <RotateCcw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-300" />
            <span className="truncate">Reset</span>
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="ghost"
            className="w-full group hover:bg-accent/20 hover:scale-105 transition-all duration-300"
            onClick={onSave}
          >
            <Save className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            <span className="truncate">Save</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full group hover:bg-destructive/20 hover:text-destructive hover:scale-105 transition-all duration-300"
            onClick={onExit}
          >
            <X className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
            <span className="truncate">Exit</span>
          </Button>
        </div>

        {children && (
          <div className="mt-4 p-3 bg-gradient-to-r from-muted/30 to-background/50 rounded-lg border border/30">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructionsPanel;
