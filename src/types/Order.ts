export interface OrderProduct {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  color: string;
  size: string;
  image: string;
  type: string;
  producer: string;
  material: string;
  description?: string;
}

export interface OrderUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  img: string;
  fullName: string;
}

export interface AdminOrder {
  id: string;
  userId: string;
  recipient: string; 
  address: string;
  phone: string;
  delivery: string;
  payment: string;
  note: string;
  status: string;
  createdAt: string;
  products: OrderProduct[];
  total: number;
  user: OrderUser; 
}