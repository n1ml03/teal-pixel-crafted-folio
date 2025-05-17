import { motion } from 'framer-motion';
import { 
  Clock, 
  BookmarkPlus, 
  BookmarkCheck, 
  ArrowRight,
  Star
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MotionButton } from "@/components/ui/motion-button";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  progress?: number;
  tags: string[];
  featured?: boolean;
  category: string;
}

interface ChallengeCardProps {
  challenge: Challenge;
  onSave?: (id: string) => void;
  onDetails?: (id: string) => void;
  onStart?: (id: string) => void;
  isSaved?: boolean;
  className?: string;
  index?: number;
}

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-amber-100 text-amber-800',
  advanced: 'bg-red-100 text-red-800'
};

const DifficultyBadge = ({ level }: { level: 'beginner' | 'intermediate' | 'advanced' }) => (
  <span className={cn(
    'absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium',
    difficultyColors[level]
  )}>
    {level.charAt(0).toUpperCase() + level.slice(1)}
  </span>
);

export const ChallengeCard = ({ 
  challenge, 
  onSave, 
  onDetails, 
  onStart,
  isSaved = false,
  className,
  index = 0
}: ChallengeCardProps) => {
  const {
    id,
    title,
    description,
    thumbnail,
    difficulty,
    duration,
    progress,
    tags,
    featured
  } = challenge;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn("h-full", className)}
    >
      <Card className={cn(
        "h-full overflow-hidden transition-all duration-300 hover:shadow-md border border-gray-100",
        featured && "ring-2 ring-primary/50"
      )}>
        <div className="relative overflow-hidden aspect-video">
          <img 
            src={thumbnail} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <DifficultyBadge level={difficulty} />
          {featured && (
            <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium flex items-center">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </div>
          )}
        </div>
        
        <CardHeader className="pb-2">
          <CardTitle className="line-clamp-2 text-lg">{title}</CardTitle>
          <CardDescription className="flex items-center text-xs">
            <Clock className="w-3 h-3 mr-1 inline" />
            {duration}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pb-2">
          <p className="line-clamp-3 text-sm text-muted-foreground mb-3">{description}</p>
          
          {progress !== undefined && progress > 0 && (
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>
          )}
          
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs">+{tags.length - 3}</Badge>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="justify-between pt-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onDetails?.(id)}
            className="text-xs"
          >
            Details
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onSave?.(id)}
              aria-label={isSaved ? "Remove from saved" : "Save for later"}
            >
              {isSaved ? (
                <BookmarkCheck className="h-4 w-4 text-primary" />
              ) : (
                <BookmarkPlus className="h-4 w-4" />
              )}
            </Button>
            
            <MotionButton
              variant="default"
              size="sm"
              onClick={() => onStart?.(id)}
              className="text-xs"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Start <ArrowRight className="ml-1 h-3 w-3" />
            </MotionButton>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ChallengeCard;
