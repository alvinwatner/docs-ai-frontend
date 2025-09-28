import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export default function TestimonialsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      quote: "Docko reduced our document processing time by 80%. What used to take hours now takes minutes.",
      author: "Sarah Chen",
      role: "Operations Director",
      company: "TechCorp Solutions",
      savings: "$200K annually"
    },
    {
      quote: "The auto-formatting feature alone saved us 3 admin positions. ROI was immediate.",
      author: "Michael Rodriguez",
      role: "CFO",
      company: "FinanceHub",
      savings: "5 hours/day saved"
    },
    {
      quote: "Perfect for compliance documents. Every document is now consistent and professionally formatted.",
      author: "Dr. Emily Johnson",
      role: "Compliance Manager",
      company: "HealthPlus Medical",
      savings: "100% compliance rate"
    },
    {
      quote: "Integration with our existing systems was seamless. Best investment we've made this year.",
      author: "David Park",
      role: "IT Director",
      company: "ConsultPro",
      savings: "2-week payback period"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Auto-rotate every 5 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-600">Join 500+ companies achieving remarkable results</p>
        </div>

        <div className="relative bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <Quote className="absolute top-6 left-6 w-8 h-8 text-blue-200" />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <p className="text-xl md:text-2xl text-gray-800 mb-8 italic leading-relaxed">
                &ldquo;{testimonials[currentIndex].quote}&rdquo;
              </p>

              <div className="mb-4">
                <div className="font-semibold text-gray-900 text-lg">
                  {testimonials[currentIndex].author}
                </div>
                <div className="text-gray-600">
                  {testimonials[currentIndex].role}, {testimonials[currentIndex].company}
                </div>
              </div>

              <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full">
                <span className="font-semibold">{testimonials[currentIndex].savings}</span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-8 bg-blue-600'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}