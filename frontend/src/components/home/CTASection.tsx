import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ArrowRight, Sparkles } from 'lucide-react';

export const CTASection = () => {
  const navigate = useNavigate();
  
  // Use the new scroll animation hook for the CTA content
  const { ref: contentRef, isInView: contentInView } = useScrollAnimation({
    threshold: 0.2,
    rootMargin: '-100px',
    triggerOnce: true,
  });

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-main via-info-main to-primary-dark">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />
      </div>

      <div 
        ref={contentRef as React.RefObject<HTMLDivElement>}
        className={`relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-600 ease-out ${
          contentInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white/20 backdrop-blur-sm rounded-full">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">
              Join Thousands of Satisfied Users
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to Get Started?
          </h2>

          <p className="text-xl sm:text-2xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join our platform today and experience the future of project bidding. No credit card required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/signup')}
              icon={<ArrowRight className="w-5 h-5" />}
              className="!bg-white !text-primary-main hover:!bg-gray-100 !shadow-xl"
            >
              Sign Up Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/login')}
              className="!border-2 !border-white !text-white hover:!bg-white/10 !bg-transparent"
            >
              Already Have an Account?
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full" />
              <span>Free Forever</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full" />
              <span>No Hidden Fees</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full" />
              <span>Cancel Anytime</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
    </section>
  );
};
