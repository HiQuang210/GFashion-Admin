export interface ProductReview {
  _id: string;
  productId: {
    _id: string;
    name: string;
    images: string[];
    type: string;
    price: number;
    producer: string;
  };
  rating: number;
  comment?: string;
  color: string;
  size: string;
}

export interface Review {
  _id: string;
  orderId: {
    _id: string;
    recipient: string;
    address: string;
    createdAt: string;
  };
  userId: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    img: string | null | undefined;
  };
  overallRating: number;
  overallComment?: string;
  productReviews: ProductReview[];
  deliveryRating?: number;
  serviceRating?: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ReviewsResponse {
  status: string;
  message: string;
  data: Review[];
  currentPage: number;
  totalPage: number;
  totalReviews: number;
}

export interface FetchReviewsParams {
  page?: number;
  limitItem?: number;
  sort?: string;
  filter?: string;
  searchQuery?: string;
}

export interface CreateReviewData {
  orderId: string;
  overallRating: number;
  overallComment?: string;
  productReviews: {
    productId: string;
    rating: number;
    comment?: string;
    color: string;
    size: string;
  }[];
  deliveryRating?: number;
  serviceRating?: number;
}