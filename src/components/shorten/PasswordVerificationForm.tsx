import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { z } from '@/lib/zod-init';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { URLShortenerService } from '@/services/URLShortenerService.ts';

import { CSRFProtectionService } from '@/services/CSRFProtectionService.ts';
import { ShortenedURL } from '@/types/shorten.ts';
import { toast } from 'sonner';


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


  // Generate CSRF token on component mount
  useEffect(() => {
    const token = CSRFProtectionService.generateToken(`password-verification-${shortenedURL.id}`);
    setCsrfToken(token);


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

      // Validate CSRF token
      if (!CSRFProtectionService.validateToken(`password-verification-${shortenedURL.id}`, csrfToken)) {
        throw new Error('Security validation failed. Please refresh the page and try again.');
      }

      // Verify password
      if (!shortenedURL.password) {
        throw new Error('This URL is not password protected');
      }

      // Check if password is correct
      const isCorrect = await URLShortenerService.verifyPassword(values.password, shortenedURL.password);

      if (isCorrect) {
        toast.success('Password verified successfully!');
        onVerified();
      } else {
        // Increment attempts counter
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        // Generate a new CSRF token for the next attempt
        const newToken = CSRFProtectionService.generateToken(`password-verification-${shortenedURL.id}`);
        setCsrfToken(newToken);

        // Show error message
        toast.error('Incorrect password. Please try again.');

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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Hidden CSRF token input */}
            <input type="hidden" name="csrf_token" value={csrfToken} />

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
