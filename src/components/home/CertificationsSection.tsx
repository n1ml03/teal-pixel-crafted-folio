import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge.tsx";
import { ScrollReveal } from "@/components/ui/scroll-reveal.tsx";
import {
  ExternalLink,
  Calendar,
  Award
} from 'lucide-react';
import { MotionLink } from "@/components/ui/motion-link.tsx";

interface CertificationCardProps {
  title: string;
  issuer: string;
  date: string;
  description: string;
  image: string;
  credentialUrl?: string;
  skills?: string[];
  category?: string;
  skillLevels?: { skill: string; level: number }[];
  index: number;
}

const CertificationCard = ({
  title,
  issuer,
  date,
  description,
  image,
  credentialUrl,
  skills = [],
  category = "Technical",
  skillLevels = [],
  index
}: CertificationCardProps) => {
  return (
    <ScrollReveal
      delay={index * 0.1}
      className="w-full"
    >
      <motion.div
        className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 h-full"
        whileHover={{ y: -5, boxShadow: "0 15px 30px -5px rgba(0, 0, 0, 0.1)" }}
      >
        <div className="flex flex-col h-full">
          {/* Certificate header with logo */}
          <div className="p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-gray-50 p-2 flex items-center justify-center overflow-hidden flex-shrink-0">
              <img
                src={image}
                alt={`${issuer} logo`}
                className="w-8 h-8 object-contain"
              />
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
              </div>
              <div className="flex items-center text-gray-500 text-sm">
                <Calendar className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                <span>{date}</span>
              </div>
              <div className="text-sm font-medium text-teal-600 mt-1">{issuer}</div>
              <Badge
                variant="outline"
                className="mt-2 bg-gray-50 text-gray-600 border-gray-200"
              >
                {category}
              </Badge>
            </div>
          </div>

          {/* Certificate content - fixed */}
          <div className="px-6 pb-6 flex-grow flex flex-col">
            <div className="flex-grow">
              <p className="text-gray-600 text-sm mb-4">{description}</p>

              {/* Skills tags */}
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {skills.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-teal-50 text-teal-700 text-xs px-3 py-1 rounded-full flex items-center"
                    >
                      <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-1.5"></span>
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {/* Skill levels with progress bars */}
              {skillLevels.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Skill Proficiency</h4>
                  {skillLevels.map((skillLevel, i) => (
                    <div key={i} className="mb-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-gray-600">{skillLevel.skill}</span>
                        <span className="text-xs font-medium text-gray-500">{skillLevel.level}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <motion.div
                          className="bg-teal-500 h-1.5 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${skillLevel.level}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Credential link - fixed at bottom */}
            {credentialUrl && (
              <div className="mt-auto pt-4 border-t border-gray-100">
                <MotionLink
                  href={credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
                  whileHover={{ x: 3 }}
                >
                  View Certificate <ExternalLink className="ml-1 h-3.5 w-3.5" />
                </MotionLink>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </ScrollReveal>
  );
};

const CertificationsSection = () => {
  // Sample certifications data with categories and skill levels
  const certifications = [
    {
    title: "Advanced Game Testing Certification",
    issuer: "Global Game QA Institute",
    date: "2024",
    description: "Certification focused on specialized testing for game applications, covering UI/UX testing, performance benchmarking, and multiplayer sync issues.",
    image: "./images/istqb.svg",
    credentialUrl: "./NotFound",
    skills: ["Game Testing", "Performance Testing", "Multiplayer QA"],
    category: "Testing",
    skillLevels: [
      { skill: "Game Testing", level: 90 },
      { skill: "Performance Testing", level: 80 },
      { skill: "Multiplayer QA", level: 75 }
    ]
  },
    {
    title: "AI-Powered Test Automation Specialist",
    issuer: "NextGen QA Academy",
    date: "2025",
    description: "Certification for leveraging AI in software testing, including test script generation, smart defect prediction, and visual regression using machine learning.",
    image: "./images/ai.webp",
    credentialUrl: "./NotFound",
    skills: ["AI Testing", "ML-based Automation", "Visual Regression"],
    category: "Testing",
    skillLevels: [
      { skill: "AI Testing", level: 85 },
      { skill: "ML-based Automation", level: 80 },
      { skill: "Visual Regression", level: 70 }
    ]
  },
    {
      title: "Data Science Fundamentals",
      issuer: "DataCamp",
      date: "2022",
      description: "Comprehensive certification covering data analysis, visualization, and machine learning fundamentals with Python and related libraries.",
      image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
      credentialUrl: "./NotFound",
      skills: ["Python", "Data Analysis", "Machine Learning"],
      category: "Data Science",
      skillLevels: [
        { skill: "Python", level: 80 },
        { skill: "Data Analysis", level: 75 },
        { skill: "Machine Learning", level: 65 }
      ]
    }
  ];

  return (
    <section id="certifications" className="py-24">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.h2
            className="text-4xl font-bold mb-4 text-gray-800 relative inline-block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-teal-400">
              Certifications
            </span>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-teal-500 rounded-full"></div>
          </motion.h2>
          <motion.p
            className="text-gray-600 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Professional certifications that demonstrate my expertise and technical skills in the field.
          </motion.p>
        </div>

        {/* Certifications grid */}
        <div className="mb-16">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center">
              <Award className="w-6 h-6 mr-2 text-teal-500" />
              Professional Certifications
            </h3>
          </div>

          {/* Certifications grid */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {certifications.map((cert, index) => (
              <CertificationCard key={cert.title} {...cert} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;
