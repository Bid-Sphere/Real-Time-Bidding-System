import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedCard } from '../ui/AnimatedCard';
import { FileText, Users, Trophy } from 'lucide-react';

const steps = [
  {
    stepNumber: 1,
    title: 'Post Project',
    description: 'Create a detailed project listing with your requirements, budget, and timeline.',
    icon: FileText,
  },
  {
    stepNumber: 2,
    title: 'Receive Bids',
    description: 'Get competitive proposals from qualified organizations and freelancers within hours.',
    icon: Users,
  },
  {
    stepNumber: 3,
    title: 'Award Winner',
    description: 'Review bids, compare profiles, and select the best candidate for your project.',
    icon: Trophy,
  },
];

export const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-100px', amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">How It Works</h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Get started in three simple steps and connect with the right talent for your project.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary-main/30 to-transparent -translate-y-1/2 z-0" />

          {steps.map((step, index) => (
            <AnimatedCard key={step.stepNumber} delay={index * 0.2} className="relative z-10 bg-background-deep/80">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-main to-secondary-main flex items-center justify-center mb-6 shadow-glow-sm">
                  <step.icon className="w-8 h-8 text-white" />
                </div>

                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-background-elevated border border-white/10 flex items-center justify-center text-sm font-bold text-primary-main shadow-lg">
                  {step.stepNumber}
                </div>

                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>
  );
};
