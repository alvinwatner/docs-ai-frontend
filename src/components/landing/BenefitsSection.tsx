import React from 'react';
import { motion } from 'framer-motion';
import { LandingSectionProps } from './types';
import { Zap, Users, Layers, Maximize } from 'lucide-react';

export default function BenefitsSection({ id, isVisible }: LandingSectionProps) {
  const benefits = [
    {
      icon: Layers,
      title: "Smart Content Grouping",
      description: "Keep related content together on the same page - headers with their first paragraph, complete paragraphs that don't split across pages",
      feature: "Content Grouping"
    },
    {
      icon: Maximize,
      title: "Perfect Line Spacing",
      description: "Exactly one line break after each content group - no more, no less. Consistent spacing throughout your document",
      feature: "Line Break Control"
    },
    {
      icon: Zap,
      title: "Lightning Fast & Deterministic",
      description: "Formatting happens in milliseconds with consistent, predictable results every single time",
      feature: "Speed & Reliability"
    }
  ];

  return (
    <section id={id} className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Intelligent Auto-Formatting
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Professional Formatting{' '}
            <span className="text-blue-400">Automatically</span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our advanced formatting engine ensures your documents look perfect every time, 
            with smart content grouping and consistent spacing.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700"
            >
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <benefit.icon className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
              <p className="text-gray-300 mb-4">{benefit.description}</p>
              <div className="text-xs text-blue-400 font-medium">{benefit.feature}</div>
            </motion.div>
          ))}
        </div>

        {/* Detailed Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid lg:grid-cols-2 gap-8"
        >
          {/* Without Auto-Formatting */}
          <div className="bg-gray-800 rounded-xl p-6 border border-red-500/30">
            <h4 className="text-lg font-semibold text-red-400 mb-4">❌ Without Smart Formatting</h4>
            <div className="space-y-3 text-sm">
              <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
                <ul className="text-gray-300 space-y-1">
                  <li>• Headers separated from their content</li>
                  <li>• Paragraphs split awkwardly across pages</li>
                  <li>• Inconsistent spacing everywhere</li>
                  <li>• Manual formatting required</li>
                  <li>• Time-consuming layout fixes</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* With Auto-Formatting */}
          <div className="bg-gray-800 rounded-xl p-6 border border-green-500/30">
            <h4 className="text-lg font-semibold text-green-400 mb-4">✅ Docko Smart Formatting</h4>
            <div className="space-y-3 text-sm">
              <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
                <ul className="text-gray-300 space-y-1">
                  <li>• Headers always stay with their first paragraph</li>
                  <li>• Complete paragraphs never split across pages</li>
                  <li>• Exactly one line break after each content group</li>
                  <li>• Perfect layout automatically</li>
                  <li>• Consistent professional appearance</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Custom Content Groups */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Users className="w-8 h-8" />
              <h3 className="text-2xl font-bold">
                Custom Content Grouping
              </h3>
            </div>
            <p className="text-blue-100 text-lg mb-6">
              Need specific content to stay together? Define your own content groups for 
              ultimate control over document layout and formatting.
            </p>
            <div className="bg-white/20 backdrop-blur rounded-lg px-6 py-3 inline-block">
              <span className="font-semibold">Advanced formatting controls coming soon</span>
            </div>
          </div>
        </motion.div>

        {/* Technical Details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mt-12"
        >
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
            <h3 className="text-xl font-semibold mb-6 text-center">How Our Auto-Formatting Works</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-blue-400 mb-3 flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  Content Grouping Rules
                </h4>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li><strong>Header + Paragraph:</strong> Headers never appear alone at the bottom of a page</li>
                  <li><strong>Complete Paragraphs:</strong> Paragraphs start and end on the same page</li>
                  <li><strong>Custom Groups:</strong> You define what content belongs together</li>
                  <li><strong>Smart Tables:</strong> Tables don&apos;t break at awkward points</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-blue-400 mb-3 flex items-center gap-2">
                  <Maximize className="w-5 h-5" />
                  Line Break Management
                </h4>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li><strong>After Paragraphs:</strong> Always exactly one line break</li>
                  <li><strong>After Lists:</strong> Consistent spacing, never multiple breaks</li>
                  <li><strong>After Images:</strong> Proper spacing maintained</li>
                  <li><strong>After Tables:</strong> Clean separation from next content</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-lg text-sm">
                <Zap className="w-4 h-4" />
                <span>Processing time: &lt;100ms • Results: 100% consistent</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}