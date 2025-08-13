export interface ReviewResponse {
  ratingAverage: number;
  ratingCount: number;
  reviews: ReviewItem[];
}

export interface ReviewItem {
  id: number;
  reviewerName: string;
  createdAt: string;
  rating: number;
  content: string;
}
