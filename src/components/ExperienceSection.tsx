
import { motion } from 'framer-motion';
import { MotionButton } from "@/components/ui/motion-button";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  GraduationCap
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
  return (
    <div className="relative pl-8 pb-12">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-4 top-6 w-0.5 h-full bg-gradient-to-b from-teal-500 to-teal-100 transform -translate-x-1/2"></div>
      )}

      {/* Timeline dot */}
      <div className="absolute left-4 top-6 w-8 h-8 rounded-full bg-white border-2 border-teal-500 flex items-center justify-center transform -translate-x-1/2 z-10">
        <Briefcase className="w-4 h-4 text-teal-500" />
      </div>

      {/* Card content */}
      <motion.div
        className="bg-white p-6 rounded-xl shadow-md border border-gray-100 ml-4"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        viewport={{ once: true }}
        whileHover={{
          y: -5,
          boxShadow: "0 15px 30px -5px rgba(0, 0, 0, 0.1)",
          borderColor: "rgba(20, 184, 166, 0.3)"
        }}
      >
        <div className="flex items-center mb-3">
          <div className="w-12 h-12 rounded-lg bg-gray-50 p-2 flex items-center justify-center mr-4 overflow-hidden">
            <img
              src={logo}
              alt={company}
              className="w-8 h-8 object-contain"
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{company}</h3>
            <div className="flex items-center text-gray-500 text-sm">
              <Calendar className="w-3.5 h-3.5 mr-1" />
              <span>{period}</span>
            </div>
          </div>
        </div>

        <h4 className="text-lg font-medium mb-3 text-teal-600">{title}</h4>

        <p className="text-gray-600 mb-4 text-sm leading-relaxed">{description}</p>

        {achievements.length > 0 && (
          <div className="mb-4">
            <h5 className="text-sm font-medium mb-2 text-gray-700 flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-1 text-teal-500" />
              Key Achievements
            </h5>
            <ul className="space-y-1">
              {achievements.map((achievement, i) => (
                <li key={i} className="text-sm text-gray-600 flex items-start">
                  <span className="text-teal-500 mr-2 text-xs mt-1">•</span>
                  {achievement}
                </li>
              ))}
            </ul>
          </div>
        )}

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {skills.map((skill, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="bg-teal-50 text-teal-700 hover:bg-teal-100"
              >
                {skill}
              </Badge>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

const ExperienceSection = () => {
  const experiences = [
  {
    logo: "./images/koeitecmo.svg",
    company: "Koei Tecmo Software Vietnam",
    title: "QA Engineer",
    period: "2025 - Present",
    description: "Conducted game testing and quality assurance for popular Koei Tecmo titles. Collaborated with development teams to ensure smooth user experiences and bug-free releases.",
    achievements: [
      "Detected and reported over 300 bugs in DOAXVV and other mobile game projects",
      "Built automated UI test cases, increasing testing efficiency by 35%",
      "Integrated OCR and template matching tools into QA workflow for Japanese UI verification"
    ],
    skills: ["Game Testing", "Bug Reporting", "JIRA", "Manual Testing", "Automation Testing"]
  },
  {
  logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/playwright/playwright-original.svg",
  company: "Self-Study Project",
  title: "Automation Testing Learner",
  period: "2024 - 2025",
  description: "Independently studied and practiced automation testing for web applications using modern tools and frameworks. Emphasized test planning, script development, and defect tracking workflows.",
  achievements: [
    "Built and executed automated test cases for UI and functional flows using Playwright and Selenium",
    "Designed test plans and traceability matrices in Zephyr for structured test management",
    "Reported and tracked issues efficiently using JIRA, aligning with agile QA practices"
  ],
  skills: ["Playwright", "Selenium", "JIRA", "Zephyr", "Test Automation"]
},
  {
  logo: "./images/hus.svg",
  company: "VNU-HN University of Science",
  title: "Student - Data Science",
  period: "2021 - 2025",
  description: "Final-year Data Science student with hands-on experience in manual testing and data analysis. Focused on applying statistical and programming knowledge to real-world software testing and QA workflows.",
  achievements: [
    "Graduation thesis: Developed a system to recognize Japanese text from game screenshots and match with structured datasets for QA validation",
    "Collaborated on a research project integrating YOLOv5 and Tesseract OCR to automate UI testing in game applications",
    "Completed a Web Testing project with 500+ test cases on an e-commerce platform, improving system stability by 20%"
  ],
  skills: ["Python", "Pandas", "Matplotlib", "Data Visualization", "Statistical Analysis"]
}
];

  return (
    <section id="experience" className="py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/3 mb-12 md:mb-0 md:sticky md:top-24 md:self-start">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-4 text-gray-800 relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-teal-400">
                  Professional Experience
                </span>
                <div className="absolute -bottom-2 left-0 w-16 h-1 bg-teal-500 rounded-full"></div>
              </h2>

              <p className="text-gray-600 leading-relaxed">
                My professional journey spans QA engineering and full-stack development,
                with expertise in test automation, React, Node.js, and cloud technologies.
              </p>

              <div className="flex flex-col space-y-3">
                <div className="flex items-center text-gray-700">
                  <GraduationCap className="w-5 h-5 mr-3 text-teal-500" />
                  <span>1+ Years Experience</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <FileText className="w-5 h-5 mr-3 text-teal-500" />
                  <span>Multiple Industries</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <ExternalLink className="w-5 h-5 mr-3 text-teal-500" />
                  <span>Remote & On-site</span>
                </div>
              </div>

              <MotionButton
                className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-6 py-3 text-sm font-medium mt-4 flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  // Create a link to download the CV
                  const link = document.createElement('a');
                  link.href = '/CV Le Van Nam - Intern Tester.pdf';
                  link.download = 'CV_Le_Van_Nam.pdf';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Download CV
              </MotionButton>
            </motion.div>
          </div>

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
    </section>
  );
};

export default ExperienceSection;
