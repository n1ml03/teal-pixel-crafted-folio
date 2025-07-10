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
        "h-full overflow-hidden transition-all duration-500 hover:shadow-2xl border border-white/30 bg-white/90 backdrop-blur-md shadow-lg hover:scale-[1.02] hover:-translate-y-2",
        featured && "ring-2 ring-gradient-to-r from-purple-400 to-blue-400 shadow-purple-200/50"
      )}>
        <div className="relative overflow-hidden aspect-video group">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Enhanced badges with glassmorphism */}
          <div className="absolute top-2 right-2">
            <motion.div
              className={cn(
                "backdrop-blur-md border border-white/30 shadow-lg",
                isMobile ? 'px-2 py-1 text-[10px]' : 'px-3 py-1.5 text-xs',
                'rounded-full font-semibold text-white',
                difficulty === 'beginner' && 'bg-green-500/80',
                difficulty === 'intermediate' && 'bg-amber-500/80', 
                difficulty === 'advanced' && 'bg-red-500/80'
              )}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
            >
              {isMobile ? difficulty.charAt(0).toUpperCase() : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </motion.div>
          </div>
          
          {featured && (
            <motion.div 
              className={`absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white ${isMobile ? 'px-2 py-1 text-[10px]' : 'px-3 py-1.5 text-xs'} rounded-full font-semibold flex items-center backdrop-blur-md border border-white/30 shadow-lg`}
              initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 300 }}
              whileHover={{ scale: 1.05, rotate: 2 }}
            >
              <Star className={`${isMobile ? 'w-2.5 h-2.5 mr-0.5' : 'w-3 h-3 mr-1'} animate-pulse`} />
              {isMobile ? 'New' : 'Featured'}
            </motion.div>
          )}
        </div>

        <CardHeader className={isMobile ? "p-4 pb-2" : "p-6 pb-3"}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 + 0.1 }}
          >
            <CardTitle className={`line-clamp-2 ${isMobile ? 'text-base' : 'text-lg'} font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2`}>
              {title}
            </CardTitle>
            <CardDescription className="flex items-center text-xs bg-gray-100/80 backdrop-blur-sm rounded-full px-2 py-1 w-fit">
              <Clock className={`${isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'} mr-1 text-blue-500`} />
              <span className="font-medium">{duration}</span>
            </CardDescription>
          </motion.div>
        </CardHeader>

        <CardContent className={isMobile ? "p-4 pt-0 pb-2" : "px-6 pb-3"}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 + 0.2 }}
          >
            <p className={`line-clamp-2 ${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 mb-3 leading-relaxed`}>
              {description}
            </p>

            {progress !== undefined && progress > 0 && (
              <motion.div 
                className="mb-3 bg-gray-50/80 backdrop-blur-sm rounded-lg p-2"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 + 0.3 }}
              >
                <div className="flex justify-between text-xs mb-1.5">
                  <span className={`${isMobile ? 'text-[10px]' : ''} font-medium text-gray-700`}>Progress</span>
                  <span className={`${isMobile ? 'text-[10px]' : ''} font-bold text-teal-600`}>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2 bg-gray-200/50" />
              </motion.div>
            )}

            <div className="flex flex-wrap gap-1.5 mt-3">
              {tags.slice(0, isMobile ? 2 : 3).map((tag, tagIndex) => (
                <motion.div
                  key={tag}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.05 + 0.4 + tagIndex * 0.05 }}
                >
                  <Badge 
                    variant="secondary" 
                    className={`${isMobile ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-0.5'} bg-gradient-to-r from-blue-100 to-teal-100 text-blue-700 border-blue-200/50 hover:from-blue-200 hover:to-teal-200 transition-all duration-200`}
                  >
                    {tag}
                  </Badge>
                </motion.div>
              ))}
              {tags.length > (isMobile ? 2 : 3) && (
                <Badge 
                  variant="outline" 
                  className={`${isMobile ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-0.5'} border-gray-300 text-gray-600 bg-white/80 backdrop-blur-sm`}
                >
                  +{tags.length - (isMobile ? 2 : 3)}
                </Badge>
              )}
            </div>
          </motion.div>
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
