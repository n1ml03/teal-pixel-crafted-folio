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
import { useIsMobile } from '@/hooks/use-mobile';
import LazyImage from '@/components/ui/lazy-image';

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

const DifficultyBadge = ({ level }: { level: 'beginner' | 'intermediate' | 'advanced' }) => {
  const isMobile = useIsMobile();
  return (
    <span className={cn(
      `absolute top-2 right-2 ${isMobile ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs'} rounded-full font-medium`,
      difficultyColors[level]
    )}>
      {isMobile ? level.charAt(0).toUpperCase() : level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
  );
};

export const ChallengeCard = ({
  challenge,
  onSave,
  onDetails,
  onStart,
  isSaved = false,
  className,
  index = 0
}: ChallengeCardProps) => {
  const isMobile = useIsMobile();
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
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
      className={cn("h-full", className)}
      style={{ contain: 'content' }}
    >
      <Card className={cn(
        "h-full overflow-hidden transition-all duration-300 hover:shadow-md border border-gray-100",
        featured && "ring-2 ring-primary/50"
      )}>
        <div className="relative overflow-hidden aspect-video">
          <LazyImage
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            optimizeResponsive={true}
            blurEffect={true}
            loadingStrategy="lazy"
          />
          <DifficultyBadge level={difficulty} />
          {featured && (
            <div className={`absolute top-2 left-2 bg-primary text-primary-foreground ${isMobile ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs'} rounded-full font-medium flex items-center`}>
              <Star className={`${isMobile ? 'w-2.5 h-2.5 mr-0.5' : 'w-3 h-3 mr-1'}`} />
              {isMobile ? 'New' : 'Featured'}
            </div>
          )}
        </div>

        <CardHeader className={isMobile ? "p-3 pb-1" : "pb-2"}>
          <CardTitle className={`line-clamp-2 ${isMobile ? 'text-base' : 'text-lg'}`}>{title}</CardTitle>
          <CardDescription className="flex items-center text-xs">
            <Clock className={`${isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'} mr-1 inline`} />
            {duration}
          </CardDescription>
        </CardHeader>

        <CardContent className={isMobile ? "p-3 pt-1 pb-1" : "pb-2"}>
          <p className={`line-clamp-2 ${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground mb-2`}>{description}</p>

          {progress !== undefined && progress > 0 && (
            <div className="mb-2">
              <div className="flex justify-between text-xs mb-1">
                <span className={isMobile ? 'text-[10px]' : ''}>Progress</span>
                <span className={isMobile ? 'text-[10px]' : ''}>{progress}%</span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>
          )}

          <div className="flex flex-wrap gap-1 mt-2">
            {tags.slice(0, isMobile ? 2 : 3).map(tag => (
              <Badge key={tag} variant="secondary" className={`${isMobile ? 'text-[10px] px-1.5 py-0' : 'text-xs'}`}>{tag}</Badge>
            ))}
            {tags.length > (isMobile ? 2 : 3) && (
              <Badge variant="outline" className={`${isMobile ? 'text-[10px] px-1.5 py-0' : 'text-xs'}`}>+{tags.length - (isMobile ? 2 : 3)}</Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className={`justify-between ${isMobile ? 'p-3 pt-1' : 'pt-2'}`}>
          <Button
            variant="ghost"
            size={isMobile ? "sm" : "sm"}
            onClick={() => onDetails?.(id)}
            className={`${isMobile ? 'text-[10px] h-7 px-2' : 'text-xs'}`}
          >
            Details
          </Button>

          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className={isMobile ? "h-7 w-7" : "h-8 w-8"}
              onClick={() => onSave?.(id)}
              aria-label={isSaved ? "Remove from saved" : "Save for later"}
            >
              {isSaved ? (
                <BookmarkCheck className={`${isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4'} text-primary`} />
              ) : (
                <BookmarkPlus className={`${isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} />
              )}
            </Button>

            <MotionButton
              variant="default"
              size={isMobile ? "sm" : "sm"}
              onClick={() => onStart?.(id)}
              className={`${isMobile ? 'text-[10px] h-7 px-2' : 'text-xs'}`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {isMobile ? 'Start' : 'Start'} <ArrowRight className={`ml-1 ${isMobile ? 'h-2.5 w-2.5' : 'h-3 w-3'}`} />
            </MotionButton>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ChallengeCard;
