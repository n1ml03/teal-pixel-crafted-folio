import { useState, ReactNode } from 'react';
import {
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Save,
  X,
  HelpCircle
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
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-amber-100 text-amber-800',
  advanced: 'bg-red-100 text-red-800'
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

  return (
    <div className="flex flex-col h-full bg-background border-r">
      <div className="p-4 border-b">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-bold line-clamp-2 pr-2 flex-1">{title}</h2>
        </div>

        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Clock className="w-4 h-4 mr-1 flex-shrink-0" />
          <span>Time: {formatTime(timeElapsed)}</span>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          </div>

          <Separator />

          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium">Objectives</h3>
              <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                {completedCount} of {totalCount} completed
              </span>
            </div>

            <Progress value={progressPercentage} className="h-1.5 mb-4" />

            <ul className="space-y-3">
              {objectives.map((objective, index) => (
                <li
                  key={objective.id}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-md transition-colors",
                    objective.completed ? "bg-muted/50" : "hover:bg-muted/30"
                  )}
                  onClick={() => onObjectiveToggle(objective.id)}
                >
                  <div className={cn(
                    "flex items-center justify-center w-5 h-5 rounded-full border mt-0.5 flex-shrink-0",
                    objective.completed
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-muted-foreground"
                  )}>
                    {objective.completed && <CheckCircle2 className="w-4 h-4" />}
                    {!objective.completed && (
                      <span className="text-xs font-medium">{index + 1}</span>
                    )}
                  </div>
                  <span className={cn(
                    "text-sm break-words",
                    objective.completed && "text-muted-foreground line-through"
                  )}>
                    {objective.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          <Collapsible open={hintsOpen} onOpenChange={setHintsOpen}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Hints</h3>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="p-0 h-8 w-8 flex-shrink-0">
                  {hintsOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent className="mt-3">
              <div className="space-y-4">
                {hints.map((hint) => (
                  <div
                    key={hint.id}
                    className="bg-muted/50 p-4 rounded-md border border-muted"
                  >
                    <div className="flex items-center mb-2">
                      <HelpCircle className="w-4 h-4 mr-2 text-muted-foreground flex-shrink-0" />
                      <span className="text-xs font-medium capitalize">
                        {hint.level} Hint
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed">{hint.content}</p>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>

      <div className="p-4 border-t mt-auto">
        <div className="grid grid-cols-2 gap-2 mb-2">
          <Button
            variant="default"
            className="w-full"
            onClick={onSubmit}
          >
            <span className="truncate">Submit Solution</span>
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={onReset}
          >
            <RotateCcw className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">Reset</span>
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="ghost"
            className="w-full"
            onClick={onSave}
          >
            <Save className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">Save</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={onExit}
          >
            <X className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">Exit</span>
          </Button>
        </div>

        {children && (
          <div className="mt-3">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructionsPanel;
