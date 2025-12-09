import React from 'react';

interface AnimatedCardProps {
    children: React.ReactNode;
    className?: string;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({ children, className = "" }) => {
    return (
        <div className={`glass-card rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(59,130,246,0.5)] animate-fade-in-up ${className}`}>
            {children}
        </div>
    );
};
