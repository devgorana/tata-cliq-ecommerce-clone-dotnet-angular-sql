export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice: number | null;
  brandId: string;
  brandName: string;
  categoryId: string;
  categoryName: string;
  imageUrls: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  imageUrl: string | null;
}

export interface ProductFilters {
  categoryId: string | null;
  brandId: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  sort: 'price_asc' | 'price_desc' | 'newest' | 'rating' | null;
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}
