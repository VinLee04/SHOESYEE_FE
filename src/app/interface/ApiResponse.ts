export interface ApiResponse<T = any> {
  code: number,
  message?: string,
  result?: T
}

export interface DataResponse<T> {
  success: boolean;
  result: T;
}
