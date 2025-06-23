import React, { useState } from 'react';
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { toast } from "sonner";
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  Mail,
  MessageSquare,
  Send,
  User,
  GithubIcon,
  LinkedinIcon,
  Clock,
  MapPin,
  Sparkles,
  Coffee,
  Heart,
  Star,
  Zap
} from "lucide-react";
import { MotionButton } from "@/components/ui/motion-button.tsx";
import { Badge } from "@/components/ui/badge.tsx";

const ContactSection = () => {
  // Scroll animations
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  // Using sonner toast directly
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);

      // Reset form
      setFormState({
        name: '',
        email: '',
        message: ''
      });

      // Show success toast
      toast.success("Thank you for your message. I'll get back to you soon!", {
        description: "Message sent successfully!",
      });
    }, 1500);
  };

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const contactMethods = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email",
      value: "pearleseed@gmail.com",
      href: "mailto:pearleseed@gmail.com",
      description: "Send me an email anytime",
      color: "from-teal-500 to-teal-600"
    },
    {
      icon: <GithubIcon className="h-6 w-6" />,
      title: "GitHub",
      value: "github.com/n1ml03",
      href: "https://github.com/n1ml03",
      description: "Check out my code repositories",
      color: "from-gray-600 to-gray-700"
    },
    {
      icon: <LinkedinIcon className="h-6 w-6" />,
      title: "LinkedIn",
      value: "linkedin.com/in/pearleseed",
      href: "https://linkedin.com/in/pearleseed",
      description: "Connect with me professionally",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Availability",
      value: "Open to opportunities",
      description: "Currently available for new projects",
      color: "from-green-500 to-green-600"
    }
  ];

  const quickStats = [
    { icon: Coffee, number: "24h", label: "Response Time", color: "text-amber-300" },
    { icon: Heart, number: "100%", label: "Client Satisfaction", color: "text-red-300" },
    { icon: Star, number: "5+", label: "Projects Completed", color: "text-yellow-300" },
    { icon: Zap, number: "1+", label: "Years Experience", color: "text-blue-300" }
  ];

  return (
    <motion.section 
      id="contact" 
      className="py-24 relative overflow-hidden"
      style={{ y }}
    >
      {/* Enhanced background with glassmorphism */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'radial-gradient(circle at 25% 25%, rgba(20, 184, 166, 0.15) 0%, rgba(59, 130, 246, 0.1) 50%, transparent 70%)',
              'radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.15) 0%, rgba(20, 184, 166, 0.1) 50%, transparent 70%)',
              'radial-gradient(circle at 25% 25%, rgba(20, 184, 166, 0.15) 0%, rgba(59, 130, 246, 0.1) 50%, transparent 70%)'
            ]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Enhanced floating decorative elements */}
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 rounded-full bg-gradient-to-tr from-teal-100/20 to-blue-100/20 backdrop-blur-md border border-white/20"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 15, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-80 h-80 rounded-3xl bg-gradient-to-tr from-purple-100/20 to-pink-100/20 backdrop-blur-md border border-white/20"
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, -10, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 left-16 w-40 h-96 rounded-full bg-gradient-to-b from-yellow-100/15 to-orange-100/15 backdrop-blur-sm border border-white/20"
          animate={{ 
            x: [0, 20, 0],
            rotate: [0, 8, 0]
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Enhanced section header */}
          <div className="max-w-4xl mx-auto text-center mb-20">
            <motion.div
              className="inline-flex items-center mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge 
                variant="outline" 
                className="px-4 py-2 text-sm font-medium bg-white/80 backdrop-blur-md border-teal-200/50 text-teal-700"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Let's Connect
              </Badge>
            </motion.div>

            <motion.h2
              className="text-5xl lg:text-6xl font-bold mb-6 relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600">
                Start Your Project
              </span>
              <motion.div 
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: 128 }}
                transition={{ delay: 1, duration: 0.8 }}
                viewport={{ once: true }}
              />
            </motion.h2>

            <motion.p
              className="text-gray-600 text-xl leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Ready to bring your ideas to life? Let's discuss your project and see how I can help you 
              <span className="text-teal-600 font-semibold"> achieve your goals</span>.
            </motion.p>
          </div>

          {/* Enhanced statistics section */}
          <motion.div
            className="bg-white/60 backdrop-blur-md rounded-3xl p-12 border border-white/20 shadow-xl mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {quickStats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-white shadow-lg flex items-center justify-center ${stat.color}`}>
                    {(() => {
                      const IconComponent = stat.icon;
                      return <IconComponent className="w-8 h-8" />;
                    })()}
                  </div>
                  <motion.div 
                    className={`text-3xl font-bold mb-2 ${stat.color.replace('text-', 'text-')}`}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.5, type: "spring", damping: 15 }}
                    viewport={{ once: true }}
                  >
                    {stat.number}
                  </motion.div>
                  <p className="text-gray-600 font-medium text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Enhanced contact information */}
            <motion.div
              className="w-full lg:w-2/5"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-xl border border-white/20 h-full relative overflow-hidden">
                {/* Enhanced background effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-50/60 via-white to-blue-50/40 opacity-60" />
                <motion.div 
                  className="absolute -right-16 -top-16 w-32 h-32 bg-gradient-to-br from-teal-100/30 to-teal-50/50 rounded-full"
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />

                <div className="relative z-10">
                  <h3 className="text-3xl font-bold mb-8 text-gray-800">Get In Touch</h3>

                  <div className="space-y-8">
                    {contactMethods.map((method, index) => (
                      <motion.div
                        key={index}
                        className="group flex items-start"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        whileHover={{ x: 5 }}
                      >
                        <motion.div 
                          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${method.color} flex items-center justify-center mr-6 text-white shadow-lg group-hover:shadow-xl transition-shadow`}
                          whileHover={{ 
                            scale: 1.1, 
                            rotate: 5,
                            boxShadow: "0 10px 25px -5px rgba(20, 184, 166, 0.4)"
                          }}
                          transition={{ type: "spring", damping: 15 }}
                        >
                          {method.icon}
                        </motion.div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">{method.title}</h4>
                          {method.href ? (
                            <motion.a
                              href={method.href}
                              className="text-lg font-bold text-gray-800 hover:text-teal-600 transition-colors flex items-center group"
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ x: 3 }}
                            >
                              {method.value}
                              <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.a>
                          ) : (
                            <p className="text-lg font-bold text-gray-800">{method.value}</p>
                          )}
                          <p className="text-sm text-gray-600 mt-1 leading-relaxed">{method.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-12 pt-8 border-t border-gray-100/50">
                    <motion.div
                      className="flex items-center justify-center bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl p-6 border border-teal-100/50"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", damping: 20 }}
                    >
                      <MapPin className="w-5 h-5 mr-3 text-teal-600" />
                      <span className="text-gray-700 font-medium">Ha Noi, Vietnam (UTC+7)</span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Enhanced contact form */}
            <motion.div
              className="w-full lg:w-3/5"
              initial="hidden"
              whileInView="visible"
              variants={formVariants}
              viewport={{ once: true }}
            >
              <div 
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-xl border border-white/20 relative overflow-hidden"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {/* Enhanced background effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-white to-purple-50/40 opacity-60" />
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-blue-500/5"
                  animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Floating decorative elements */}
                <motion.div 
                  className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-blue-100/30 to-blue-50/50 rounded-full"
                  animate={isHovered ? { 
                    scale: 1.3, 
                    opacity: 0.8,
                    rotate: 30 
                  } : { 
                    scale: 1, 
                    opacity: 0.4,
                    rotate: 0 
                  }}
                  transition={{ duration: 0.4, type: "spring", damping: 20 }}
                />
                <motion.div 
                  className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-tr from-purple-100/30 to-purple-50/50 rounded-full"
                  animate={isHovered ? { 
                    scale: 1.2, 
                    opacity: 0.6,
                    rotate: -20 
                  } : { 
                    scale: 1, 
                    opacity: 0.3,
                    rotate: 0 
                  }}
                  transition={{ duration: 0.3, type: "spring", damping: 25 }}
                />

                <div className="relative z-10">
                  <h3 className="text-3xl font-bold mb-8 text-gray-800">Send Message</h3>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    <motion.div className="space-y-3" variants={itemVariants}>
                      <label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center">
                        <User className="h-5 w-5 mr-3 text-teal-500" />
                        Full Name
                      </label>
                      <Input
                        id="name"
                        placeholder="Your full name"
                        className="bg-white/90 backdrop-blur-md border/50 rounded-2xl py-4 px-6 text-lg transition-all focus:border-teal-400 focus:ring focus:ring-teal-200/50 hover:bg-white"
                        required
                        value={formState.name}
                        onChange={handleChange}
                      />
                    </motion.div>

                    <motion.div className="space-y-3" variants={itemVariants}>
                      <label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center">
                        <Mail className="h-5 w-5 mr-3 text-teal-500" />
                        Email Address
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        className="bg-white/90 backdrop-blur-md border/50 rounded-2xl py-4 px-6 text-lg transition-all focus:border-teal-400 focus:ring focus:ring-teal-200/50 hover:bg-white"
                        required
                        value={formState.email}
                        onChange={handleChange}
                      />
                    </motion.div>

                    <motion.div className="space-y-3" variants={itemVariants}>
                      <label htmlFor="message" className="text-sm font-semibold text-gray-700 flex items-center">
                        <MessageSquare className="h-5 w-5 mr-3 text-teal-500" />
                        Project Details
                      </label>
                      <Textarea
                        id="message"
                        placeholder="Tell me about your project requirements, timeline, and any specific needs..."
                        className="min-h-40 bg-white/90 backdrop-blur-md border/50 rounded-2xl py-4 px-6 text-lg transition-all focus:border-teal-400 focus:ring focus:ring-teal-200/50 hover:bg-white resize-none"
                        required
                        value={formState.message}
                        onChange={handleChange}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <MotionButton
                        type="submit"
                        className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-2xl py-4 px-8 text-lg font-semibold transition-all shadow-lg hover:shadow-xl"
                        disabled={isSubmitting}
                        whileHover={{ 
                          scale: 1.02,
                          boxShadow: "0 10px 30px -5px rgba(20, 184, 166, 0.4)"
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending Message...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center">
                            <Send className="mr-3 h-5 w-5" />
                            Send Message
                            <motion.span
                              className="ml-3 inline-block"
                              initial={{ x: 0 }}
                              whileHover={{ x: 5 }}
                            >
                              <ArrowRight size={20} />
                            </motion.span>
                          </span>
                        )}
                      </MotionButton>
                    </motion.div>
                  </form>

                  <motion.div 
                    className="mt-8 p-6 bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl border border-teal-100/50"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    viewport={{ once: true }}
                  >
                    <p className="text-sm text-gray-600 text-center">
                      <span className="font-semibold text-teal-600">✨ Quick Response:</span> I'll get back to you within 24 hours!
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ContactSection;
