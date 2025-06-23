import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShortenedURL } from '@/types/shorten.ts';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Copy, Trash2, ExternalLink, Search, QrCode, BarChart3, Star, Clock } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog.tsx";
import { URLShortenerService } from '@/services/URLShortenerService.ts';

interface URLHistoryListProps {
  urlHistory: ShortenedURL[];
  onDelete: (id: string) => void;
  onSelect: (url: ShortenedURL) => void;
  onAnalyticsSelect?: (url: ShortenedURL) => void;
  onUpdate?: () => void;
}

const URLHistoryList: React.FC<URLHistoryListProps> = ({ urlHistory, onDelete, onSelect, onAnalyticsSelect, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter URLs based on search term
  const filteredURLs = urlHistory.filter(url =>
    url.originalURL.toLowerCase().includes(searchTerm.toLowerCase()) ||
    url.shortURL.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (url.customAlias && url.customAlias.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success('URL copied to clipboard!');

    // Reset copied state after 2 seconds
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      toast.success('URL deleted successfully!');
      setDeleteId(null);
    }
  };

  const handleTogglePermanent = (url: ShortenedURL) => {
    const isPermanent = URLShortenerService.isInPermanentStorage(url.id);
    
    if (isPermanent) {
      const success = URLShortenerService.removeFromPermanentStorage(url.id);
      if (success) {
        toast.success('URL removed from permanent storage');
        onUpdate?.();
      } else {
        toast.error('Failed to remove URL from permanent storage');
      }
    } else {
      const success = URLShortenerService.addToPermanentStorage(url.id);
      if (success) {
        toast.success('URL saved to permanent storage!');
        onUpdate?.();
      } else {
        toast.error('Failed to save URL to permanent storage');
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
        <Input
          placeholder="Search URLs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 sm:pl-10 h-9 sm:h-10 text-xs sm:text-sm"
        />
      </div>

      {filteredURLs.length === 0 ? (
        <div className="text-center py-8">
          {urlHistory.length === 0 ? (
            <p className="text-gray-500">No shortened URLs yet. Create one to get started!</p>
          ) : (
            <p className="text-gray-500">No URLs match your search.</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredURLs.map((url) => (
            <motion.div
              key={url.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="border border rounded-lg p-3 sm:p-4 bg-white hover:shadow-sm transition-all"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-1 flex-1 min-w-0">
                    <h3 className="font-medium text-xs sm:text-sm text-gray-900 break-all">
                      {url.shortURL}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-gray-500 break-all truncate">
                      {url.originalURL.length > 30
                        ? `${url.originalURL.substring(0, 30)}...`
                        : url.originalURL}
                    </p>
                  </div>
                  <div className="flex gap-0.5 sm:gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 sm:h-8 sm:w-8"
                      onClick={() => handleCopy(url.shortURL, url.id)}
                    >
                      {copiedId === url.id ? (
                        <motion.div
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500" />
                        </motion.div>
                      ) : (
                        <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-7 w-7 sm:h-8 sm:w-8 ${
                        URLShortenerService.isInPermanentStorage(url.id) 
                          ? 'text-yellow-500 hover:text-yellow-600' 
                          : 'text-gray-400 hover:text-yellow-500'
                      }`}
                      onClick={() => handleTogglePermanent(url)}
                      title={URLShortenerService.isInPermanentStorage(url.id) ? 'Remove from permanent storage' : 'Save permanently'}
                    >
                      <Star className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                        URLShortenerService.isInPermanentStorage(url.id) ? 'fill-current' : ''
                      }`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 sm:h-8 sm:w-8"
                      onClick={() => window.open(url.shortURL, '_blank')}
                    >
                      <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 sm:h-8 sm:w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => confirmDelete(url.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-x-3 sm:gap-x-4 gap-y-1 sm:gap-y-2 text-[10px] sm:text-xs text-gray-500 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    <span>Created: {format(new Date(url.createdAt), 'PP')}</span>
                  </div>

                  {url.expiresAt ? (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Expires: {format(new Date(url.expiresAt), 'PP')}</span>
                    </div>
                  ) : (
                    URLShortenerService.isInPermanentStorage(url.id) && (
                      <div className="flex items-center gap-1 text-yellow-600">
                        <Star className="h-3 w-3 fill-current" />
                        <span>Permanent</span>
                      </div>
                    )
                  )}

                  <div className="flex items-center gap-1">
                    <span>Clicks: {url.clicks}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 sm:h-7 text-[10px] sm:text-xs px-1.5 sm:px-2"
                    onClick={() => onSelect(url)}
                  >
                    <QrCode className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                    QR Code
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 sm:h-7 text-[10px] sm:text-xs px-1.5 sm:px-2"
                    onClick={() => onAnalyticsSelect ? onAnalyticsSelect(url) : onSelect(url)}
                  >
                    <BarChart3 className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                    Analytics
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base sm:text-lg">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-xs sm:text-sm">
              This will permanently delete this shortened URL. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <AlertDialogCancel className="mt-0 text-xs sm:text-sm h-8 sm:h-10">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-xs sm:text-sm h-8 sm:h-10"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default URLHistoryList;
