import React from 'react';
import { motion } from 'framer-motion';

export default function ClientLogos() {
  // Using placeholder company names - in production, these would be actual client logos
  const clients = [
    { name: 'TechCorp', size: 'Enterprise' },
    { name: 'FinanceHub', size: 'Finance' },
    { name: 'HealthPlus', size: 'Healthcare' },
    { name: 'EduSmart', size: 'Education' },
    { name: 'RetailMax', size: 'Retail' },
    { name: 'ConsultPro', size: 'Consulting' }
  ];

  return (
    <section className="py-12 bg-white border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-center text-sm text-gray-600 mb-6">
            Trusted by 500+ companies worldwide
          </p>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center">
            {clients.map((client, index) => (
              <motion.div
                key={client.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="h-12 flex items-center justify-center">
                  {/* In production, this would be an actual logo image */}
                  <div className="text-gray-400 font-semibold text-lg">
                    {client.name}
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">{client.size}</div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">10M+</div>
                <div className="text-sm text-gray-600">Documents Generated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">99.9%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">&lt; 100ms</div>
                <div className="text-sm text-gray-600">Processing Time</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}