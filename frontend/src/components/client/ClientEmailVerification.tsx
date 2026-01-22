import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, Clock, Send } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface ClientEmailVerificationProps {
  email: string;
  status: 'unverified' | 'pending' | 'verified';
  onSendCode: () => Promise<{ message: string; expiresAt: string }>;
  onVerifyCode: (code: string) => Promise<{ verified: boolean; message: string }>;
}

export const ClientEmailVerification: React.FC<ClientEmailVerificationProps> = ({
  email,
  status,
  onSendCode,
  onVerifyCode,
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSendCode = async () => {
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const result = await onSendCode();
      setMessage(result.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setError('Please enter the verification code');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const result = await onVerifyCode(verificationCode);
      if (result.verified) {
        setMessage('Email verified successfully!');
        setVerificationCode('');
      } else {
        setError(result.message || 'Invalid verification code');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify code');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Mail className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'verified':
        return 'Email verified';
      case 'pending':
        return 'Verification pending';
      default:
        return 'Email not verified';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'verified':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-500';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/50 border border-gray-800 rounded-xl p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        {getStatusIcon()}
        <h3 className="text-lg font-semibold text-white">Email Verification</h3>
        <span className={`text-sm ${getStatusColor()}`}>({getStatusText()})</span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
          <div>
            <p className="text-white font-medium">{email}</p>
            <p className="text-sm text-gray-400">
              {status === 'verified'
                ? 'This email address has been verified'
                : 'Verify your email to unlock all features'}
            </p>
          </div>
          
          {status !== 'verified' && (
            <Button
              onClick={handleSendCode}
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  {status === 'pending' ? 'Resend Code' : 'Send Code'}
                </>
              )}
            </Button>
          )}
        </div>

        {status === 'pending' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-4"
          >
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Enter 6-digit verification code"
                  value={verificationCode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVerificationCode(e.target.value)}
                  maxLength={6}
                />
              </div>
              <Button
                onClick={handleVerifyCode}
                disabled={isLoading || !verificationCode.trim()}
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Verifying...
                  </>
                ) : (
                  'Verify'
                )}
              </Button>
            </div>

            <p className="text-sm text-gray-400">
              Check your email for the verification code. It may take a few minutes to arrive.
            </p>
          </motion.div>
        )}

        {message && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 bg-green-900/20 border border-green-700 rounded-lg"
          >
            <p className="text-sm text-green-400">{message}</p>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 bg-red-900/20 border border-red-700 rounded-lg"
          >
            <p className="text-sm text-red-400">{error}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};