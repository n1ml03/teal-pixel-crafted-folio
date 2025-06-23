import { useState, useMemo, useCallback } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { MotionButton } from "@/components/ui/motion-button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  GraduationCap,
  Sparkles,
  Star,
  Award,
  Code,
  TestTube,
  TrendingUp
} from 'lucide-react';


interface ExperienceCardProps {
  logo: string;
  company: string;
  title: string;
  period: string;
  description: string;
  achievements: string[];
  skills: string[];
  index: number;
  isLast?: boolean;
}

const TimelineItem = ({
  logo,
  company,
  title,
  period,
  description,
  achievements,
  skills,
  index,
  isLast = false
}: ExperienceCardProps) => {
  const prefersReducedMotion = useReducedMotion();

  // Memoize animation variants để tránh re-create
  const lineAnimation = useMemo(() => ({
    initial: !prefersReducedMotion ? { scaleY: 0 } : {},
    whileInView: !prefersReducedMotion ? { scaleY: 1 } : {},
    transition: !prefersReducedMotion ? { duration: 0.6, delay: index * 0.05 } : {}
  }), [prefersReducedMotion, index]);

  const dotAnimation = useMemo(() => ({
    initial: !prefersReducedMotion ? { scale: 0, rotate: -45 } : {},
    whileInView: !prefersReducedMotion ? { scale: 1, rotate: 0 } : {},
    transition: !prefersReducedMotion ? { 
      type: "spring", 
      damping: 20, 
      delay: index * 0.03,
      duration: 0.4
    } : {}
  }), [prefersReducedMotion, index]);

  const cardAnimation = useMemo(() => ({
    initial: !prefersReducedMotion ? { opacity: 0, x: -20, scale: 0.98 } : {},
    whileInView: !prefersReducedMotion ? { opacity: 1, x: 0, scale: 1 } : {},
    transition: !prefersReducedMotion ? { 
      duration: 0.3, 
      delay: index * 0.03,
      ease: "easeOut"
    } : {}
  }), [prefersReducedMotion, index]);

  return (
    <div className="relative pl-8 sm:pl-12 pb-12 sm:pb-16">
      {/* Optimized timeline line */}
      {!isLast && (
        <motion.div 
          className="absolute left-4 sm:left-6 top-8 w-1 h-full bg-gradient-to-b from-teal-500 via-teal-400 to-teal-200 transform -translate-x-1/2 rounded-full will-change-transform"
          {...lineAnimation}
          viewport={{ once: true, margin: "-100px" }}
        />
      )}

      {/* Optimized timeline dot */}
      <motion.div 
        className="absolute left-4 sm:left-6 top-8 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white border-4 border-teal-500 flex items-center justify-center transform -translate-x-1/2 z-20 shadow-md will-change-transform"
        {...dotAnimation}
        viewport={{ once: true, margin: "-100px" }}
      >
        <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-teal-500" />
      </motion.div>

      {/* Optimized card content */}
      <motion.div
        className="relative bg-white/90 rounded-3xl p-4 sm:p-8 shadow-md border border-gray-100 ml-4 sm:ml-8 overflow-hidden will-change-transform"
        {...cardAnimation}
        viewport={{ once: true, margin: "-50px" }}
      >
        {/* Simplified background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50/40 via-white to-blue-50/30" />
        
        {/* Static decorative elements - no animation */}
        <div className="absolute -right-8 -top-8 w-20 h-20 bg-teal-50/60 rounded-full opacity-40" />
        <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-blue-50/40 rounded-2xl opacity-30" />

        <div className="relative z-10">
          {/* Enhanced header */}
          <div className="flex items-center mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white p-2 sm:p-3 flex items-center justify-center mr-4 sm:mr-6 overflow-hidden shadow-sm border border-gray-100">
              <img
                src={logo}
                alt={company}
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                loading="lazy"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-800">
                {company}
              </h3>
              <div className="flex items-center text-gray-500 text-sm mt-1">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="font-medium">{period}</span>
              </div>
            </div>
            <Badge
              variant="outline"
              className="bg-white text-teal-600 border-teal-200 px-3 py-1 font-medium"
            >
              <Star className="w-3 h-3 mr-1" />
              Experience
            </Badge>
          </div>

          <h4 className="text-xl font-bold mb-4 text-teal-600">
            {title}
          </h4>

          <p className="text-gray-600 mb-6 text-sm leading-relaxed">{description}</p>

          {/* Enhanced achievements */}
          {achievements.length > 0 && (
            <div className="mb-6">
              <h5 className="text-sm font-semibold mb-4 text-gray-700 flex items-center">
                <CheckCircle2 className="w-5 h-5 mr-2 text-teal-500" />
                Key Achievements
              </h5>
              <div className="space-y-3">
                {achievements.map((achievement, i) => (
                  <div 
                    key={i} 
                    className="flex items-start"
                  >
                    <div className="w-2 h-2 bg-teal-500 rounded-full mr-3 mt-2 flex-shrink-0" />
                    <span className="text-sm text-gray-600 leading-relaxed">
                      {achievement}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced skills */}
          {skills.length > 0 && (
            <div className="pt-4 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="bg-teal-50 text-teal-700 border-teal-200 px-3 py-1"
                  >
                    <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2"></div>
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const ExperienceSection = () => {
  const prefersReducedMotion = useReducedMotion();
  
  // Optimized scroll animations - only when needed
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -30]);

  // Memoize experiences data
  const experiences = useMemo(() => [
    {
      logo: "./images/koeitecmo.svg",
      company: "Koei Tecmo Software Vietnam",
      title: "QA Engineer",
      period: "2025 - Present",
      description: "Conducting comprehensive game testing and quality assurance for popular Koei Tecmo titles. Collaborating with international development teams to ensure smooth user experiences and deliver bug-free releases across multiple platforms.",
      achievements: [
        "Detected and reported over 300 critical bugs in DOAXVV and other mobile game projects, improving overall game stability",
        "Built and implemented automated UI test cases using advanced testing frameworks, increasing testing efficiency by 35%",
        "Integrated OCR and template matching tools into QA workflow for Japanese UI verification, reducing manual testing time by 50%"
      ],
      skills: ["Game Testing", "Bug Reporting", "JIRA", "Manual Testing", "Automation Testing", "OCR Tools"]
    },
    {
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/playwright/playwright-original.svg",
      company: "Self-Study Project",
      title: "Automation Testing Learner",
      period: "2024 - 2025",
      description: "Independently studied and practiced automation testing for web applications using modern tools and frameworks. Emphasized comprehensive test planning, script development, and defect tracking workflows following industry best practices.",
      achievements: [
        "Built and executed 100+ automated test cases for UI and functional flows using Playwright and Selenium WebDriver",
        "Designed detailed test plans and traceability matrices in Zephyr for structured test management and coverage tracking",
        "Reported and tracked 200+ issues efficiently using JIRA, aligning with agile QA practices and sprint methodologies"
      ],
      skills: ["Playwright", "Selenium", "JIRA", "Zephyr", "Test Automation", "Agile Testing", "CI/CD"]
    },
    {
      logo: "./images/hus.svg",
      company: "VNU-HN University of Science",
      title: "Student - Data Science",
      period: "2021 - 2025",
      description: "Final-year Data Science student with hands-on experience in manual testing and advanced data analysis. Focused on applying statistical modeling and programming knowledge to real-world software testing and QA workflows.",
      achievements: [
        "Graduation thesis: Developed an intelligent system to recognize Japanese text from game screenshots and match with structured datasets for automated QA validation",
        "Collaborated on a research project integrating YOLOv5 and Tesseract OCR to automate UI testing in game applications, achieving 92% accuracy",
        "Completed comprehensive Web Testing project with 500+ test cases on an e-commerce platform, improving system stability by 20%"
      ],
      skills: ["Python", "Pandas", "Matplotlib", "Data Visualization", "Statistical Analysis", "Machine Learning", "Research"]
    }
  ], []);

  // Memoize stats data
  const stats = useMemo(() => [
    { icon: TrendingUp, number: "1+", label: "Years Experience", color: "text-teal-600" },
    { icon: Award, number: "3", label: "Positions", color: "text-blue-600" },
    { icon: Code, number: "5+", label: "Projects", color: "text-purple-600" },
    { icon: TestTube, number: "5000+", label: "Test Cases", color: "text-green-600" }
  ], []);

  // Optimized download handler
  const handleDownload = useCallback(() => {
    const link = document.createElement('a');
    link.href = '/CV Le Van Nam - Intern Tester.pdf';
    link.download = 'CV_Le_Van_Nam.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return (
    <motion.section 
      id="experience" 
      className="py-16 sm:py-24 relative overflow-hidden"
      style={!prefersReducedMotion ? { y } : {}}
    >
      {/* Consistent background matching the site pattern */}
      <div className="absolute inset-0 -z-10">
        {/* Main gradient background - matching site theme */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50 to-teal-50" />
        
        {/* Enhanced overlay gradient for visual depth */}
        <div 
          className="absolute inset-0 opacity-25"
          style={{
            background: 'radial-gradient(circle at 30% 20%, rgba(20, 184, 166, 0.12) 0%, rgba(56, 189, 248, 0.08) 50%, transparent 70%)'
          }}
        />
        
        {/* Subtle pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2320b2aa' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}
        />
        
        {/* Simplified decorative elements - consistent with site theme */}
        <div className="absolute top-16 right-16 w-96 h-96 rounded-full bg-gradient-to-tr from-teal-100/15 to-blue-100/12 opacity-60" />
        <div className="absolute bottom-16 left-16 w-80 h-80 rounded-3xl bg-gradient-to-tr from-purple-100/10 to-pink-100/08 opacity-50" />
        <div className="absolute top-1/2 right-20 w-40 h-80 rounded-full bg-gradient-to-b from-blue-100/12 to-cyan-100/08 opacity-40" />
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row">
          {/* Optimized sidebar */}
          <div className="w-full md:w-1/3 mb-12 md:mb-0 md:sticky md:top-24 md:self-start">
            <motion.div
              className="bg-white/95 rounded-3xl p-6 sm:p-10 shadow-lg border border-gray-100 relative overflow-hidden will-change-transform"
              initial={!prefersReducedMotion ? { opacity: 0, y: 20 } : {}}
              whileInView={!prefersReducedMotion ? { opacity: 1, y: 0 } : {}}
              transition={!prefersReducedMotion ? { duration: 0.4 } : {}}
              viewport={{ once: true, margin: "-50px" }}
            >
              {/* Simplified background effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-50/40 via-white to-blue-50/30" />
              {/* Static decorative element */}
              <div className="absolute -right-16 -top-16 w-32 h-32 bg-teal-50/30 rounded-full" />

              <div className="relative z-10 space-y-8">
                <div>
                  <motion.div
                    className="inline-flex items-center mb-4"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    viewport={{ once: true }}
                  >
                    <Badge 
                      variant="outline" 
                      className="px-4 py-2 text-sm font-medium bg-white border-teal-200 text-teal-700"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Career Journey
                    </Badge>
                  </motion.div>

                  <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-800 relative">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-teal-400">
                      Professional Experience
                    </span>
                    <motion.div 
                      className="absolute -bottom-2 left-0 w-24 h-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full will-change-transform"
                      initial={!prefersReducedMotion ? { width: 0 } : {}}
                      whileInView={!prefersReducedMotion ? { width: 96 } : {}}
                      transition={!prefersReducedMotion ? { delay: 0.6, duration: 0.6 } : {}}
                      viewport={{ once: true }}
                    />
                  </h2>

                  <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
                    My professional journey spans QA engineering and full-stack development,
                    with expertise in test automation, modern frameworks, and 
                    <span className="text-teal-600 font-semibold"> quality-driven development</span>.
                  </p>
                </div>

                {/* Optimized statistics */}
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      className="text-center bg-white rounded-2xl p-4 border border-gray-100 shadow-sm will-change-transform"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 + 0.2 }}
                      viewport={{ once: true }}
                    >
                      <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gray-50 shadow-sm flex items-center justify-center ${stat.color}`}>
                        {(() => {
                          const IconComponent = stat.icon;
                          return <IconComponent className="w-6 h-6" />;
                        })()}
                      </div>
                      <motion.div 
                        className={`text-2xl font-bold mb-1 ${stat.color}`}
                        initial={{ scale: 0.8 }}
                        whileInView={{ scale: 1 }}
                        transition={{ delay: index * 0.05 + 0.3, type: "spring", damping: 20 }}
                        viewport={{ once: true }}
                      >
                        {stat.number}
                      </motion.div>
                      <p className="text-gray-600 font-medium text-xs">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="flex flex-col space-y-4">
                  <div className="flex items-center text-gray-700">
                    <GraduationCap className="w-6 h-6 mr-4 text-teal-500" />
                    <span className="font-medium">Multiple Industries</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <FileText className="w-6 h-6 mr-4 text-teal-500" />
                    <span className="font-medium">Agile Methodologies</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <ExternalLink className="w-6 h-6 mr-4 text-teal-500" />
                    <span className="font-medium">Remote & On-site</span>
                  </div>
                </div>

                <MotionButton
                  className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-2xl px-8 py-4 text-sm font-semibold flex items-center justify-center shadow-md will-change-transform"
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDownload}
                >
                  <Download className="w-5 h-5 mr-3" />
                  Download CV
                </MotionButton>
              </div>
            </motion.div>
          </div>

          {/* Optimized timeline */}
          <div className="w-full md:w-2/3 md:pl-16">
            <div className="relative">
              {experiences.map((exp, index) => (
                <TimelineItem
                  key={index}
                  {...exp}
                  index={index}
                  isLast={index === experiences.length - 1}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ExperienceSection;
