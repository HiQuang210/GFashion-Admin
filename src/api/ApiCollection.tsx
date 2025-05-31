import axios, { AxiosResponse, AxiosError } from 'axios';
import { getCookie, deleteCookie } from '../utils/cookieUtils';
import { CreateUserData, User } from '../types/User'; 

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

// GET TOTAL USERS (excluding current user)
export const fetchTotalUsers = async () => {
  try {
    const response = await apiClient.get('/user/getAll');
    return response.data.totalUser; 
  } catch (err) {
    console.error('Failed to fetch total users:', err);
    throw err;
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

// GET TOTAL PRODUCTS
export const fetchTotalProducts = async () => {
  try {
    const response = await apiClient.get('/product/get-all-admin', {
      params: {
        limitItem: 1, 
        page: 1,
      },
    });

    const total = response.data?.totalItems ?? 0;
    console.log('Total products:', total);
    return total;
  } catch (error) {
    console.error('Failed to fetch total products:', error);
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
    if (productData.rating !== undefined) formData.append('rating', productData.rating.toString());

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

// GET TOTAL RATIO
export const fetchTotalRatio = async () => {
  const response = await axios
    .get('https://react-admin-ui-v1-api.vercel.app/totalratio')
    .then((res) => {
      console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET TOTAL REVENUE
export const fetchTotalRevenue = async () => {
  const response = await axios
    .get('https://react-admin-ui-v1-api.vercel.app/totalrevenue')
    .then((res) => {
      console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET TOTAL SOURCE
export const fetchTotalSource = async () => {
  const response = await axios
    .get('https://react-admin-ui-v1-api.vercel.app/totalsource')
    .then((res) => {
      console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET TOTAL VISIT
export const fetchTotalVisit = async () => {
  const response = await axios
    .get('https://react-admin-ui-v1-api.vercel.app/totalvisit')
    .then((res) => {
      console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET TOP DEALS
export const fetchTopDeals = async () => {
  const response = await axios
    .get('https://react-admin-ui-v1-api.vercel.app/topdeals')
    .then((res) => {
      console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET TOTAL REVENUE BY PRODUCTS
export const fetchTotalRevenueByProducts = async () => {
  const response = await axios
    .get(
      'https://react-admin-ui-v1-api.vercel.app/totalrevenue-by-product'
    )
    .then((res) => {
      console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET TOTAL PROFIT
export const fetchTotalProfit = async () => {
  const response = await axios
    .get('https://react-admin-ui-v1-api.vercel.app/totalprofit')
    .then((res) => {
      console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET ALL ORDERS
export const fetchOrders = async () => {
  const response = await axios
    .get('https://react-admin-ui-v1-api.vercel.app/orders')
    .then((res) => {
      console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET ALL POSTS
export const fetchPosts = async () => {
  const response = await axios
    .get('https://react-admin-ui-v1-api.vercel.app/posts')
    .then((res) => {
      console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET ALL NOTES
export const fetchNotes = async () => {
  const response = await axios
    .get(`https://react-admin-ui-v1-api.vercel.app/notes?q=`)
    .then((res) => {
      console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET ALL LOGS
export const fetchLogs = async () => {
  const response = await axios
    .get(`https://react-admin-ui-v1-api.vercel.app/logs`)
    .then((res) => {
      console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};
