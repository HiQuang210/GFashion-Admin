import React from 'react';
import { MdEmail, MdShoppingBag, MdLocalShipping, MdTagFaces } from 'react-icons/md';
import { renderStars, UserAvatar } from '@components/ReviewHandler';
import { formatPrice, formatDetailedDate } from '@utils/reviewHelper';
import { Review } from '@type/Review';
import { ServiceRating } from './UIComponents';

interface CustomerInfoProps {
  review: Review;
  reviewerName: string;
}

export const CustomerInfo: React.FC<CustomerInfoProps> = ({ review, reviewerName }) => {
  // Safe handling of user data with null checks
  const user = review.userId;
  const userImg = user?.img || null;
  const userEmail = user?.email || 'No email provided';

  return (
    <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <UserAvatar userImg={userImg} />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
            {reviewerName}
          </h2>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-3">
            <MdEmail className="w-4 h-4" />
            <span className="text-sm">{userEmail}</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Overall Rating</p>
              {renderStars(review.overallRating, 'lg')}
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">Review Date</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {formatDetailedDate(review.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface OverallCommentProps {
  comment: string;
}

export const OverallComment: React.FC<OverallCommentProps> = ({ comment }) => (
  <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
      Overall Review
    </h3>
    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
      <p className="text-gray-700 dark:text-gray-300 italic text-lg leading-relaxed">
        "{comment}"
      </p>
    </div>
  </div>
);

interface OrderInfoProps {
  review: Review;
}

export const OrderInfo: React.FC<OrderInfoProps> = ({ review }) => {
  const order = review.orderId;
  const recipient = order?.recipient || 'Unknown recipient';
  const address = order?.address || 'Address not provided';
  const orderDate = order?.createdAt ? formatDetailedDate(order.createdAt) : 'Date not available';

  return (
    <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Order Information
      </h3>
      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MdShoppingBag className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-gray-900 dark:text-white">Delivery Details</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <p><span className="font-medium">Recipient:</span> {recipient}</p>
              <p><span className="font-medium">Address:</span> {address}</p>
              <p><span className="font-medium">Order Date:</span> {orderDate}</p>
            </div>
          </div>
          
          {/* Service Ratings */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Service Ratings</h4>
            <div className="space-y-2">
              {review.deliveryRating && (
                <ServiceRating
                  icon={MdLocalShipping}
                  label="Delivery"
                  rating={review.deliveryRating}
                  iconColor="text-green-600 dark:text-green-400"
                />
              )}
              {review.serviceRating && (
                <ServiceRating
                  icon={MdTagFaces}
                  label="Service"
                  rating={review.serviceRating}
                  iconColor="text-blue-600 dark:text-blue-400"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ProductReviewsProps {
  productReviews: Review['productReviews'];
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({ productReviews }) => {
  const reviews = productReviews || [];

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Product Reviews ({reviews.length} items)
      </h3>
      <div className="space-y-4">
        {reviews.map((productReview) => {
          const product = productReview.productId;
          const productName = product?.name || 'Product name not available';
          const productProducer = product?.producer || 'Producer not available';
          const productType = product?.type || 'Type not available';
          const productPrice = product?.price ? formatPrice(product.price) : 'Price not available';
          const productImage = product?.images?.[0] || '/corrugated-box.jpg';
          
          return (
            <div
              key={productReview._id}
              className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <img
                    src={productImage}
                    alt={productName}
                    className="w-24 h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/corrugated-box.jpg'; 
                    }}
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {productName}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {productProducer} • {productType}
                      </p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {productPrice}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Product Rating</p>
                      {renderStars(productReview.rating)}
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mb-3">
                    <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                      Color: {productReview.color || 'Not specified'}
                    </span>
                    <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                      Size: {productReview.size || 'Not specified'}
                    </span>
                  </div>
                  
                  {productReview.comment && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                      <p className="text-gray-700 dark:text-gray-300 italic">
                        "{productReview.comment}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};