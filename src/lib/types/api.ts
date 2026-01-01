export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, string>;
  };
}

export interface OffsetPaginationMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface OffsetPaginationResponse<T> {
  data: T[];
  meta: OffsetPaginationMeta;
}
