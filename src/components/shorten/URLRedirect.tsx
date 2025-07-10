import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigateWithTransition } from '@/hooks/useNavigateWithTransition';
import { URLShortenerService } from '@/services/URLShortenerService.ts';
import { URLSanitizerService } from '@/services/URLSanitizerService.ts';
import { SecureHeadersService } from '@/services/SecureHeadersService.ts';
import { ShortenedURL, UTMParams } from '@/types/shorten.ts';
import { MotionButton } from '@/components/ui/motion-button.tsx';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.tsx';
import { ExternalLink, AlertTriangle, ArrowLeft, Shield, Clock, Globe, AlertCircle, Check } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import EnhancedBackground from '@/components/utils/EnhancedBackground.tsx';
import { ScrollReveal } from '@/components/ui/scroll-reveal.tsx';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import PasswordVerificationForm from '@/components/shorten/PasswordVerificationForm.tsx';

// List of trusted domains that don't require confirmation
const TRUSTED_DOMAINS = [
  'google.com', 'github.com', 'microsoft.com', 'apple.com', 'amazon.com',
  'mozilla.org', 'wikipedia.org', 'linkedin.com', 'twitter.com', 'facebook.com',
  'instagram.com', 'youtube.com', 'reddit.com', 'medium.com', 'dev.to'
];

// Check if a domain is in the trusted list or is a subdomain of a trusted domain
const isTrustedDomain = (domain: string): boolean => {
  return TRUSTED_DOMAINS.some(trusted =>
    domain === trusted || domain.endsWith(`.${trusted}`)
  );
};

// Utility function to append UTM parameters to a URL
const appendUtmParameters = (url: string, utmParams: any): string => {
  try {
    const urlObj = new URL(url);

    if (utmParams.source) urlObj.searchParams.set('utm_source', utmParams.source);
    if (utmParams.medium) urlObj.searchParams.set('utm_medium', utmParams.medium);
    if (utmParams.campaign) urlObj.searchParams.set('utm_campaign', utmParams.campaign);
    if (utmParams.term) urlObj.searchParams.set('utm_term', utmParams.term);
    if (utmParams.content) urlObj.searchParams.set('utm_content', utmParams.content);

    // Handle custom UTM parameters
    if (utmParams.custom) {
      Object.entries(utmParams.custom).forEach(([key, value]) => {
        if (typeof value === 'string') {
          urlObj.searchParams.set(`utm_${key}`, value);
        }
      });
    }

    return urlObj.toString();
  } catch (error) {
    console.error('Error appending UTM parameters:', error);
    return url;
  }
};

const URLRedirect: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const navigateWithTransition = useNavigateWithTransition();
  const prefersReducedMotion = useReducedMotion();
  const [error, setError] = useState<string | null>(null);
  const [originalURL, setOriginalURL] = useState<string | null>(null);
  const [sanitizedURL, setSanitizedURL] = useState<{ hostname: string; pathname: string; fullUrl: string } | null>(null);
  const [countdown, setCountdown] = useState(5);
  const [shortenedURL, setShortenedURL] = useState<ShortenedURL | null>(null);
  const [needsPassword, setNeedsPassword] = useState(false);
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [redirectConfirmed, setRedirectConfirmed] = useState(false);
  const [isDangerousURL, setIsDangerousURL] = useState(false);

  // Apply secure headers when component mounts
  useEffect(() => {
    SecureHeadersService.applySecureHeaders();
  }, []);

  useEffect(() => {
    if (!shortCode) {
      setError('Invalid short URL');
      return;
    }

    let timer: NodeJS.Timeout | null = null;

    const processURL = async () => {
      try {
        // Look up the short code
        const url = await URLShortenerService.getURLByShortCode(shortCode);

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

        // Get the final URL with UTM parameters if present
        const finalURL = url.utmParameters
          ? appendUtmParameters(url.originalURL, url.utmParameters)
          : url.originalURL;

        // Sanitize and validate the URL
        const sanitizedURLData = URLSanitizerService.getSafeDisplayURL(finalURL);
        setSanitizedURL(sanitizedURLData);

        // Check if URL is potentially dangerous
        const isDangerous = URLSanitizerService.isPotentiallyDangerous(finalURL);
        setIsDangerousURL(isDangerous);

        if (isDangerous) {
          setShowWarning(true);
          setError('This URL may be dangerous and has been blocked for your safety.');
          return;
        }

        // Check if URL is suspicious (from the shortened URL metadata)
        if (url.isSuspicious && !redirectConfirmed) {
          setShowWarning(true);
          setOriginalURL(finalURL);
          return;
        }

        // Check if domain is trusted
        try {
          const domain = new URL(finalURL).hostname;
          const isTrusted = isTrustedDomain(domain);

          // If not trusted and not confirmed, show warning
          if (!isTrusted && !redirectConfirmed) {
            setShowWarning(true);
            setOriginalURL(finalURL);
            return;
          }
        } catch (e) {
          console.error('Error parsing URL domain:', e);
          setError('Invalid URL format');
          return;
        }

        // If we get here, the URL is safe to redirect to or has been confirmed
        setOriginalURL(finalURL);

        // Record the click only if we're actually redirecting
        if (redirectConfirmed || !showWarning) {
          // Extract UTM parameters from the current URL if they exist
          const currentUrlParams = new URLSearchParams(window.location.search);
          const extractedUtmParams: UTMParams = {};

          // Check for UTM parameters in the current URL
          ['source', 'medium', 'campaign', 'term', 'content'].forEach(param => {
            const value = currentUrlParams.get(`utm_${param}`);
            if (value) {
              extractedUtmParams[param] = value;
            }
          });

          // Check for custom UTM parameters
          currentUrlParams.forEach((value, key) => {
            if (key.startsWith('utm_') && !['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].includes(key)) {
              const customParam = key.replace('utm_', '');
              if (!extractedUtmParams.custom) {
                extractedUtmParams.custom = {};
              }
              extractedUtmParams.custom[customParam] = value;
            }
          });

          // Use extracted UTM parameters if available, otherwise use the ones from the shortened URL
          const utmParameters = Object.keys(extractedUtmParams).length > 0
            ? extractedUtmParams
            : url.utmParameters;

          await URLShortenerService.recordClick(shortCode, {
            referrer: document.referrer || undefined,
            device: navigator.userAgent || undefined,
            browser: navigator.userAgent ? navigator.userAgent.split(' ').pop() || undefined : undefined,
            location: { country: 'Unknown' }, // In a real app, this would be determined server-side
            utmParameters: utmParameters
          });
        }

        // Only start countdown if redirect is confirmed or no warning is needed
        if (redirectConfirmed || !showWarning) {
          // Start countdown for automatic redirect
          timer = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                if (timer) clearInterval(timer);
                window.location.href = finalURL;
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
      } catch (error) {
        console.error('Error redirecting:', error);
        setError('An error occurred while processing this URL');
      }
    };

    processURL();

    // Cleanup function
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [shortCode, passwordVerified, redirectConfirmed]);

  const handleManualRedirect = () => {
    if (originalURL && (redirectConfirmed || !showWarning)) {
      // Additional security check before redirect
      try {
        const url = new URL(originalURL);
        // Only allow http and https protocols
        if (url.protocol === 'http:' || url.protocol === 'https:') {
          window.location.href = originalURL;
        } else {
          setError('Invalid URL protocol. Only HTTP and HTTPS are allowed.');
        }
      } catch (error) {
        setError('Invalid URL format.');
      }
    }
  };

  const handleConfirmRedirect = () => {
    setRedirectConfirmed(true);
    setShowWarning(false);
  };

  const handleGoBack = () => {
    navigateWithTransition('/url-shortener');
  };

  // Memoize the background component to prevent unnecessary re-renders
  const memoizedBackground = useMemo(() => (
    <EnhancedBackground optimizeForLowPerformance={false} />
  ), []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        {memoizedBackground}
        <ScrollReveal>
          <Card className="max-w-md w-full p-6 mx-auto border border-red-200 shadow-xl backdrop-blur-md bg-gradient-to-b from-white to-red-50/30 rounded-xl">
            <CardHeader className="pb-4">
              <div className="mx-auto bg-gradient-to-br from-red-100 to-red-200 p-3 rounded-full mb-4 w-16 h-16 flex items-center justify-center shadow-sm">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-center text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-700 to-red-500">
                Redirect Error
              </CardTitle>
              <CardDescription className="text-center text-red-700 mt-2 font-medium">
                We couldn't process this shortened URL
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-4">
              <Alert variant="destructive" className="bg-red-100/80 border-red-300 mb-4 shadow-sm">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertTitle className="text-red-800 font-semibold">Unable to Redirect</AlertTitle>
                <AlertDescription className="text-sm text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter className="flex justify-center pt-2">
              <MotionButton
                onClick={handleGoBack}
                className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-md"
                whileHover={prefersReducedMotion ? {} : { scale: 1.03, y: -2 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
                transitionType="spring"
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
    navigateWithTransition('/url-shortener');
  };

  // Show password verification form if needed
  if (needsPassword && shortenedURL) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        {memoizedBackground}
        <ScrollReveal>
          <div className="max-w-md w-full mx-auto">
            <PasswordVerificationForm
              shortenedURL={shortenedURL}
              onVerified={handlePasswordVerified}
              onCancel={handleCancelPasswordVerification}
            />
          </div>
        </ScrollReveal>
      </div>
    );
  }

  // Show warning for suspicious or untrusted URLs
  if (showWarning && originalURL && !isDangerousURL) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        {memoizedBackground}
        <ScrollReveal>
          <Card className="max-w-md w-full p-6 mx-auto border border-amber-300 shadow-xl backdrop-blur-md bg-gradient-to-b from-white to-amber-50/40 rounded-xl">
            <CardHeader className="pb-4">
              <div className="mx-auto bg-gradient-to-br from-amber-200 to-amber-300 p-3 rounded-full mb-4 w-16 h-16 flex items-center justify-center shadow-sm">
                <AlertCircle className="h-8 w-8 text-amber-700" />
              </div>
              <CardTitle className="text-center text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-800 to-amber-600">
                Redirect Warning
              </CardTitle>
              <CardDescription className="text-center text-amber-800 mt-2 font-medium">
                Please verify this destination before proceeding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 py-4">
              <Alert variant="default" className="bg-amber-100 border-amber-300 shadow-sm">
                <AlertTriangle className="h-4 w-4 text-amber-700" />
                <AlertTitle className="text-amber-900 font-semibold">Caution Required</AlertTitle>
                <AlertDescription className="text-amber-800 text-sm">
                  {shortenedURL?.isSuspicious
                    ? "This URL has been flagged as potentially suspicious. It may lead to an unsafe website."
                    : "You're being redirected to a website outside our trusted domain list."}
                </AlertDescription>
              </Alert>

              <div className="mt-4">
                <h3 className="text-sm font-semibold text-amber-900 mb-2">Destination URL:</h3>
                <div className="p-4 bg-white rounded-lg border border-amber-200 break-all shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-amber-200 p-1.5 rounded-full shadow-sm">
                      <Globe className="h-4 w-4 text-amber-700 flex-shrink-0" />
                    </div>
                    <div className="font-medium text-amber-900 text-sm">
                      {sanitizedURL?.hostname || 'Unknown domain'}
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm overflow-hidden mt-2 pl-9">
                    <span className="block truncate hover:whitespace-normal hover:overflow-visible transition-all duration-300">
                      {sanitizedURL?.fullUrl || originalURL}
                    </span>
                  </p>
                </div>
              </div>

              <div className="bg-blue-100 p-4 rounded-lg border border-blue-200 mt-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-200 p-1.5 rounded-full mt-0.5 shadow-sm">
                    <Shield className="h-4 w-4 text-blue-700 flex-shrink-0" />
                  </div>
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Security Notice:</p>
                    <p>We cannot guarantee the safety of external websites. Proceed with caution and ensure you trust the destination.</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-4 gap-4">
              <MotionButton
                onClick={handleGoBack}
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2 border-amber-300 text-amber-800 hover:bg-amber-50 shadow-sm"
                whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                transitionType="spring"
              >
                <ArrowLeft className="h-4 w-4" />
                Cancel
              </MotionButton>
              <MotionButton
                onClick={handleConfirmRedirect}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 shadow-md"
                whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                transitionType="spring"
              >
                <ExternalLink className="h-4 w-4" />
                Proceed Anyway
              </MotionButton>
            </CardFooter>
          </Card>
        </ScrollReveal>
      </div>
    );
  }

  // Show redirect page
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {memoizedBackground}
      <ScrollReveal>
        <Card className="max-w-md w-full p-6 mx-auto border border-teal-200 shadow-xl backdrop-blur-md bg-gradient-to-b from-white to-teal-50/30 rounded-xl">
          <CardHeader className="pb-4">
            <div className="mx-auto bg-gradient-to-br from-teal-200 to-blue-200 p-3 rounded-full mb-4 w-16 h-16 flex items-center justify-center shadow-sm">
              {prefersReducedMotion ? (
                <Clock className="h-8 w-8 text-teal-700" />
              ) : (
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                    repeatType: "loop"
                  }}
                >
                  <Clock className="h-8 w-8 text-teal-700" />
                </motion.div>
              )}
            </div>
            <CardTitle className="text-center text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-blue-600">
              Redirecting...
            </CardTitle>
            {sanitizedURL && (
              <CardDescription className="text-center mt-2 flex items-center justify-center gap-2">
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 flex items-center gap-1 px-3 py-1 shadow-sm font-medium">
                  <Check className="h-3.5 w-3.5 text-green-600" />
                  <span>URL verified as safe</span>
                </Badge>
              </CardDescription>
            )}
          </CardHeader>

          <CardContent className="text-center space-y-6 py-4">
            <div>
              <p className="text-teal-800 mb-3 font-medium">You are being redirected to:</p>
              <div className="p-4 bg-white rounded-lg border border-teal-200 break-all shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-teal-200 p-1.5 rounded-full shadow-sm">
                    <Globe className="h-4 w-4 text-teal-700 flex-shrink-0" />
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="font-medium text-teal-900 text-sm">
                          {sanitizedURL?.hostname || (originalURL && (() => {
                            try {
                              return new URL(originalURL).hostname;
                            } catch (e) {
                              return 'Unknown domain';
                            }
                          })())}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-teal-800 text-white border-teal-900">
                        <p>Domain of the destination URL</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-gray-700 text-sm overflow-hidden pl-9">
                  <span className="block truncate hover:whitespace-normal hover:overflow-visible transition-all duration-300">
                    {sanitizedURL?.fullUrl || originalURL}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative w-28 h-28 mb-3">
                {prefersReducedMotion ? (
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
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray="283"
                      strokeDashoffset={283 - (283 * ((5 - countdown) / 5))}
                    />
                    {/* Text in the middle */}
                    <text
                      x="50"
                      y="55"
                      textAnchor="middle"
                      fontSize="28"
                      fontWeight="bold"
                      fill="#0f766e"
                    >
                      {countdown}
                    </text>
                    {/* Gradient definition */}
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0f766e" />
                        <stop offset="100%" stopColor="#2563eb" />
                      </linearGradient>
                    </defs>
                  </svg>
                ) : (
                  <motion.div
                    className="w-full h-full"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
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
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray="283"
                        initial={{ strokeDashoffset: 283 }}
                        animate={{
                          strokeDashoffset: 283 - (283 * ((5 - countdown) / 5))
                        }}
                        transition={{
                          duration: 0.8,
                          ease: "easeOut"
                        }}
                      />
                      {/* Pulsing animation around the text */}
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="30"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="2"
                        initial={{ opacity: 0.5 }}
                        animate={{
                          opacity: [0.3, 0.6, 0.3],
                          scale: [0.8, 1.1, 0.8],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "loop",
                          ease: "easeInOut"
                        }}
                      />
                      {/* Text in the middle */}
                      <text
                        x="50"
                        y="55"
                        textAnchor="middle"
                        fontSize="28"
                        fontWeight="bold"
                        fill="#0f766e"
                      >
                        {countdown}
                      </text>
                      {/* Gradient definition */}
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#0f766e" />
                          <stop offset="100%" stopColor="#2563eb" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </motion.div>
                )}
              </div>
              <motion.p
                className="text-teal-800 font-medium"
                animate={{
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut"
                }}
              >
                Redirecting automatically in <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-blue-600">{countdown}</span> seconds...
              </motion.p>
            </div>
          </CardContent>

          <CardFooter className="flex justify-center pt-4">
            <MotionButton
              onClick={handleManualRedirect}
              className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white hover:from-teal-700 hover:to-blue-700 px-6 py-2 shadow-md"
              whileHover={prefersReducedMotion ? {} : { scale: 1.03, y: -2 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
              transitionType="spring"
            >
              <ExternalLink className="h-4 w-4" />
              Redirect Now
            </MotionButton>
          </CardFooter>

          <div className="text-center mt-6 text-sm text-teal-700 flex items-center justify-center gap-2">
            <div className="bg-teal-100 p-1.5 rounded-full shadow-sm">
              <Shield className="h-3.5 w-3.5 text-teal-600" />
            </div>
            <span className="font-medium">This redirect is secure and your visit is private</span>
          </div>
        </Card>
      </ScrollReveal>
    </div>
  );
};

export default URLRedirect;
