import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

interface FooterProps {
  variant?: 'default' | 'simple';
}

export default function Footer({ variant = 'default' }: FooterProps) {
  const currentYear = new Date().getFullYear();

  if (variant === 'simple') {
    return (
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            © {currentYear} Bidding System. All rights reserved.
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-xl font-bold">
              <span className="text-gray-900 dark:text-white">Bid</span>
              <span className="text-primary-main">Sphere</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Connect clients with organizations and freelancers for IT, Construction, and
              Procurement projects.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-primary-main dark:hover:text-primary-light transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-primary-main dark:hover:text-primary-light transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-primary-main dark:hover:text-primary-light transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="mailto:contact@biddingsystem.com"
                className="text-gray-600 dark:text-gray-400 hover:text-primary-main dark:hover:text-primary-light transition-colors"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <nav aria-label="Company links">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/about"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-main dark:hover:text-primary-light transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-main dark:hover:text-primary-light transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-main dark:hover:text-primary-light transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-main dark:hover:text-primary-light transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </nav>

          {/* Resources Links */}
          <nav aria-label="Resource links">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/help"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-main dark:hover:text-primary-light transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-main dark:hover:text-primary-light transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/guides"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-main dark:hover:text-primary-light transition-colors"
                >
                  Guides
                </Link>
              </li>
              <li>
                <Link
                  to="/api"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-main dark:hover:text-primary-light transition-colors"
                >
                  API Docs
                </Link>
              </li>
            </ul>
          </nav>

          {/* Legal Links */}
          <nav aria-label="Legal links">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/terms"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-main dark:hover:text-primary-light transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-main dark:hover:text-primary-light transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/cookies"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-main dark:hover:text-primary-light transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/licenses"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-main dark:hover:text-primary-light transition-colors"
                >
                  Licenses
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} Bid Sphere. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                to="/terms"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-main dark:hover:text-primary-light transition-colors"
              >
                Terms
              </Link>
              <Link
                to="/privacy"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-main dark:hover:text-primary-light transition-colors"
              >
                Privacy
              </Link>
              <Link
                to="/contact"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-main dark:hover:text-primary-light transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
