export interface ApiResponse<T = unknown> {
  code: number
  msg: string
  data?: T
}

export interface ApiError {
  code: number
  msg: string
  details?: Record<string, unknown>
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
