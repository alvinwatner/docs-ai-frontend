import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Award, CheckCircle } from 'lucide-react';

interface SecurityBadgesProps {
  variant?: 'full' | 'compact';
  className?: string;
}

export default function SecurityBadges({ variant = 'full', className = '' }: SecurityBadgesProps) {
  const badges = [
    { name: 'SOC 2', icon: Shield, description: 'Type II Certified' },
    { name: 'GDPR', icon: Lock, description: 'Compliant' },
    { name: 'HIPAA', icon: Award, description: 'Compliant' },
    { name: 'ISO 27001', icon: CheckCircle, description: 'Certified' }
  ];

  if (variant === 'compact') {
    return (
      <div className={`flex items-center justify-center gap-8 py-4 ${className}`}>
        {badges.map((badge, index) => (
          <motion.div
            key={badge.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex items-center gap-2 text-gray-600"
          >
            <badge.icon className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium">{badge.name}</span>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <section className={`py-12 bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Enterprise-Grade Security & Compliance
            </h3>
            <p className="text-gray-600">Your data is protected with industry-leading standards</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {badges.map((badge, index) => {
              const Icon = badge.icon;
              return (
                <motion.div
                  key={badge.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow"
                >
                  <Icon className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900">{badge.name}</div>
                  <div className="text-xs text-gray-600 mt-1">{badge.description}</div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              🔒 256-bit encryption • 99.9% uptime SLA • Daily backups • RBAC access control
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}