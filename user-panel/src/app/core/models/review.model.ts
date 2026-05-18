export interface Review {
  id: string;
  productId: string;
  userId: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  /** ISO date string — mapped from backend `createdAt` */
  date: string;
}

export interface CreateReviewRequest {
  rating: number;
  title: string;
  body: string;
}

export interface PagedReviews {
  items: Review[];
  totalCount: number;
  page: number;
  pageSize: number;
}
