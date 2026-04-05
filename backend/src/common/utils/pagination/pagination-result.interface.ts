export interface PaginatedResult<T> {
  data: T;
  total: number;
  limit: number;
  page: number;
  offset: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
