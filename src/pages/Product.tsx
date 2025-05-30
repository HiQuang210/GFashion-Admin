import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchSingleProduct, updateProduct } from '../api/ApiCollection';
import { getTotalStock } from '../utils/productHelper';
import toast from 'react-hot-toast';
import { HiOutlineArrowLeft, HiOutlinePencilSquare, HiOutlineTrash, HiOutlineCheck } from 'react-icons/hi2';
import ProductImageGallery from '../components/product-details/ImageGallery';
import ProductBasicInfo from '../components/product-details/BasicInfo';
import ProductStockStats from '../components/product-details/StockStat';
import ProductVariants from '../components/product-details/Variants';
import ProductAdditionalInfo from '../components/product-details/AdditionalInfo';
import ImageModal from '../components/product-details/ImageModal';

const Product: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);
  const [originalImages, setOriginalImages] = useState<string[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);

  // Fetch product data
  const { isLoading, isError, data: response, error } = useQuery({
    queryKey: ['productDetail', id],
    queryFn: () => fetchSingleProduct(id!),
    enabled: !!id,
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: ({ productData, removedImages }: { productData: Partial<Product>, removedImages: string[] }) =>
      updateProduct(id!, productData, removedImages),
    onMutate: () => toast.loading('Saving changes...', { id: 'productUpdate' }),
    onSuccess: (data) => {
      toast.success('Product updated successfully!', { id: 'productUpdate' });
      setIsEditing(false);
      setRemovedImages([]);
      queryClient.setQueryData(['productDetail', id], data);
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      queryClient.invalidateQueries({ queryKey: ['totalProducts'] });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to update product';
      toast.error(errorMessage, { id: 'productUpdate' });
    },
  });

  // Initialize edited product
  useEffect(() => {
    if (response?.data && !editedProduct) {
      setEditedProduct(response.data);
      setOriginalImages([...response.data.images]);
    }
  }, [response?.data, editedProduct]);

  // Handle toast notifications (separate effect to avoid retriggering on editedProduct changes)
  useEffect(() => {
    if (isLoading) {
      toast.loading('Loading product details...', { id: 'productDetail' });
    } else if (isError) {
      const errorMessage = (error as any)?.response?.data?.message || 'Failed to load product details!';
      toast.error(errorMessage, { id: 'productDetail' });
    } else if (response?.data) {
      toast.success('Product details loaded successfully!', { id: 'productDetail' });
    }
  }, [isLoading, isError, response?.data, error]);

  // Validation function
  const validateProduct = useCallback((product: Product): string | null => {
    if (!product.name?.trim()) return 'Product name is required';
    if (!product.type?.trim()) return 'Product type is required';
    if (!product.price || product.price <= 0) return 'Valid price is required';
    if (!product.producer?.trim()) return 'Producer is required';
    if (!product.description?.trim()) return 'Description is required';
    if (!product.material?.trim()) return 'Material is required';
    if (!product.images?.length) return 'At least one image is required';
    if (!product.variants?.length) return 'At least one variant is required';
    
    // Validate variants
    for (let i = 0; i < product.variants.length; i++) {
      const variant = product.variants[i];
      if (!variant.sizes || variant.sizes.length === 0) return `Variant ${i + 1}: Size is required`;
      if (!variant.color?.trim()) return `Variant ${i + 1}: Color is required`;
      if (variant.sizes.some(size => size.stock < 0)) return `Variant ${i + 1}: Stock cannot be negative`;
    }
    
    return null;
  }, []);

  // Handle save changes
  const handleSaveChanges = useCallback(async () => {
    if (!editedProduct) return;

    const error = validateProduct(editedProduct);
    if (error) {
      toast.error(`Validation failed: ${error}`);
      return;
    }

    // Clean up temporary IDs before sending to backend
    const cleanedProduct = {
      ...editedProduct,
      variants: editedProduct.variants.map(variant => ({
        ...variant,
        // Remove temporary IDs from new variants
        ...(variant._id.startsWith('temp-') ? { _id: undefined } : {}),
        sizes: variant.sizes.map(size => ({
          ...size,
          // Remove temporary IDs from new sizes
          ...(size._id.startsWith('temp-') ? { _id: undefined } : {})
        }))
      }))
    };

    await updateProductMutation.mutateAsync({
      productData: cleanedProduct,
      removedImages
    });
  }, [editedProduct, removedImages, updateProductMutation, validateProduct]);

  // Handle edit toggle
  const handleEditProduct = useCallback(() => {
    if (isEditing) {
      handleSaveChanges();
    } else {
      setIsEditing(true);
      if (response?.data) {
        setEditedProduct({ ...response.data });
        setOriginalImages([...response.data.images]);
        setRemovedImages([]);
      }
    }
  }, [isEditing, handleSaveChanges, response?.data]);

  // Handle cancel edit
  const handleCancelEdit = useCallback(() => {
    if (!response?.data) return;
    
    setIsEditing(false);
    setEditedProduct({ ...response.data });
    setRemovedImages([]);
    setSelectedImageIndex(0);
    toast.dismiss('productUpdate');
  }, [response?.data]);

  // Handle product field changes
  const handleProductChange = useCallback((field: keyof Product, value: any) => {
    setEditedProduct(prev => prev ? { ...prev, [field]: value } : null);
  }, []);

  // Handle variants change
  const handleVariantsChange = useCallback((variants: Variant[]) => {
    setEditedProduct(prev => prev ? { ...prev, variants } : null);
  }, []);

  // Handle images change
  const handleImagesChange = useCallback((images: string[]) => {
    if (!editedProduct) return;
    
    const newRemovedImages = originalImages.filter(img => !images.includes(img));
    setRemovedImages(prev => [...new Set([...prev, ...newRemovedImages])]);
    
    if (selectedImageIndex >= images.length) {
      setSelectedImageIndex(Math.max(0, images.length - 1));
    }
    
    setEditedProduct(prev => prev ? { ...prev, images } : null);
  }, [editedProduct, originalImages, selectedImageIndex]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  // Error state
  if (isError || !response?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-error mb-4">Product Not Found</h2>
          <p className="text-base-content/70 mb-4">
            {(error as any)?.response?.data?.message || 'The product you are looking for does not exist.'}
          </p>
          <button onClick={() => navigate('/products')} className="btn btn-primary">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const product: Product = response.data;
  const displayProduct = isEditing ? editedProduct! : product;
  const totalStock = getTotalStock(displayProduct.variants);
  const totalVariants = displayProduct.variants.length;
  const isPending = updateProductMutation.isPending;

  return (
    <div className="min-h-screen bg-base-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/products')}
              className="btn btn-ghost btn-circle"
              disabled={isPending}
            >
              <HiOutlineArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-base-content">Product Details</h1>
              <p className="text-base-content/70">ID: {product._id}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {isEditing && (
              <button onClick={handleCancelEdit} className="btn btn-ghost" disabled={isPending}>
                Cancel
              </button>
            )}
            <button
              onClick={handleEditProduct}
              className={`btn ${isEditing ? 'btn-success' : 'btn-primary'}`}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  <span className="hidden sm:inline">Saving...</span>
                  <span className="sm:hidden">...</span>
                </>
              ) : isEditing ? (
                <>
                  <HiOutlineCheck size={16} />
                  <span className="hidden sm:inline">Save Changes</span>
                  <span className="sm:hidden">Save</span>
                </>
              ) : (
                <>
                  <HiOutlinePencilSquare size={16} />
                  <span className="hidden sm:inline">Edit Product</span>
                  <span className="sm:hidden">Edit</span>
                </>
              )}
            </button>
            {!isEditing && (
              <button
                onClick={() => toast('Delete functionality to be implemented')}
                className="btn btn-error"
                disabled={isPending}
              >
                <HiOutlineTrash size={16} />
                <span className="hidden sm:inline">Delete</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ProductImageGallery
              images={displayProduct.images ?? []}
              productName={displayProduct.name}
              selectedImageIndex={selectedImageIndex}
              onImageSelect={setSelectedImageIndex}
              onImageClick={() => setIsImageModalOpen(true)}
              isEditing={isEditing}
              onImagesChange={handleImagesChange}
            />
          </div>

          <div className="lg:col-span-1">
            <ProductBasicInfo 
              product={displayProduct}
              isEditing={isEditing}
              onProductChange={handleProductChange}
            />
            <ProductStockStats 
              totalStock={totalStock} 
              totalVariants={totalVariants} 
            />
          </div>

          <div className="lg:col-span-1">
            <ProductVariants 
              variants={displayProduct.variants}
              isEditing={isEditing}
              onVariantsChange={handleVariantsChange}
            />
            <ProductAdditionalInfo 
              product={displayProduct}
              isEditing={isEditing}
              onProductChange={handleProductChange}
            />
          </div>
        </div>

        {/* Image Modal */}
        <ImageModal
          isOpen={isImageModalOpen}
          images={displayProduct.images ?? []}
          productName={displayProduct.name}
          selectedImageIndex={selectedImageIndex}
          onClose={() => setIsImageModalOpen(false)}
          onImageSelect={setSelectedImageIndex}
          isEditing={isEditing}
          onImagesChange={handleImagesChange}
        />
      </div>
    </div>
  );
};

export default Product;