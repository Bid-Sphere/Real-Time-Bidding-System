import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Send, User, Mail, Phone, MessageSquare, CheckCircle } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { validateContactForm, type ContactFormData, type ContactFormErrors } from '@/utils/validation';

/**
 * ContactSection Component
 * Phase 1 Frontend Redesign - Contact Section
 * 
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5
 * - 9.1: Display a "How can we assist you?" contact section
 * - 9.2: Include contact form with fields: Full Name, Email Address, Phone Number, Message
 * - 9.3: Use dark-themed input fields with light borders and placeholder text
 * - 9.4: Include a "Send" CTA button with blue/gradient styling
 * - 9.5: Display success confirmation on valid submission
 */

export const ContactSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    email: '',
    phone: '',
    message: '',
  });

  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: keyof ContactFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateContactForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after showing success
    setTimeout(() => {
      setFormData({ fullName: '', email: '', phone: '', message: '' });
    }, 500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' as const },
    },
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="py-12 sm:py-16 md:py-20 lg:py-28 relative px-4 sm:px-0"
      aria-labelledby="contact-heading"
    >
      {/* Background gradient decoration - scaled for mobile */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] bg-gradient-to-r from-accent-blue/5 to-accent-purple/5 rounded-full blur-3xl" />
      </div>

      <div className="container-main relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="max-w-2xl mx-auto"
        >
          {/* Section Header - Requirement 9.1 */}
          <motion.div variants={itemVariants} className="text-center mb-8 sm:mb-12">
            <h2
              id="contact-heading"
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-3 sm:mb-4"
            >
              How can we{' '}
              <span className="text-gradient-primary">assist you?</span>
            </h2>
            <p className="text-base sm:text-lg text-text-secondary max-w-xl mx-auto px-4 sm:px-0">
              Have questions about our platform? We're here to help. Send us a
              message and we'll respond as soon as possible.
            </p>
          </motion.div>

          {/* Contact Form Card */}
          <motion.div
            variants={itemVariants}
            className="bg-bg-card/50 border border-border-light rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 backdrop-blur-sm"
          >
            {isSubmitted ? (
              /* Success Confirmation - Requirement 9.5 */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 sm:py-8"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center mx-auto mb-3 sm:mb-4 ring-1 ring-border-light">
                  <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-success" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-2">
                  Message Sent!
                </h3>
                <p className="text-sm sm:text-base text-text-secondary mb-4 sm:mb-6">
                  Thank you for reaching out. We'll get back to you shortly.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setIsSubmitted(false)}
                >
                  Send Another Message
                </Button>
              </motion.div>
            ) : (
              /* Contact Form - Requirements 9.2, 9.3, 9.4 */
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Full Name Field */}
                <Input
                  type="text"
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleInputChange('fullName')}
                  error={errors.fullName}
                  leftIcon={<User className="w-5 h-5" />}
                  required
                  fullWidth
                />

                {/* Email Field */}
                <Input
                  type="email"
                  label="Email Address"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  error={errors.email}
                  leftIcon={<Mail className="w-5 h-5" />}
                  required
                  fullWidth
                />

                {/* Phone Field */}
                <Input
                  type="tel"
                  label="Phone Number"
                  placeholder="Enter your phone number (optional)"
                  value={formData.phone}
                  onChange={handleInputChange('phone')}
                  error={errors.phone}
                  leftIcon={<Phone className="w-5 h-5" />}
                  fullWidth
                />

                {/* Message Field - Textarea styled as dark input */}
                <div className="flex flex-col gap-2 w-full">
                  <label
                    htmlFor="contact-message"
                    className="text-sm font-medium text-[var(--text-primary)]"
                  >
                    Message
                    <span className="text-[var(--color-error)] ml-1">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-3 text-[var(--text-muted)] pointer-events-none">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <textarea
                      id="contact-message"
                      placeholder="How can we help you?"
                      value={formData.message}
                      onChange={handleInputChange('message')}
                      rows={5}
                      required
                      aria-invalid={errors.message ? 'true' : 'false'}
                      className={`
                        w-full pl-11 pr-4 py-3
                        text-base text-[var(--text-primary)]
                        bg-[var(--bg-input)]
                        border rounded-[var(--radius-lg)]
                        placeholder:text-[var(--text-muted)]
                        transition-all duration-[var(--transition-fast)]
                        focus:outline-none resize-none
                        ${
                          errors.message
                            ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.25)]'
                            : 'border-[var(--border-light)] focus:border-[var(--accent-blue)] focus:shadow-[var(--shadow-input-focus)] hover:border-[var(--border-medium)]'
                        }
                      `}
                    />
                  </div>
                  {errors.message && (
                    <span
                      role="alert"
                      className="text-sm text-[var(--color-error)] flex items-center gap-1.5"
                    >
                      <svg
                        className="w-4 h-4 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.message}
                    </span>
                  )}
                </div>

                {/* Send Button - Requirement 9.4 */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={isSubmitting}
                  rightIcon={<Send className="w-5 h-5" />}
                >
                  Send Message
                </Button>
              </form>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
