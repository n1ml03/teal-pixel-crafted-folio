import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { MotionButton } from "@/components/ui/motion-button";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EnhancedBackground from '@/components/utils/EnhancedBackground.tsx';
import { toast } from "@/components/ui/sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Mail,
  User,
  Phone,
  Building2,
  MessageSquare,
  Send,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  FileText,
  Briefcase,
  Globe,
  HelpCircle
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

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

  return (
    <div className="min-h-screen relative">
      <EnhancedBackground />

      <Header />
      <main id="main-content" className="pt-24 pb-16">
        {/* Enhanced Hero section */}
        <section className="relative py-24 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <ScrollReveal>
              <div className="text-center max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    type: "spring",
                    stiffness: 200,
                    damping: 15
                  }}
                >
                  <Badge
                    variant="secondary"
                    className="mb-6 bg-teal-50/80 text-teal-500 hover:bg-teal-50 px-6 py-2.5 text-sm font-medium inline-flex items-center backdrop-blur-sm border border-teal-100/50 shadow-sm"
                  >
                    <MessageSquare className="w-4 h-4 mr-2 text-teal-500" />
                    CONTACT ME
                  </Badge>
                </motion.div>

                <motion.h1
                  className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.7,
                    type: "spring",
                    stiffness: 100,
                    damping: 15
                  }}
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-teal-500 to-blue-500">
                    Let's Connect
                  </span>
                </motion.h1>

                <motion.p
                  className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  Have a project in mind or want to discuss potential opportunities?
                  <span className="block mt-2 text-gray-500">I'm always open to new ideas and collaborations.</span>
                </motion.p>

                <motion.div
                  className="flex flex-wrap justify-center gap-4 mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  {[
                    { icon: <Mail className="w-5 h-5" />, text: "pearleseed@gmail.com" },
                    { icon: <Globe className="w-5 h-5" />, text: "Available Worldwide" },
                    { icon: <Clock className="w-5 h-5" />, text: "Quick Response" }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center text-gray-600 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-100/50 shadow-sm"
                      whileHover={{ y: -3, backgroundColor: "rgba(255, 255, 255, 0.8)" }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <span className="text-teal-500 mr-2">{item.icon}</span>
                      <span className="text-sm font-medium">{item.text}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </ScrollReveal>
          </div>

          {/* Enhanced Wave divider */}
          {/* <div className="absolute bottom-0 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto" preserveAspectRatio="none">
              <path
                fill="#ffffff"
                fillOpacity="1"
                d="M0,32L48,48C96,64,192,96,288,96C384,96,480,64,576,48C672,32,768,32,864,48C960,64,1056,96,1152,96C1248,96,1344,64,1392,48L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
              ></path>
            </svg>
          </div> */}
        </section>

        {/* Enhanced Main content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="flex flex-col">
                {/* Form Column */}
                <div className="w-full">
                  <motion.div
                    className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="p-8 md:p-12">
                      <ScrollReveal>
                        <div className="mb-10">
                          <h2 className="text-3xl font-bold text-gray-800 mb-4">Send Me a Message</h2>
                          <p className="text-gray-600">
                            Have a question or want to work together? Fill out the form below.
                          </p>
                        </div>

                        {isSuccess ? (
                          <motion.div
                            className="bg-teal-50 border border-teal-100 rounded-xl p-8 text-center"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                          >
                            <motion.div
                              className="w-20 h-20 bg-teal-100 rounded-full mx-auto flex items-center justify-center mb-6"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            >
                              <CheckCircle2 className="w-10 h-10 text-teal-600" />
                            </motion.div>
                            <h3 className="text-2xl font-bold text-teal-700 mb-2">Message Sent!</h3>
                            <p className="text-teal-600 mb-6">Thank you for reaching out. I'll respond to your message shortly.</p>
                          </motion.div>
                        ) : (
                          <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name Field */}
                                <FormField
                                  control={form.control}
                                  name="name"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="flex items-center text-gray-700">
                                        <User className="h-4 w-4 mr-2 text-teal-500" />
                                        Name
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Your full name"
                                          {...field}
                                          className="bg-white border-gray-200 rounded-lg transition-all focus:border-teal-400 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
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
                                      <FormLabel className="flex items-center text-gray-700">
                                        <Mail className="h-4 w-4 mr-2 text-teal-500" />
                                        Email
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="your.email@example.com"
                                          type="email"
                                          {...field}
                                          className="bg-white border-gray-200 rounded-lg transition-all focus:border-teal-400 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
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
                                      <FormLabel className="flex items-center text-gray-700">
                                        <Phone className="h-4 w-4 mr-2 text-teal-500" />
                                        Phone (Optional)
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Your phone number"
                                          {...field}
                                          className="bg-white border-gray-200 rounded-lg transition-all focus:border-teal-400 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
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
                                      <FormLabel className="flex items-center text-gray-700">
                                        <Building2 className="h-4 w-4 mr-2 text-teal-500" />
                                        Company (Optional)
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Your company name"
                                          {...field}
                                          className="bg-white border-gray-200 rounded-lg transition-all focus:border-teal-400 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                                        />
                                      </FormControl>
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
                                    <FormLabel className="flex items-center text-gray-700">
                                      <FileText className="h-4 w-4 mr-2 text-teal-500" />
                                      Subject
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="What is your message about?"
                                        {...field}
                                        className="bg-white border-gray-200 rounded-lg transition-all focus:border-teal-400 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Project Type Field */}
                                <FormField
                                  control={form.control}
                                  name="projectType"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="flex items-center text-gray-700">
                                        <Briefcase className="h-4 w-4 mr-2 text-teal-500" />
                                        Project Type
                                      </FormLabel>
                                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                          <SelectTrigger className="bg-white border-gray-200 rounded-lg transition-all focus:border-teal-400 focus:ring focus:ring-teal-200 focus:ring-opacity-50">
                                            <SelectValue placeholder="Select project type" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="web">Web Development</SelectItem>
                                          <SelectItem value="mobile">Mobile App</SelectItem>
                                          <SelectItem value="testing">QA & Testing</SelectItem>
                                          <SelectItem value="consulting">Consulting</SelectItem>
                                          <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                {/* Urgency Field */}
                                <FormField
                                  control={form.control}
                                  name="urgency"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="flex items-center text-gray-700">
                                        <Clock className="h-4 w-4 mr-2 text-teal-500" />
                                        Urgency
                                      </FormLabel>
                                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                          <SelectTrigger className="bg-white border-gray-200 rounded-lg transition-all focus:border-teal-400 focus:ring focus:ring-teal-200 focus:ring-opacity-50">
                                            <SelectValue placeholder="Select urgency" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="low">Low - No Rush</SelectItem>
                                          <SelectItem value="normal">Normal - Within a Week</SelectItem>
                                          <SelectItem value="high">High - Within 48 Hours</SelectItem>
                                          <SelectItem value="urgent">Urgent - ASAP</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>

                              {/* Message Field */}
                              <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="flex items-center text-gray-700">
                                      <MessageSquare className="h-4 w-4 mr-2 text-teal-500" />
                                      Message
                                    </FormLabel>
                                    <FormControl>
                                      <Textarea
                                        placeholder="Tell me about your project or inquiry..."
                                        {...field}
                                        className="min-h-32 bg-white border-gray-200 rounded-lg transition-all focus:border-teal-400 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
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
                                    <FormLabel className="flex items-center text-gray-700">
                                      <Globe className="h-4 w-4 mr-2 text-teal-500" />
                                      Preferred Contact Method
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger className="bg-white border-gray-200 rounded-lg transition-all focus:border-teal-400 focus:ring focus:ring-teal-200 focus:ring-opacity-50">
                                          <SelectValue placeholder="Select contact method" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="email">Email</SelectItem>
                                        <SelectItem value="phone">Phone</SelectItem>
                                        <SelectItem value="any">Any Method</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              {/* Newsletter Checkbox */}
                              <FormField
                                control={form.control}
                                name="newsletter"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 bg-gray-50">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel className="text-gray-700">
                                        Subscribe to newsletter
                                      </FormLabel>
                                      <FormDescription className="text-gray-500 text-xs">
                                        Receive updates about new projects, blog posts, and resources.
                                      </FormDescription>
                                    </div>
                                  </FormItem>
                                )}
                              />

                              {/* Terms and Conditions Checkbox */}
                              <FormField
                                control={form.control}
                                name="termsAccepted"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 bg-gray-50">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel className="text-gray-700">
                                        I accept the terms and conditions
                                      </FormLabel>
                                      <FormDescription className="text-gray-500 text-xs">
                                        By submitting this form, you agree to our privacy policy and terms of service.
                                      </FormDescription>
                                    </div>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              {/* Submit Button */}
                              <motion.div
                                className="pt-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                              >
                                <MotionButton
                                  type="submit"
                                  className={`w-full py-6 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-xl transition-all duration-300 ${
                                    isSubmitting ? "opacity-80 cursor-not-allowed" : ""
                                  }`}
                                  disabled={isSubmitting}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  {isSubmitting ? (
                                    <div className="flex items-center justify-center">
                                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                      </svg>
                                      Sending Message...
                                    </div>
                                  ) : (
                                    <span className="flex items-center justify-center">
                                      <Send className="mr-2 h-5 w-5" />
                                      Send Message
                                      <motion.span
                                        className="ml-2 inline-block"
                                        initial={{ x: 0 }}
                                        whileHover={{ x: 5 }}
                                      >
                                        <ArrowRight size={16} />
                                      </motion.span>
                                    </span>
                                  )}
                                </MotionButton>
                              </motion.div>
                            </form>
                          </Form>
                        )}
                      </ScrollReveal>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ContactForm;
