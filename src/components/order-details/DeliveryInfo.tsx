import React from 'react';
import { HiMapPin, HiPhone, HiTruck, HiCreditCard, HiDocumentText } from 'react-icons/hi2';
import { AdminOrder } from 'types/Order';

interface DeliveryInfoProps {
  order: AdminOrder;
}

const DeliveryInfo: React.FC<DeliveryInfoProps> = ({ order }) => {
  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <h2 className="card-title text-xl mb-4 flex items-center gap-2">
          <HiMapPin className="w-5 h-5" />
          Delivery Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-base-content/70">Recipient</label>
              <p className="text-base font-medium">{order.recipient}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-base-content/70">Phone Number</label>
              <div className="flex items-center gap-2 mt-1">
                <HiPhone className="w-4 h-4" />
                <span className="text-base font-medium">
                  {order.user?.phone || 'Not provided'}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-base-content/70">Delivery Type</label>
              <div className="flex items-center gap-2 mt-1">
                <HiTruck className="w-4 h-4" />
                <span className="capitalize">{order.delivery}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-base-content/70">Delivery Address</label>
              <p className="text-base">{order.address}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-base-content/70">Payment Method</label>
              <div className="flex items-center gap-2 mt-1">
                <HiCreditCard className="w-4 h-4" />
                <span className="capitalize">{order.payment}</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-base-content/70">Note</label>
              <div className="flex items-center gap-2 mt-1">
                <HiDocumentText className="w-4 h-4" />
                <span className="text-base">
                  {order.note || 'No note provided'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryInfo;