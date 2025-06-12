import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchAllReviews, deleteReview } from '@api/ApiCollection';
import { Review } from '@type/Review';
import DeleteConfirmationModal from '@components/DeleteConfirmation';
import { LoadingSpinner, ErrorMessage, ReviewNotFound, ReviewHeader } from '@components/review-details/UIComponents';
import { CustomerInfo, OverallComment, OrderInfo, ProductReviews } from '@components/review-details/ContentSection';

const ReviewDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: reviewsData,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['reviews', 'all'],
    queryFn: () => fetchAllReviews({ page: 1, limitItem: 1000 }),
  });

  const review = reviewsData?.data?.find((r: Review) => r._id === id);

  const handleDeleteClick = () => setDeleteModalOpen(true);

  const handleDeleteConfirm = async () => {
    if (!review) return;

    setIsDeleting(true);
    try {
      await deleteReview(review._id);
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      navigate('/reviews');
      alert('Review deleted successfully');
    } catch (error) {
      console.error('Failed to delete review:', error);
      alert('Failed to delete review. Please try again.');
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  const handleDeleteCancel = () => setDeleteModalOpen(false);
  const handleBackToReviews = () => navigate('/reviews');

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage error={error} />;
  if (!review) return <ReviewNotFound onBackClick={handleBackToReviews} />;

  const user = review.userId;
  const reviewerName = user 
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Anonymous User'
    : 'Anonymous User';

  return (
    <div className="w-full p-6 max-w-4xl mx-auto">
      {/* Header with Back Button */}
      <ReviewHeader
        onBackClick={handleBackToReviews}
        onDeleteClick={handleDeleteClick}
        createdAt={review.createdAt}
      />

      {/* Review Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        {/* Customer Information */}
        <CustomerInfo review={review} reviewerName={reviewerName} />

        {/* Overall Comment */}
        {review.overallComment && (
          <OverallComment comment={review.overallComment} />
        )}

        {/* Order Information */}
        <OrderInfo review={review} />

        {/* Product Reviews */}
        <ProductReviews productReviews={review.productReviews} />
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        itemName={`Review by ${reviewerName}`}
        itemId={review._id}
        title="Delete Review"
        description={`Are you sure you want to delete this review by ${reviewerName}?`}
        confirmButtonText="Delete Review"
        cancelButtonText="Cancel"
      />
    </div>
  );
};

export default ReviewDetail;