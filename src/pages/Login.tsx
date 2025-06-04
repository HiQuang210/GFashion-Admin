import { useState } from 'react';
import ChangeThemes from '@components/ChangesThemes';
import { DiReact } from 'react-icons/di';
import { PiEyeBold, PiEyeClosedBold } from 'react-icons/pi';
import { useNavigate, useLocation } from 'react-router-dom';
import { adminLoginUser } from '@api/ApiCollection';
import { setCookie } from '@utils/cookieUtils';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState(location.state?.successMessage || '');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
    if (successMessage) setSuccessMessage('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await adminLoginUser({
        email: formData.email.toLowerCase().trim(),
        password: formData.password
      });

      if (response.status === 'OK') {
        const cookieDays = rememberMe ? 7 : 1;

        setCookie('adminToken', response.access_token, cookieDays);
        setCookie('adminRefreshToken', response.refresh_token, cookieDays);
        setCookie('adminUserId', response.userInfo._id, cookieDays);

        navigate('/', { replace: true });
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);

      if (error?.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Login failed. Please check your connection and try again.');
      }
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

          <span className="xl:text-xl font-semibold -mt-2">
            Hello, 👋 Welcome Back!
          </span>

          <form onSubmit={handleSubmit} className="w-full flex flex-col items-stretch gap-3">
            {error && (
              <div className="alert alert-error">
                <span className="text-sm">{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="alert alert-success">
                <span className="text-sm">{successMessage}</span>
              </div>
            )}

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
                value={formData.email}
                onChange={handleInputChange}
                className="grow input outline-none focus:outline-none border-none h-auto pl-1 pr-0"
                placeholder="Email"
                required
                disabled={isLoading}
              />
            </label>

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
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="grow input outline-none focus:outline-none border-none h-auto pl-1 pr-0"
                placeholder="Password"
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

            <div className="flex items-center justify-between">
              <div className="form-control">
                <label className="label cursor-pointer gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="checkbox w-4 h-4 rounded-md checkbox-primary"
                    disabled={isLoading}
                  />
                  <span className="label-text text-xs">Remember me</span>
                </label>
              </div>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="link link-primary font-semibold text-xs no-underline hover:underline"
                disabled={isLoading}
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`btn btn-block btn-primary`}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  <span className="ml-2">Logging in...</span>
                </>
              ) : (
                'Log In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;