import React, { useRef } from 'react';
import { HiOutlinePlus, HiOutlineTrash, HiOutlineArrowLeft, HiOutlineArrowRight } from 'react-icons/hi2';
import { 
  handleImageUpload, 
  handleImageDelete, 
  createFileInput, 
  createAddImageButton,
  createDeleteButton,
  getThumbnailClasses,
  MAX_IMAGES
} from '@components/ImageHandler';

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  images,
  productName,
  selectedImageIndex,
  onClose,
  onImageSelect,
  isEditing = false,
  onImagesChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !images || images.length === 0) return null;

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => 
    handleImageUpload(event, images, onImagesChange, fileInputRef);

  const handleDelete = (indexToDelete: number) => 
    handleImageDelete(indexToDelete, images, onImagesChange, selectedImageIndex, onImageSelect, onClose);

  const handleUploadClick = () => fileInputRef.current?.click();

  const navigate = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? (selectedImageIndex > 0 ? selectedImageIndex - 1 : images.length - 1)
      : (selectedImageIndex < images.length - 1 ? selectedImageIndex + 1 : 0);
    onImageSelect(newIndex);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const keyActions: { [key: string]: () => void } = {
      'ArrowLeft': () => navigate('prev'),
      'ArrowRight': () => navigate('next'),
      'Escape': onClose
    };
    keyActions[e.key]?.();
  };

  const hasMultipleImages = images.length > 1;
  const isMaxImagesReached = images.length >= MAX_IMAGES;

  return (
    <div className="modal modal-open" onKeyDown={handleKeyDown} tabIndex={-1}>
      <div className="modal-box max-w-6xl max-h-[90vh]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">
            {productName} - Image {selectedImageIndex + 1} of {images.length}
          </h3>
          
          <div className="flex items-center gap-2">
            {isEditing && (
              <>
                {createAddImageButton(
                  handleUploadClick,
                  `btn btn-sm btn-primary ${isMaxImagesReached ? 'btn-disabled' : ''}`,
                  <HiOutlinePlus size={16} />,
                  isMaxImagesReached ? "Max Images" : "Upload",
                  isMaxImagesReached
                )}
                {hasMultipleImages && createDeleteButton(
                  () => handleDelete(selectedImageIndex),
                  "btn btn-sm btn-error",
                  <HiOutlineTrash size={16} />,
                  false
                )}
              </>
            )}
            <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">✕</button>
          </div>
        </div>

        {createFileInput(fileInputRef, handleUpload)}
        
        <div className="relative mb-4">
          <img
            src={images[selectedImageIndex]}
            alt={productName}
            className="w-full h-auto max-h-[60vh] object-contain rounded-lg mx-auto block"
          />
          
          {hasMultipleImages && (
            <>
              <button
                onClick={() => navigate('prev')}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 btn btn-circle bg-black/50 border-none hover:bg-black/70"
              >
                <HiOutlineArrowLeft size={20} className="text-white" />
              </button>
              <button
                onClick={() => navigate('next')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 btn btn-circle bg-black/50 border-none hover:bg-black/70"
              >
                <HiOutlineArrowRight size={20} className="text-white" />
              </button>
            </>
          )}
        </div>
        
        {hasMultipleImages && (
          <div className="flex justify-center gap-2 overflow-x-auto max-w-full pb-2">
            {images.map((image, index) => (
              <div key={index} className="relative flex-shrink-0">
                <img
                  src={image}
                  alt={`${productName} ${index + 1}`}
                  className={getThumbnailClasses(selectedImageIndex === index, isEditing)}
                  onClick={() => onImageSelect(index)}
                />
                {isEditing && hasMultipleImages && createDeleteButton(
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
        )}

        {hasMultipleImages && !isEditing && (
          <div className="text-center text-sm text-base-content/60 mt-2">
            Use arrow keys or click thumbnails to navigate • Press Esc to close
          </div>
        )}
      </div>
      
      <div className="modal-backdrop" onClick={onClose}>
        <button>close</button>
      </div>
    </div>
  );
};

export default ImageModal;