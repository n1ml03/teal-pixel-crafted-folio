import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ThumbsUp,
  Bookmark,
  BookmarkCheck,
  Share2,
  Copy,
  X,
  Check,
  Loader2
} from 'lucide-react';
import { toast } from "sonner";
import { MotionButton } from "@/components/ui/motion-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogClose,
  DialogHeader
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type ContentType = 'article' | 'resource' | 'project';

export interface SocialActionsProps {
  contentId: string;
  contentType: ContentType;
  contentTitle: string;
  contentUrl: string;
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showShareDialog?: boolean;
  onShareDialogChange?: (open: boolean) => void;
  horizontal?: boolean;
}

export const SocialActions: React.FC<SocialActionsProps> = ({
  contentId,
  contentType,
  contentTitle,
  contentUrl,
  showLabels = false,
  size = 'sm',
  className = '',
  showShareDialog: externalShowShareDialog,
  onShareDialogChange,
  horizontal = true,
}) => {
  // State for like, save, share dialog, and loading states
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [internalShowShareDialog, setInternalShowShareDialog] = useState(false);
  const [isSharing, setIsSharing] = useState<string | null>(null); // Track which platform is being shared to
  const [isCopied, setIsCopied] = useState(false);

  // Use either internal or external state for share dialog
  const showShareDialog = externalShowShareDialog !== undefined ? externalShowShareDialog : internalShowShareDialog;
  const setShowShareDialog = (value: boolean) => {
    if (onShareDialogChange) {
      onShareDialogChange(value);
    } else {
      setInternalShowShareDialog(value);
    }
  };

  // Get the appropriate localStorage key based on content type
  const getSavedItemsKey = useCallback(() => {
    switch (contentType) {
      case 'article':
        return 'savedArticles';
      case 'resource':
        return 'savedResources';
      case 'project':
        return 'savedProjects';
      default:
        return 'savedItems';
    }
  }, [contentType]);

  const getLikedItemsKey = useCallback(() => {
    switch (contentType) {
      case 'article':
        return 'likedArticles';
      case 'resource':
        return 'likedResources';
      case 'project':
        return 'likedProjects';
      default:
        return 'likedItems';
    }
  }, [contentType]);

  // Check if item is saved/liked on component mount
  useEffect(() => {
    const savedItemsKey = getSavedItemsKey();
    const likedItemsKey = getLikedItemsKey();

    const savedItems = JSON.parse(localStorage.getItem(savedItemsKey) || '[]');
    const likedItems = JSON.parse(localStorage.getItem(likedItemsKey) || '[]');

    setIsSaved(savedItems.includes(contentId));
    setIsLiked(likedItems.includes(contentId));
  }, [contentId, contentType, getLikedItemsKey, getSavedItemsKey]);

  // Handle saving item
  const handleSave = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const savedItemsKey = getSavedItemsKey();
    const savedItems = JSON.parse(localStorage.getItem(savedItemsKey) || '[]');

    if (isSaved) {
      // Remove from saved items
      const updatedSavedItems = savedItems.filter((id: string) => id !== contentId);
      localStorage.setItem(savedItemsKey, JSON.stringify(updatedSavedItems));
      setIsSaved(false);
      toast.success(`${contentType === 'article' ? 'Article' : contentType === 'resource' ? 'Resource' : 'Project'} removed from saved items`);
    } else {
      // Add to saved items
      savedItems.push(contentId);
      localStorage.setItem(savedItemsKey, JSON.stringify(savedItems));
      setIsSaved(true);
      toast.success(`${contentType === 'article' ? 'Article' : contentType === 'resource' ? 'Resource' : 'Project'} saved for later`);
    }
  };

  // Handle liking item
  const handleLike = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const likedItemsKey = getLikedItemsKey();
    const likedItems = JSON.parse(localStorage.getItem(likedItemsKey) || '[]');

    if (isLiked) {
      // Remove like
      const updatedLikedItems = likedItems.filter((id: string) => id !== contentId);
      localStorage.setItem(likedItemsKey, JSON.stringify(updatedLikedItems));
      setIsLiked(false);
    } else {
      // Add like
      likedItems.push(contentId);
      localStorage.setItem(likedItemsKey, JSON.stringify(likedItems));
      setIsLiked(true);
      toast.success('Thanks for your feedback!');
    }
  };

  // Handle sharing item
  const handleShare = async (platform?: string) => {
    const url = contentUrl;
    const title = contentTitle;

    // If no platform specified, show share dialog
    if (!platform) {
      setShowShareDialog(true);
      return;
    }

    // Set loading state for the specific platform
    setIsSharing(platform);

    try {
      if (platform === 'copy') {
        await navigator.clipboard.writeText(url);
        setIsCopied(true);
        toast.success('Link copied to clipboard!', {
          description: 'You can now paste it anywhere you want.',
          icon: <Check className="h-4 w-4" />
        });

        // Reset copied state after 2 seconds
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);

        setShowShareDialog(false);
        return;
      }

      if (platform === 'twitter') {
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        toast.success('Sharing to Twitter', {
          description: 'Twitter opened in a new tab'
        });
        setShowShareDialog(false);
        return;
      }

      if (platform === 'facebook') {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        toast.success('Sharing to Facebook', {
          description: 'Facebook opened in a new tab'
        });
        setShowShareDialog(false);
        return;
      }

      if (platform === 'linkedin') {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        toast.success('Sharing to LinkedIn', {
          description: 'LinkedIn opened in a new tab'
        });
        setShowShareDialog(false);
        return;
      }

      if (platform === 'whatsapp') {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' - ' + url)}`, '_blank');
        toast.success('Sharing to WhatsApp', {
          description: 'WhatsApp opened in a new tab'
        });
        setShowShareDialog(false);
        return;
      }
    } catch (error) {
      toast.error('Failed to share', {
        description: 'Please try again later'
      });
    } finally {
      // Reset loading state
      setIsSharing(null);
    }
  };

  // Button size classes with improved sizing and accessibility
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'p-2.5 rounded-full min-w-[36px] min-h-[36px]';
      case 'lg':
        return 'p-4 rounded-lg min-w-[48px] min-h-[48px]';
      default: // md
        return 'p-3 rounded-lg min-w-[42px] min-h-[42px]';
    }
  };

  return (
    <>
      <div className={`flex ${horizontal ? 'flex-row' : 'flex-col'} items-center gap-3 ${className}`}>
        {/* Like Button */}
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                onClick={handleLike}
                className={cn(
                  getSizeClasses(),
                  "transition-all duration-300 flex items-center justify-center shadow-sm",
                  isLiked
                    ? "bg-gradient-to-r from-teal-50 to-teal-100 text-teal-700 border border-teal-200 shadow-teal-100/50"
                    : "bg-white text-gray-600 border border hover:bg-gray-50 hover:border-gray-300"
                )}
                whileHover={{
                  scale: 1.05,
                  y: -2,
                  boxShadow: "0 8px 16px -4px rgba(0, 0, 0, 0.1)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 15
                }}
                aria-label={isLiked ? "Unlike" : "Like"}
              >
                <div className="flex items-center justify-center gap-1.5">
                  <motion.div
                    animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <ThumbsUp
                      className={cn(
                        "w-5 h-5",
                        isLiked ? "fill-teal-500 text-teal-600" : ""
                      )}
                    />
                  </motion.div>
                  {showLabels && (
                    <span className="text-sm font-medium">
                      {isLiked ? 'Liked' : 'Like'}
                    </span>
                  )}
                </div>
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="top" className="font-medium">
              <p>{isLiked ? 'Unlike this content' : 'Like this content'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Save Button */}
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                onClick={handleSave}
                className={cn(
                  getSizeClasses(),
                  "transition-all duration-300 flex items-center justify-center shadow-sm",
                  isSaved
                    ? "bg-gradient-to-r from-teal-50 to-teal-100 text-teal-700 border border-teal-200 shadow-teal-100/50"
                    : "bg-white text-gray-600 border border hover:bg-gray-50 hover:border-gray-300"
                )}
                whileHover={{
                  scale: 1.05,
                  y: -2,
                  boxShadow: "0 8px 16px -4px rgba(0, 0, 0, 0.1)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 15
                }}
                aria-label={isSaved ? "Unsave" : "Save"}
              >
                <div className="flex items-center justify-center gap-1.5">
                  <motion.div
                    animate={isSaved ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    {isSaved ? (
                      <BookmarkCheck className="w-5 h-5 fill-teal-500 text-teal-600" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                  </motion.div>
                  {showLabels && (
                    <span className="text-sm font-medium">
                      {isSaved ? 'Saved' : 'Save'}
                    </span>
                  )}
                </div>
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="top" className="font-medium">
              <p>{isSaved ? 'Remove from saved items' : 'Save for later'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Share Button */}
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                onClick={() => handleShare()}
                className={cn(
                  getSizeClasses(),
                  "transition-all duration-300 flex items-center justify-center shadow-sm",
                  "bg-white text-gray-600 border border hover:bg-gray-50 hover:border-gray-300"
                )}
                whileHover={{
                  scale: 1.05,
                  y: -2,
                  boxShadow: "0 8px 16px -4px rgba(0, 0, 0, 0.1)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 15
                }}
                aria-label="Share this content"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <Share2 className="w-5 h-5" />
                  {showLabels && <span className="text-sm font-medium">Share</span>}
                </div>
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="top" className="font-medium">
              <p>Share this content</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl">
          {/* Clean Header Section */}
          <motion.div
            className="relative bg-gradient-to-br from-teal-50/80 via-blue-50/40 to-white/60 p-6 border-b border-gray-100/50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Subtle decorative elements */}
            <div className="absolute top-4 right-4 w-16 h-16 bg-teal-100/20 rounded-full -mr-4 -mt-4" />
            <div className="absolute bottom-2 left-2 w-12 h-12 bg-blue-100/15 rounded-xl" />

            <DialogHeader className="relative z-10">
              <div className="flex items-center mb-3">
                <motion.div 
                  className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center text-white mr-3 shadow-lg"
                  whileHover={{ rotate: 5, scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Share2 className="w-5 h-5" />
                </motion.div>
                <div>
                  <DialogTitle className="text-xl font-bold text-gray-800">
                    Share {contentType}
                  </DialogTitle>
                  <DialogDescription className="text-gray-600 text-sm mt-1">
                    Choose your preferred platform
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <DialogClose className="absolute top-4 right-4 rounded-full p-2 text-gray-500 hover:bg-white/50 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all z-20">
              <X className="w-4 h-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </motion.div>

          {/* Main Content */}
          <motion.div
            className="p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {/* Social Platform Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {/* Twitter/X Button */}
              <motion.button
                onClick={() => handleShare('twitter')}
                className="flex flex-col items-center justify-center gap-2 p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 hover:border-[#1DA1F2]/30 hover:bg-[#1DA1F2]/5 transition-all duration-200 shadow-sm hover:shadow-md group"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                whileHover={{ y: -2, scale: 1.02 }}
                disabled={isSharing === 'twitter'}
              >
                {isSharing === 'twitter' ? (
                  <Loader2 className="w-6 h-6 animate-spin text-[#1DA1F2]" />
                ) : (
                  <svg className="w-6 h-6 text-[#1DA1F2] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                )}
                <span className="text-sm font-medium text-gray-700 group-hover:text-[#1DA1F2] transition-colors">Twitter</span>
              </motion.button>

              {/* Facebook Button */}
              <motion.button
                onClick={() => handleShare('facebook')}
                className="flex flex-col items-center justify-center gap-2 p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 hover:border-[#4267B2]/30 hover:bg-[#4267B2]/5 transition-all duration-200 shadow-sm hover:shadow-md group"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.25 }}
                whileHover={{ y: -2, scale: 1.02 }}
                disabled={isSharing === 'facebook'}
              >
                {isSharing === 'facebook' ? (
                  <Loader2 className="w-6 h-6 animate-spin text-[#4267B2]" />
                ) : (
                  <svg className="w-6 h-6 text-[#4267B2] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                )}
                <span className="text-sm font-medium text-gray-700 group-hover:text-[#4267B2] transition-colors">Facebook</span>
              </motion.button>

              {/* LinkedIn Button */}
              <motion.button
                onClick={() => handleShare('linkedin')}
                className="flex flex-col items-center justify-center gap-2 p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 hover:border-[#0077B5]/30 hover:bg-[#0077B5]/5 transition-all duration-200 shadow-sm hover:shadow-md group"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                whileHover={{ y: -2, scale: 1.02 }}
                disabled={isSharing === 'linkedin'}
              >
                {isSharing === 'linkedin' ? (
                  <Loader2 className="w-6 h-6 animate-spin text-[#0077B5]" />
                ) : (
                  <svg className="w-6 h-6 text-[#0077B5] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                )}
                <span className="text-sm font-medium text-gray-700 group-hover:text-[#0077B5] transition-colors">LinkedIn</span>
              </motion.button>

              {/* WhatsApp Button */}
              <motion.button
                onClick={() => handleShare('whatsapp')}
                className="flex flex-col items-center justify-center gap-2 p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 hover:border-[#25D366]/30 hover:bg-[#25D366]/5 transition-all duration-200 shadow-sm hover:shadow-md group"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.35 }}
                whileHover={{ y: -2, scale: 1.02 }}
                disabled={isSharing === 'whatsapp'}
              >
                {isSharing === 'whatsapp' ? (
                  <Loader2 className="w-6 h-6 animate-spin text-[#25D366]" />
                ) : (
                  <svg className="w-6 h-6 text-[#25D366] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                )}
                <span className="text-sm font-medium text-gray-700 group-hover:text-[#25D366] transition-colors">WhatsApp</span>
              </motion.button>
            </div>

            {/* Copy Link Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <MotionButton
                onClick={() => handleShare('copy')}
                className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-4 py-3 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSharing === 'copy'}
                aria-label="Copy link to clipboard"
              >
                {isSharing === 'copy' ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : isCopied ? (
                  <Check className="w-4 h-4 mr-2 text-white" />
                ) : (
                  <Copy className="w-4 h-4 mr-2" />
                )}
                {isCopied ? 'Link Copied!' : 'Copy Link'}
              </MotionButton>
            </motion.div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SocialActions;
