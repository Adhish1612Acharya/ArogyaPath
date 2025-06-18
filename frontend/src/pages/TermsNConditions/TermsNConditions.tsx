import React, { useState, useEffect } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import ScrollTopButton from '../../components/TermsNConditions/ScrollTopButton';
import TableOfContents from '../../components/TermsNConditions/TableOfContents.tsx';
import TermsHeader from '../../components/TermsNConditions/TermsHeader.tsx';
import TermsSections from '../../components/TermsNConditions/TermsSections.tsx';
import AcceptanceSection from '../../components/TermsNConditions/AcceptanceSection.tsx';

const TermsNConditions: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.9]);
  const scale = useTransform(scrollYProgress, [0, 0.1], [1, 0.98]);

  const sections = [
    { id: 'eligibility', title: 'Eligibility' },
    { id: 'services', title: 'Our Services' },
    { id: 'user-data', title: 'User Data and Privacy' },
    { id: 'responsibilities', title: 'User Responsibilities' },
    { id: 'community', title: 'Community Guidelines' },
    { id: 'disclaimer', title: 'Medical Disclaimer' },
    { id: 'third-party', title: 'Third-Party Links' },
    { id: 'ip', title: 'Intellectual Property' },
    { id: 'termination', title: 'Account Termination' },
    { id: 'modifications', title: 'Modifications' },
    { id: 'governing-law', title: 'Governing Law' },
    { id: 'contact', title: 'Contact Us' },
  ];

  // Scroll to top handler
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Check scroll position for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection observer for TOC highlighting
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5, rootMargin: '-100px 0px -50% 0px' }
    );

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Box sx={{ 
      position: 'relative',
      minHeight: '100vh',
      bgcolor: 'background.default',
    }}>
      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <ScrollTopButton onClick={scrollToTop} />
        )}
      </AnimatePresence>

      {/* Sidebar TOC (Desktop only) */}
      {!isMobile && (
        <TableOfContents 
          sections={sections} 
          activeSection={activeSection} 
          scrollToSection={scrollToSection} 
        />
      )}

      {/* Main Content */}
      <Box sx={{
        width: { xs: '100vw', md: 'calc(100vw - 260px)' },
        maxWidth: { xs: '100vw', md: 'calc(100vw - 260px)' },
        mx: 0,
        px: { xs: 2, sm: 4, md: 6 },
        py: { xs: 4, md: 6 },
        ml: { xs: 0, md: '260px' },
        boxSizing: 'border-box',
        overflowX: 'auto',
      }}>
        <TermsHeader />
        
        <motion.div style={{ opacity, scale }}>
          <TermsSections />
          <AcceptanceSection />
        </motion.div>
      </Box>
    </Box>
  );
};

export default TermsNConditions;