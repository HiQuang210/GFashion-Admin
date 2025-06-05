import React, { useState } from 'react';
import { HiXMark, HiExclamationTriangle } from 'react-icons/hi2';
import { getStatusIcon } from './Status';

interface StatusUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: string;
  orderId: string;
  onUpdateStatus: (status: string) => Promise<void>;
  isUpdating: boolean;
}

const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({
  isOpen,
  onClose,
  currentStatus,
  orderId,
  onUpdateStatus,
  isUpdating
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>(currentStatus);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const statusOptions = [
    { value: 'pending', label: 'Pending', description: 'Order is waiting to be processed' },
    { value: 'processing', label: 'Processing', description: 'Order is being prepared' },
    { value: 'shipping', label: 'Shipping', description: 'Order is on the way to customer' },
    { value: 'completed', label: 'Completed', description: 'Order has been delivered successfully' },
    { value: 'cancelled', label: 'Cancelled', description: 'Order has been cancelled' }
  ];

  const needsConfirmation = (status: string) => {
    return status === 'completed' || status === 'cancelled';
  };

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
  };

  const handleUpdate = () => {
    if (needsConfirmation(selectedStatus)) {
      setShowConfirmation(true);
    } else {
      confirmUpdate();
    }
  };

  const confirmUpdate = async () => {
    try {
      await onUpdateStatus(selectedStatus);
      handleClose();
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  const handleClose = () => {
    setSelectedStatus(currentStatus);
    setShowConfirmation(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-md mx-4">
        {!showConfirmation ? (
          // Status Selection Modal
          <>
            <div className="flex justify-between items-center p-6 border-b border-base-300">
              <h3 className="text-lg font-semibold">Update Order Status</h3>
              <button
                onClick={handleClose}
                className="btn btn-ghost btn-sm btn-circle"
                disabled={isUpdating}
              >
                <HiXMark className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-sm text-base-content/70 mb-4">
                Order ID: #{orderId}
              </p>
              
              <div className="space-y-3">
                {statusOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors
                      ${selectedStatus === option.value 
                        ? 'border-primary bg-primary/10' 
                        : 'border-base-300 hover:border-base-400'
                      }
                      ${option.value === currentStatus ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={option.value}
                      checked={selectedStatus === option.value}
                      onChange={() => handleStatusSelect(option.value)}
                      disabled={option.value === currentStatus}
                      className="radio radio-primary"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(option.value)}
                        <span className="font-medium capitalize">{option.label}</span>
                        {option.value === currentStatus && (
                          <span className="badge badge-outline badge-sm">Current</span>
                        )}
                      </div>
                      <p className="text-sm text-base-content/60 mt-1">
                        {option.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t border-base-300">
              <button
                onClick={handleClose}
                className="btn btn-ghost"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={selectedStatus === currentStatus || isUpdating}
                className="btn btn-primary"
              >
                {isUpdating ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Updating...
                  </>
                ) : (
                  'Update Status'
                )}
              </button>
            </div>
          </>
        ) : (
          // Confirmation Modal
          <>
            <div className="flex justify-between items-center p-6 border-b border-base-300">
              <h3 className="text-lg font-semibold text-warning">Confirm Status Update</h3>
              <button
                onClick={() => setShowConfirmation(false)}
                className="btn btn-ghost btn-sm btn-circle"
                disabled={isUpdating}
              >
                <HiXMark className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="text-warning text-2xl">
                  <HiExclamationTriangle />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">
                    Are you sure you want to mark this order as {selectedStatus}?
                  </h4>
                  <p className="text-sm text-base-content/70 mb-4">
                    {selectedStatus === 'completed' 
                      ? 'This action will mark the order as successfully delivered and completed. This action cannot be undone.'
                      : 'This action will cancel the order. This may affect inventory and customer notifications.'
                    }
                  </p>
                  <div className="bg-base-200 p-3 rounded-lg">
                    <p className="text-sm">
                      <strong>Order ID:</strong> #{orderId}
                    </p>
                    <p className="text-sm">
                      <strong>Current Status:</strong> <span className="capitalize">{currentStatus}</span>
                    </p>
                    <p className="text-sm">
                      <strong>New Status:</strong> <span className="capitalize">{selectedStatus}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t border-base-300">
              <button
                onClick={() => setShowConfirmation(false)}
                className="btn btn-ghost"
                disabled={isUpdating}
              >
                Go Back
              </button>
              <button
                onClick={confirmUpdate}
                disabled={isUpdating}
                className={`btn ${selectedStatus === 'cancelled' ? 'btn-error' : 'btn-warning'}`}
              >
                {isUpdating ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Updating...
                  </>
                ) : (
                  `Confirm ${selectedStatus === 'cancelled' ? 'Cancellation' : 'Completion'}`
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StatusUpdateModal;