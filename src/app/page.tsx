'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { 
  FileText, 
  Shield,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import HeroSection from '@/components/landing/HeroSection';
import ProblemSection from '@/components/landing/ProblemSection';
import SolutionSection from '@/components/landing/SolutionSection';
import DifferentiatorSection from '@/components/landing/DifferentiatorSection';
import BenefitsSection from '@/components/landing/BenefitsSection';
import CaseStudySection from '@/components/landing/CaseStudySection';
import IntegrationSection from '@/components/landing/IntegrationSection';
import PricingSection from '@/components/landing/PricingSection';

export default function HomePage() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [, setActiveSection] = useState('hero');
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({ hero: true });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'problem', 'solution', 'differentiator', 'benefits', 'case-study', 'integrations', 'pricing'];
      
      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          const isInView = rect.top < window.innerHeight * 0.6 && rect.bottom > 0;
          
          setIsVisible(prev => ({
            ...prev,
            [section]: isInView
          }));

          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleGetStarted = () => {
    window.location.href = '/auth/login';
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" label="Loading..." />
      </div>
    );
  }

  // Show landing page for unauthenticated users
  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        {/* Sticky Navigation */}
        <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              {/* Logo */}
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('hero')}>
                <FileText className="w-8 h-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">Docko</span>
              </div>
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-8">
                <button
                  onClick={() => scrollToSection('solution')}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  How It Works
                </button>
                <button
                  onClick={() => scrollToSection('benefits')}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Benefits
                </button>
                <button
                  onClick={() => scrollToSection('pricing')}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Pricing
                </button>
                <button
                  onClick={() => scrollToSection('integrations')}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Enterprise
                </button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handleGetStarted}
                >
                  Get Started
                </Button>
              </div>
              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="md:hidden bg-white border-t border-gray-100"
              >
                <div className="px-6 py-4 flex flex-col items-center gap-4">
                  <button onClick={() => scrollToSection('solution')} className="text-gray-600 hover:text-gray-900 w-full py-2 text-lg">How It Works</button>
                  <button onClick={() => scrollToSection('benefits')} className="text-gray-600 hover:text-gray-900 w-full py-2 text-lg">Benefits</button>
                  <button onClick={() => scrollToSection('pricing')} className="text-gray-600 hover:text-gray-900 w-full py-2 text-lg">Pricing</button>
                  <button onClick={() => scrollToSection('integrations')} className="text-gray-600 hover:text-gray-900 w-full py-2 text-lg">Enterprise</button>
                  <Button onClick={handleGetStarted} className="w-full bg-blue-600 hover:bg-blue-700 text-lg">Get Started</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Page Sections */}
        <div className="pt-20">
          <HeroSection id="hero" isVisible={isVisible.hero} />
          <ProblemSection id="problem" isVisible={isVisible.problem} />
          <SolutionSection id="solution" isVisible={isVisible.solution} />
          <DifferentiatorSection id="differentiator" isVisible={isVisible.differentiator} />
          <BenefitsSection id="benefits" isVisible={isVisible.benefits} />
          <CaseStudySection id="case-study" isVisible={isVisible['case-study']} />
          <PricingSection id="pricing" isVisible={isVisible.pricing} />
          <IntegrationSection id="integrations" isVisible={isVisible.integrations} />
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-6">
            {/* Adjusted grid for better mobile responsiveness */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              <div className="sm:col-span-2 md:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-6 h-6 text-blue-400" />
                  <span className="text-lg font-semibold">Docko</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Transform your Word documents into intelligent templates. 
                  Simple, powerful document automation.
                </p>
                <div className="flex items-center gap-2 mt-4">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-300">Secure & Reliable</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white">Features</a></li>
                  <li><a href="#" className="hover:text-white">Pricing</a></li>
                  <li><a href="#" className="hover:text-white">Security</a></li>
                  <li><a href="#" className="hover:text-white">Integrations</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white">Documentation</a></li>
                  <li><a href="#" className="hover:text-white">Training</a></li>
                  <li><a href="#" className="hover:text-white">Contact</a></li>
                  <li><a href="#" className="hover:text-white">Help Center</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white">About</a></li>
                  <li><a href="#" className="hover:text-white">Blog</a></li>
                  <li><a href="#" className="hover:text-white">Privacy</a></li>
                  <li><a href="#" className="hover:text-white">Terms</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
              <p>&copy; 2024 Docko. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // This shouldn't render, but just in case
  return null;
}