import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  transparentNavbar?: boolean;
  simpleFooter?: boolean;
  hideNavbar?: boolean;
  hideFooter?: boolean;
}

export default function Layout({
  children,
  transparentNavbar = false,
  simpleFooter = false,
  hideNavbar = false,
  hideFooter = false,
}: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {!hideNavbar && <Navbar transparent={transparentNavbar} />}
      
      <main className="flex-grow">
        {/* Add padding-top to account for fixed navbar */}
        <div className={!hideNavbar ? 'pt-16' : ''}>
          {children}
        </div>
      </main>
      
      {!hideFooter && <Footer variant={simpleFooter ? 'simple' : 'default'} />}
    </div>
  );
}
