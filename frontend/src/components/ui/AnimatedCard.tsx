import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedCardProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({ children, className = "", delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
            whileHover={{
                y: -5,
                boxShadow: "0 10px 30px -10px rgba(59, 130, 246, 0.5)"
            }}
            className={`glass-card rounded-xl p-6 transition-all duration-300 ${className}`}
        >
            {children}
        </motion.div>
    );
};
