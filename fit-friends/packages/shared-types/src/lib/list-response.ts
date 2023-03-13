export interface ListResponse<T> {
  currentPage: number;
  totalPages: number;
  items: T[];
}
