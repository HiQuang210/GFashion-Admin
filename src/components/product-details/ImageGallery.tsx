import React from 'react';
import { HiOutlinePhoto, HiOutlineEye } from 'react-icons/hi2';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  selectedImageIndex: number;
  onImageSelect: (index: number) => void;
  onImageClick: () => void;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  productName,
  selectedImageIndex,
  onImageSelect,
  onImageClick,
}) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body p-4">
        <h2 className="card-title flex items-center gap-2 mb-4">
          <HiOutlinePhoto size={20} />
          Product Images
        </h2>
        
        {images && images.length > 0 ? (
          <>
            {/* Main Image */}
            <div className="relative mb-4">
              <img
                src={images[selectedImageIndex]}
                alt={productName}
                className="w-full h-64 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                onClick={onImageClick}
              />
              <button
                onClick={onImageClick}
                className="absolute top-2 right-2 btn btn-circle btn-sm bg-black/50 border-none"
              >
                <HiOutlineEye size={16} className="text-white" />
              </button>
            </div>
            
            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${productName} ${index + 1}`}
                    className={`w-16 h-16 object-cover rounded cursor-pointer flex-shrink-0 transition-all ${
                      selectedImageIndex === index 
                        ? 'ring-2 ring-primary' 
                        : 'hover:ring-1 hover:ring-base-300'
                    }`}
                    onClick={() => onImageSelect(index)}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-64 bg-base-200 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <HiOutlinePhoto size={48} className="text-base-content/50 mx-auto mb-2" />
              <p className="text-base-content/50">No images available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductImageGallery;