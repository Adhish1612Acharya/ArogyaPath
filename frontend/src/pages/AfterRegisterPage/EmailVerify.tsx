import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Edit2, Mail } from 'lucide-react';

export default function EmailVerify() {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [email, setEmail] = useState('user@example.com'); // Default or from state
  const [showEditEmail, setShowEditEmail] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const handleChange = (index: number, value: string) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleVerify = () => {
    setIsLoading(true);
    setTimeout(() => {
      const isValid = otp.join('') === '123456';
      setVerificationStatus(isValid ? 'success' : 'error');
      setIsLoading(false);
    }, 1500);
  };

  const handleResend = () => {
    setIsLoading(true);
    setResendDisabled(true);
    
    // Start countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setOtp(['', '', '', '', '', '']);
    }, 1000);
  };

  const handleUpdateEmail = () => {
    setShowEditEmail(false);
    setOtp(['', '', '', '', '', '']);
    setVerificationStatus('idle');
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-bold text-green-800">
            Verify Your Email Address
          </CardTitle>
          
          {!showEditEmail ? (
            <div className="flex items-center justify-center gap-2">
              <p className="text-sm text-gray-600">
                We've sent a 6-digit OTP to {email}
              </p>
              <button
  onClick={() => setShowEditEmail(true)}
  className="text-sm font-medium text-amber-600 hover:text-amber-800 flex items-center gap-1"
>
  <Edit2 className="h-4 w-4" />
  Change Email?
</button>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 text-left">
                Enter your email address
              </Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  placeholder="your@email.com"
                />
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleUpdateEmail}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Update
                </Button>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {verificationStatus === 'success' ? (
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-green-800">
                Email Verified Successfully!
              </h3>
              <p className="text-sm text-gray-600">
                Your account has been verified. You can now access all features.
              </p>
              <Button
                component={Link}
                to="/dashboard"
                variant="contained"
                color="success"
                fullWidth
                className="mt-4 bg-green-600 hover:bg-green-700"
              >
                Go to Dashboard
              </Button>
            </div>
          ) : verificationStatus === 'error' ? (
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-red-800">
                Verification Failed
              </h3>
              <p className="text-sm text-gray-600">
                The OTP you entered is incorrect. Please try again.
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  onClick={() => {
                    setVerificationStatus('idle');
                    setOtp(['', '', '', '', '', '']);
                  }}
                >
                  Try Again
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  fullWidth
                  onClick={handleResend}
                  disabled={isLoading || resendDisabled}
                >
                  {isLoading ? 'Sending...' : resendDisabled ? `Resend in ${countdown}s` : 'Resend OTP'}
                </Button>
              </div>
            </div>
          ) : !showEditEmail ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-gray-700">
                  Enter 6-digit OTP
                </Label>
                <div className="flex justify-between space-x-2">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      className="h-14 w-14 text-center text-2xl font-semibold"
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleResend}
                  disabled={isLoading || resendDisabled}
                  className={`text-sm font-medium flex items-center gap-1 ${
                    resendDisabled 
                      ? 'text-gray-400' 
                      : 'text-green-600 hover:text-green-800'
                  }`}
                >
                  <Mail className="h-4 w-4" />
                  {isLoading ? (
                    'Sending...'
                  ) : resendDisabled ? (
                    `Resend OTP in ${countdown}s`
                  ) : (
                    'Resend OTP'
                  )}
                </button>
              </div>

              <Button
                variant="contained"
                color="success"
                fullWidth
                onClick={handleVerify}
                disabled={isLoading || otp.some(d => d === '')}
                className="bg-green-600 hover:bg-green-700 mt-4"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Email'
                )}
              </Button>
            </>
          ) : null}
        </CardContent>

        {!showEditEmail && verificationStatus === 'idle' && (
          <CardFooter className="flex justify-center">
            <button
              onClick={() => setShowEditEmail(true)}
              className="text-sm font-medium text-green-600 hover:text-green-800 flex items-center gap-1"
            >
              <Edit2 className="h-4 w-4" />
              Not your email? Edit email address
            </button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}