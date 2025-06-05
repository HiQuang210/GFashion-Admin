import axios, { AxiosResponse, AxiosError } from 'axios';
import { getCookie, deleteCookie } from '@utils/cookieUtils';
import { CreateUserData, User } from '@type/User'; 
import { CreateReviewData, Review } from '@type/Review';
import { ReviewsResponse, FetchReviewsParams } from '@type/Review';

const API_BASE_URL = 'http://localhost:5000/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  status: string;
  message: string;
  access_token: string;
  refresh_token: string;
  userInfo: User;
}

interface FetchAdminProductsParams {
  limitItem?: number;
  page?: number;
  sort?: string;
  filter?: string;
  searchQuery?: string;
}

interface UpdateOrderStatusResponse {
  status: string;
  message: string;
  data: {
    id: string;
    status: string;
  };
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getCookie('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      deleteCookie('adminToken');
      deleteCookie('adminRefreshToken');
      deleteCookie('adminUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// REGISTER USER
export const registerUser = async (newUser: CreateUserData) => {
  try {
    const userData = {
      email: newUser.email,
      password: newUser.password,
      phone: newUser.phone,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
    };

    console.log('Sending userData:', userData);

    const response = await apiClient.post('/user/sign-up', userData, {
      headers: { 'Content-Type': 'application/json' },
    });

    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    if (axios.isAxiosError(error)) {
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);
    }
    throw error;
  }
};

// ADMIN LOGIN
export const adminLoginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>(
      '/user/admin-sign-in',
      credentials
    );
    return response.data;
  } catch (error) {
    console.error('Admin login error:', error);
    throw error;
  }
};

// GET ALL USERS (excluding current user)
export const fetchUsers = async () => {
  try {
    const response = await apiClient.get('/user/getAll');
    console.log('Fetched users:', response.data);
    return response.data;
  } catch (err) {
    console.error('Failed to fetch all users:', err);
    throw err;
  }
};

// GET SINGLE USER
export const fetchSingleUser = async (id: string) => {
  try {
    const response = await apiClient.get(`/user/get-detail/${id}`);
    console.log('Fetched single user:', response.data);
    return response.data;
  } catch (err) {
    console.error('Failed to fetch user details:', err);
    throw err;
  }
};

// HELPER FUNCTION - Tạo FormData từ data và file
const createFormData = (updatedData: Partial<User>, avatarFile?: File): FormData => {
  const formData = new FormData();
  
  if (avatarFile) {
    formData.append("avatar", avatarFile);
  }

  Object.entries(updatedData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });

  return formData;
};

// USER INFO UPDATE
const updateUserGeneric = async (
  endpoint: string,
  id: string,
  updatedData: Partial<User>,
  avatarFile?: File,
  logMessage?: string
) => {
  try {
    const formData = createFormData(updatedData, avatarFile);

    const response = await apiClient.put(`${endpoint}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (logMessage) {
      console.log(logMessage, response.data);
    }
    
    return response.data;
  } catch (err) {
    console.error(`Failed to update user via ${endpoint}:`, err);
    throw err;
  }
};

// UPDATE USER INFO (for regular users)
export const updateUser = async (
  id: string,
  updatedData: Partial<User>,
  avatarFile?: File 
) => {
  return updateUserGeneric(
    '/user/update-user',
    id,
    updatedData,
    avatarFile,
    'User updated:'
  );
};

// UPDATE USER INFO FOR ADMIN
export const updateUserByAdmin = async (
  id: string,
  updatedData: Partial<User>,
  avatarFile?: File
) => {
  return updateUserGeneric(
    '/user/admin-update-user',
    id,
    updatedData,
    avatarFile,
    'User updated by admin:'
  );
};

// CHANGE PASSWORD
export const changePassword = (
  id: string,
  { oldPassword, newPassword }: { oldPassword: string; newPassword: string }
) => {
  return apiClient
    .put(`/user/change-password/${id}`, {
      oldPassword,
      newPassword,
    })
    .then((res) => res.data);
};

// REQUEST PASSWORD RESET
export const requestPasswordReset = (email: string) => {
  return apiClient
    .post('/user/request-password-reset', { email })
    .then((res) => res.data);
};

// VERIFY RESET CODE
export const verifyResetCode = (email: string, code: string) => {
  return apiClient
    .post('/user/verify-reset-code', { email, code })
    .then((res) => res.data);
};

// RESET PASSWORD
export const resetPassword = (email: string, code: string, newPassword: string) => {
  return apiClient
    .post('/user/reset-password', { email, code, newPassword })
    .then((res) => res.data);
};

// GET ALL PRODUCTS FOR ADMIN
export const fetchAdminProducts = async (params: FetchAdminProductsParams = {}) => {
  try {
    const response = await apiClient.get('/product/get-all-admin', {
      params: {
        limitItem: params.limitItem || 10,
        page: params.page || 1,
        sort: params.sort || '',
        filter: params.filter || '',
        searchQuery: params.searchQuery || '',
      },
    });

    console.log('Admin products:', response.data);
    return response.data;
  } catch (error) {
    console.error('Fetch admin products failed:', error);
    throw error;
  }
};

// CREATE PRODUCT
export const createProduct = async (productData: Partial<Product>) => {
  try {
    const formData = new FormData();

    if (productData.name) formData.append('name', productData.name);
    if (productData.type) formData.append('type', productData.type);
    if (productData.price !== undefined) formData.append('price', productData.price.toString());
    if (productData.producer) formData.append('producer', productData.producer);
    if (productData.description) formData.append('description', productData.description);
    if (productData.material) formData.append('material', productData.material);

    if (productData.variants) {
      formData.append('variants', JSON.stringify(productData.variants));
    }

    if (productData.images) {
      const newImageFiles = productData.images.filter(img => img.startsWith('data:'));

      for (let i = 0; i < newImageFiles.length; i++) {
        const base64Image = newImageFiles[i];
        const response = await fetch(base64Image);
        const blob = await response.blob();

        const file = new File([blob], `image_${i}.jpg`, { type: 'image/jpeg' });
        formData.append('images', file);
      }
    }

    const response = await apiClient.post('/product/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Product created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to create product:', error);
    throw error;
  }
};

// GET SINGLE PRODUCT BY ID
export const fetchSingleProduct = async (id: string) => {
  try {
    const response = await apiClient.get(`/product/get-detail/${id}`);
    console.log('Fetched product detail:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch product detail:', error);
    throw error;
  }
};

// UPDATE PRODUCT BY ID
export const updateProduct = async (id: string, productData: Partial<Product>, removedImages: string[] = []) => {
  try {
    const formData = new FormData();

    if (productData.name) formData.append('name', productData.name);
    if (productData.type) formData.append('type', productData.type);
    if (productData.price !== undefined) formData.append('price', productData.price.toString());
    if (productData.producer) formData.append('producer', productData.producer);
    if (productData.description) formData.append('description', productData.description);
    if (productData.material) formData.append('material', productData.material);

    if (productData.variants) {
      formData.append('variants', JSON.stringify(productData.variants));
    }

    if (removedImages.length > 0) {
      formData.append('removedImages', JSON.stringify(removedImages));
    }

    if (productData.images) {
      const newImageFiles = productData.images.filter(img => img.startsWith('data:'));
      
      for (let i = 0; i < newImageFiles.length; i++) {
        const base64Image = newImageFiles[i];
        const response = await fetch(base64Image);
        const blob = await response.blob();
        
        const file = new File([blob], `image_${i}.jpg`, { type: 'image/jpeg' });
        formData.append('images', file);
      }
    }

    const response = await apiClient.put(`/product/update/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Product updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to update product:', error);
    throw error;
  }
};

//DELETE PRODUCT(S)

// DELETE SINGLE PRODUCT BY ID
export const deleteProduct = async (id: string) => {
  try {
    const response = await apiClient.delete(`/product/delete/${id}`);
    console.log('Product deleted successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to delete product:', error);
    throw error;
  }
};

// DELETE MULTIPLE PRODUCTS
export const deleteMultipleProducts = async (ids: string[]) => {
  try {
    const response = await apiClient.delete('/product/delete', {
      data: { ids }
    });
    console.log('Products deleted successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to delete products:', error);
    throw error;
  }
};

// GET ALL ORDERS
export const fetchOrders = async () => {
  try {
    const response = await apiClient.get('/order/admin-get-all');
    console.log('fetchOrders response:', response.data);

    if (response.data.status === 'OK') {
      return response.data; 
    } else {
      throw new Error(response.data.message || 'Failed to fetch orders');
    }
  } catch (error: any) {
    console.error('fetchOrders error:', error);
    throw error;
  }
};

// GET ORDER BY ID FOR ADMIN
export const fetchOrderById = async (orderId: string) => {
  try {
    const response = await apiClient.get(`/order/admin-get-detail/${orderId}`);
    console.log('fetchOrderById response:', response.data);
    
    if (response.data.status === 'OK') {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch order details');
    }
  } catch (error: any) {
    console.error('fetchOrderById error:', error);
    throw error;
  }
};

// UPDATE ORDER STATUS
export const updateOrderStatus = async (orderId: string, status: string): Promise<UpdateOrderStatusResponse> => {
  try {
    const response = await apiClient.put(`/order/update-status/${orderId}?status=${status}`);
    console.log('updateOrderStatus response:', response.data);
    
    if (response.data.status === 'OK') {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Failed to update order status');
    }
  } catch (error: any) {
    console.error('updateOrderStatus error:', error);
    throw error;
  }
};

// GET TOTAL REVENUE STATS 
export const fetchTotalRevenueStats = async (year?: string) => {
  try {
    const response = await apiClient.get(`/report/revenue-stats${year ? `?year=${year}` : ''}`);
    console.log('fetchTotalRevenueStats response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('fetchTotalRevenueStats error:', error);
    throw error;
  }
};

// GET MONTHLY REVENUE DATA 
export const fetchMonthlyRevenue = async (year?: string) => {
  try {
    const response = await apiClient.get(`/report/revenue${year ? `?year=${year}` : ''}`);
    console.log('fetchMonthlyRevenue response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('fetchMonthlyRevenue error:', error);
    throw error;
  }
};

// EXPORT REVENUE REPORT
export const exportRevenueReport = async (year?: string) => {
  try {
    const response = await apiClient.get(`/report/exportRevenue${year ? `?year=${year}` : ''}`, {
      responseType: 'blob'
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `revenue-${year || '2025'}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return response;
  } catch (error: any) {
    console.error('exportRevenueReport error:', error);
    throw error;
  }
};

// GET SOLDS BY PRODUCTS TYPE
export const fetchTopSellingProducts = async () => {
  try {
    const response = await fetchAdminProducts({ 
      limitItem: 50, 
      page: 1,
      sort: 'sold', 
    });
    
    // Return the response in the expected format
    return {
      data: {
        products: response.data // Assuming response.data contains the products array
      }
    };
  } catch (error) {
    console.error('Fetch top selling products failed:', error);
    throw error;
  }
};

// GET ALL REVIEWS FOR ADMIN
export const fetchAllReviews = async (params: FetchReviewsParams = {}): Promise<ReviewsResponse> => {
  try {
    const response = await apiClient.get('/review/admin/all', {
      params: {
        page: params.page || 1,
        limitItem: params.limitItem || 10,
        sort: params.sort || '-createdAt',
        filter: params.filter || '',
        searchQuery: params.searchQuery || '',
      },
    });

    console.log('Fetched all reviews:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch all reviews:', error);
    throw error;
  }
};

// GET REVIEW BY ORDER ID
export const fetchReviewByOrderId = async (orderId: string): Promise<{ status: string; message: string; data: Review }> => {
  try {
    const response = await apiClient.get(`/review/order/${orderId}`);
    console.log('Fetched review by order ID:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch review by order ID:', error);
    throw error;
  }
};

// GET REVIEWS BY PRODUCT ID
export const fetchProductReviews = async (productId: string): Promise<{ status: string; message: string; data: Review[] }> => {
  try {
    const response = await apiClient.get(`/review/product/${productId}`);
    console.log('Fetched product reviews:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch product reviews:', error);
    throw error;
  }
};

// GET USER REVIEWS (requires authentication)
export const fetchUserReviews = async (): Promise<{ status: string; message: string; data: Review[] }> => {
  try {
    const response = await apiClient.get('/review/user');
    console.log('Fetched user reviews:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user reviews:', error);
    throw error;
  }
};

// CREATE REVIEW (requires authentication)
export const createReview = async (reviewData: CreateReviewData): Promise<{ status: string; message: string; data: Review }> => {
  try {
    const response = await apiClient.post('/review/create', reviewData, {
      headers: { 'Content-Type': 'application/json' },
    });

    console.log('Review created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to create review:', error);
    throw error;
  }
};

// UPDATE REVIEW 
export const updateReview = async (
  reviewId: string, 
  reviewData: Partial<CreateReviewData>
): Promise<{ status: string; message: string; data: Review }> => {
  try {
    const response = await apiClient.put(`/review/update/${reviewId}`, reviewData, {
      headers: { 'Content-Type': 'application/json' },
    });

    console.log('Review updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to update review:', error);
    throw error;
  }
};

// DELETE REVIEW (FOR ADMIN)
export const deleteReview = async (reviewId: string): Promise<{ status: string; message: string }> => {
  try {
    const response = await apiClient.delete(`/review/delete/${reviewId}`);
    console.log('Review deleted successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to delete review:', error);
    throw error;
  }
};

