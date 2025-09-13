import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LandingSectionProps } from './types';
import { Table, Plus, Layers } from 'lucide-react';

export default function DifferentiatorSection({ id, isVisible }: LandingSectionProps) {
  const [activeTab, setActiveTab] = useState('basic');

  return (
    <section id={id} className="py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Layers className="w-4 h-4" />
            What Makes Us Different
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Beyond Simple Variables:{' '}
            <span className="text-purple-600">Repeating Sections</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Others stop at basic text replacement. We&apos;re the only solution that handles 
            complex repeating sections with dynamic content structures.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-white p-2 rounded-xl shadow-lg border">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('basic')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${ 
                  activeTab === 'basic'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Simple Variables
              </button>
              <button
                onClick={() => setActiveTab('sections')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === 'sections'
                    ? 'bg-purple-100 text-purple-900 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Section Variables
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - What Others Do */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {activeTab === 'basic' ? 'What Everyone Else Does' : 'Where Others Completely Fail'}
              </h3>
              <p className="text-gray-600 mb-6">
                {activeTab === 'basic' 
                  ? 'Basic find-and-replace functionality for simple text substitution.'
                  : 'Competitors don&apos;t even support repeating sections. They simply can&apos;t handle complex document structures.'
                }
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-red-100">
              {activeTab === 'basic' ? (
                <div className="space-y-3">
                  <div className="text-sm text-gray-500 mb-2">Basic Text Replacement:</div>
                  <p className="text-gray-800">
                    Dear <span className="bg-blue-100 px-1 rounded">John Smith</span>,
                  </p>
                  <p className="text-gray-800">
                    Your order <span className="bg-blue-100 px-1 rounded">#12345</span> is ready.
                  </p>
                  <p className="text-gray-800">
                    Total: <span className="bg-blue-100 px-1 rounded">$99.99</span>
                  </p>
                  <div className="text-xs text-gray-500 mt-4 p-2 bg-gray-50 rounded">
                    ✓ Works for simple substitutions only
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-sm text-gray-500 mb-2">Trying to Handle Sections:</div>
                  <div className="border border-red-200 rounded p-3 bg-red-50">
                    <h4 className="font-semibold text-red-700 mb-2">Project Details</h4>
                    <div className="text-red-600 text-sm space-y-1">
                      <div>❌ ERROR: Cannot repeat content</div>
                      <div>❌ ERROR: Manual table creation required</div>
                      <div>❌ ERROR: No section variables support</div>
                    </div>
                  </div>
                  <div className="text-xs text-red-600 p-2 bg-red-50 rounded">
                    ❌ Competitors literally don&apos;t support this at all
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Column - What We Do */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {activeTab === 'basic' ? 'What Docko Does Better' : 'How Docko Revolutionizes Documents'}
              </h3>
              <p className="text-gray-600 mb-6">
                {activeTab === 'basic' 
                  ? 'Everything others do, plus intelligent formatting and perfect layout.'
                  : 'Revolutionary section variables that let you repeat complex content structures with titles, subtitles, and dynamic tables.'
                }
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-100">
              {activeTab === 'basic' ? (
                <div className="space-y-3">
                  <div className="text-sm text-gray-500 mb-2">Docko Enhanced:</div>
                  <p className="text-gray-800">
                    Dear <span className="bg-green-100 px-1 rounded font-semibold">John Smith</span>,
                  </p>
                  <p className="text-gray-800">
                    Your order <span className="bg-green-100 px-1 rounded font-semibold">#12345</span> shipped on <span className="bg-green-100 px-1 rounded font-semibold">March 15, 2024</span>.
                  </p>
                  <p className="text-gray-800">
                    Total: <span className="bg-green-100 px-1 rounded font-semibold">$99.99</span> 
                    <span className="text-sm text-gray-500">(tax included)</span>
                  </p>
                  <div className="text-xs text-green-600 mt-4 p-2 bg-green-50 rounded">
                    ✓ Perfect formatting • ✓ Professional appearance • ✓ Context-aware
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-sm text-gray-500 mb-2">Docko Section Variable Output:</div>
                  
                  {/* Section 1 */}
                  <div className="border border-green-200 rounded p-3 bg-green-50">
                    <h4 className="font-bold text-green-900 mb-1">Website Development</h4>
                    <p className="text-sm text-green-700 mb-2">Complete website design and development package</p>
                    <table className="w-full text-xs">
                      <tbody>
                        <tr><td className="py-1">Frontend Development</td><td className="text-right py-1">$5,000</td></tr>
                        <tr><td className="py-1">Backend Development</td><td className="text-right py-1">$4,000</td></tr>
                        <tr><td className="py-1">Design System</td><td className="text-right py-1">$2,000</td></tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Section 2 */}
                  <div className="border border-green-200 rounded p-3 bg-green-50">
                    <h4 className="font-bold text-green-900 mb-1">Training & Support</h4>
                    <p className="text-sm text-green-700 mb-2">Comprehensive training and ongoing support</p>
                    <table className="w-full text-xs">
                      <tbody>
                        <tr><td className="py-1">Team Training</td><td className="text-right py-1">$1,500</td></tr>
                        <tr><td className="py-1">Documentation</td><td className="text-right py-1">$800</td></tr>
                        <tr><td className="py-1">Support (6 months)</td><td className="text-right py-1">$1,200</td></tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-green-600 p-2 bg-green-50 rounded">
                    <Plus className="w-3 h-3" />
                    <span>Users can add unlimited sections like these</span>
                  </div>
                  
                  <div className="text-xs text-green-600 p-2 bg-green-50 rounded">
                    ✓ Dynamic sections • ✓ Perfect formatting • ✓ Unlimited content
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Section Variables Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16"
        >
          <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl p-8 text-white max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Layers className="w-8 h-8" />
                <h3 className="text-2xl font-bold">
                  Section Variables: The Game Changer
                </h3>
              </div>
              <p className="text-xl text-purple-100">
                Each section variable can contain a title, subtitle, and a dynamic table. 
                Users can add as many sections as needed, with unlimited rows in each table.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Table className="w-5 h-5" />
                  Current: Section Tables
                </h4>
                <ul className="text-purple-100 space-y-2 text-sm">
                  <li>• Title + Subtitle + 3-column table</li>
                  <li>• Borderless design</li>
                  <li>• Unlimited rows per table</li>
                  <li>• Perfect formatting automatically</li>
                </ul>
              </div>
              
              <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Coming Soon
                </h4>
                <ul className="text-purple-100 space-y-2 text-sm">
                  <li>• Custom section layouts</li>
                  <li>• Image + text combinations</li>
                  <li>• Multi-column formats</li>
                  <li>• Build your own section types</li>
                </ul>
              </div>
            </div>

            <div className="text-center mt-6">
              <div className="bg-white/20 backdrop-blur rounded-lg px-6 py-3 inline-block">
                <span className="font-semibold">Only Docko supports repeating sections - competitors can&apos;t even compete</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}