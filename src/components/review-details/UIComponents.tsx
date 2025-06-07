import React from 'react';
import { MdWarning, MdArrowBack, MdDelete } from 'react-icons/md';
import { renderStars } from '@components/ReviewHandler';
import { formatDetailedDate } from '@utils/reviewHelper';

// Loading Component
export const LoadingSpinner: React.FC = () => (
  <div className="w-full p-6">
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  </div>
);

// Error Component
interface ErrorMessageProps {
  error: unknown;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => (
  <div className="w-full p-6">
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
      <h3 className="text-red-800 dark:text-red-200 font-medium">Error loading review</h3>
      <p className="text-red-600 dark:text-red-300 text-sm mt-1">
        {error instanceof Error ? error.message : 'An unexpected error occurred'}
      </p>
    </div>
  </div>
);

// Not Found Component
interface ReviewNotFoundProps {
  onBackClick: () => void;
}

export const ReviewNotFound: React.FC<ReviewNotFoundProps> = ({ onBackClick }) => (
  <div className="w-full p-6">
    <div className="text-center py-12">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
        <MdWarning className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Review not found
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        The review you're looking for doesn't exist or has been removed.
      </p>
      <button
        onClick={onBackClick}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
      >
        Back to Reviews
      </button>
    </div>
  </div>
);

interface ReviewHeaderProps {
  onBackClick: () => void;
  onDeleteClick: () => void;
  createdAt: string;
}

export const ReviewHeader: React.FC<ReviewHeaderProps> = ({
  onBackClick,
  onDeleteClick,
  createdAt
}) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-4">
      <button
        onClick={onBackClick}
        className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
      >
        <MdArrowBack className="w-5 h-5" />
      </button>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Review Details
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Review submitted on {formatDetailedDate(createdAt)}
        </p>
      </div>
    </div>
    
    <button
      onClick={onDeleteClick}
      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
    >
      <MdDelete className="w-5 h-5" />
      Delete Review
    </button>
  </div>
);

interface ServiceRatingProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  rating: number;
  iconColor: string;
}

export const ServiceRating: React.FC<ServiceRatingProps> = ({ 
  icon: Icon, 
  label, 
  rating, 
  iconColor 
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <Icon className={`w-4 h-4 ${iconColor}`} />
      <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
    </div>
    {renderStars(rating, 'sm')}
  </div>
);