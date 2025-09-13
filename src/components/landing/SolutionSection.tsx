import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LandingSectionProps } from './types';
import { Zap, CheckCircle, ArrowRight, Upload, Edit3, Download } from 'lucide-react';

export default function SolutionSection({ id, isVisible }: LandingSectionProps) {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: 1,
      icon: Upload,
      title: 'Upload Your Template',
      description: 'Upload your DOCX file with variables like {{client_name}} and {{section_table}}',
      details: 'Use your existing Word documents. Add variables with curly braces for simple text replacement or section tables for dynamic content.',
      example: {
        title: 'Template Example',
        content: 'Dear {{client_name}},\n\nYour project details:\n{{section_table}}\n\nTotal: {{total_amount}}'
      }
    },
    {
      number: 2,
      icon: Edit3,
      title: 'Fill Variables',
      description: 'Enter values for each detected variable through our simple form',
      details: 'Our system automatically detects all variables in your template and creates an easy-to-fill form.',
      example: {
        title: 'Fill Form',
        content: 'client_name: "Acme Corporation"\ntotal_amount: "$12,500"\nsection_table: [Item 1, Item 2, Item 3]'
      }
    },
    {
      number: 3,
      icon: Download,
      title: 'Export Perfect Document',
      description: 'Download your professionally formatted DOCX with perfect layout',
      details: 'We handle all the formatting automatically - proper page breaks, consistent spacing, and professional appearance.',
      example: {
        title: 'Generated Result',
        content: 'Dear Acme Corporation,\n\nYour project details:\n[Perfect Table Layout]\n\nTotal: $12,500'
      }
    }
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
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Simple 3-Step Process
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            From Template to{' '}
            <span className="text-green-600">Perfect Document</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            No complex setup or training required. Upload your Word template, 
            fill in the variables, and get a perfectly formatted document in seconds.
          </p>
        </motion.div>

        {/* Step Navigation */}
        <div className="flex justify-center mb-12">
          <div className="w-full max-w-2xl mx-auto">
            <div className="flex items-start justify-between">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center relative flex-1">
                  {/* Step Circle */}
                  <button
                    onClick={() => setActiveStep(index)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-base transition-all duration-300 z-10 relative ${
                      activeStep === index
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {step.number}
                  </button>
                  
                  {/* Step Label */}
                  <div className="mt-3 text-center max-w-24">
                    <div className={`text-sm font-medium transition-colors whitespace-nowrap ${
                      activeStep === index
                        ? 'text-blue-600'
                        : 'text-gray-500'
                    }`}>
                      {step.title}
                    </div>
                  </div>
                  
                  {/* Connecting Line */}
                  {index < steps.length - 1 && (
                    <div className="absolute top-6 left-1/2 w-full h-0.5 bg-gray-200 z-0">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          activeStep > index ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                        style={{
                          width: activeStep > index ? '100%' : '0%'
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Step Details */}
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                activeStep === 0 ? 'bg-blue-500' : 
                activeStep === 1 ? 'bg-purple-500' : 'bg-green-500'
              }`}>
                {React.createElement(steps[activeStep].icon, { 
                  className: "w-6 h-6 text-white" 
                })}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {steps[activeStep].title}
                </h3>
                <p className="text-gray-600">
                  {steps[activeStep].description}
                </p>
              </div>
            </div>

            <p className="text-lg text-gray-700">
              {steps[activeStep].details}
            </p>

            {/* Features for each step */}
            <div className="space-y-3">
              {activeStep === 0 && (
                <>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Supports {'{{variable_name}}'} for simple text</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Supports {'{{section_table}}'} for dynamic tables</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Automatic variable detection</span>
                  </div>
                </>
              )}
              
              {activeStep === 1 && (
                <>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Intuitive form interface</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Add unlimited table rows</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Preview as you type</span>
                  </div>
                </>
              )}
              
              {activeStep === 2 && (
                <>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Perfect formatting automatically</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Smart page breaks</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Professional DOCX output</span>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* Right Column - Visual Example */}
          <motion.div
            key={`example-${activeStep}`}
            initial={{ opacity: 0, x: 50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="bg-white rounded-xl shadow-2xl p-6 border">
              <div className="flex items-center gap-2 mb-4">
                {React.createElement(steps[activeStep].icon, { 
                  className: `w-5 h-5 ${
                    activeStep === 0 ? 'text-blue-600' : 
                    activeStep === 1 ? 'text-purple-600' : 'text-green-600'
                  }` 
                })}
                <span className="font-medium text-gray-700">
                  {steps[activeStep].example.title}
                </span>
              </div>
              
              <div className="space-y-3 text-sm font-mono bg-gray-50 p-4 rounded-lg">
                {activeStep === 0 && (
                  <>
                    <p className="text-gray-800">
                      Dear <span className="bg-yellow-200 px-1 rounded text-blue-700">{'{{client_name}}'}</span>,
                    </p>
                    <p className="text-gray-800">Your project details:</p>
                    <p className="text-gray-800">
                      <span className="bg-yellow-200 px-1 rounded text-blue-700">{'{{section_table}}'}</span>
                    </p>
                    <p className="text-gray-800">
                      Total: <span className="bg-yellow-200 px-1 rounded text-blue-700">{'{{total_amount}}'}</span>
                    </p>
                  </>
                )}
                
                {activeStep === 1 && (
                  <>
                    <div className="text-gray-700">
                      <strong>client_name:</strong> &ldquo;Acme Corporation&rdquo;
                    </div>
                    <div className="text-gray-700">
                      <strong>total_amount:</strong> &ldquo;$12,500&rdquo;
                    </div>
                    <div className="text-gray-700">
                      <strong>section_table:</strong>
                      <div className="ml-4 mt-2 space-y-1">
                        <div>• Website Design - $5,000</div>
                        <div>• Development - $4,000</div>
                        <div>• Training - $3,500</div>
                      </div>
                    </div>
                  </>
                )}
                
                {activeStep === 2 && (
                  <>
                    <p className="text-gray-800">Dear <strong>Acme Corporation</strong>,</p>
                    <p className="text-gray-800">Your project details:</p>
                    <div className="bg-white border rounded p-2 my-2">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-1">Service</th>
                            <th className="text-right py-1">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr><td className="py-1">Website Design</td><td className="text-right py-1">$5,000</td></tr>
                          <tr><td className="py-1">Development</td><td className="text-right py-1">$4,000</td></tr>
                          <tr><td className="py-1">Training</td><td className="text-right py-1">$3,500</td></tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="text-gray-800">Total: <strong>$12,500</strong></p>
                  </>
                )}
              </div>
            </div>

            {/* Step indicator */}
            <div className="absolute -top-3 -right-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
              Step {activeStep + 1}
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
          <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-8 text-white max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Try It Yourself?
            </h3>
            <p className="text-green-100 text-lg mb-6">
              Start with your own Word template and see how easy document automation can be.
            </p>
            <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2 mx-auto">
              Upload Your Template
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}