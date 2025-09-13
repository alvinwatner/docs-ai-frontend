
import React, { useState } from 'react';
import { LandingSectionProps } from './types';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, ArrowRight, FileText, Mail, Phone } from 'lucide-react';

export default function CTASection({ id, isVisible }: LandingSectionProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // In a real app, this would submit to your backend
  };

  return (
    <section id={id} className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <FileText className="w-4 h-4" />
            Start Your Transformation
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Start With{' '}
            <span className="text-blue-600">What You Know</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            No complex setup. No training required. Use your existing Word documents 
            and see results in minutes, not months.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Option 1 - Try With Your Document */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-2xl p-8 shadow-lg border-2 border-blue-200"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Try With Your Own Document
              </h3>
              <p className="text-gray-600">
                Upload your existing Word document and see Docko in action. 
                Free trial, no credit card required.
              </p>
            </div>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Enter your work email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 text-lg"
                  required
                />
                <Button 
                  type="submit"
                  className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </form>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="text-green-600 font-semibold mb-2">Thanks for your interest!</div>
                <p className="text-green-700 text-sm">
                  We&apos;ll send you trial access within 24 hours.
                </p>
              </div>
            )}

            <div className="mt-6 text-center">
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ 14-day free trial</li>
                <li>✓ No credit card required</li>
                <li>✓ Full feature access</li>
                <li>✓ Personal onboarding call</li>
              </ul>
            </div>
          </motion.div>

          {/* Option 2 - See a Demo */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl p-8 shadow-lg text-white"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">
                See a Personal Demo
              </h3>
              <p className="text-purple-100">
                Perfect for teams who want guidance. We&apos;ll show you exactly how 
                Docko works with your specific use case.
              </p>
            </div>

            <Button 
              variant="secondary"
              className="w-full h-12 text-lg bg-white text-purple-600 hover:bg-gray-100"
            >
              <Phone className="w-5 h-5 mr-2" />
              Schedule 15-Min Demo
            </Button>

            <div className="mt-6 text-center">
              <ul className="text-sm text-purple-100 space-y-1">
                <li>✓ Personalized walkthrough</li>
                <li>✓ Custom use case discussion</li>
                <li>✓ ROI calculation for your team</li>
                <li>✓ Implementation roadmap</li>
              </ul>
            </div>

            <div className="mt-6 bg-white/10 rounded-lg p-4">
              <p className="text-sm text-center text-purple-100">
                &ldquo;The demo showed us exactly how we could save $200K annually. 
                Best 15 minutes we&apos;ve invested.&rdquo;
              </p>
              <p className="text-xs text-center text-purple-200 mt-2">
                - Director of Operations, 300-person company
              </p>
            </div>
          </motion.div>
        </div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto border">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Questions? We&apos;re Here to Help
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div className="text-center sm:text-left">
                  <div className="font-semibold text-gray-900">+628 21 3882 3663</div>
                  <div className="text-sm text-gray-600">Mon-Fri, 8am-6pm WIB</div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div className="text-center sm:text-left">
                  <div className="font-semibold text-gray-900">sales@docko.com</div>
                  <div className="text-sm text-gray-600">Response within 2 hours</div>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
