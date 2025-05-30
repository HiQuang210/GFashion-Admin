import React from 'react';

interface ImageModalProps {
  isOpen: boolean;
  images: string[];
  productName: string;
  selectedImageIndex: number;
  onClose: () => void;
  onImageSelect: (index: number) => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  images,
  productName,
  selectedImageIndex,
  onClose,
  onImageSelect,
}) => {
  if (!isOpen || !images || images.length === 0) {
    return null;
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl">
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </button>
        <img
          src={images[selectedImageIndex]}
          alt={productName}
          className="w-full h-auto rounded-lg"
        />
        
        {images.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => onImageSelect(index)}
                className={`btn btn-sm ${
                  selectedImageIndex === index ? 'btn-primary' : 'btn-ghost'
                }`}
              >
                {index + 1}
              </button>
            ))}
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