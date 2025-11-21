import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedCard } from '../ui/AnimatedCard';
import { features } from '../../data/mockData';

export const BentoGrid: React.FC = () => {
    return (
        <section className="py-24 relative">
            <div className="container mx-auto px-4">

                {/* Features Section */}
                <div className="mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, margin: '-100px', amount: 0.2 }}
                        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Why Choose Us?</h2>
                        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                            Experience the next evolution of freelancing with our cutting-edge platform features.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <AnimatedCard key={feature.id} delay={index * 0.1}>
                                <div className="h-12 w-12 rounded-lg bg-primary-main/10 flex items-center justify-center mb-6 text-primary-main">
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-text-secondary text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </AnimatedCard>
                        ))}
                    </div>
                </div>



            </div>
        </section>
    );
};
