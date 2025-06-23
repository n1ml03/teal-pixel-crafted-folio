import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { ShortenedURL } from '@/types/shorten.ts';
import { toast } from 'sonner';
import { Check, Copy, QrCode, Link, Calendar, ExternalLink, Download, Share2, Lock, Shield } from 'lucide-react';
import * as QRCodeLib from 'qrcode.react';
import { format } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import { Slider } from '@/components/ui/slider.tsx';

interface ShortenedURLDisplayProps {
  shortenedURL: ShortenedURL;
}

const ShortenedURLDisplay: React.FC<ShortenedURLDisplayProps> = ({ shortenedURL }) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('url');
  const [qrSize, setQrSize] = useState(200);
  const [qrColor, setQrColor] = useState('#000000');
  const [qrBgColor, setQrBgColor] = useState('#FFFFFF');
  const [qrLevel, setQrLevel] = useState<'L' | 'M' | 'Q' | 'H'>('H');

  // Copy to clipboard with animation and feedback
  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);

    // Show success toast with different messages based on what was copied
    if (type === 'short') {
      toast.success('Shortened URL copied to clipboard!');
    } else if (type === 'original') {
      toast.success('Original URL copied to clipboard!');
    } else {
      toast.success('Copied to clipboard!');
    }

    // Reset copied state after 2 seconds
    setTimeout(() => {
      setCopied(null);
    }, 2000);
  };

  // Share URL using Web Share API if available
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Shortened URL',
          text: 'Check out this shortened URL',
          url: shortenedURL.shortURL,
        });
        toast.success('URL shared successfully!');
      } catch (error) {
        console.error('Error sharing:', error);
        // Fallback to copy if sharing fails or was cancelled
        handleCopy(shortenedURL.shortURL, 'short');
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      handleCopy(shortenedURL.shortURL, 'short');
      toast.info('Share not supported on this browser. URL copied instead!');
    }
  };

  // Download QR code as PNG
  const handleDownloadQR = () => {
    const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
    if (!canvas) return;

    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');

    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `qr-${shortenedURL.shortCode}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    toast.success('QR code downloaded!');
  };

  return (
    <Card className="border border shadow-sm bg-white/90 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-6">
        <Tabs defaultValue="url" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6">
            <TabsTrigger value="url" className="flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3">
              <Link className="h-2 w-2 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm">Shortened URL</span>
            </TabsTrigger>
            <TabsTrigger value="qr" className="flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3">
              <QrCode className="h-2 w-2 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm">QR Code</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="mt-0">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-sm font-medium text-gray-500">Original URL</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => handleCopy(shortenedURL.originalURL, 'original')}
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2"
                        >
                          {copied === 'original' ? (
                            <motion.div
                              initial={{ scale: 0.8 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Check className="h-3 w-3 text-green-500" />
                            </motion.div>
                          ) : (
                            <Copy className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy original URL</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="relative group">
                  <p className="text-sm text-gray-700 break-all bg-gray-50 p-2 rounded border">
                    {shortenedURL.originalURL}
                  </p>
                  <div className="absolute inset-0 bg-gray-900/5 opacity-0 group-hover:opacity-100 rounded transition-opacity flex items-center justify-center">
                    <Button
                      onClick={() => handleCopy(shortenedURL.originalURL, 'original')}
                      variant="secondary"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {copied === 'original' ? 'Copied!' : 'Copy URL'}
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-gray-500">Shortened URL</h3>
                    {shortenedURL.password && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center">
                              <Shield className="h-4 w-4 text-amber-500" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>This URL is password protected</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                  <div className="flex-1 bg-blue-50 p-2 rounded sm:rounded-l sm:rounded-r-none border sm:border-r-0 font-medium text-blue-700 break-all text-xs sm:text-sm">
                    {shortenedURL.shortURL}
                  </div>
                  <div className="flex">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => handleCopy(shortenedURL.shortURL, 'short')}
                            variant="outline"
                            size="sm"
                            className="flex-1 sm:flex-none rounded-l sm:rounded-l-none rounded-r-none h-10 sm:h-[42px] border-r-0"
                          >
                            {copied === 'short' ? (
                              <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Check className="h-4 w-4 text-green-500" />
                              </motion.div>
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy to clipboard</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={handleShare}
                            variant="outline"
                            size="sm"
                            className="flex-1 sm:flex-none rounded-r rounded-l-none h-10 sm:h-[42px]"
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Share URL</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-4 mt-3 sm:mt-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => window.open(shortenedURL.shortURL, '_blank')}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1.5 sm:gap-2 h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3"
                      >
                        <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                        Open Link
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Open in new tab</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => setActiveTab('qr')}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1.5 sm:gap-2 h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3"
                      >
                        <QrCode className="h-3 w-3 sm:h-4 sm:w-4" />
                        View QR Code
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Generate QR code</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                <div className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-2 text-[10px] sm:text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    <span>Created: {format(new Date(shortenedURL.createdAt), 'PP')}</span>
                  </div>

                  {shortenedURL.expiresAt && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      <span>Expires: {format(new Date(shortenedURL.expiresAt), 'PP')}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    <Link className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    <span>Clicks: {shortenedURL.clicks}</span>
                  </div>

                  {shortenedURL.password && (
                    <div className="flex items-center gap-1">
                      <Lock className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-amber-500" />
                      <span className="text-amber-600 font-medium">Password Protected</span>
                    </div>
                  )}
                </div>

                {shortenedURL.utmParameters && Object.keys(shortenedURL.utmParameters).length > 0 && (
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                    <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1.5 sm:mb-2">UTM Parameters</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
                      {shortenedURL.utmParameters.source && (
                        <div className="bg-gray-50 p-1.5 sm:p-2 rounded border">
                          <span className="font-medium">Source:</span> {shortenedURL.utmParameters.source}
                        </div>
                      )}
                      {shortenedURL.utmParameters.medium && (
                        <div className="bg-gray-50 p-1.5 sm:p-2 rounded border">
                          <span className="font-medium">Medium:</span> {shortenedURL.utmParameters.medium}
                        </div>
                      )}
                      {shortenedURL.utmParameters.campaign && (
                        <div className="bg-gray-50 p-1.5 sm:p-2 rounded border">
                          <span className="font-medium">Campaign:</span> {shortenedURL.utmParameters.campaign}
                        </div>
                      )}
                      {shortenedURL.utmParameters.term && (
                        <div className="bg-gray-50 p-1.5 sm:p-2 rounded border">
                          <span className="font-medium">Term:</span> {shortenedURL.utmParameters.term}
                        </div>
                      )}
                      {shortenedURL.utmParameters.content && (
                        <div className="bg-gray-50 p-1.5 sm:p-2 rounded border">
                          <span className="font-medium">Content:</span> {shortenedURL.utmParameters.content}
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] sm:text-xs text-gray-400 mt-1.5 sm:mt-2">
                      UTM parameters will be automatically added to the URL when someone clicks your link.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="qr" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="flex flex-col items-center justify-center p-2 sm:p-4">
                <div className="bg-white p-2 sm:p-4 rounded-lg shadow-sm border mb-3 sm:mb-4">
                  <QRCodeLib.QRCodeCanvas
                    id="qr-code"
                    value={shortenedURL.shortURL}
                    size={qrSize}
                    level={qrLevel}
                    marginSize={10}
                    fgColor={qrColor}
                    bgColor={qrBgColor}
                  />
                </div>

                <div className="flex gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={handleDownloadQR}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1.5 sm:gap-2 h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3"
                        >
                          <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                          Download
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Download as PNG</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => handleCopy(shortenedURL.shortURL, 'short')}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1.5 sm:gap-2 h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3"
                        >
                          <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                          Copy URL
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy shortened URL</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <p className="text-[10px] sm:text-xs text-gray-500 mt-3 sm:mt-4 text-center">
                  Scan this QR code with a mobile device to open the shortened URL.
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1.5 sm:mb-2">QR Code Customization</h3>

                  <div className="space-y-3 sm:space-y-4">
                    <div className="space-y-1 sm:space-y-2">
                      <label className="text-[10px] sm:text-xs text-gray-500">Size</label>
                      <div className="flex items-center gap-2 sm:gap-4">
                        <Slider
                          value={[qrSize]}
                          min={100}
                          max={300}
                          step={10}
                          onValueChange={(value) => setQrSize(value[0])}
                          className="flex-1"
                        />
                        <span className="text-[10px] sm:text-xs text-gray-500 w-8 sm:w-10 text-right">{qrSize}px</span>
                      </div>
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                      <label className="text-[10px] sm:text-xs text-gray-500">Error Correction</label>
                      <Select value={qrLevel} onValueChange={(value) => setQrLevel(value as 'L' | 'M' | 'Q' | 'H')}>
                        <SelectTrigger className="w-full h-8 sm:h-10 text-xs sm:text-sm">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="L" className="text-xs sm:text-sm">Low (7%)</SelectItem>
                          <SelectItem value="M" className="text-xs sm:text-sm">Medium (15%)</SelectItem>
                          <SelectItem value="Q" className="text-xs sm:text-sm">Quartile (25%)</SelectItem>
                          <SelectItem value="H" className="text-xs sm:text-sm">High (30%)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-[10px] sm:text-xs text-gray-400">Higher correction allows QR code to be readable even if partially damaged or obscured.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:gap-4">
                      <div className="space-y-1 sm:space-y-2">
                        <label className="text-[10px] sm:text-xs text-gray-500">Foreground Color</label>
                        <div className="flex items-center gap-1 sm:gap-2">
                          <div
                            className="w-5 h-5 sm:w-6 sm:h-6 rounded border"
                            style={{ backgroundColor: qrColor }}
                          />
                          <input
                            type="color"
                            value={qrColor}
                            onChange={(e) => setQrColor(e.target.value)}
                            className="w-full h-7 sm:h-8"
                          />
                        </div>
                      </div>

                      <div className="space-y-1 sm:space-y-2">
                        <label className="text-[10px] sm:text-xs text-gray-500">Background Color</label>
                        <div className="flex items-center gap-1 sm:gap-2">
                          <div
                            className="w-5 h-5 sm:w-6 sm:h-6 rounded border"
                            style={{ backgroundColor: qrBgColor }}
                          />
                          <input
                            type="color"
                            value={qrBgColor}
                            onChange={(e) => setQrBgColor(e.target.value)}
                            className="w-full h-7 sm:h-8"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ShortenedURLDisplay;
