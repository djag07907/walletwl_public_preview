export interface ApiResponse<T> {
  data: T;
  code: number;
  lang: string;
  message: string;
}
