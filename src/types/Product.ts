
// Define TypeScript interfaces based on your backend model
interface Size {
  size: string;
  stock: number;
  _id: string;
}

interface Variant {
  color: string;
  sizes: Size[];
  _id: string;
}

interface Product {
  _id: string;
  name: string;
  images?: string[];
  type: string;
  price: number;
  producer: string;
  variants: Variant[];
  rating: number;
  description?: string;
  material?: string;
  sold: number;
  createdAt: string;
  updatedAt: string;
}

interface ProductWithIndex extends Product {
  id: string;
  index: number;
}