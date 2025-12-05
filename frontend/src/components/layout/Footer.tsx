/**
 * Footer Component
 * Phase 1 Frontend Redesign
 * 
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5
 * 
 * Features:
 * - Platform logo
 * - Navigation links grouped by category (Platform, Company, Legal, Support)
 * - Social media icon buttons
 * - Copyright information
 * - Dark theme with proper contrast
 */

import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Instagram, Sparkles } from 'lucide-react';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

// Footer navigation sections (Requirement 10.2)
const footerSections: FooterSection[] = [
  {
    title: 'Platform',
    links: [
      { label: 'Browse Projects', href: '/projects' },
      { label: 'Post a Project', href: '/post-project' },
      { label: 'Find Organizations', href: '/organizations' },
      { label: 'How It Works', href: '/#how-it-works' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Blog', href: '/blog' },
      { label: 'Press', href: '/press' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Licenses', href: '/licenses' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Status', href: '/status' },
    ],
  },
];

// Social media links (Requirement 10.3)
const socialLinks = [
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: Github, href: 'https://github.com', label: 'GitHub' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="bg-[var(--bg-primary)] border-t border-[var(--border-light)]"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-8 sm:py-12 lg:py-16">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 lg:gap-12">
            {/* Brand Section (Requirement 10.1) - Full width on mobile */}
            <div className="col-span-2 sm:col-span-2 md:col-span-3 lg:col-span-2 space-y-4 sm:space-y-6 mb-4 sm:mb-0">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-purple)] rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-[var(--shadow-glow)] transition-all duration-300">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="text-lg sm:text-xl font-bold text-[var(--text-primary)] tracking-tight">
                  Bid<span className="text-[var(--accent-blue)]">Sphere</span>
                </span>
              </Link>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed max-w-xs">
                Connect with professional organizations through competitive bidding. 
                Find the perfect match for your projects.
              </p>
              {/* Social Media Icons (Requirement 10.3) - Enhanced hover effects (Requirement 15.1) */}
              <div className="flex items-center gap-2 sm:gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/5 border border-[var(--border-light)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/10 hover:border-[var(--accent-blue)] hover:scale-110 hover:shadow-[var(--shadow-glow)] transition-all duration-150"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation Links (Requirement 10.2) - 2 cols on mobile, 4 on tablet+ */}
            {footerSections.map((section) => (
              <nav key={section.title} aria-label={`${section.title} links`}>
                <h3 className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] mb-3 sm:mb-4 uppercase tracking-wider">
                  {section.title}
                </h3>
                <ul className="space-y-2 sm:space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="text-xs sm:text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:translate-x-1 inline-block transition-all duration-150"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* Bottom Bar (Requirement 10.4, 10.5) */}
        <div className="py-4 sm:py-6 border-t border-[var(--border-light)]">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-xs sm:text-sm text-[var(--text-muted)] text-center sm:text-left">
              © {currentYear} BidSphere. All rights reserved.
            </p>
            <div className="flex items-center gap-4 sm:gap-6">
              <Link
                to="/terms"
                className="text-xs sm:text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors duration-200"
              >
                Terms
              </Link>
              <Link
                to="/privacy"
                className="text-xs sm:text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors duration-200"
              >
                Privacy
              </Link>
              <Link
                to="/cookies"
                className="text-xs sm:text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors duration-200"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
