import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge.tsx";
import { ScrollReveal } from "@/components/ui/scroll-reveal.tsx";
import {
  ExternalLink,
  Calendar,
  Award,
  Sparkles,
  Target,
  CheckCircle,
  Book,
  Trophy,
  Zap
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
  index
}: CertificationCardProps) => {

  return (
    <ScrollReveal
      delay={index * 0.05}
      className="w-full"
    >
      <div
        className="relative bg-white/90 rounded-2xl overflow-hidden shadow-lg border border-white/30 h-full transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1"
        style={{ 
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)'
        }}
      >
        {/* Simplified background */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50/40 via-white to-blue-50/30" />
        
        {/* Single decorative element */}
        <div className="absolute -right-6 -top-6 w-12 h-12 bg-gradient-to-br from-teal-100/40 to-teal-50/60 rounded-full opacity-50" />

        <div className="flex flex-col h-full relative z-10">
          {/* Certificate header */}
          <div className="p-6 flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-white/95 p-2.5 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md border border-white/40">
              <img
                src={image}
                alt={`${issuer} logo`}
                className="w-9 h-9 object-contain"
                loading="lazy"
              />
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-gray-800 leading-tight line-clamp-2">
                  {title}
                </h3>
                <Badge
                  variant="outline"
                  className="bg-white/80 text-teal-600 border-teal-200/60 px-2.5 py-1 font-medium text-xs"
                >
                  {category}
                </Badge>
              </div>
              <div className="flex items-center text-gray-500 text-sm mb-2">
                <Calendar className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                <span>{date}</span>
              </div>
              <div className="text-sm font-semibold text-teal-600 mb-2">{issuer}</div>
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border-0 px-2.5 py-1 text-xs"
              >
                <Trophy className="w-3 h-3 mr-1" />
                Certified
              </Badge>
            </div>
          </div>

          {/* Certificate content */}
          <div className="px-6 pb-6 flex-grow flex flex-col">
            <div className="flex-grow">
              <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">{description}</p>

              {/* Skills tags */}
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {skills.map((skill, i) => (
                    <div
                      key={i}
                      className="transition-transform duration-200 hover:scale-105"
                    >
                      <Badge
                        variant="outline"
                        className="bg-teal-50/80 text-teal-700 border-teal-200/60 px-2.5 py-1 text-xs hover:bg-teal-100/80 transition-colors duration-200"
                      >
                        <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-1.5"></div>
                        {skill}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Credential link */}
            {credentialUrl && (
              <div className="mt-auto pt-4 border-t border-gray-100/60">
                <MotionLink
                  href={credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-semibold text-teal-600 hover:text-teal-700 bg-teal-50/80 px-3 py-2 rounded-xl border border-teal-200/60 hover:bg-teal-100/80 transition-all duration-200"
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <CheckCircle className="mr-2 h-3.5 w-3.5" />
                  View Certificate 
                  <ExternalLink className="ml-2 h-3.5 w-3.5" />
                </MotionLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

const CertificationsSection = () => {
  // Memoize certifications data to prevent re-renders
  const certifications = useMemo(() => [
    {
      title: "Advanced Game Testing Certification",
      issuer: "Global Game QA Institute",
      date: "2024",
      description: "Comprehensive certification focused on specialized testing methodologies for game applications, covering advanced UI/UX testing, performance benchmarking, and multiplayer synchronization issues.",
      image: "./images/istqb.svg",
      credentialUrl: "./NotFound",
      skills: ["Game Testing", "Performance Testing", "Multiplayer QA", "UI/UX Testing"],
      category: "Game Testing"
    },
    {
      title: "AI-Powered Test Automation Specialist",
      issuer: "NextGen QA Academy",
      date: "2025",
      description: "Advanced certification program for leveraging artificial intelligence in software testing, including intelligent test script generation, smart defect prediction algorithms, and visual regression testing using machine learning frameworks.",
      image: "./images/ai.webp",
      credentialUrl: "./NotFound",
      skills: ["AI Testing", "ML-based Automation", "Visual Regression", "Smart Analytics"],
      category: "AI Testing"
    },
    {
      title: "Data Science Fundamentals",
      issuer: "DataCamp Professional",
      date: "2022",
      description: "Comprehensive certification program covering advanced data analysis methodologies, statistical modeling, data visualization techniques, and machine learning fundamentals using Python and specialized analytics libraries.",
      image: "./images/python.svg",
      credentialUrl: "./NotFound",
      skills: ["Python", "Data Analysis", "Machine Learning", "Statistical Modeling"],
      category: "Data Science"
    }
  ], []);

  const stats = useMemo(() => [
    { icon: Award, number: "3+", label: "Certifications", color: "text-yellow-500" },
    { icon: Target, number: "85%", label: "Avg. Score", color: "text-green-500" },
    { icon: Book, number: "12+", label: "Skills Covered", color: "text-blue-500" },
    { icon: Zap, number: "100%", label: "Completion Rate", color: "text-purple-500" }
  ], []);

  return (
    <section 
      id="certifications" 
      className="py-20 relative overflow-hidden"
    >
      {/* Simplified static background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50/30 via-blue-50/20 to-purple-50/30" />
        
        {/* Static decorative elements */}
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-gradient-to-tr from-yellow-100/20 to-orange-100/20 opacity-60" />
        <div className="absolute bottom-20 left-20 w-48 h-48 rounded-2xl bg-gradient-to-tr from-teal-100/20 to-cyan-100/20 opacity-50" />
      </div>

      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.div
            className="inline-flex items-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Badge 
              variant="outline" 
              className="px-4 py-2 text-sm font-medium bg-white/90 border-teal-200/60 text-teal-700"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Professional Achievements
            </Badge>
          </motion.div>

          <motion.h2
            className="text-4xl lg:text-5xl font-bold mb-6 relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600">
              Certifications & Skills
            </span>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full" />
          </motion.h2>

          <motion.p
            className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Professional certifications and achievements that demonstrate my expertise and commitment to 
            <span className="text-teal-600 font-semibold"> continuous learning and excellence</span> in technology.
          </motion.p>
        </div>

        {/* Statistics section */}
        <motion.div
          className="bg-white/80 rounded-2xl p-8 border border-white/40 shadow-lg mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 + 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -3 }}
              >
                <div className={`w-14 h-14 mx-auto mb-3 rounded-xl bg-white shadow-md flex items-center justify-center group-hover:shadow-lg transition-shadow duration-200 ${stat.color}`}>
                  {(() => {
                    const IconComponent = stat.icon;
                    return <IconComponent className="w-7 h-7" />;
                  })()}
                </div>
                <div className={`text-2xl font-bold mb-1 ${stat.color}`}>
                  {stat.number}
                </div>
                <p className="text-gray-600 font-medium text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Certifications section */}
        <div className="mb-16">
          <motion.div 
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gray-800 flex items-center justify-center">
              <Award className="w-7 h-7 mr-3 text-teal-500" />
              Professional Certifications
            </h3>
          </motion.div>

          {/* Certifications grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
