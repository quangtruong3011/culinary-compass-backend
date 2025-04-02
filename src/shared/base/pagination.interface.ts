export interface PaginationOptions {
  page?: number;
  limit?: number;
  // sortBy?: string;
  // sortOrder?: 'ASC' | 'DESC';
  // search?: string;
  filter?: string;
}

export interface PaginationResult<T> {
  results: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
