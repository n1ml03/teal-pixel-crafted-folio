import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { z } from '@/lib/zod-init';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Lock, Eye, EyeOff, ArrowLeft, AlertTriangle, Shield } from 'lucide-react';
import { URLShortenerService } from '@/services/URLShortenerService.ts';
import { RateLimiterService } from '@/services/RateLimiterService.ts';
import { CSRFProtectionService } from '@/services/CSRFProtectionService.ts';
import { ShortenedURL } from '@/types/shorten.ts';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx";

// Form schema
const formSchema = z.object({
  password: z.string().min(1, { message: 'Password is required' })
});

type FormValues = z.infer<typeof formSchema>;

interface PasswordVerificationFormProps {
  shortenedURL: ShortenedURL;
  onVerified: () => void;
  onCancel: () => void;
}

const PasswordVerificationForm: React.FC<PasswordVerificationFormProps> = ({
  shortenedURL,
  onVerified,
  onCancel
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitRemaining, setRateLimitRemaining] = useState(5);
  const [rateLimitResetTime, setRateLimitResetTime] = useState<number | null>(null);

  // Generate CSRF token on component mount
  useEffect(() => {
    const token = CSRFProtectionService.generateToken(`password-verification-${shortenedURL.id}`);
    setCsrfToken(token);

    // Check if already rate limited
    const rateLimit = RateLimiterService.checkLimit(`password-attempts-${shortenedURL.id}`, {
      maxAttempts: 5,
      windowMs: 5 * 60 * 1000, // 5 minutes
      blockDurationMs: 30 * 60 * 1000, // 30 minutes
      showToast: false
    });

    setRateLimitRemaining(rateLimit.remaining);
    setIsRateLimited(!rateLimit.allowed);

    if (rateLimit.blockedUntil) {
      setRateLimitResetTime(rateLimit.blockedUntil);
    }
  }, [shortenedURL.id]);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);

      // Check rate limiting
      const rateLimit = RateLimiterService.checkLimit(`password-attempts-${shortenedURL.id}`, {
        maxAttempts: 5,
        windowMs: 5 * 60 * 1000, // 5 minutes
        blockDurationMs: 30 * 60 * 1000, // 30 minutes
        showToast: false
      });

      // Update rate limit state
      setRateLimitRemaining(rateLimit.remaining);

      // If rate limited, prevent submission
      if (!rateLimit.allowed) {
        setIsRateLimited(true);
        if (rateLimit.blockedUntil) {
          setRateLimitResetTime(rateLimit.blockedUntil);
        }
        throw new Error(`Too many failed attempts. Please try again later.`);
      }

      // Validate CSRF token
      if (!CSRFProtectionService.validateToken(`password-verification-${shortenedURL.id}`, csrfToken)) {
        throw new Error('Security validation failed. Please refresh the page and try again.');
      }

      // Verify password
      if (!shortenedURL.password) {
        throw new Error('This URL is not password protected');
      }

      // Check if password is correct
      const isCorrect = URLShortenerService.verifyPassword(values.password, shortenedURL.password);

      if (isCorrect) {
        // Reset rate limiting on successful verification
        RateLimiterService.resetLimit(`password-attempts-${shortenedURL.id}`);

        toast.success('Password verified successfully!');
        onVerified();
      } else {
        // Increment attempts counter
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        // Generate a new CSRF token for the next attempt
        const newToken = CSRFProtectionService.generateToken(`password-verification-${shortenedURL.id}`);
        setCsrfToken(newToken);

        // Show error message based on remaining attempts
        if (rateLimitRemaining <= 1) {
          toast.error('Too many failed attempts. You will be temporarily blocked after the next failed attempt.');
        } else {
          toast.error(`Incorrect password. ${rateLimitRemaining} attempts remaining.`);
        }

        // Clear password field
        form.setValue('password', '');
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to verify password');
    } finally {
      setIsLoading(false);
    }
  };

  // Format the rate limit reset time
  const formatResetTime = () => {
    if (!rateLimitResetTime) return 'some time';

    const now = Date.now();
    const timeLeft = Math.max(0, rateLimitResetTime - now);
    const minutes = Math.ceil(timeLeft / 60000);

    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-blue-500" />
          Password Protected URL
        </CardTitle>
        <CardDescription>
          This URL is password protected. Please enter the password to continue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isRateLimited ? (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Access Temporarily Blocked</AlertTitle>
            <AlertDescription>
              <p className="mb-2">Too many failed password attempts. Please try again in {formatResetTime()}.</p>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="mt-2 w-full flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
            </AlertDescription>
          </Alert>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              {/* Hidden CSRF token input */}
              <input type="hidden" name="csrf_token" value={csrfToken} />

              {/* Rate limit warning */}
              {rateLimitRemaining < 3 && (
                <Alert className="mb-4 bg-blue-50 border-blue-200">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-800">Limited Attempts Remaining</AlertTitle>
                  <AlertDescription className="text-blue-700">
                    You have {rateLimitRemaining} password attempt{rateLimitRemaining !== 1 ? 's' : ''} remaining.
                    After that, you'll be temporarily blocked.
                  </AlertDescription>
                </Alert>
              )}

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter password"
                          {...field}
                          autoFocus
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                  className="flex items-center gap-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Go Back
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      Verifying...
                    </span>
                  ) : (
                    'Continue'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <p className="text-xs text-gray-500">
          If you don't know the password, please contact the person who shared this URL with you.
        </p>
      </CardFooter>
    </Card>
  );
};

export default PasswordVerificationForm;
