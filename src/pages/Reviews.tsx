import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce'; // You might need to install this: npm install use-debounce
import {
  MdStar,
  MdSearch,
  MdShoppingBag,
  MdVisibility,
  MdClear
} from 'react-icons/md';
import { fetchAllReviews } from '@api/ApiCollection';
import { Review } from '@type/Review';
import { 
  renderStars, 
  formatDate, 
  generatePagination, 
  UserAvatar 
} from '@components/ReviewHandler';

const Reviews = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('-createdAt');
  const [filter, setFilter] = useState('');
  const limitPerPage = 10;
  const navigate = useNavigate();

  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  const {
    data: reviewsData,
    isLoading,
    isError,
    error,
    isFetching
  } = useQuery({
    queryKey: ['reviews', debouncedSearchQuery, sortBy, filter, currentPage],
    queryFn: () => fetchAllReviews({
      page: currentPage,
      limitItem: limitPerPage,
      sort: sortBy,
      filter,
      searchQuery: debouncedSearchQuery.trim(),
    }),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Memoized handlers to prevent unnecessary re-renders
  const handleSortChange = useCallback((newSort: string) => {
    setSortBy(newSort);
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback((newFilter: string) => {
    setFilter(newFilter);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleViewDetail = useCallback((reviewId: string) => {
    navigate(`/review/${reviewId}`);
  }, [navigate]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); 
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setCurrentPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setSortBy('-createdAt');
    setFilter('');
    setCurrentPage(1);
  }, []);

  const sortOptions = useMemo(() => [
    { value: '-createdAt', label: 'Newest First' },
    { value: 'createdAt', label: 'Oldest First' },
    { value: '-overallRating', label: 'Highest Rating' },
    { value: 'overallRating', label: 'Lowest Rating' },
  ], []);

  const filterOptions = useMemo(() => [
    { value: '', label: 'All Ratings' },
    { value: '5', label: '5 Stars' },
    { value: '4', label: '4 Stars' },
    { value: '3', label: '3 Stars' },
    { value: '2', label: '2 Stars' },
    { value: '1', label: '1 Star' },
  ], []);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return searchQuery || filter || sortBy !== '-createdAt';
  }, [searchQuery, filter, sortBy]);

  if (isLoading) {
    return (
      <div className="w-full p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <h3 className="text-red-800 dark:text-red-200 font-medium">Error loading reviews</h3>
          <p className="text-red-600 dark:text-red-300 text-sm mt-1">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Customer Reviews
        </h1>
        <div className="flex items-center justify-between">
          <p className="text-gray-600 dark:text-gray-400">
            {reviewsData ? `${reviewsData.totalReviews} total reviews` : 'Loading reviews...'}
            {isFetching && !isLoading && (
              <span className="ml-2 text-blue-500">• Updating...</span>
            )}
          </p>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search reviews by user name, comment, or recipient..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <MdClear className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Sort & Filter */}
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={filter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {filterOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap gap-2">
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm rounded-full">
                Search: "{searchQuery}"
                <button
                  onClick={handleClearSearch}
                  className="ml-1 hover:text-blue-600 dark:hover:text-blue-300"
                >
                  <MdClear className="w-3 h-3" />
                </button>
              </span>
            )}
            {filter && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-sm rounded-full">
                Rating: {filter} Star{filter !== '1' ? 's' : ''}
                <button
                  onClick={() => handleFilterChange('')}
                  className="ml-1 hover:text-green-600 dark:hover:text-green-300"
                >
                  <MdClear className="w-3 h-3" />
                </button>
              </span>
            )}
            {sortBy !== '-createdAt' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-sm rounded-full">
                Sort: {sortOptions.find(opt => opt.value === sortBy)?.label}
                <button
                  onClick={() => handleSortChange('-createdAt')}
                  className="ml-1 hover:text-purple-600 dark:hover:text-purple-300"
                >
                  <MdClear className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviewsData?.data?.map((review: Review) => (
          <div
            key={review._id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all hover:border-blue-300 dark:hover:border-blue-600"
          >
            <div className="flex items-center justify-between">
              {/* Left - User Info */}
              <div className="flex items-start gap-4 flex-1">
                <UserAvatar userImg={review.userId.img} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {review.userId.firstName} {review.userId.lastName}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>

                  <div className="mb-2">
                    {renderStars(review.overallRating)}
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2">
                    {review.overallComment || 'No overall comment provided'}
                  </p>

                  <div className="flex items-center gap-1 mt-2">
                    <MdShoppingBag className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Order to: {review.orderId.recipient}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right - View Detail */}
              <div className="flex-shrink-0 ml-4">
                <button
                  onClick={() => handleViewDetail(review._id)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <MdVisibility className="w-4 h-4" />
                  View Detail
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {reviewsData?.data?.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <MdStar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {hasActiveFilters ? 'No reviews match your criteria' : 'No reviews found'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {hasActiveFilters 
              ? 'Try adjusting your search or filter criteria.' 
              : 'There are no reviews to display at the moment.'
            }
          </p>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {reviewsData?.totalPage !== undefined && reviewsData.totalPage > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {generatePagination(currentPage, reviewsData.totalPage, handlePageChange)}
        </div>
      )}
    </div>
  );
};

export default Reviews;