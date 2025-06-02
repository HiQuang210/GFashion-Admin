export interface User {
  _id: string;
  email: string;
  password?: string; 
  firstName?: string;
  lastName?: string;
  img?: string;
  isActive: boolean;
  isAdmin: boolean;
  phone?: string;
  favorite: string[]; 
  totalSpent: number;
  cart: {
    product: string; 
    color: string;
    size: string;
    quantity: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  phone: string;
  firstName: string;
  lastName: string;
}