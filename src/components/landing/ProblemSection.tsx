import React from 'react';
import { motion } from 'framer-motion';
import { LandingSectionProps } from './types';
import { Users, Clock, AlertCircle } from 'lucide-react';

export default function ProblemSection({ id, isVisible }: LandingSectionProps) {
  const problems = [
    {
      icon: Users,
      title: "5 Admins Doing Repetitive Work?",
      description: "Your team spends hours on document formatting that could be automated",
      cost: "$50,000+ annually in wasted time"
    },
    {
      icon: Clock,
      title: "40% Time Lost on Formatting?",
      description: "Every document needs manual adjustments, corrections, and reformatting",
      cost: "2-3 hours per complex document"
    },
    {
      icon: AlertCircle,
      title: "Documents Breaking Across Pages?",
      description: "Tables split awkwardly, headers separate from content, unprofessional results",
      cost: "Embarrassing client presentations"
    }
  ];

  return (
    <section id={id} className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Still Manually Creating Documents?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your team is burning money and time on tasks that should be automated. 
            Here&apos;s what it&apos;s really costing you:
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="relative"
            >
              {/* Background card */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-red-100 hover:border-red-200 transition-all duration-300 h-full">
                {/* Icon */}
                <div className="w-16 h-16 bg-red-50 rounded-xl flex items-center justify-center mb-6">
                  <problem.icon className="w-8 h-8 text-red-600" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {problem.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {problem.description}
                </p>

                {/* Cost indicator */}
                <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                  <p className="text-red-700 font-semibold text-sm">
                    💸 {problem.cost}
                  </p>
                </div>

                {/* Stress indicator */}
                <div className="absolute top-4 right-4">
                  <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <div className="bg-red-50 rounded-2xl p-8 max-w-4xl mx-auto border border-red-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Sound Familiar?
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              You&apos;re not alone. Most businesses lose 30-40% of their administrative efficiency 
              to manual document creation.
            </p>
            <div className="text-3xl font-bold text-red-600">
              That ends today.
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}