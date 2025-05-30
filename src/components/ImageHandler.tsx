export const MAX_IMAGES = 5;

export const handleImageUpload = (
  event: React.ChangeEvent<HTMLInputElement>,
  images: string[],
  onImagesChange: ((images: string[]) => void) | undefined,
  fileInputRef: React.RefObject<HTMLInputElement>
) => {
  const files = event.target.files;
  if (!files || !onImagesChange) return;

  const currentImageCount = images.length;
  const remainingSlots = MAX_IMAGES - currentImageCount;
  
  if (remainingSlots <= 0) {
    alert(`Maximum ${MAX_IMAGES} images allowed per product.`);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    return;
  }

  const filesToProcess = Array.from(files).slice(0, remainingSlots);
  
  if (files.length > remainingSlots) {
    alert(`Only ${remainingSlots} more image(s) can be added. Maximum ${MAX_IMAGES} images allowed per product.`);
  }

  let processedCount = 0;
  const newImages = [...images];

  filesToProcess.forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        newImages.push(e.target.result as string);
        processedCount++;
        
        if (processedCount === filesToProcess.length) {
          onImagesChange(newImages);
        }
      }
    };
    reader.readAsDataURL(file);
  });

  if (fileInputRef.current) {
    fileInputRef.current.value = '';
  }
};

export const handleImageDelete = (
  indexToDelete: number,
  images: string[],
  onImagesChange: ((images: string[]) => void) | undefined,
  selectedImageIndex: number,
  onImageSelect: (index: number) => void,
  onClose?: () => void
) => {
  if (!onImagesChange) return;

  const newImages = images.filter((_, index) => index !== indexToDelete);
  onImagesChange(newImages);

  if (newImages.length === 0) {
    onClose?.();
    onImageSelect(0);
  } else if (selectedImageIndex >= newImages.length) {
    onImageSelect(newImages.length - 1);
  } else if (selectedImageIndex > indexToDelete) {
    onImageSelect(selectedImageIndex - 1);
  }
};

export const createFileInput = (
  fileInputRef: React.RefObject<HTMLInputElement>,
  handleUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
) => (
  <input
    ref={fileInputRef}
    type="file"
    accept="image/*"
    multiple
    onChange={handleUpload}
    className="hidden"
  />
);

export const createAddImageButton = (
  onClick: () => void,
  className: string = "btn btn-sm btn-primary",
  icon: React.ReactNode,
  text?: string,
  disabled: boolean = false
) => (
  <button onClick={onClick} className={className} disabled={disabled}>
    {icon}
    {text}
  </button>
);

export const createDeleteButton = (
  onClick: (e?: React.MouseEvent) => void,
  className: string = "btn btn-xs btn-circle btn-error",
  icon: React.ReactNode,
  stopPropagation: boolean = true
) => (
  <button
    onClick={stopPropagation ? (e) => { e.stopPropagation(); onClick(e); } : onClick}
    className={className}
  >
    {icon}
  </button>
);

export const getThumbnailClasses = (isSelected: boolean, isEditing: boolean = false) => {
  const baseClasses = "w-16 h-16 object-cover rounded cursor-pointer transition-all";
  if (isSelected) {
    return `${baseClasses} ring-2 ring-primary ${isEditing ? '' : 'opacity-100'}`;
  }
  return `${baseClasses} ${isEditing ? 'opacity-60 hover:opacity-100' : 'hover:ring-1 hover:ring-base-300'}`;
};

export const createEmptyImagePlaceholder = (
  isEditing: boolean,
  onUploadClick: () => void,
  photoIcon: React.ReactNode,
  plusIcon: React.ReactNode
) => (
  <div className="w-full h-64 bg-base-200 rounded-lg flex items-center justify-center">
    <div className="text-center">
      {photoIcon}
      {isEditing ? (
        <>
          <p className="text-base-content/50 mb-4">No images yet</p>
          <button onClick={onUploadClick} className="btn btn-primary btn-sm">
            {plusIcon}
            Upload Images (Max {MAX_IMAGES})
          </button>
        </>
      ) : (
        <p className="text-base-content/50">No images available</p>
      )}
    </div>
  </div>
);
