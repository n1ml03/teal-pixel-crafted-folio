import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { URLShortenerService } from '@/services/URLShortenerService.ts';
import { MotionButton } from '@/components/ui/motion-button.tsx';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { ExternalLink, AlertTriangle, ArrowLeft, Shield, Clock, Globe } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import EnhancedBackground from '@/components/utils/EnhancedBackground.tsx';
import { ScrollReveal } from '@/components/ui/scroll-reveal.tsx';
import PasswordVerificationForm from '@/components/shorten/PasswordVerificationForm.tsx';

const URLRedirect: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const [error, setError] = useState<string | null>(null);
  const [originalURL, setOriginalURL] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);
  const [shortenedURL, setShortenedURL] = useState<any>(null);
  const [needsPassword, setNeedsPassword] = useState(false);
  const [passwordVerified, setPasswordVerified] = useState(false);

  useEffect(() => {
    if (!shortCode) {
      setError('Invalid short URL');
      return;
    }

    try {
      // Look up the short code
      const url = URLShortenerService.getURLByShortCode(shortCode);

      if (!url) {
        setError('This shortened URL does not exist or has expired');
        return;
      }

      // Check if URL has expired
      if (url.expiresAt && new Date(url.expiresAt) < new Date()) {
        setError('This shortened URL has expired');
        return;
      }

      // Save the shortened URL
      setShortenedURL(url);

      // Check if URL is password protected
      if (url.password && !passwordVerified) {
        setNeedsPassword(true);
        return;
      }

      // Record the click
      URLShortenerService.recordClick(shortCode, {
        referrer: document.referrer || undefined,
        device: navigator.userAgent || undefined,
        browser: navigator.userAgent ? navigator.userAgent.split(' ').pop() || undefined : undefined,
        location: { country: 'Unknown' }, // In a real app, this would be determined server-side
        utmParameters: url.utmParameters
      });

      // Get the final URL with UTM parameters if present
      const finalURL = url.utmParameters
        ? URLShortenerService.appendUtmParameters(url.originalURL, url.utmParameters)
        : url.originalURL;

      // Set the original URL (for display)
      setOriginalURL(finalURL);

      // Start countdown for automatic redirect
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            window.location.href = finalURL;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    } catch (error) {
      console.error('Error redirecting:', error);
      setError('An error occurred while processing this URL');
    }
  }, [shortCode, passwordVerified]);

  const handleManualRedirect = () => {
    if (originalURL) {
      window.location.href = originalURL;
    }
  };

  const handleGoBack = () => {
    navigate('/url-shortener');
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EnhancedBackground optimizeForLowPerformance={true} />
        <ScrollReveal>
          <Card className="max-w-md w-full p-4 sm:p-6 mx-4 border border-red-100 shadow-lg backdrop-blur-sm bg-white/90">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-center gap-2 text-red-500">
                <AlertTriangle className="h-6 w-6" />
                <span>Redirect Error</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-700 mb-6">{error}</p>
            </CardContent>
            <CardFooter className="flex justify-center pt-2">
              <MotionButton
                onClick={handleGoBack}
                className="flex items-center gap-2"
                whileHover={prefersReducedMotion ? {} : { scale: 1.03, y: -2 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
              >
                <ArrowLeft className="h-4 w-4" />
                Go to URL Shortener
              </MotionButton>
            </CardFooter>
          </Card>
        </ScrollReveal>
      </div>
    );
  }

  // Handle password verification
  const handlePasswordVerified = () => {
    setPasswordVerified(true);
    setNeedsPassword(false);
  };

  // Handle cancel password verification
  const handleCancelPasswordVerification = () => {
    navigate('/url-shortener');
  };

  // Show password verification form if needed
  if (needsPassword && shortenedURL) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <EnhancedBackground optimizeForLowPerformance={true} />
        <ScrollReveal>
          <PasswordVerificationForm
            shortenedURL={shortenedURL}
            onVerified={handlePasswordVerified}
            onCancel={handleCancelPasswordVerification}
          />
        </ScrollReveal>
      </div>
    );
  }

  // Show redirect page
  return (
    <div className="min-h-screen flex items-center justify-center">
      <EnhancedBackground optimizeForLowPerformance={true} />
      <ScrollReveal>
        <Card className="max-w-md w-full p-4 sm:p-6 mx-4 border border-teal-100 shadow-lg backdrop-blur-sm bg-white/90">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-500">
              {prefersReducedMotion ? (
                <Clock className="h-6 w-6 text-teal-500" />
              ) : (
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="text-teal-500"
                >
                  <Clock className="h-6 w-6" />
                </motion.div>
              )}
              <span>Redirecting...</span>
            </CardTitle>
          </CardHeader>

          <CardContent className="text-center space-y-6">
            <div>
              <p className="text-gray-600 mb-2">You are being redirected to:</p>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 break-all">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="font-medium text-gray-800 text-sm text-left">
                          {originalURL && (() => {
                            try {
                              return new URL(originalURL).hostname;
                            } catch (e) {
                              return 'Unknown domain';
                            }
                          })()}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Domain of the destination URL</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-gray-600 text-sm text-left overflow-hidden">
                  <span className="block truncate hover:whitespace-normal hover:overflow-visible transition-all duration-300">
                    {originalURL}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative w-20 h-20 mb-2">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="8"
                  />
                  {/* Progress circle */}
                  {prefersReducedMotion ? (
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#0d9488"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray="283"
                      strokeDashoffset={283 - (283 * ((5 - countdown) / 5))}
                    />
                  ) : (
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#0d9488"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray="283"
                      initial={{ strokeDashoffset: 283 }}
                      animate={{
                        strokeDashoffset: 283 - (283 * ((5 - countdown) / 5))
                      }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                  )}
                  {/* Text in the middle */}
                  <text
                    x="50"
                    y="55"
                    textAnchor="middle"
                    fontSize="24"
                    fontWeight="bold"
                    fill="#0d9488"
                  >
                    {countdown}
                  </text>
                </svg>
              </div>
              <p className="text-gray-600">
                Redirecting automatically in <span className="font-semibold text-teal-600">{countdown}</span> seconds...
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex justify-center pt-2">
            <MotionButton
              onClick={handleManualRedirect}
              className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600"
              whileHover={prefersReducedMotion ? {} : { scale: 1.03, y: -2 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
            >
              <ExternalLink className="h-4 w-4" />
              Redirect Now
            </MotionButton>
          </CardFooter>

          <div className="text-center mt-4 text-xs text-gray-500 flex items-center justify-center gap-1">
            <Shield className="h-3 w-3" />
            <span>This redirect is secure and your visit is private</span>
          </div>
        </Card>
      </ScrollReveal>
    </div>
  );
};

export default URLRedirect;
