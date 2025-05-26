import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie, deleteCookie, isAuthenticated } from '../utils/cookieUltis';
import { User } from '../types/User';

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = (): void => {
    try {
      if (isAuthenticated()) {
        const userData = getCookie('adminUser');
        if (userData) {
          const parsedUser: User = JSON.parse(userData);
          setUser(parsedUser);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('❌ Auth check error:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    deleteCookie('adminToken');
    deleteCookie('adminRefreshToken');
    deleteCookie('adminUser');
    setUser(null);
    navigate('/login'); 
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    logout,
    checkAuth
  };
};
