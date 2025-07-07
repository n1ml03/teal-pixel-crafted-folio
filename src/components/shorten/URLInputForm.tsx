import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { z } from '@/lib/zod-init';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { Calendar } from '@/components/ui/calendar.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select.tsx';
import { format } from 'date-fns';
import { CalendarIcon, Sparkles, BarChart3, Eye, EyeOff, AlertTriangle, Shield } from 'lucide-react';
import { cn } from '@/lib/utils.ts';
import { ShortenedURL, URLOptions, UTMParams } from '@/types/shorten.ts';
import { URLShortenerService } from '@/services/URLShortenerService.ts';
import { URLSanitizerService } from '@/services/URLSanitizerService.ts';
import { RateLimiterService } from '@/services/RateLimiterService.ts';
import { CSRFProtectionService } from '@/services/CSRFProtectionService.ts';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx";

// Form schema
const formSchema = z.object({
  url: z.string()
    .min(1, { message: 'URL is required' })
    .refine(
      (url) => {
        try {
          new URL(url);
          return true;
        } catch (e) {
          return false;
        }
      },
      { message: 'Please enter a valid URL including http:// or https://' }
    ),
  useCustomAlias: z.boolean().default(false),
  customAlias: z.string().optional()
    .refine(
      (alias) => !alias || /^[a-zA-Z0-9_-]+$/.test(alias),
      { message: 'Custom alias can only contain letters, numbers, hyphens, and underscores' }
    )
    .refine(
      (alias) => !alias || alias.length >= 3,
      { message: 'Custom alias must be at least 3 characters long' }
    )
    .refine(
      (alias) => !alias || alias.length <= 50,
      { message: 'Custom alias must be at most 50 characters long' }
    ),
  useExpiration: z.boolean().default(false),
  expirationDate: z.date().optional(),
  usePassword: z.boolean().default(false),
  password: z.string().optional()
    .refine(
      (password) => !password || password.length >= 6,
      { message: 'Password must be at least 6 characters long' }
    ),
  useUtm: z.boolean().default(false),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmTerm: z.string().optional(),
  utmContent: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface URLInputFormProps {
  onURLShortened: (shortenedURL: ShortenedURL) => void;
  initialUtmParams?: UTMParams;
}

const URLInputForm: React.FC<URLInputFormProps> = ({ onURLShortened, initialUtmParams }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(initialUtmParams ? true : false);
  const [csrfToken, setCsrfToken] = useState('');
  const [showSuspiciousWarning, setShowSuspiciousWarning] = useState(false);
  const [suspiciousURL, setSuspiciousURL] = useState('');
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitRemaining, setRateLimitRemaining] = useState(5);
  const [showPassword, setShowPassword] = useState(false);

  // Generate CSRF token on component mount
  useEffect(() => {
    const token = CSRFProtectionService.generateToken('url-shortener-form');
    setCsrfToken(token);
  }, []);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
      useCustomAlias: false,
      customAlias: '',
      useExpiration: false,
      expirationDate: undefined,
      usePassword: false,
      password: '',
      useUtm: initialUtmParams ? true : false,
      utmSource: initialUtmParams?.source || '',
      utmMedium: initialUtmParams?.medium || '',
      utmCampaign: initialUtmParams?.campaign || '',
      utmTerm: initialUtmParams?.term || '',
      utmContent: initialUtmParams?.content || '',
    },
  });

  // Function to handle suspicious URL confirmation
  const handleConfirmSuspiciousURL = async () => {
    try {
      setIsLoading(true);
      setShowSuspiciousWarning(false);

      // Get form values
      const values = form.getValues();

      // Prepare options
      const options: URLOptions = prepareURLOptions(values);

      // Create shortened URL with warning flag
      const shortenedURL = await URLShortenerService.shortenURL(suspiciousURL, options);

      // Notify parent component
      onURLShortened(shortenedURL);

      // Show success message with warning
      toast.success('URL shortened successfully, but marked as potentially suspicious.');

      // Reset form
      resetFormAfterSubmission(values);

      // Reset suspicious URL state
      setSuspiciousURL('');
    } catch (error) {
      console.error('Error shortening suspicious URL:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to shorten URL');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to prepare URL options
  const prepareURLOptions = (values: FormValues): URLOptions => {
    const options: URLOptions = {};

    // Add custom alias if enabled
    if (values.useCustomAlias && values.customAlias) {
      // Sanitize the custom alias
      const sanitizedAlias = URLSanitizerService.sanitizeAlias(values.customAlias);

      // Check if alias is available
      const aliasValidation = URLShortenerService.validateAlias(sanitizedAlias);
      if (!aliasValidation.valid) {
        throw new Error(aliasValidation.reason || 'Invalid custom alias');
      }
      options.customAlias = sanitizedAlias;
    }

    // Add expiration date if enabled
    if (values.useExpiration && values.expirationDate) {
      // Ensure expiration date is in the future
      if (values.expirationDate <= new Date()) {
        throw new Error('Expiration date must be in the future');
      }
      options.expiresAt = values.expirationDate.toISOString();
    }

    // Add password protection if enabled
    if (values.usePassword && values.password) {
      if (values.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      options.password = values.password;
    }

    // Add UTM parameters if enabled
    if (values.useUtm) {
      const utmParams: Record<string, string> = {};

      // Sanitize UTM parameters
      if (values.utmSource) utmParams.source = URLSanitizerService.sanitizeString(values.utmSource);
      if (values.utmMedium) utmParams.medium = URLSanitizerService.sanitizeString(values.utmMedium);
      if (values.utmCampaign) utmParams.campaign = URLSanitizerService.sanitizeString(values.utmCampaign);
      if (values.utmTerm) utmParams.term = URLSanitizerService.sanitizeString(values.utmTerm);
      if (values.utmContent) utmParams.content = URLSanitizerService.sanitizeString(values.utmContent);

      // Only add UTM parameters if at least one is provided
      if (Object.keys(utmParams).length > 0) {
        // Validate UTM parameters
        if (!values.utmSource) {
          throw new Error('UTM Source is required when using UTM parameters');
        }

        // Check for invalid characters
        const invalidCharsRegex = /[^\w\s\-_.]/;
        for (const [key, value] of Object.entries(utmParams)) {
          if (value && invalidCharsRegex.test(value)) {
            throw new Error(`UTM ${key} contains invalid characters. Use only letters, numbers, underscores, hyphens, and periods.`);
          }
        }

        options.utmParameters = utmParams;
      }
    }

    return options;
  };

  // Function to reset form after submission
  const resetFormAfterSubmission = (values: FormValues) => {
    if (!values.useCustomAlias && !values.useExpiration && !values.usePassword && !values.useUtm) {
      form.reset();
    } else {
      // Just reset the URL field
      form.setValue('url', '');
    }

    // Generate a new CSRF token
    const token = CSRFProtectionService.generateToken('url-shortener-form');
    setCsrfToken(token);
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      setIsRateLimited(false);

      // Additional client-side validation
      if (!values.url || values.url.trim().length === 0) {
        throw new Error('URL is required');
      }

      // Check rate limiting
      const rateLimit = RateLimiterService.checkLimit('url-shortener', {
        maxAttempts: 10,
        windowMs: 60 * 1000, // 1 minute
        showToast: false
      });

      // Update rate limit state
      setRateLimitRemaining(rateLimit.remaining);

      // If rate limited, prevent submission
      if (!rateLimit.allowed) {
        setIsRateLimited(true);
        throw new Error(`Rate limit exceeded. Please try again later.`);
      }

      // Validate CSRF token
      if (!csrfToken || !CSRFProtectionService.validateToken('url-shortener-form', csrfToken)) {
        throw new Error('Security validation failed. Please refresh the page and try again.');
      }

      // Sanitize URL
      const sanitizedURL = URLSanitizerService.sanitizeURL(values.url.trim());
      if (!sanitizedURL) {
        throw new Error('Invalid URL format. Please enter a valid URL including http:// or https://');
      }

      // Additional URL validation
      try {
        const urlObj = new URL(sanitizedURL);
        if (!['http:', 'https:'].includes(urlObj.protocol)) {
          throw new Error('Only HTTP and HTTPS URLs are allowed');
        }
      } catch (urlError) {
        throw new Error('Invalid URL format. Please enter a valid URL including http:// or https://');
      }

      // Validate URL
      const urlValidation = URLShortenerService.isValidURL(sanitizedURL);
      if (!urlValidation.valid) {
        throw new Error(urlValidation.reason || 'Invalid URL');
      }

      // Check if URL is suspicious
      if (urlValidation.suspicious) {
        // Show warning and require confirmation
        setShowSuspiciousWarning(true);
        setSuspiciousURL(sanitizedURL);
        return;
      }

      // Prepare options with additional validation
      const options = prepareURLOptions(values);

      // Create shortened URL
      const shortenedURL = await URLShortenerService.shortenURL(sanitizedURL, options);

      // Notify parent component
      onURLShortened(shortenedURL);

      // Show success message
      toast.success('URL shortened successfully!');

      // Reset form
      resetFormAfterSubmission(values);
    } catch (error) {
      console.error('Error shortening URL:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to shorten URL');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Hidden CSRF token input */}
        <input type="hidden" name="csrf_token" value={csrfToken} />

        {/* Suspicious URL warning */}
        {showSuspiciousWarning && (
          <Alert variant="destructive" className="mb-4 bg-amber-50 border-amber-300 text-amber-800">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800 font-medium">Potentially Suspicious URL Detected</AlertTitle>
            <AlertDescription className="text-amber-700 text-xs sm:text-sm">
              <p className="mb-2">
                The URL you're trying to shorten has been flagged as potentially suspicious.
                This could be due to unusual patterns or characteristics that might indicate phishing or malicious intent.
              </p>
              <p className="mb-3">
                URL: <span className="font-mono text-xs break-all">{suspiciousURL}</span>
              </p>
              <div className="flex flex-wrap gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSuspiciousWarning(false)}
                  className="bg-white"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleConfirmSuspiciousURL}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Proceed Anyway'}
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Rate limit warning */}
        {isRateLimited && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Rate Limit Exceeded</AlertTitle>
            <AlertDescription>
              You've made too many requests. Please try again later.
            </AlertDescription>
          </Alert>
        )}

        {/* Rate limit indicator */}
        {!isRateLimited && rateLimitRemaining < 3 && (
          <Alert className="mb-4 bg-blue-50 border-blue-200">
            <Shield className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Rate Limit Warning</AlertTitle>
            <AlertDescription className="text-blue-700">
              You have {rateLimitRemaining} requests remaining. Please slow down to avoid being temporarily blocked.
            </AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs sm:text-sm">URL to shorten</FormLabel>
              <FormControl>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                  <Input
                    placeholder="https://example.com/very/long/url/that/needs/shortening"
                    {...field}
                    className="sm:rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0 sm:border-r-0 text-xs sm:text-sm h-10"
                  />
                  <Button
                    type="submit"
                    className="sm:rounded-l-none min-h-10"
                    disabled={isLoading || isRateLimited}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2 w-full">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span className="text-sm sm:text-base">Shortening...</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2 w-full">
                        <Sparkles className="h-4 w-4" />
                        <span className="text-sm sm:text-base">Shorten</span>
                      </span>
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            className="text-xs sm:text-sm"
          >
            {showAdvancedOptions ? 'Hide' : 'Show'} Advanced Options
          </Button>
        </div>

        {showAdvancedOptions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3 sm:space-y-4 border rounded-md p-3 sm:p-4 bg-gray-50"
          >
            <FormField
              control={form.control}
              name="useCustomAlias"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-2 sm:space-x-3 space-y-0 rounded-md p-2 sm:p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mt-0.5"
                    />
                  </FormControl>
                  <div className="space-y-0.5 sm:space-y-1 leading-none">
                    <FormLabel className="text-xs sm:text-sm">Use custom alias</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {form.watch('useCustomAlias') && (
              <FormField
                control={form.control}
                name="customAlias"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Alias</FormLabel>
                    <FormControl>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-0">
                        <span className="bg-gray-100 px-2 sm:px-3 py-1.5 sm:py-2 border sm:border-r-0 rounded-md sm:rounded-r-none text-gray-500 text-xs sm:text-sm w-full sm:w-auto overflow-hidden text-ellipsis whitespace-nowrap">
                          {window.location.origin}/s/
                        </span>
                        <Input
                          placeholder="my-custom-link"
                          {...field}
                          className="sm:rounded-l-none"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="useExpiration"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-2 sm:space-x-3 space-y-0 rounded-md p-2 sm:p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mt-0.5"
                    />
                  </FormControl>
                  <div className="space-y-0.5 sm:space-y-1 leading-none">
                    <FormLabel className="text-xs sm:text-sm">Set expiration date</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {form.watch('useExpiration') && (
              <FormField
                control={form.control}
                name="expirationDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-xs sm:text-sm">Expiration Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal text-xs sm:text-sm h-8 sm:h-10",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-3.5 w-3.5 sm:h-4 sm:w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="text-xs sm:text-sm"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="usePassword"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-2 sm:space-x-3 space-y-0 rounded-md p-2 sm:p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mt-0.5"
                    />
                  </FormControl>
                  <div className="space-y-0.5 sm:space-y-1 leading-none">
                    <FormLabel className="text-xs sm:text-sm">Password protect this URL</FormLabel>
                    <p className="text-[10px] sm:text-xs text-gray-500">
                      Require a password before redirecting to the original URL
                    </p>
                  </div>
                </FormItem>
              )}
            />

            {form.watch('usePassword') && (
              <div className="pl-3 sm:pl-4 border-l-2 border-gray-100">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm">Password</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter a secure password"
                              {...field}
                              className="text-xs sm:text-sm h-8 sm:h-10 pr-9"
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-2 sm:px-3"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500" />
                            ) : (
                              <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500" />
                            )}
                          </Button>
                        </div>
                        <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                          Password must be at least 6 characters long
                        </p>
                        <FormMessage className="text-xs" />
                      </FormItem>
                  )}
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="useUtm"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-2 sm:space-x-3 space-y-0 rounded-md p-2 sm:p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mt-0.5"
                    />
                  </FormControl>
                  <div className="space-y-0.5 sm:space-y-1 leading-none">
                    <FormLabel className="text-xs sm:text-sm">Add UTM parameters</FormLabel>
                    <p className="text-[10px] sm:text-xs text-gray-500">
                      Track your marketing campaigns with UTM parameters
                    </p>
                  </div>
                </FormItem>
              )}
            />

            {form.watch('useUtm') && (
              <div className="space-y-3 sm:space-y-4 pl-3 sm:pl-4 border-l-2 border-gray-100">
                <div className="mb-3 sm:mb-4">
                  <h4 className="text-xs sm:text-sm font-medium mb-2">What are UTM parameters?</h4>
                  <p className="text-xs text-gray-500 mb-2">
                    UTM parameters are tags added to your URL to track the effectiveness of your marketing campaigns across different channels.
                  </p>
                  <div className="bg-blue-50 p-2 sm:p-3 rounded-md text-xs text-blue-700 mb-3 sm:mb-4">
                    <p className="font-medium mb-1">Example:</p>
                    <p className="break-all text-[10px] sm:text-xs">
                      <>
                        {'https://example.com?'}<span className="font-bold">utm_source</span>{'=twitter&'}<span className="font-bold">utm_medium</span>{'=social&'}<span className="font-bold">utm_campaign</span>{'=summer_sale'}
                      </>
                    </p>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="utmSource"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1">
                        <FormLabel className="text-xs sm:text-sm mb-0">
                          UTM Source <span className="text-[10px] sm:text-xs text-gray-500">(required)</span>
                        </FormLabel>
                        <div className="text-[10px] sm:text-xs text-gray-500 hover:text-gray-700 cursor-help" title="Identifies which site sent the traffic (e.g., google, facebook, twitter)">
                          What's this?
                        </div>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="google, facebook, newsletter"
                            {...field}
                            className="text-xs sm:text-sm h-8 sm:h-10 pr-8"
                          />
                          <div className="absolute right-2 top-1/2 -translate-y-1/2">
                            <Select
                              value=""
                              onValueChange={(value) => {
                                if (value) field.onChange(value);
                              }}
                            >
                              <SelectTrigger className="h-5 w-5 sm:h-6 sm:w-6 border-none bg-transparent p-0">
                                <BarChart3 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                              </SelectTrigger>
                              <SelectContent align="end" className="w-[180px] text-xs sm:text-sm">
                                <SelectItem value="google">Google</SelectItem>
                                <SelectItem value="facebook">Facebook</SelectItem>
                                <SelectItem value="instagram">Instagram</SelectItem>
                                <SelectItem value="twitter">Twitter</SelectItem>
                                <SelectItem value="linkedin">LinkedIn</SelectItem>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="newsletter">Newsletter</SelectItem>
                                <SelectItem value="direct">Direct</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="utmMedium"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>
                          UTM Medium <span className="text-xs text-gray-500">(optional)</span>
                        </FormLabel>
                        <div className="text-xs text-gray-500 hover:text-gray-700 cursor-help" title="Identifies what type of link was used (e.g., cpc, banner, email)">
                          What's this?
                        </div>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="cpc, email, social"
                            {...field}
                          />
                          <div className="absolute right-2 top-1/2 -translate-y-1/2">
                            <Select
                              value=""
                              onValueChange={(value) => {
                                if (value) field.onChange(value);
                              }}
                            >
                              <SelectTrigger className="h-6 w-6 border-none bg-transparent p-0">
                                <BarChart3 className="h-4 w-4 text-gray-400" />
                              </SelectTrigger>
                              <SelectContent align="end" className="w-[180px]">
                                <SelectItem value="cpc">CPC</SelectItem>
                                <SelectItem value="organic">Organic</SelectItem>
                                <SelectItem value="social">Social</SelectItem>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="referral">Referral</SelectItem>
                                <SelectItem value="display">Display</SelectItem>
                                <SelectItem value="banner">Banner</SelectItem>
                                <SelectItem value="affiliate">Affiliate</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="utmCampaign"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>
                          UTM Campaign <span className="text-xs text-gray-500">(optional)</span>
                        </FormLabel>
                        <div className="text-xs text-gray-500 hover:text-gray-700 cursor-help" title="Identifies a specific product promotion or strategic campaign">
                          What's this?
                        </div>
                      </div>
                      <FormControl>
                        <Input
                          placeholder="summer_sale, product_launch"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <FormField
                    control={form.control}
                    name="utmTerm"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1">
                          <FormLabel className="text-xs sm:text-sm mb-0">
                            UTM Term <span className="text-xs text-gray-500">(optional)</span>
                          </FormLabel>
                          <div className="text-xs text-gray-500 hover:text-gray-700 cursor-help" title="Identifies search terms or keywords">
                            What's this?
                          </div>
                        </div>
                        <FormControl>
                          <Input
                            placeholder="running+shoes"
                            {...field}
                            className="text-xs sm:text-sm h-8 sm:h-10"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="utmContent"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1">
                          <FormLabel className="text-xs sm:text-sm mb-0">
                            UTM Content <span className="text-xs text-gray-500">(optional)</span>
                          </FormLabel>
                          <div className="text-xs text-gray-500 hover:text-gray-700 cursor-help" title="Identifies what specifically was clicked to bring the user to the site">
                            What's this?
                          </div>
                        </div>
                        <FormControl>
                          <Input
                            placeholder="banner, textlink"
                            {...field}
                            className="text-xs sm:text-sm h-8 sm:h-10"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-2 p-2 sm:p-3 bg-gray-50 rounded-md border border-gray-100">
                  <h4 className="text-xs sm:text-sm font-medium mb-2 flex items-center">
                    <span className="h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-blue-100 text-blue-600 inline-flex items-center justify-center mr-1.5 sm:mr-2 text-[10px] sm:text-xs">i</span>
                    Preview
                  </h4>
                  <div className="text-[10px] sm:text-xs font-mono bg-white p-1.5 sm:p-2 rounded border overflow-x-auto max-h-24 sm:max-h-32">
                    {form.watch('url') && (
                      <span className="text-gray-800">
                        {form.watch('url')}
                        {(form.watch('utmSource') || form.watch('utmMedium') || form.watch('utmCampaign') || form.watch('utmTerm') || form.watch('utmContent')) && '?'}
                        {form.watch('utmSource') && <span className="text-green-600">utm_source={form.watch('utmSource')}</span>}
                        {form.watch('utmMedium') && (
                          <>
                            {form.watch('utmSource') && '&'}
                            <span className="text-blue-600">utm_medium={form.watch('utmMedium')}</span>
                          </>
                        )}
                        {form.watch('utmCampaign') && (
                          <>
                            {(form.watch('utmSource') || form.watch('utmMedium')) && '&'}
                            <span className="text-purple-600">utm_campaign={form.watch('utmCampaign')}</span>
                          </>
                        )}
                        {form.watch('utmTerm') && (
                          <>
                            {(form.watch('utmSource') || form.watch('utmMedium') || form.watch('utmCampaign')) && '&'}
                            <span className="text-orange-600">utm_term={form.watch('utmTerm')}</span>
                          </>
                        )}
                        {form.watch('utmContent') && (
                          <>
                            {(form.watch('utmSource') || form.watch('utmMedium') || form.watch('utmCampaign') || form.watch('utmTerm')) && '&'}
                            <span className="text-red-600">utm_content={form.watch('utmContent')}</span>
                          </>
                        )}
                      </span>
                    )}
                    {!form.watch('url') && (
                      <span className="text-gray-400">Enter a URL above to see the preview with UTM parameters</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </form>
    </Form>
  );
};

export default URLInputForm;
