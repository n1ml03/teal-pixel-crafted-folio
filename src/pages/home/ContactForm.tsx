import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Badge } from "@/components/ui/badge.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { MotionButton } from "@/components/ui/motion-button.tsx";
import Header from '@/components/home/Header.tsx';
import Footer from '@/components/home/Footer.tsx';
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "@/lib/zod-init";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import {
  Mail,
  User,
  Phone,
  Building2,
  MessageSquare,
  Send,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  Briefcase,
  Globe,
  MapPin,
  Calendar,
  Star,
  Sparkles,
  Target,
  Shield,
  Zap
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";

// Define form schema with Zod
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
  urgency: z.string().optional(),
  projectType: z.string().optional(),
  preferredContact: z.enum(["email", "phone", "any"], {
    required_error: "Please select a preferred contact method.",
  }),
  newsletter: z.boolean().default(false).optional(),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions." }),
  }),
});

type FormValues = z.infer<typeof formSchema>;

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, -50]);
  const y2 = useTransform(scrollY, [0, 1000], [0, 50]);

  // Initialize form with react-hook-form and zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      subject: "",
      message: "",
      urgency: "normal",
      projectType: "other",
      preferredContact: "email",
      newsletter: false,
      termsAccepted: true,
    },
  });

  // Form submission handler
  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", data);
      setIsSubmitting(false);
      setIsSuccess(true);

      // Show success toast
      toast.success("Message sent successfully!", {
        description: "Thank you for your message. I'll get back to you soon.",
        duration: 5000,
      });

      // Reset form after 2 seconds
      setTimeout(() => {
        form.reset();
        setIsSuccess(false);
      }, 2000);
    }, 1500);
  };

  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      description: "pearleseed@gmail.com",
      action: "mailto:pearleseed@gmail.com",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      description: "Available on request",
      action: "#",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Location",
      description: "Remote Worldwide",
      action: "#",
      color: "from-purple-500 to-purple-600"
    }
  ];

  const features = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Quick Response",
      description: "Usually within 24 hours"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Confidential",
      description: "Your information stays secure"
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: "Tailored Solutions",
      description: "Custom approach for each project"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-teal-50 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div 
        className="absolute top-20 left-10 w-32 h-32 bg-teal-100 rounded-full opacity-20"
        style={{ y: y1 }}
      />
      <motion.div 
        className="absolute bottom-20 right-10 w-24 h-24 bg-blue-100 rounded-full opacity-30"
        style={{ y: y2 }}
      />
      <motion.div 
        className="absolute top-1/2 left-1/2 w-40 h-40 bg-purple-100 rounded-full opacity-10 -translate-x-1/2 -translate-y-1/2"
        animate={{ rotate: 360, scale: [1, 1.05, 1] }}
        transition={{ duration: 20, repeat: Infinity }}
      />

      <Header />
      <main id="main-content" className="pt-20 pb-16 relative z-10">
        {/* Enhanced Hero section */}
        <section className="py-24 relative overflow-hidden">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, type: "spring", damping: 25 }}
            >
              {/* Floating badge */}
              <motion.div
                className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mb-6 shadow-lg border border-teal-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <MessageSquare className="w-4 h-4 text-teal-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">LET'S CONNECT & BUILD TOGETHER</span>
              </motion.div>

              <motion.h1 
                className="text-5xl md:text-6xl font-bold text-gray-800 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Start Your{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-teal-500 to-blue-500 relative">
                  Project Today
                  <motion.div
                    className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  />
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Ready to transform your ideas into reality? Let's discuss your project and create something amazing together.
              </motion.p>

              {/* Enhanced Feature Cards */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-teal-100/50 shadow-lg"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center text-white mb-4 mx-auto shadow-lg">
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Enhanced Main content */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* Enhanced Contact Information */}
                <motion.div 
                  className="lg:col-span-1 space-y-8"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <motion.div 
                    className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-teal-100 relative overflow-hidden"
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", damping: 20 }}
                  >
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-50/80 via-blue-50/40 to-white/60 rounded-3xl" />
                    
                    <div className="relative">
                      <div className="flex items-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white mr-6 shadow-lg">
                          <MessageSquare className="w-8 h-8" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-800">Contact Information</h2>
                          <p className="text-gray-600">Let's start a conversation</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {contactMethods.map((method, index) => (
                          <motion.a
                            key={index}
                            href={method.action}
                            className="block p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-teal-100 hover:border-teal-200 transition-all duration-300 group shadow-sm hover:shadow-lg"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            whileHover={{ x: 5, scale: 1.02 }}
                          >
                            <div className="flex items-center">
                              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${method.color} flex items-center justify-center text-white mr-4 shadow-md group-hover:scale-110 transition-transform`}>
                                {method.icon}
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-800 group-hover:text-teal-600 transition-colors">{method.title}</h3>
                                <p className="text-gray-600 text-sm">{method.description}</p>
                              </div>
                            </div>
                          </motion.a>
                        ))}
                      </div>

                      {/* Working Hours */}
                      <motion.div 
                        className="mt-8 p-6 bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl border border-teal-100"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        <div className="flex items-center mb-4">
                          <Clock className="w-5 h-5 text-teal-500 mr-3" />
                          <h3 className="font-semibold text-gray-800">Availability</h3>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>Monday - Friday</span>
                            <span className="text-teal-600 font-medium">9:00 AM - 6:00 PM</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Response Time</span>
                            <span className="text-teal-600 font-medium">Within 24 hours</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Timezone</span>
                            <span className="text-teal-600 font-medium">UTC+7 (Vietnam)</span>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Enhanced Contact Form */}
                <motion.div 
                  className="lg:col-span-2"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <motion.div 
                    className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-teal-100 relative overflow-hidden"
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", damping: 20 }}
                  >
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-teal-50/20 to-blue-50/30 rounded-3xl" />
                    
                    <div className="relative">
                      {/* Form Header */}
                      <div className="text-center mb-12">
                        <motion.div
                          className="w-20 h-20 rounded-3xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white mx-auto mb-6 shadow-xl"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5, type: "spring", damping: 15 }}
                        >
                          <Send className="w-10 h-10" />
                        </motion.div>
                        
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                          <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-500">
                            Send a Message
                          </span>
                        </h2>
                        <p className="text-gray-600 text-lg">Tell me about your project and let's make it happen</p>
                      </div>

                      {/* Success State */}
                      {isSuccess && (
                        <motion.div
                          className="text-center py-12"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <motion.div
                            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", damping: 15 }}
                          >
                            <CheckCircle2 className="w-10 h-10 text-green-600" />
                          </motion.div>
                          <h3 className="text-2xl font-bold text-gray-800 mb-4">Message Sent Successfully!</h3>
                          <p className="text-gray-600 mb-8">Thank you for reaching out. I'll get back to you within 24 hours.</p>
                          <MotionButton
                            onClick={() => setIsSuccess(false)}
                            className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-8 py-3 rounded-2xl font-medium shadow-lg"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Send Another Message
                          </MotionButton>
                        </motion.div>
                      )}

                      {/* Enhanced Form */}
                      {!isSuccess && (
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Name Field */}
                              <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="flex items-center text-gray-700 font-medium mb-3">
                                      <User className="w-4 h-4 mr-2 text-teal-500" />
                                      Full Name *
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Enter your full name"
                                        {...field}
                                        className="h-12 rounded-2xl border-teal-200 focus:border-teal-500 focus:ring-teal-500 bg-white/80 backdrop-blur-sm shadow-sm"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              {/* Email Field */}
                              <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="flex items-center text-gray-700 font-medium mb-3">
                                      <Mail className="w-4 h-4 mr-2 text-teal-500" />
                                      Email Address *
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        type="email"
                                        placeholder="your.email@example.com"
                                        {...field}
                                        className="h-12 rounded-2xl border-teal-200 focus:border-teal-500 focus:ring-teal-500 bg-white/80 backdrop-blur-sm shadow-sm"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Phone Field */}
                              <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="flex items-center text-gray-700 font-medium mb-3">
                                      <Phone className="w-4 h-4 mr-2 text-teal-500" />
                                      Phone Number
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="+1 (555) 123-4567"
                                        {...field}
                                        className="h-12 rounded-2xl border-teal-200 focus:border-teal-500 focus:ring-teal-500 bg-white/80 backdrop-blur-sm shadow-sm"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              {/* Company Field */}
                              <FormField
                                control={form.control}
                                name="company"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="flex items-center text-gray-700 font-medium mb-3">
                                      <Building2 className="w-4 h-4 mr-2 text-teal-500" />
                                      Company/Organization
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Your company name"
                                        {...field}
                                        className="h-12 rounded-2xl border-teal-200 focus:border-teal-500 focus:ring-teal-500 bg-white/80 backdrop-blur-sm shadow-sm"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Project Type */}
                              <FormField
                                control={form.control}
                                name="projectType"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="flex items-center text-gray-700 font-medium mb-3">
                                      <Briefcase className="w-4 h-4 mr-2 text-teal-500" />
                                      Project Type
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger className="h-12 rounded-2xl border-teal-200 focus:border-teal-500 focus:ring-teal-500 bg-white/80 backdrop-blur-sm shadow-sm">
                                          <SelectValue placeholder="Select project type" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent className="rounded-2xl border-teal-200 bg-white/95 backdrop-blur-xl">
                                        <SelectItem value="web-development">Web Development</SelectItem>
                                        <SelectItem value="mobile-app">Mobile App</SelectItem>
                                        <SelectItem value="backend-api">Backend/API</SelectItem>
                                        <SelectItem value="devops">DevOps/Infrastructure</SelectItem>
                                        <SelectItem value="qa-testing">QA & Testing</SelectItem>
                                        <SelectItem value="consultation">Consultation</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              {/* Urgency */}
                              <FormField
                                control={form.control}
                                name="urgency"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="flex items-center text-gray-700 font-medium mb-3">
                                      <Clock className="w-4 h-4 mr-2 text-teal-500" />
                                      Timeline
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger className="h-12 rounded-2xl border-teal-200 focus:border-teal-500 focus:ring-teal-500 bg-white/80 backdrop-blur-sm shadow-sm">
                                          <SelectValue placeholder="Select timeline" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent className="rounded-2xl border-teal-200 bg-white/95 backdrop-blur-xl">
                                        <SelectItem value="urgent">Urgent (ASAP)</SelectItem>
                                        <SelectItem value="soon">Soon (1-2 weeks)</SelectItem>
                                        <SelectItem value="normal">Normal (1 month)</SelectItem>
                                        <SelectItem value="flexible">Flexible (2+ months)</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            {/* Subject Field */}
                            <FormField
                              control={form.control}
                              name="subject"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center text-gray-700 font-medium mb-3">
                                    <FileText className="w-4 h-4 mr-2 text-teal-500" />
                                    Subject *
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Brief description of your project"
                                      {...field}
                                      className="h-12 rounded-2xl border-teal-200 focus:border-teal-500 focus:ring-teal-500 bg-white/80 backdrop-blur-sm shadow-sm"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {/* Message Field */}
                            <FormField
                              control={form.control}
                              name="message"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center text-gray-700 font-medium mb-3">
                                    <MessageSquare className="w-4 h-4 mr-2 text-teal-500" />
                                    Project Details *
                                  </FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Tell me about your project requirements, goals, and any specific details you'd like to share..."
                                      {...field}
                                      rows={6}
                                      className="rounded-2xl border-teal-200 focus:border-teal-500 focus:ring-teal-500 bg-white/80 backdrop-blur-sm shadow-sm resize-none"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {/* Preferred Contact Method */}
                            <FormField
                              control={form.control}
                              name="preferredContact"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center text-gray-700 font-medium mb-3">
                                    <Globe className="w-4 h-4 mr-2 text-teal-500" />
                                    Preferred Contact Method *
                                  </FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="h-12 rounded-2xl border-teal-200 focus:border-teal-500 focus:ring-teal-500 bg-white/80 backdrop-blur-sm shadow-sm">
                                        <SelectValue placeholder="How would you like me to respond?" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="rounded-2xl border-teal-200 bg-white/95 backdrop-blur-xl">
                                      <SelectItem value="email">Email</SelectItem>
                                      <SelectItem value="phone">Phone Call</SelectItem>
                                      <SelectItem value="any">Any Method</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {/* Checkboxes */}
                            <div className="space-y-4">
                              <FormField
                                control={form.control}
                                name="newsletter"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-2xl border border-teal-100 p-4 bg-teal-50/50">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel className="text-sm font-medium cursor-pointer">
                                        Subscribe to newsletter
                                      </FormLabel>
                                      <FormDescription className="text-sm text-gray-600">
                                        Stay updated with my latest projects and tech insights.
                                      </FormDescription>
                                    </div>
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="termsAccepted"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-2xl border border-teal-100 p-4 bg-teal-50/50">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel className="text-sm font-medium cursor-pointer">
                                        I agree to the terms and conditions *
                                      </FormLabel>
                                      <FormDescription className="text-sm text-gray-600">
                                        Your information will be kept confidential and used only for project communication.
                                      </FormDescription>
                                    </div>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            {/* Enhanced Submit Button */}
                            <motion.div 
                              className="text-center pt-6"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <MotionButton
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-12 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed min-w-48"
                                whileHover={{ y: -3 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {isSubmitting ? (
                                  <motion.div 
                                    className="flex items-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                  >
                                    <motion.div
                                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                                      animate={{ rotate: 360 }}
                                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    />
                                    Sending Message...
                                  </motion.div>
                                ) : (
                                  <span className="flex items-center">
                                    Send Message
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                  </span>
                                )}
                              </MotionButton>
                            </motion.div>
                          </form>
                        </Form>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced FAQ Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div 
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="text-center mb-16">
                <motion.h2 
                  className="text-4xl md:text-5xl font-bold mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-teal-500 to-blue-500">
                    Frequently Asked Questions
                  </span>
                </motion.h2>
                
                <motion.p 
                  className="text-xl text-gray-600"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  Common questions about working together
                </motion.p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    question: "How quickly can you start on my project?",
                    answer: "I can typically start within 1-2 weeks, depending on my current workload and project complexity. For urgent projects, I can often accommodate faster start times."
                  },
                  {
                    question: "What's your typical project timeline?",
                    answer: "Project timelines vary based on scope and complexity. Simple websites take 2-4 weeks, while complex applications can take 2-6 months. I provide detailed timelines during our initial consultation."
                  },
                  {
                    question: "Do you provide ongoing support after project completion?",
                    answer: "Yes! I offer 3-6 months of free support for bug fixes and minor adjustments. I also provide ongoing maintenance packages for long-term support and updates."
                  },
                  {
                    question: "How do you handle project payments?",
                    answer: "I typically work with a 50% upfront payment and 50% upon completion for smaller projects. For larger projects, I can arrange milestone-based payments to make it more manageable."
                  }
                ].map((faq, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-teal-100"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    viewport={{ once: true }}
                    whileHover={{ y: -3 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-50/30 via-blue-50/20 to-white/40 rounded-3xl" />
                    
                    <div className="relative">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                          <span className="text-white font-bold text-sm">{index + 1}</span>
                        </div>
                        {faq.question}
                      </h3>
                      <p className="text-gray-600 leading-relaxed pl-12">{faq.answer}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContactForm;
