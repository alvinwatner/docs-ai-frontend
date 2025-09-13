
import React, { useState } from 'react';
import { LandingSectionProps } from './types';
import { Button } from "@/components/ui/button";
import { Play, ArrowRight, FileText, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection({ id, isVisible }: LandingSectionProps) {
  const [, setIsPlaying] = useState(true);

  const handleDemo = () => {
    setIsPlaying(true);
    // In a real app, this would trigger a demo video or modal
  };

  return (
    <section id={id} className="relative py-20 lg:py-28 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 right-20 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-20"></div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-8 text-center lg:text-left"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Zap className="w-4 h-4" />
                  Save 40% of your team&apos;s time
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Turn Your Word Documents Into{' '}
                  <span className="text-blue-600 relative">
                    Powerful Templates
                    <div className="absolute -bottom-2 left-0 w-full h-1 bg-blue-200 rounded"></div>
                  </span>
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg md:text-xl text-gray-600 leading-relaxed"
              >
                Use the Microsoft Word you already know to automate document creation. 
                No learning required – just transform your existing documents into intelligent templates.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4 h-auto"
                onClick={handleDemo}
              >
                <Play className="w-5 h-5 mr-2" />
                See How It Works
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-8 py-4 h-auto border-2 hover:bg-gray-50"
              >
                Try With Your Document
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>

          </motion.div>

          {/* Right Column - Visual Demo */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="grid grid-cols-1 gap-6">
              {/* Before - Word Document */}
              <div className="relative bg-white rounded-xl shadow-2xl p-6 border">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-700">Your Word Template</span>
                </div>
                
                <div className="space-y-3 text-sm">
                  <p className="text-gray-800">
                    Dear <span className="bg-yellow-200 px-1 rounded text-blue-700 font-mono">{'{client_name}'}</span>,
                  </p>
                  <p className="text-gray-800">
                    Thank you for choosing our services. Your project on{' '}
                    <span className="bg-yellow-200 px-1 rounded text-blue-700 font-mono">{'{project_date}'}</span>{' '}
                    is now complete.
                  </p>
                  <p className="text-gray-800">
                    Total amount: <span className="bg-yellow-200 px-1 rounded text-blue-700 font-mono">{'{total_amount}'}</span>
                  </p>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="bg-blue-600 rounded-full p-3"
                >
                  <ArrowRight className="w-6 h-6 text-white rotate-90" />
                </motion.div>
              </div>

              {/* After - Generated Document */}
              <div className="relative bg-white rounded-xl shadow-2xl p-6 border">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-700">Generated Document</span>
                </div>
                
                <div className="space-y-3 text-sm">
                  <p className="text-gray-800">Dear <strong>Acme Corporation</strong>,</p>
                  <p className="text-gray-800">
                    Thank you for choosing our services. Your project on{' '}
                    <strong>March 15, 2024</strong> is now complete.
                  </p>
                  <p className="text-gray-800">
                    Total amount: <strong>$12,500.00</strong>
                  </p>
                </div>

                {/* Perfect formatting badge */}
                <div className="absolute -top-3 -right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Perfect Formatting ✓
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <motion.div
              animate={{ rotate: [0, 5, 0], y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute -top-4 -right-4 bg-blue-100 rounded-lg p-3"
            >
              <FileText className="w-6 h-6 text-blue-600" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
