import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchSingleProduct } from '../api/ApiCollection';
import { getTotalStock } from '../utils/productHelper';
import toast from 'react-hot-toast';
import { HiOutlineArrowLeft, HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2';
import ProductImageGallery from '../components/product-details/ImageGallery';
import ProductBasicInfo from '../components/product-details/BasicInfo';
import ProductStockStats from '../components/product-details/StockStat';
import ProductVariants from '../components/product-details/Variants';
import ProductAdditionalInfo from '../components/product-details/AdditionalInfo';
import ImageModal from '../components/product-details/ImageModal';

const Product: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const { isLoading, isError, data: response } = useQuery({
    queryKey: ['productDetail', id],
    queryFn: () => fetchSingleProduct(id!),
    enabled: !!id,
  });

  React.useEffect(() => {
    if (isLoading) {
      toast.loading('Loading product details...', { id: 'productDetail' });
    } else if (isError) {
      toast.error('Failed to load product details!', { id: 'productDetail' });
    } else if (response) {
      toast.success('Product details loaded successfully!', { id: 'productDetail' });
    }
  }, [isLoading, isError, response]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (isError || !response?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-error mb-4">Product Not Found</h2>
          <button 
            onClick={() => navigate('/products')}
            className="btn btn-primary"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const product: Product = response.data;
  const totalStock = getTotalStock(product.variants);
  const totalVariants = product.variants.length;

  const handleEditProduct = () => {
    toast('Edit functionality to be implemented');
  };

  const handleDeleteProduct = () => {
    toast('Delete functionality to be implemented');
  };

  return (
    <div className="min-h-screen bg-base-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/products')}
              className="btn btn-ghost btn-circle"
            >
              <HiOutlineArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-base-content">Product Details</h1>
              <p className="text-base-content/70">ID: {product._id}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleEditProduct}
              className="btn btn-primary"
            >
              <HiOutlinePencilSquare size={16} />
              <span className="hidden sm:inline">Edit Product</span>
              <span className="sm:hidden">Edit</span>
            </button>
            <button
              onClick={handleDeleteProduct}
              className="btn btn-error"
            >
              <HiOutlineTrash size={16} />
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Images */}
          <div className="lg:col-span-1">
            <ProductImageGallery
              images={product.images ?? []}
              productName={product.name}
              selectedImageIndex={selectedImageIndex}
              onImageSelect={setSelectedImageIndex}
              onImageClick={() => setIsImageModalOpen(true)}
            />
          </div>

          {/* Middle Column - Basic Info */}
          <div className="lg:col-span-1">
            <ProductBasicInfo product={product} />
            <ProductStockStats 
              totalStock={totalStock} 
              totalVariants={totalVariants} 
            />
          </div>

          {/* Right Column - Variants & Additional Info */}
          <div className="lg:col-span-1">
            <ProductVariants variants={product.variants} />
            <ProductAdditionalInfo product={product} />
          </div>
        </div>

        {/* Image Modal */}
        <ImageModal
          isOpen={isImageModalOpen}
          images={product.images ?? []}
          productName={product.name}
          selectedImageIndex={selectedImageIndex}
          onClose={() => setIsImageModalOpen(false)}
          onImageSelect={setSelectedImageIndex}
        />
      </div>
    </div>
  );
};

export default Product;