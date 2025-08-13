export interface ReviewResponse {
  ratingAverage: number;
  ratingCount: number;
  reviews: ReviewItemType[];
}

export interface ReviewItemType {
  id: number;
  reviewerName: string;
  createdAt: string;
  rating: number;
  content: string;
}
