import React, { useRef } from 'react';
import { HiOutlinePhoto, HiOutlineEye, HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi2';
import { 
  handleImageUpload, 
  handleImageDelete, 
  createFileInput, 
  createAddImageButton,
  createDeleteButton,
  getThumbnailClasses,
  createEmptyImagePlaceholder,
  MAX_IMAGES
} from '@components/ImageHandler';

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  productName,
  selectedImageIndex,
  onImageSelect,
  onImageClick,
  isEditing = false,
  onImagesChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => 
    handleImageUpload(event, images, onImagesChange, fileInputRef);

  const handleDelete = (indexToDelete: number) => 
    handleImageDelete(indexToDelete, images, onImagesChange, selectedImageIndex, onImageSelect);

  const handleUploadClick = () => fileInputRef.current?.click();

  const hasImages = images && images.length > 0;
  const isMaxImagesReached = images && images.length >= MAX_IMAGES;

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="card-title flex items-center gap-2">
            <HiOutlinePhoto size={20} />
            Product Images
          </h2>
          
          {isEditing && createAddImageButton(
            handleUploadClick,
            `btn btn-sm btn-primary ${isMaxImagesReached ? 'btn-disabled' : ''}`,
            <HiOutlinePlus size={16} />,
            isMaxImagesReached ? "Max Images Reached" : "Add Images",
            isMaxImagesReached
          )}
        </div>
        
        {createFileInput(fileInputRef, handleUpload)}
        
        {hasImages ? (
          <>
            <div className="relative mb-4">
              <img
                src={images[selectedImageIndex]}
                alt={productName}
                className="w-full h-64 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                onClick={onImageClick}
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={onImageClick}
                  className="btn btn-circle btn-sm bg-black/50 border-none hover:bg-black/70"
                >
                  <HiOutlineEye size={16} className="text-white" />
                </button>
                {isEditing && images.length > 1 && createDeleteButton(
                  () => handleDelete(selectedImageIndex),
                  "btn btn-circle btn-sm bg-error/80 border-none hover:bg-error",
                  <HiOutlineTrash size={16} className="text-white" />,
                  false
                )}
              </div>
            </div>
            
            <div className="flex gap-2 overflow-x-auto">
              {images.map((image, index) => (
                <div key={index} className="relative flex-shrink-0">
                  <img
                    src={image}
                    alt={`${productName} ${index + 1}`}
                    className={getThumbnailClasses(selectedImageIndex === index)}
                    onClick={() => onImageSelect(index)}
                  />
                  {isEditing && images.length > 1 && createDeleteButton(
                    () => handleDelete(index),
                    "absolute -top-1 -right-1 btn btn-xs btn-circle btn-error",
                    <HiOutlineTrash size={10} />
                  )}
                </div>
              ))}
              
              {isEditing && !isMaxImagesReached && (
                <button
                  onClick={handleUploadClick}
                  className="w-16 h-16 bg-base-200 border-2 border-dashed border-base-300 rounded flex items-center justify-center hover:bg-base-300 transition-colors flex-shrink-0"
                  title={`Add more images (${images.length}/${MAX_IMAGES})`}
                >
                  <HiOutlinePlus size={20} className="text-base-content/50" />
                </button>
              )}
            </div>
          </>
        ) : createEmptyImagePlaceholder(
          isEditing,
          handleUploadClick,
          <HiOutlinePhoto size={48} className="text-base-content/50 mx-auto mb-2" />,
          <HiOutlinePlus size={16} />
        )}
      </div>
    </div>
  );
};

export default ProductImageGallery;