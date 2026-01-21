import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Shield, Clock, DollarSign, Star, Zap, Globe } from 'lucide-react';

const clientBenefits = [
  {
    icon: <Clock className="w-6 h-6" />,
    title: 'Save Time',
    description: 'Post once and receive multiple bids within hours, not days.',
  },
  {
    icon: <DollarSign className="w-6 h-6" />,
    title: 'Competitive Pricing',
    description: 'Get the best value with competitive bids from qualified professionals.',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Secure Platform',
    description: 'Protected payments and verified organizations ensure peace of mind.',
  },
];

const organizationBenefits = [
  {
    icon: <Star className="w-6 h-6" />,
    title: 'Quality Projects',
    description: 'Access a steady stream of verified projects matching your expertise.',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Fast Bidding',
    description: 'Submit proposals quickly and track your bids in real-time.',
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: 'Global Reach',
    description: 'Connect with clients worldwide and grow your business.',
  },
];

export const FeaturesSection = () => {
  // Use the new scroll animation hook for the section header
  const { ref: headerRef, isInView: headerInView } = useScrollAnimation({
    threshold: 0.1,
    rootMargin: '-100px',
    triggerOnce: true,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Using useScrollAnimation hook for header animation */}
        <div
          ref={headerRef as React.RefObject<HTMLDivElement>}
          className={`text-center mb-16 transition-all duration-600 ease-out ${headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose Our Platform
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover the benefits that make us the preferred choice for clients and service providers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Client Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center lg:text-left">
              For Clients
            </h3>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6"
            >
              {clientBenefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                >
                  <Card variant="elevated" hoverable padding="none" className="h-full min-h-[110px] flex items-center">
                    <div className="flex items-center gap-4 w-full p-6">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-main to-info-main text-white rounded-xl flex items-center justify-center shadow-md">
                        {benefit.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {benefit.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Organization Benefits */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center lg:text-left">
              For Organizations
            </h3>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6"
            >
              {organizationBenefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                >
                  <Card variant="elevated" hoverable padding="none" className="h-full min-h-[110px] flex items-center">
                    <div className="flex items-center gap-4 w-full p-6">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-info-main to-primary-main text-white rounded-xl flex items-center justify-center shadow-md">
                        {benefit.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {benefit.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
