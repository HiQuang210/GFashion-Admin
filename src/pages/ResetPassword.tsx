import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DiReact } from 'react-icons/di';
import { PiEyeBold, PiEyeClosedBold } from 'react-icons/pi';
import { HiCheck, HiX } from 'react-icons/hi';
import { resetPassword } from '@api/ApiCollection';
import ChangeThemes from '@components/ChangesThemes';

interface LocationState {
  email: string;
  code: string;
}

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Redirect to forgot password if no state is provided
    if (!state?.email || !state?.code) {
      navigate('/forgot-password', { replace: true });
    }
  }, [state, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.newPassword || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    const passwordError = validatePassword(formData.newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await resetPassword(state.email, state.code, formData.newPassword);

      if (response.status === 'OK') {
        // Show success message and redirect to login
        navigate('/login', { 
          state: { 
            successMessage: 'Password reset successfully! Please log in with your new password.' 
          },
          replace: true 
        });
      } else {
        setError(response.message || 'Failed to reset password');
      }
    } catch (error: any) {
      console.error('Reset password error:', error);
      if (error?.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, text: '' };
    if (password.length < 6) return { strength: 1, text: 'Too short' };
    if (password.length < 8) return { strength: 2, text: 'Weak' };
    if (password.length < 12) return { strength: 3, text: 'Good' };
    return { strength: 4, text: 'Strong' };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  if (!state?.email || !state?.code) {
    return null; // Will redirect in useEffect
  }

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
            <h2 className="xl:text-xl font-semibold">Reset Password</h2>
            <p className="text-sm text-base-content/70 mt-1">
              Enter your new password for {state.email}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full flex flex-col items-stretch gap-3">
            {error && (
              <div className="alert alert-error">
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* New Password Input */}
            <label className="input input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type={showPassword ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="grow input outline-none focus:outline-none border-none h-auto pl-1 pr-0"
                placeholder="New Password"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="btn btn-ghost btn-sm p-0 h-auto min-h-0 hover:bg-transparent"
                disabled={isLoading}
                tabIndex={-1}
              >
                {showPassword ? (
                  <PiEyeClosedBold className="w-4 h-4 opacity-70 hover:opacity-100 transition-opacity" />
                ) : (
                  <PiEyeBold className="w-4 h-4 opacity-70 hover:opacity-100 transition-opacity" />
                )}
              </button>
            </label>

            {/* Password Strength Indicator */}
            {formData.newPassword && (
              <div className="w-full">
                <div className="flex justify-between text-xs mb-1">
                  <span>Password Strength</span>
                  <span className={
                    passwordStrength.strength <= 1 ? 'text-error' :
                    passwordStrength.strength <= 2 ? 'text-warning' :
                    'text-success'
                  }>
                    {passwordStrength.text}
                  </span>
                </div>
                <div className="w-full bg-base-300 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      passwordStrength.strength <= 1 ? 'bg-error' :
                      passwordStrength.strength <= 2 ? 'bg-warning' :
                      'bg-success'
                    }`}
                    style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Confirm Password Input */}
            <label className="input input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="grow input outline-none focus:outline-none border-none h-auto pl-1 pr-0"
                placeholder="Confirm New Password"
                required
                disabled={isLoading}
              />
              {formData.confirmPassword && (
                <div className="flex items-center">
                  {formData.newPassword === formData.confirmPassword ? (
                    <HiCheck className="w-4 h-4 text-green-500" />
                  ) : (
                    <HiX className="w-4 h-4 text-red-500" />
                  )}
                </div>
              )}
            </label>

            <button
              type="submit"
              disabled={isLoading || formData.newPassword !== formData.confirmPassword}
              className="btn btn-block btn-primary"
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  <span className="ml-2">Resetting Password...</span>
                </>
              ) : (
                'Reset Password'
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="btn btn-ghost btn-sm"
            >
              ← Back to Verification
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;