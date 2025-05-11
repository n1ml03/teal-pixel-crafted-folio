
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Mail,
  MessageSquare,
  Send,
  User,
  Calendar,
  GithubIcon,
  LinkedinIcon
} from "lucide-react";
import { MotionButton } from "@/components/ui/motion-button";
import { Badge } from "@/components/ui/badge";

const ContactSection = () => {
  const { toast } = useToast();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      toast({
        title: "Message sent!",
        description: "Thank you for your message. I'll get back to you soon.",
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
      icon: <Mail className="h-5 w-5" />,
      title: "Email",
      value: "pearleseed@gmail.com",
      href: "mailto:pearleseed@gmail.com",
      description: "Send me an email anytime"
    },
    {
      icon: <GithubIcon className="h-5 w-5" />,
      title: "GitHub",
      value: "github.com/n1ml03",
      href: "https://github.com/n1ml03",
      description: "Check out my code repositories"
    },
    {
      icon: <LinkedinIcon className="h-5 w-5" />,
      title: "LinkedIn",
      value: "linkedin.com/in/pearleseed",
      href: "https://linkedin.com/in/pearleseed",
      description: "Connect with me professionally"
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      title: "Availability",
      value: "Open to opportunities",
      description: "Currently available for new projects"
    }
  ];

  return (
    <section id="contact" className="py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge
              variant="secondary"
              className="mb-4 bg-teal-50 text-teal-700 hover:bg-teal-100 px-4 py-1.5 text-sm font-medium"
            >
              Get in Touch
            </Badge>
            <h2 className="text-4xl font-bold mb-4 text-gray-800 relative inline-block">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-teal-400">
                Let's collaborate on your next project
              </span>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-teal-500 rounded-full"></div>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Have a project in mind or want to discuss potential opportunities?
              I'm always open to new ideas and collaborations.
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-12">
            <motion.div
              className="w-full lg:w-2/5"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 h-full">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Contact Information</h3>

                <div className="space-y-6">
                  {contactMethods.map((method, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center mr-4 text-teal-600">
                        {method.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">{method.title}</h4>
                        {method.href ? (
                          <a
                            href={method.href}
                            className="text-base font-medium text-teal-600 hover:text-teal-700 transition-colors flex items-center"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {method.value}
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </a>
                        ) : (
                          <p className="text-base font-medium text-gray-800">{method.value}</p>
                        )}
                        <p className="text-sm text-gray-500 mt-0.5">{method.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* <div className="mt-10 pt-8 border-t border-gray-100">
                  <h4 className="text-base font-semibold mb-4 text-gray-800">Follow Me</h4>
                  <div className="flex space-x-3">
                    <motion.a
                      href="https://github.com/namle"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                      whileHover={{ y: -3, scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <GithubIcon className="h-5 w-5" />
                    </motion.a>
                    <motion.a
                      href="https://linkedin.com/in/namle"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                      whileHover={{ y: -3, scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <LinkedinIcon className="h-5 w-5" />
                    </motion.a>
                  </div>
                </div> */}
              </div>
            </motion.div>

            {/* Contact form */}
            <motion.div
              className="w-full lg:w-3/5"
              initial="hidden"
              whileInView="visible"
              variants={formVariants}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-50 rounded-full opacity-50"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-50 rounded-full opacity-50"></div>

                <div className="relative">
                  <h3 className="text-2xl font-bold mb-6 text-gray-800">Send Me a Message</h3>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <motion.div className="space-y-2" variants={itemVariants}>
                      <label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center">
                        <User className="h-4 w-4 mr-2 text-teal-500" />
                        Name
                      </label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        className="bg-white border-gray-200 rounded-lg transition-all focus:border-teal-400 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                        required
                        value={formState.name}
                        onChange={handleChange}
                      />
                    </motion.div>

                    <motion.div className="space-y-2" variants={itemVariants}>
                      <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-teal-500" />
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        className="bg-white border-gray-200 rounded-lg transition-all focus:border-teal-400 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                        required
                        value={formState.email}
                        onChange={handleChange}
                      />
                    </motion.div>

                    <motion.div className="space-y-2" variants={itemVariants}>
                      <label htmlFor="message" className="text-sm font-medium text-gray-700 flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2 text-teal-500" />
                        Message
                      </label>
                      <Textarea
                        id="message"
                        placeholder="Tell me about your development or testing needs"
                        className="min-h-32 bg-white border-gray-200 rounded-lg transition-all focus:border-teal-400 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                        required
                        value={formState.message}
                        onChange={handleChange}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <MotionButton
                        type="submit"
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-lg py-3 transition-all"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center">
                            <Send className="mr-2 h-4 w-4" />
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
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
