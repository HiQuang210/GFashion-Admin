import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie, deleteCookie } from '../utils/cookieUtils';
import { User } from '../types/User';
import { fetchSingleUser } from '../api/ApiCollection';

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

  const checkAuth = async (): Promise<void> => {
    const token = getCookie('adminToken');
    const userId = getCookie('adminUserId');

    if (!token || !userId) {
      logout();
      return;
    }

    try {
      const response = await fetchSingleUser(userId);
      const userData = response.data || response;
      setUser(userData);
    } catch (error) {
      console.error('❌ Failed to fetch user from ID:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    deleteCookie('adminToken');
    deleteCookie('adminRefreshToken');
    deleteCookie('adminUserId');
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