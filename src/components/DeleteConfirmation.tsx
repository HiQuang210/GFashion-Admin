import React from 'react';
import { HiOutlineExclamationTriangle } from 'react-icons/hi2';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  itemName: string;
  itemId?: string;
  title?: string;
  description?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  itemName,
  itemId,
  title = "Confirm Deletion",
  description,
  confirmButtonText = "Delete",
  cancelButtonText = "Cancel"
}) => {
  if (!isOpen) return null;

  const defaultDescription = `Are you sure you want to delete "${itemName}"? This action cannot be undone.`;

  return (
    <dialog open className="modal modal-open">
      <div className="modal-box">
        <div className="flex items-center gap-3 mb-4">
          <HiOutlineExclamationTriangle className="text-error" size={24} />
          <h3 className="font-bold text-lg">{title}</h3>
        </div>
        
        <div className="mb-4">
          <p className="mb-2">
            {description || defaultDescription}
          </p>
          {itemId && (
            <p className="text-sm text-base-content/70">
              ID: {itemId}
            </p>
          )}
        </div>
        
        <p className="text-sm text-warning mb-6">
          This action cannot be undone.
        </p>
        
        <div className="modal-action">
          <button 
            className="btn btn-ghost" 
            onClick={onClose}
            disabled={isDeleting}
          >
            {cancelButtonText}
          </button>
          <button 
            className="btn btn-error" 
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Deleting...
              </>
            ) : (
              confirmButtonText
            )}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default DeleteConfirmationModal;