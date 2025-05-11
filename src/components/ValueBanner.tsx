import { motion } from 'framer-motion';
import { Code, FileCode, GitBranch, Layers, Server, TestTube } from 'lucide-react';

const ValueBanner = () => {
  // Tech stack logos using Lucide icons
  const techStack = [
    { id: 1, name: "TypeScript", icon: Code },
    { id: 2, name: "React", icon: Layers },
    { id: 3, name: "Node.js", icon: Server },
    { id: 4, name: "Jest", icon: TestTube },
    { id: 5, name: "Cypress", icon: GitBranch },
    { id: 6, name: "JIRA", icon: FileCode },
    { id: 7, name: "Flaywright", icon: FileCode }

  ];

  return (
    <div className="flex justify-center my-12 md:my-16">
      <section className="py-16 md:py-20 text-white rounded-3xl shadow-xl max-w-6xl mx-4 relative overflow-hidden bg-gradient-to-r from-teal-500 to-teal-600">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10 px-8 md:px-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12 max-w-3xl mx-auto text-center"
          >
            My mission is to deliver high-quality software solutions through meticulous development and comprehensive testing.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ staggerChildren: 0.2, delayChildren: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-6 md:gap-8 max-w-3xl mx-auto"
          >
            {techStack.map((tech) => (
              <motion.div
                key={tech.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="h-10 md:h-12 bg-white/20 px-4 py-2 rounded-full hover:bg-white/30 transition-all duration-300 flex items-center gap-2 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <tech.icon
                  className="h-5 w-5 text-white"
                  aria-label={tech.name}
                />
                <span className="text-sm font-medium">{tech.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ValueBanner;
