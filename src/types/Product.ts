
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

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  selectedImageIndex: number;
  onImageSelect: (index: number) => void;
  onImageClick: () => void;
  isEditing?: boolean;
  onImagesChange?: (images: string[]) => void;
}

interface ImageModalProps {
  isOpen: boolean;
  images: string[];
  productName: string;
  selectedImageIndex: number;
  onClose: () => void;
  onImageSelect: (index: number) => void;
  isEditing?: boolean;
  onImagesChange?: (images: string[]) => void;
}