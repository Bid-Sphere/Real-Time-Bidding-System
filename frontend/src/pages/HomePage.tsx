import Layout from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { CategorySection } from '@/components/home/CategorySection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { CTASection } from '@/components/home/CTASection';
import { CursorTrail } from '@/components/ui/CursorTrail';

/**
 * HomePage Component
 * 
 * This page demonstrates the use of scroll animations using the useScrollAnimation hook.
 * The hook is implemented in the following sections:
 * - CategorySection: Header animation with fade-in from bottom
 * - HowItWorksSection: Header animation with fade-in from bottom
 * - FeaturesSection: Header animation with fade-in from bottom
 * - CTASection: Full content animation with fade-in from bottom
 * 
 * The useScrollAnimation hook uses IntersectionObserver for performance-optimized
 * scroll-triggered animations. See @/hooks/useScrollAnimation for implementation details.
 * 
 * Additionally includes:
 * - CursorTrail: Antigravity-style cursor following dots (desktop only)
 */
export default function HomePage() {
  return (
    <>
      {/* Cursor Trail Effect - Desktop Only */}
      <CursorTrail />

      <Layout transparentNavbar={false}>
        {/* Hero Section */}
        <HeroSection />

        {/* Category Section - Uses useScrollAnimation for header */}
        <CategorySection />

        {/* How It Works Section - Uses useScrollAnimation for header */}
        <HowItWorksSection />

        {/* Features Section - Uses useScrollAnimation for header */}
        <FeaturesSection />

        {/* CTA Section - Uses useScrollAnimation for entire content */}
        <CTASection />
      </Layout>
    </>
  );
}
