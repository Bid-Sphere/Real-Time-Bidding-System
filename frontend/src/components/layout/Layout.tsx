/**
 * Layout Component
 * Phase 1 Frontend Redesign
 * 
 * Provides consistent page structure with floating navbar and footer.
 * Requirements: 1.1 (Global dark theme background)
 */

import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  hideNavbar?: boolean;
  hideFooter?: boolean;
}

export default function Layout({
  children,
  hideNavbar = false,
  hideFooter = false,
}: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] transition-colors duration-300">
      {!hideNavbar && <Navbar />}
      
      <main className="flex-grow">
        {/* Add padding-top to account for floating navbar with margin */}
        <div className={!hideNavbar ? 'pt-24 sm:pt-28' : ''}>
          {children}
        </div>
      </main>
      
      {!hideFooter && <Footer />}
    </div>
  );
}
