import { useState } from 'react';
import ChangeThemes from '../components/ChangesThemes';
import { DiReact } from 'react-icons/di';
import { useNavigate } from 'react-router-dom';
import { adminLoginUser } from '../api/ApiCollection'; 
import { setCookie } from '../utils/cookieUltis'

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
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
      console.log('Attempting admin login with:', { 
        email: formData.email.toLowerCase().trim() 
      });

      const response = await adminLoginUser({
        email: formData.email.toLowerCase().trim(),
        password: formData.password
      });

      console.log('Login response:', response);

      if (response.status === 'OK') {
        // Store tokens in cookies
        const cookieDays = rememberMe ? 7 : 1; // 7 days if remember me, 1 day otherwise
        
        setCookie('adminToken', response.access_token, cookieDays);
        setCookie('adminRefreshToken', response.refresh_token, cookieDays);
        setCookie('adminUser', JSON.stringify(response.userInfo), cookieDays);

        // Navigate to dashboard
        navigate('/', { replace: true });
      } else {
        setError(response.message || 'Login failed'); 
      }
      
    } catch (error) {
      console.error('Login error:', error);

      // Narrow error type to access properties safely
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as any).response === 'object'
      ) {
        const errResponse = (error as any).response;
        if (errResponse?.data?.message) {
          setError(errResponse.data.message);
        } else if (errResponse?.status === 403) {
          setError('Access denied. Admin privileges required.');
        } else if (errResponse?.status === 401) {
          setError('Invalid email or password');
        } else if (errResponse?.status === 404) {
          setError('User not found');
        } else {
          setError('Login failed. Please check your connection and try again.');
        }
      } else {
        setError('Login failed. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // screen
    <div className="w-full p-0 m-0">
      {/* container */}
      <div className="w-full min-h-screen flex justify-center items-center bg-base-200 relative">
        {/* theme */}
        <div className="absolute top-5 right-5 z-[99]">
          <ChangeThemes />
        </div>
        <div className="w-full h-screen xl:h-auto xl:w-[30%] 2xl:w-[25%] 3xl:w-[20%] bg-base-100 rounded-lg shadow-md flex flex-col items-center p-5 pb-7 gap-8 pt-20 xl:pt-7">
          <div className="flex items-center gap-1 xl:gap-2">
            <DiReact className="text-4xl sm:text-4xl xl:text-6xl 2xl:text-6xl text-primary animate-spin-slow -ml-3" />
            <span className="text-[18px] leading-[1.2] sm:text-lg xl:text-3xl 2xl:text-3xl font-semibold text-base-content dark:text-neutral-200">
              GFashion Dashboard
            </span>
          </div>
          <span className="xl:text-xl font-semibold">
            Hello, 👋 Welcome Back!
          </span>
          
          <form onSubmit={handleSubmit} className="w-full flex flex-col items-stretch gap-3">
            {/* Error message */}
            {error && (
              <div className="alert alert-error">
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Email input */}
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
                className="grow input outline-none focus:outline-none border-none border-[0px] h-auto pl-1 pr-0"
                placeholder="Email"
                required
                disabled={isLoading}
              />
            </label>

            {/* Password input */}
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
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="grow input outline-none focus:outline-none border-none border-[0px] h-auto pl-1 pr-0"
                placeholder="Password"
                required
                disabled={isLoading}
              />
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
                  <span className="label-text text-xs">
                    Remember me
                  </span>
                </label>
              </div>
              <a
                href="#"
                className="link link-primary font-semibold text-xs no-underline"
              >
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`btn btn-block btn-primary ${isLoading ? 'loading' : ''}`}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Logging in...
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