import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

type VerificationStatus = 'unverified' | 'pending' | 'verified';

interface EmailVerificationProps {
  email: string;
  status: VerificationStatus;
  onSendCode: () => Promise<{ message: string; expiresAt: string }>;
  onVerifyCode: (code: string) => Promise<{ verified: boolean; message: string }>;
}

export const EmailVerification: React.FC<EmailVerificationProps> = ({
  email,
  status,
  onSendCode,
  onVerifyCode,
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  // Calculate time remaining for code expiration
  useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      const remaining = Math.max(0, Math.floor((expiry - now) / 1000));
      
      setTimeRemaining(remaining);
      
      if (remaining === 0) {
        setMessage('Verification code has expired. Please request a new one.');
        setMessageType('error');
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const handleSendCode = async () => {
    setIsLoading(true);
    setMessage('');
    setTimeRemaining(null); // Clear any existing timer
    
    try {
      const result = await onSendCode();
      setExpiresAt(result.expiresAt);
      setMessage(result.message);
      setMessageType('success');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to send verification code');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setMessage('Please enter the verification code');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setMessage('');
    
    try {
      const result = await onVerifyCode(verificationCode);
      
      if (result.verified) {
        setMessage(result.message);
        setMessageType('success');
        setVerificationCode('');
        setExpiresAt(null);
      } else {
        setMessage(result.message);
        setMessageType('error');
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to verify code');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeRemaining = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/50 border border-gray-800 rounded-xl p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            status === 'verified' 
              ? 'bg-green-500/20' 
              : status === 'pending'
              ? 'bg-yellow-500/20'
              : 'bg-gray-700/50'
          }`}>
            {status === 'verified' ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : status === 'pending' ? (
              <Clock className="w-5 h-5 text-yellow-500" />
            ) : (
              <Mail className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Email Verification</h3>
            <p className="text-sm text-gray-400">{email}</p>
          </div>
        </div>

        {status === 'verified' && (
          <span className="flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Verified ✓
          </span>
        )}
      </div>

      {/* Unverified Status */}
      {status === 'unverified' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-300">
            Verify your email address to unlock bidding capabilities and full platform access.
          </p>
          <Button
            onClick={handleSendCode}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? 'Sending...' : 'Send Verification Code'}
          </Button>
        </div>
      )}

      {/* Pending Status */}
      {status === 'pending' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-300">
            We've sent a verification code to your email. Please enter it below.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="text"
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength={6}
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={handleVerifyCode}
              disabled={isLoading || !verificationCode.trim()}
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </Button>
          </div>

          {timeRemaining !== null && timeRemaining > 0 && (
            <p className="text-sm text-gray-400 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Code expires in {formatTimeRemaining(timeRemaining)}
            </p>
          )}

          <button
            onClick={handleSendCode}
            disabled={isLoading || (timeRemaining !== null && timeRemaining > 0)}
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors disabled:text-gray-600 disabled:cursor-not-allowed min-h-[44px] px-2"
            aria-label="Resend verification code"
          >
            Resend Code
          </button>
        </div>
      )}

      {/* Verified Status */}
      {status === 'verified' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <div>
              <p className="text-green-500 font-medium">Email is verified</p>
              <p className="text-sm text-green-400">Your email has been successfully verified. You can now bid on projects!</p>
            </div>
          </div>
        </div>
      )}

      {/* Message Display */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-3 rounded-lg flex items-start gap-2 ${
            messageType === 'success'
              ? 'bg-green-500/20 text-green-400'
              : messageType === 'error'
              ? 'bg-red-500/20 text-red-400'
              : 'bg-blue-500/20 text-blue-400'
          }`}
        >
          {messageType === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          )}
          <p className="text-sm">{message}</p>
        </motion.div>
      )}
    </motion.div>
  );
};
