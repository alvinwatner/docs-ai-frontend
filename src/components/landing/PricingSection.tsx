import React from 'react';
import { motion } from 'framer-motion';
import { LandingSectionProps } from './types';
import { Check, Star, Zap, Shield, Users, ArrowRight, Phone } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function PricingSection({ id, isVisible }: LandingSectionProps) {
  const handleGetStarted = () => {
    window.location.href = '/auth/login';
  };

  const handleContactSales = () => {
    // You can implement contact form or redirect to calendar booking
    window.location.href = 'mailto:alvinsetiadi22@gmail.com?subject=Enterprise Plan Inquiry';
  };

  const plans = [
    {
      name: 'Free',
      description: 'Perfect for getting started',
      price: '$0',
      period: 'forever',
      icon: Star,
      color: 'gray',
      features: [
        '5 documents per month',
        '3 template uploads',
        '1GB storage',
        'DOCX export only',
        'Basic support',
        'Community access'
      ],
      cta: 'Get Started Free',
      popular: false
    },
    {
      name: 'Pro',
      description: 'For power users and small teams',
      price: 'Free',
      period: 'for 3 months',
      originalPrice: '$15/month after',
      icon: Zap,
      color: 'purple',
      features: [
        'Unlimited documents',
        'Unlimited templates',
        '10GB storage',
        'DOCX & PDF export',
        'Priority support',
        'Advanced formatting',
        'Social media upgrade*'
      ],
      cta: 'Upgrade to Pro',
      popular: true,
      socialMediaNote: true
    },
    {
      name: 'Enterprise',
      description: 'Custom solutions for large organizations',
      price: 'Custom',
      period: 'pricing',
      icon: Shield,
      color: 'blue',
      features: [
        'Everything in Pro',
        'Custom integrations',
        'SOC 2 compliance',
        'On-premise deployment',
        'Dedicated support',
        'Custom workflows',
        'SLA guarantees',
        'Training & onboarding'
      ],
      cta: 'Contact Sales',
      popular: false,
      enterprise: true
    }
  ];

  const getColorClasses = (color: string, type: 'bg' | 'text' | 'border') => {
    const colorMap = {
      gray: {
        bg: 'bg-gray-50',
        text: 'text-gray-600',
        border: 'border-gray-200'
      },
      purple: {
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        border: 'border-purple-200'
      },
      blue: {
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        border: 'border-blue-200'
      }
    };
    return colorMap[color as keyof typeof colorMap][type];
  };

  const getButtonClasses = (color: string, enterprise?: boolean) => {
    if (enterprise) {
      return 'bg-blue-600 hover:bg-blue-700 text-white';
    }

    const buttonMap = {
      gray: 'bg-gray-600 hover:bg-gray-700 text-white',
      purple: 'bg-purple-600 hover:bg-purple-700 text-white',
      blue: 'bg-blue-600 hover:bg-blue-700 text-white'
    };
    return buttonMap[color as keyof typeof buttonMap];
  };

  return (
    <section id={id} className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >

          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Choose Your{' '}
            <span className="text-blue-600">Perfect Plan</span>
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start free and scale as you grow. Get 3 months of Pro free just by sharing Docko
            on social media - no payment required.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon;

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 50 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`relative bg-white rounded-2xl shadow-lg ${
                  plan.popular ? 'ring-2 ring-purple-500 scale-105' : ''
                } ${plan.enterprise ? 'bg-gradient-to-br from-blue-50 to-indigo-50' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 ${getColorClasses(plan.color, 'bg')} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <Icon className={`w-8 h-8 ${getColorClasses(plan.color, 'text')}`} />
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-4">{plan.description}</p>

                    <div className="mb-4">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-500 ml-1">/{plan.period}</span>
                      {plan.originalPrice && (
                        <div className="text-sm text-gray-500 mt-1">
                          Then {plan.originalPrice}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Social Media Note */}
                  {plan.socialMediaNote && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-6">
                      <p className="text-sm text-purple-700 text-center">
                        * Share Docko on social media and get 3 months free automatically!
                      </p>
                    </div>
                  )}

                  {/* CTA Button */}
                  <Button
                    className={`w-full h-12 text-lg ${getButtonClasses(plan.color, plan.enterprise)}`}
                    onClick={plan.enterprise ? handleContactSales : handleGetStarted}
                  >
                    {plan.enterprise && <Phone className="w-5 h-5 mr-2" />}
                    {plan.cta}
                    {!plan.enterprise && <ArrowRight className="w-5 h-5 ml-2" />}
                  </Button>

                  {/* Enterprise Features */}
                  {plan.enterprise && (
                    <div className="mt-6 space-y-3">
                      <div className="flex items-center gap-2 text-blue-700">
                        <Users className="w-4 h-4" />
                        <span className="text-sm font-medium">Perfect for teams 50+</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-700">
                        <Shield className="w-4 h-4" />
                        <span className="text-sm font-medium">Enterprise security & compliance</span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}