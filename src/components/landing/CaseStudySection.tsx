import React from 'react';
import { motion } from 'framer-motion';
import { LandingSectionProps } from './types';
import { TrendingUp, Users, DollarSign, Clock } from 'lucide-react';

export default function CaseStudySection({ id, isVisible }: LandingSectionProps) {
  return (
    <section id={id} className="py-20 bg-blue-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <TrendingUp className="w-4 h-4" />
            Real Results
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            From 5 Admins to 2 –{' '}
            <span className="text-green-600">Real Results</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how TechCorp Solutions transformed their document workflow and 
            achieved remarkable ROI in just 2 months.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Case Study Details */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-lg">TC</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">TechCorp Solutions</h3>
                  <p className="text-gray-600">Mid-size consulting firm, 150 employees</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">The Challenge</h4>
                  <p className="text-gray-600">
                    &ldquo;We had 5 administrative staff spending 60% of their time on document 
                    formatting. Proposals took days to prepare, and client contracts were 
                    always delayed due to formatting issues.&rdquo;
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    - Sarah Mitchell, Operations Director
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">The Solution</h4>
                  <p className="text-gray-600">
                    Implemented Docko for all client-facing documents: proposals, 
                    contracts, reports, and invoices. Converted 25+ existing templates 
                    to smart templates.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
              <h4 className="font-semibold text-green-800 mb-3">Results Quote</h4>
              <blockquote className="text-green-700 italic text-lg">
                &ldquo;Docko didn&apos;t just save us time – it transformed how we work. 
                We went from dreading document creation to actually enjoying the 
                streamlined process.&rdquo;
              </blockquote>
              <footer className="text-green-600 text-sm mt-2 font-medium">
                - Sarah Mitchell, Operations Director
              </footer>
            </div>
          </motion.div>

          {/* Right Column - Results Metrics */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg border">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Measurable Impact
              </h3>

              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-8 h-8 text-red-600" />
                  </div>
                  <div className="text-3xl font-bold text-red-600 mb-1">5 → 2</div>
                  <p className="text-sm text-gray-600">Admin Staff Needed</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-1">40%</div>
                  <p className="text-sm text-gray-600">Time Saved</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-1">90%</div>
                  <p className="text-sm text-gray-600">Fewer Errors</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <DollarSign className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="text-3xl font-bold text-purple-600 mb-1">2 Mo.</div>
                  <p className="text-sm text-gray-600">ROI Achieved</p>
                </div>
              </div>
            </div>

            {/* ROI Breakdown */}
            <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-6 text-white">
              <h4 className="font-bold mb-4 text-center">Annual Savings Breakdown</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Staff reduction (3 positions)</span>
                  <span className="font-semibold">$180,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Time savings (remaining staff)</span>
                  <span className="font-semibold">$45,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Error reduction & rework</span>
                  <span className="font-semibold">$25,000</span>
                </div>
                <div className="border-t border-white/30 pt-3 mt-3">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Annual Savings</span>
                    <span>$250,000</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto border">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready for Similar Results?
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              Join hundreds of companies who&apos;ve transformed their document workflow. 
              Most see ROI within the first quarter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
                Calculate Your Savings
              </button>
              <button className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
                Schedule a Demo
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}