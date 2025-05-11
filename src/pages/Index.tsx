
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ValueBanner from '@/components/ValueBanner';
import ServicesSection from '@/components/ServicesSection';
import ProjectsSection from '@/components/ProjectsSection';
import ExperienceSection from '@/components/ExperienceSection';
import CertificationsSection from '@/components/CertificationsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import EnhancedBackground from '@/components/utils/EnhancedBackground.tsx';
import SectionBackground from '@/components/utils/SectionBackground.tsx';

const Index = () => {
  return (
    <div className="min-h-screen relative">
      {/* Global background with parallax effect */}
      <EnhancedBackground />

      <Header />

      <main id="main-content" className="relative z-0">
        {/* Hero section with dedicated background */}
        <SectionBackground sectionId="hero-section" variant="hero">
          <Hero />
          <ValueBanner />
        </SectionBackground>

        {/* Services section with dedicated background */}
        <SectionBackground sectionId="services-section" variant="services">
          <ServicesSection />
        </SectionBackground>

        {/* Projects section with dedicated background */}
        <SectionBackground sectionId="projects-section" variant="projects">
          <ProjectsSection />
        </SectionBackground>

        {/* Experience section with dedicated background */}
        <SectionBackground sectionId="experience-section" variant="experience">
          <ExperienceSection />
        </SectionBackground>

        {/* Certifications section with dedicated background */}
        <SectionBackground sectionId="certifications-section" variant="certifications">
          <CertificationsSection />
        </SectionBackground>

        {/* Contact section with dedicated background */}
        <SectionBackground sectionId="contact-section" variant="contact">
          <ContactSection />
        </SectionBackground>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
