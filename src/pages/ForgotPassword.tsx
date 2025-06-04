import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DiReact } from 'react-icons/di';
import { requestPasswordReset, verifyResetCode } from '@api/ApiCollection';
import ChangeThemes from '@components/ChangesThemes';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [passcode, setPasscode] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await requestPasswordReset(email);

      if (response.status === 'OK') {
        setIsEmailSent(true);
        setSuccess('A password reset request email has been sent to your email, if you don\'t see the email, please check your spam folder!');
      } else {
        setError(response.message || 'Failed to send reset email');
      }
    } catch (error: any) {
      console.error('Password reset request error:', error);
      if (error?.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasscodeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!passcode) {
      setError('Please enter the verification code');
      return;
    }

    if (passcode.length !== 6) {
      setError('Verification code must be 6 digits');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await verifyResetCode(email, passcode);

      if (response.status === 'OK') {
        // Navigate to reset password page with email and code
        navigate('/reset-password', { 
          state: { email, code: passcode },
          replace: true 
        });
      } else {
        setError(response.message || 'Invalid verification code');
      }
    } catch (error: any) {
      console.error('Verify code error:', error);
      if (error?.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Failed to verify code. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'passcode') {
      // Only allow digits and limit to 6 characters
      const numericValue = value.replace(/\D/g, '').slice(0, 6);
      setPasscode(numericValue);
    }
    if (error) setError('');
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await requestPasswordReset(email);
      if (response.status === 'OK') {
        setSuccess('Verification code resent successfully!');
      } else {
        setError(response.message || 'Failed to resend code');
      }
    } catch (error: any) {
      setError('Failed to resend code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full p-0 m-0">
      <div className="w-full min-h-screen flex justify-center items-center bg-base-200 relative">
        <div className="absolute top-5 right-5 z-[99]">
          <ChangeThemes />
        </div>

        <div className="w-full h-screen xl:h-auto xl:w-[30%] 2xl:w-[25%] 3xl:w-[20%] bg-base-100 rounded-lg shadow-md flex flex-col items-center p-5 pb-6 gap-4 pt-14 xl:pt-5">
          <div className="flex items-center gap-2">
            <DiReact className="text-4xl xl:text-6xl text-primary animate-spin-slow -ml-2" />
            <span className="text-lg xl:text-3xl font-semibold text-base-content dark:text-neutral-200">
              GFashion Dashboard
            </span>
          </div>

          <div className="text-center">
            <h2 className="xl:text-xl font-semibold">Forgot Password</h2>
            <p className="text-sm text-base-content/70 mt-1">
              {!isEmailSent 
                ? "Enter your email address to receive a verification code" 
                : "Enter the 6-digit code sent to your email"
              }
            </p>
          </div>

          <form 
            onSubmit={isEmailSent ? handlePasscodeSubmit : handleEmailSubmit} 
            className="w-full flex flex-col items-stretch gap-3"
          >
            {success && (
              <div className="alert alert-success">
                <span className="text-sm">{success}</span>
              </div>
            )}

            {error && (
              <div className="alert alert-error">
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Email Input */}
            <label className="input input-bordered min-w-full flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70"
              >
                <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
              </svg>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleInputChange}
                className="grow input outline-none focus:outline-none border-none h-auto pl-1 pr-0"
                placeholder="Email Address"
                required
                disabled={isLoading || isEmailSent}
              />
            </label>

            {/* Passcode Input - Only show after email is sent */}
            {isEmailSent && (
              <label className="input input-bordered min-w-full flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 opacity-70"
                >
                  <path d="M8 1a3.5 3.5 0 0 0-3.5 3.5V6H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-1.5V4.5A3.5 3.5 0 0 0 8 1zM6.5 4.5a1.5 1.5 0 1 1 3 0V6h-3V4.5z"/>
                </svg>
                <input
                  type="text"
                  name="passcode"
                  value={passcode}
                  onChange={handleInputChange}
                  className="grow input outline-none focus:outline-none border-none h-auto pl-1 pr-0 text-center tracking-widest font-mono text-lg"
                  placeholder="000000"
                  maxLength={6}
                  required
                  disabled={isLoading}
                />
              </label>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-block btn-primary"
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  <span className="ml-2">
                    {isEmailSent ? 'Verifying...' : 'Sending...'}
                  </span>
                </>
              ) : (
                isEmailSent ? 'Verify Code' : 'Send Reset Code'
              )}
            </button>

            {/* Additional Actions */}
            {isEmailSent && (
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isLoading}
                className="btn btn-outline btn-sm"
              >
                Resend Code
              </button>
            )}

            <button
              type="button"
              onClick={handleBackToLogin}
              className="btn btn-ghost btn-sm"
            >
              ← Back to Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;