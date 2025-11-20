import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface Particle {
    id: number;
    x: number;
    y: number;
    baseX: number;
    baseY: number;
    angle: number;
}

const PARTICLE_COUNT = 150;
const PARTICLE_SIZE = 3;

export const CursorTrail = () => {
    const [particles, setParticles] = useState<Particle[]>([]);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Check if device is touch-enabled (mobile)
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouchDevice) return;

        setIsVisible(true);

        // Initialize particles randomly scattered across screen
        const initParticles: Particle[] = [];

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;

            initParticles.push({
                id: i,
                x,
                y,
                baseX: x,
                baseY: y,
                angle: 0,
            });
        }

        setParticles(initParticles);

        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        const handleResize = () => {
            // Recalculate particle positions on resize
            setParticles(prev => prev.map((p) => {
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight;

                return {
                    ...p,
                    baseX: x,
                    baseY: y,
                    x,
                    y,
                };
            }));
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Continuous animation loop
    useEffect(() => {
        if (particles.length === 0) return;

        let animationFrameId: number;

        const animate = () => {
            const time = Date.now() * 0.0005;

            setParticles(prev => prev.map((particle, index) => {
                // Calculate distance and angle to cursor
                const dx = mousePos.x - particle.x;
                const dy = mousePos.y - particle.y;
                const distanceToCursor = Math.sqrt(dx * dx + dy * dy);
                const angleToMouse = Math.atan2(dy, dx) * (180 / Math.PI);

                // Minimum distance to maintain from cursor
                const minDistance = 100;
                const attractionRadius = 300;

                let targetX = particle.baseX;
                let targetY = particle.baseY;

                // If cursor is within attraction radius
                if (distanceToCursor < attractionRadius) {
                    if (distanceToCursor > minDistance) {
                        // Pull toward cursor
                        const pullStrength = 0.05;
                        targetX = particle.x + dx * pullStrength;
                        targetY = particle.y + dy * pullStrength;
                    } else {
                        // Too close - maintain distance
                        const angle = Math.atan2(dy, dx);
                        targetX = mousePos.x - Math.cos(angle) * minDistance;
                        targetY = mousePos.y - Math.sin(angle) * minDistance;
                    }
                } else {
                    // Return to base position
                    targetX = particle.baseX;
                    targetY = particle.baseY;
                }

                // Gentle drift animation
                const driftX = Math.sin(time + index * 0.5) * 2;
                const driftY = Math.cos(time + index * 0.7) * 2;

                // Smooth interpolation
                const newX = particle.x + (targetX - particle.x) * 0.1 + driftX;
                const newY = particle.y + (targetY - particle.y) * 0.1 + driftY;

                return {
                    ...particle,
                    x: newX,
                    y: newY,
                    angle: angleToMouse,
                };
            }));

            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [mousePos, particles.length]);

    if (!isVisible) return null;

    return (
        <div
            ref={containerRef}
            className="pointer-events-none fixed inset-0 z-0"
            style={{ isolation: 'isolate' }}
        >
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute"
                    style={{
                        left: particle.x,
                        top: particle.y,
                        width: PARTICLE_SIZE * 3,
                        height: PARTICLE_SIZE,
                        rotate: particle.angle,
                    }}
                    animate={{
                        rotate: particle.angle,
                    }}
                    transition={{
                        type: 'spring',
                        damping: 20,
                        stiffness: 100,
                    }}
                >
                    <div
                        className="w-full h-full rounded-full bg-primary-main/30 dark:bg-primary-light/20"
                        style={{
                            boxShadow: '0 0 4px rgba(var(--color-primary-main-rgb), 0.3)',
                        }}
                    />
                </motion.div>
            ))}
        </div>
    );
};
