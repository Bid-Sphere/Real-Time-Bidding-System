import React from 'react';
import Layout from '../components/layout/Layout';
import { HeroSection } from '../components/home/HeroSection';
import { BentoGrid } from '../components/home/BentoGrid';
import { HowItWorksSection } from '../components/home/HowItWorksSection';
import { CategorySection } from '../components/home/CategorySection';

const HomePage: React.FC = () => {
  return (
    <Layout>
      <main className="min-h-screen bg-background-deep text-text-primary selection:bg-primary-main selection:text-white">
        <HeroSection />
        <HowItWorksSection />
        <CategorySection />
        <BentoGrid />

        {/* Decorative background gradients */}
        <div className="fixed inset-0 pointer-events-none z-[-1]">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-main/10 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-main/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
        </div>
      </main>
    </Layout>
  );
};

export default HomePage;
