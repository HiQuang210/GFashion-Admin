import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/cookieUtils'

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  if (!isAuthenticated()) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;