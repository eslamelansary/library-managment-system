export interface PaginationInterface {
  limit: number;
  page: number;
  search?: string;
  sort: sort;
  order: order;
}

type order = 'ASC' | 'DESC';
type sort = 'id';
