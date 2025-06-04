import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProduct } from '@api/ApiCollection';
import toast from 'react-hot-toast';
import { HiOutlineArrowLeft, HiOutlinePlus } from 'react-icons/hi2';
import ProductImageGallery from '@components/product-details/ImageGallery';
import ProductBasicInfo from '@components/product-details/BasicInfo';
import ProductVariants from '@components/product-details/Variants';
import ProductAdditionalInfo from '@components/product-details/AdditionalInfo';
import ImageModal from '@components/product-details/ImageModal';

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const [newProduct, setNewProduct] = useState<Product>({
    _id: '',
    name: '',
    type: '',
    price: 0,
    producer: '',
    description: '',
    material: '',
    images: [],
    variants: [
      {
        _id: 'temp-variant-1',
        color: '',
        sizes: [
          {
            _id: 'temp-size-1',
            size: '',
            stock: 0
          }
        ]
      }
    ],
    rating: 0,
    sold: 0,
    createdAt: '',
    updatedAt: ''
  });

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: (productData: Partial<Product>) => createProduct(productData),
    onMutate: () => toast.loading('Creating product...', { id: 'productCreate' }),
    onSuccess: (data) => {
      toast.success('Product created successfully!', { id: 'productCreate' });
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      queryClient.invalidateQueries({ queryKey: ['totalProducts'] });
      navigate(`/product/${data.data._id}`);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to create product';
      toast.error(errorMessage, { id: 'productCreate' });
    },
  });

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
      if (variant.sizes.some(size => !size.size?.trim())) return `Variant ${i + 1}: Size name is required`;
    }
    
    return null;
  }, []);

  // Handle create product
  const handleCreateProduct = useCallback(async () => {
    const error = validateProduct(newProduct);
    if (error) {
      toast.error(`Validation failed: ${error}`);
      return;
    }

    // Clean up temporary IDs before sending to backend
  const cleanedProduct = {
    ...newProduct,
    variants: newProduct.variants.map(variant => {
      const cleanedVariant: any = {
        ...variant,
        sizes: variant.sizes.map(size => {
          const { _id, ...restSize } = size;
          return size._id.startsWith('temp-') ? restSize : size;
        })
      };

      if (variant._id.startsWith('temp-')) {
        delete cleanedVariant._id;
      }

      return cleanedVariant;
    })
  };

    await createProductMutation.mutateAsync(cleanedProduct);
  }, [newProduct, createProductMutation, validateProduct]);

  // Handle product field changes
  const handleProductChange = useCallback((field: keyof Product, value: any) => {
    setNewProduct(prev => ({ ...prev, [field]: value }));
  }, []);

  // Handle variants change
  const handleVariantsChange = useCallback((variants: Variant[]) => {
    setNewProduct(prev => ({ ...prev, variants }));
  }, []);

  // Handle images change
  const handleImagesChange = useCallback((images: string[]) => {
    if (selectedImageIndex >= images.length) {
      setSelectedImageIndex(Math.max(0, images.length - 1));
    }
    setNewProduct(prev => ({ ...prev, images }));
  }, [selectedImageIndex]);

  // Handle cancel - go back to products list
  const handleCancel = useCallback(() => {
    navigate('/products');
  }, [navigate]);

  const isPending = createProductMutation.isPending;
  const hasImages = newProduct.images && newProduct.images.length > 0;

  return (
    <div className="min-h-screen bg-base-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handleCancel}
              className="btn btn-ghost btn-circle"
              disabled={isPending}
            >
              <HiOutlineArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-base-content">Add New Product</h1>
              <p className="text-base-content/70">Create a new product with details and variants</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={handleCancel} 
              className="btn btn-ghost" 
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              onClick={handleCreateProduct}
              className="btn btn-success"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  <span className="hidden sm:inline">Creating...</span>
                  <span className="sm:hidden">...</span>
                </>
              ) : (
                <>
                  <HiOutlinePlus size={16} />
                  <span className="hidden sm:inline">Create Product</span>
                  <span className="sm:hidden">Create</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Image Gallery Column */}
          <div className="lg:col-span-1">
            <ProductImageGallery
              images={newProduct.images || []}
              productName={newProduct.name || 'New Product'}
              selectedImageIndex={selectedImageIndex}
              onImageSelect={setSelectedImageIndex}
              onImageClick={() => hasImages && setIsImageModalOpen(true)}
              isEditing={true}
              onImagesChange={handleImagesChange}
            />
          </div>

          {/* Basic Info Column */}
          <div className="lg:col-span-1">
            <ProductBasicInfo 
              product={newProduct}
              isEditing={true}
              onProductChange={handleProductChange}
            />
          </div>

          {/* Variants and Additional Info Column */}
          <div className="lg:col-span-1">
            <ProductVariants 
              variants={newProduct.variants}
              isEditing={true}
              onVariantsChange={handleVariantsChange}
            />
            <ProductAdditionalInfo 
              product={newProduct}
              isEditing={true}
              onProductChange={handleProductChange}
            />
          </div>
        </div>

        {/* Image Modal */}
        {hasImages && (
          <ImageModal
            isOpen={isImageModalOpen}
            images={newProduct.images || []}
            productName={newProduct.name || 'New Product'}
            selectedImageIndex={selectedImageIndex}
            onClose={() => setIsImageModalOpen(false)}
            onImageSelect={setSelectedImageIndex}
            isEditing={true}
            onImagesChange={handleImagesChange}
          />
        )}

        {/* Form Validation Helper */}
        <div className="mt-6 p-4 bg-base-200 rounded-lg">
          <h3 className="font-semibold mb-2">Required Fields:</h3>
          <div className="text-sm text-base-content/70 grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${newProduct.name?.trim() ? 'bg-success' : 'bg-error'}`}></div>
              Product Name
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${newProduct.type?.trim() ? 'bg-success' : 'bg-error'}`}></div>
              Product Type
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${newProduct.price > 0 ? 'bg-success' : 'bg-error'}`}></div>
              Price
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${newProduct.producer?.trim() ? 'bg-success' : 'bg-error'}`}></div>
              Producer
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${newProduct.description?.trim() ? 'bg-success' : 'bg-error'}`}></div>
              Description
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${newProduct.material?.trim() ? 'bg-success' : 'bg-error'}`}></div>
              Material
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${(newProduct.images?.length || 0) > 0 ? 'bg-success' : 'bg-error'}`}></div>
              Images (at least 1)
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                newProduct.variants?.length > 0 && 
                newProduct.variants.every(v => v.color?.trim() && v.sizes?.length > 0 && 
                v.sizes.every(s => s.size?.trim() && s.stock >= 0)) ? 'bg-success' : 'bg-error'
              }`}></div>
              Complete Variants
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;