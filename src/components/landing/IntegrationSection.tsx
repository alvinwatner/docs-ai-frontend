
import React from 'react';
import { motion } from 'framer-motion';
import { LandingSectionProps } from './types';
import { Database, Zap, Shield, ArrowRight } from 'lucide-react';

export default function IntegrationSection({ id, isVisible }: LandingSectionProps) {
  const integrations = [
    { name: 'Salesforce', category: 'CRM' },
    { name: 'HubSpot', category: 'CRM' },
    { name: 'SAP', category: 'ERP' },
    { name: 'NetSuite', category: 'ERP' },
    { name: 'PostgreSQL', category: 'Database' },
    { name: 'MySQL', category: 'Database' },
    { name: 'Excel', category: 'Spreadsheet' },
    { name: 'Google Sheets', category: 'Spreadsheet' }
  ];

  return (
    <section id={id} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Database className="w-4 h-4" />
            Enterprise Integration
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Connects With Your{' '}
            <span className="text-purple-600">Existing Systems</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Seamlessly integrate with your CRM, ERP, and databases. 
            Pull data directly from your business systems into perfectly formatted documents.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Integration Icons */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {integrations.map((integration, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-300 text-center"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg shadow-sm mx-auto mb-2 flex items-center justify-center">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded"></div>
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-gray-900">{integration.name}</div>
                  <div className="hidden sm:block text-xs text-gray-500">{integration.category}</div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Enterprise Security</h3>
              </div>
              <ul className="text-sm text-blue-700 space-y-2">
                <li>• SOC 2 Type II Certified</li>
                <li>• End-to-end encryption</li>
                <li>• On-premise deployment available</li>
                <li>• GDPR & HIPAA compliant</li>
              </ul>
            </div>
          </motion.div>

          {/* Right Column - Integration Flow */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Connect Your Data</h4>
                  <p className="text-gray-600 text-sm">Link to your existing CRM, ERP, or database</p>
                </div>
              </div>

              <div className="flex justify-center">
                <ArrowRight className="w-6 h-6 text-gray-400" />
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Map Your Fields</h4>
                  <p className="text-gray-600 text-sm">Simple drag-and-drop field mapping</p>
                </div>
              </div>

              <div className="flex justify-center">
                <ArrowRight className="w-6 h-6 text-gray-400" />
              </div>

              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Generate Documents</h4>
                  <p className="text-gray-600 text-sm">Automatic document creation with live data</p>
                </div>
              </div>
            </div>

            {/* Example Output */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="font-medium text-gray-700">Live Data Example</span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Client:</span>
                  <span className="font-medium">Acme Corp (from Salesforce)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Contract Value:</span>
                  <span className="font-medium">$45,000 (from NetSuite)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Project Manager:</span>
                  <span className="font-medium">John Smith (from HR System)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Start Date:</span>
                  <span className="font-medium">Today + 5 business days</span>
                </div>
              </div>

              <div className="text-xs text-green-600 mt-4 p-2 bg-green-50 rounded">
                ✓ Data updated automatically from source systems
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
          <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl p-8 text-white max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Connect Your Systems?
            </h3>
            <p className="text-purple-100 text-lg mb-6">
              Our integration specialists will help you connect DocuFlow to your existing 
              business systems in under 2 hours.
            </p>
            <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
              Schedule Integration Call
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
