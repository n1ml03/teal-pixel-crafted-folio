import { MotionLink } from "@/components/ui/motion-link.tsx";
import { MotionButton } from "@/components/ui/motion-button.tsx";
import { Github, Linkedin, Mail, Sparkles, BookOpen, Home, Code, Layers, Briefcase, Award, Wrench, ArrowUp, Zap } from "lucide-react";
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';

const Footer = () => {
  const prefersReducedMotion = useReducedMotion();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const navigationLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/blog", label: "Blog", icon: BookOpen },
    { to: "/resources", label: "Resources", icon: Wrench },
    { href: "/services", label: "Services", icon: Code },
    { to: "/projects", label: "Projects", icon: Layers },
  ];

  const quickLinks = [
    { href: "/home#experience", label: "Experience", icon: Briefcase },
    { href: "/home#certifications", label: "Certifications", icon: Award },
    { href: "/contact-form", label: "Contact", icon: Mail },
  ];

  const socialLinks = [
    {
      href: "https://github.com/n1ml03",
      label: "GitHub",
      icon: Github,
      hoverColor: "hover:text-gray-800"
    },
    {
      href: "https://linkedin.com/in/pearleseed",
      label: "LinkedIn", 
      icon: Linkedin,
      hoverColor: "hover:text-blue-600"
    },
    {
      href: "mailto:pearleseed@gmail.com",
      label: "Email",
      icon: Mail,
      hoverColor: "hover:text-teal-600"
    }
  ];



  return (
    <footer className="relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50 to-teal-50" />
      <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent" />
      
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-teal-100/20 rounded-full blur-2xl" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-100/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-purple-100/20 rounded-full blur-xl transform -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10">
        {/* Scroll to top button for mobile - fixed position */}
        <motion.div
          className="fixed bottom-6 right-6 z-40 md:hidden"
          initial={!prefersReducedMotion ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <MotionButton
            onClick={scrollToTop}
            className="bg-white/90 backdrop-blur-sm text-gray-700 hover:text-teal-600 p-3 rounded-2xl border border/50 shadow-lg"
            whileHover={!prefersReducedMotion ? { y: -3, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" } : {}}
            whileTap={!prefersReducedMotion ? { scale: 0.95 } : {}}
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </MotionButton>
        </motion.div>

        <div className="container mx-auto px-4 pt-20 pb-8">
          {/* Main Footer Content */}
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
             {/* Brand Section */}
             <motion.div 
               className="lg:col-span-2"
              initial={!prefersReducedMotion ? { opacity: 0, y: 20 } : { opacity: 1 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50">
                {/* Brand Header */}
                <div className="flex items-center gap-3 text-2xl font-bold text-gray-900 mb-6">
                  <motion.div
                    className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg"
                    whileHover={!prefersReducedMotion ? { rotate: 10, scale: 1.05 } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <Sparkles className="w-6 h-6 text-white" />
                  </motion.div>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600">
                    Nam Le
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-700 mb-8 leading-relaxed">
                  Developer & QA Engineer specializing in building robust software solutions through meticulous development and comprehensive testing.
                </p>

                

                                 {/* Enhanced Social Links */}
                 <div className="space-y-4">
                   <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                     <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                       <Sparkles className="w-3 h-3 text-white" />
                     </div>
                     Connect With Me
                   </h4>
                   <div className="space-y-3">
                     {socialLinks.map((social, index) => (
                       <motion.div 
                         key={index}
                         initial={!prefersReducedMotion ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
                         whileInView={{ opacity: 1, x: 0 }}
                         transition={{ duration: 0.4, delay: index * 0.1 }}
                         viewport={{ once: true }}
                       >
                         <MotionLink
                           href={social.href}
                           className={`flex items-center gap-3 bg-white/70 backdrop-blur-sm p-4 rounded-2xl text-gray-700 ${social.hoverColor} border border/50 shadow-sm group transition-all duration-300`}
                           whileHover={!prefersReducedMotion ? { 
                             y: -2, 
                             scale: 1.02,
                             boxShadow: "0 10px 25px -5px rgba(20, 184, 166, 0.15)" 
                           } : {}}
                           whileTap={!prefersReducedMotion ? { scale: 0.98 } : {}}
                           target="_blank"
                           rel="noopener noreferrer"
                           aria-label={social.label}
                         >
                           <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center group-hover:from-teal-100 group-hover:to-teal-200 transition-all duration-300">
                             {(() => {
                               const IconComponent = social.icon;
                               return <IconComponent className="w-5 h-5" />;
                             })()}
                           </div>
                           <div className="flex flex-col">
                             <span className="font-medium text-gray-800 group-hover:text-gray-900">
                               {social.label}
                             </span>
                             <span className="text-xs text-gray-500">
                               {social.label === 'GitHub' ? 'View my code' : 
                                social.label === 'LinkedIn' ? 'Professional network' : 
                                'Send me an email'}
                             </span>
                           </div>
                           <ArrowUp className="w-4 h-4 ml-auto transform rotate-45 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                         </MotionLink>
                       </motion.div>
                     ))}
                   </div>
                 </div>
              </div>
            </motion.div>

              {/* Navigation Links */}
            <motion.div 
               className="lg:col-span-1"
              initial={!prefersReducedMotion ? { opacity: 0, y: 20 } : { opacity: 1 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                {/* Navigation Section */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50">
                  <h3 className="font-semibold text-gray-900 mb-6 text-lg flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mr-3">
                      <Home className="w-4 h-4 text-white" />
                    </div>
                    Navigation
                  </h3>
                  <ul className="space-y-3">
                    {navigationLinks.map((link, index) => (
                      <motion.li key={index}>
                        {link.to ? (
                          <Link 
                            to={link.to} 
                            className="flex items-center text-gray-700 hover:text-teal-600 transition-colors group"
                          >
                            {(() => {
                              const IconComponent = link.icon;
                              return <IconComponent className="w-4 h-4 mr-3 group-hover:translate-x-1 transition-transform" />;
                            })()}
                            {link.label}
                          </Link>
                        ) : (
                          <a 
                            href={link.href} 
                            className="flex items-center text-gray-700 hover:text-teal-600 transition-colors group"
                          >
                            {(() => {
                              const IconComponent = link.icon;
                              return <IconComponent className="w-4 h-4 mr-3 group-hover:translate-x-1 transition-transform" />;
                            })()}
                            {link.label}
                          </a>
                        )}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Quick Links Section */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50">
                  <h3 className="font-semibold text-gray-900 mb-6 text-lg flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-3">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    Quick Links
                  </h3>
                  <ul className="space-y-3">
                    {quickLinks.map((link, index) => (
                      <motion.li key={index}>
                        <a 
                          href={link.href} 
                          className="flex items-center text-gray-700 hover:text-blue-600 transition-colors group"
                        >
                          {(() => {
                            const IconComponent = link.icon;
                            return <IconComponent className="w-4 h-4 mr-3 group-hover:translate-x-1 transition-transform" />;
                          })()}
                          {link.label}
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            
          </div>

          {/* Bottom Bar */}
          <motion.div 
            className="border-t border/50 pt-8"
            initial={!prefersReducedMotion ? { opacity: 0 } : { opacity: 1 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
                         <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
               <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                 <p className="text-gray-600 text-sm">
                   &copy; {new Date().getFullYear()} Nam Le. All rights reserved.
                 </p>
                 
                 <div className="flex items-center gap-6 text-sm text-gray-500">
                   <span>Made with ❤️ in Vietnam</span>
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                     <span>Available for projects</span>
                   </div>
                   
                   {/* Desktop scroll to top */}
                   <div className="hidden md:block">
                     <MotionButton
                       onClick={scrollToTop}
                       className="bg-white/90 backdrop-blur-sm text-gray-700 hover:text-teal-600 hover:bg-white p-2 rounded-xl border border/50 shadow-sm"
                       whileHover={!prefersReducedMotion ? { y: -2, scale: 1.05 } : {}}
                       whileTap={!prefersReducedMotion ? { scale: 0.95 } : {}}
                       aria-label="Scroll to top"
                     >
                       <ArrowUp className="w-4 h-4" />
                     </MotionButton>
                   </div>
                 </div>
               </div>
             </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
