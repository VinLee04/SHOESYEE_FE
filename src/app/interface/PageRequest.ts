export interface AttributeSearchRequest {
  column: string; 
  value: any; 
  operation: Operation; 
  joinTable?: string;
}

export enum Operation {
  EQUAL = 'EQUAL',
  LIKE = 'LIKE',
  IN = 'IN',
  GREATER_THAN = 'GREATER_THAN',
  LESS_THAN = 'LESS_THAN',
  BETWEEN = 'BETWEEN',
  JOIN = 'JOIN',
}

export interface ListSearchRequest {
  searchRequest: AttributeSearchRequest[];
  globalOperator: GlobalOperator; 
  pageDTO: PageRequest;
}

export enum GlobalOperator {
  AND = 'AND',
  OR = 'OR'
}

export interface PageRequest {
  pageNo: number; 
  pageSize: number; 
  sort: 'ASC' | 'DESC'; 
  sortByColumn: string; 
}

export interface PageResponse {
  content: any;
  pageable: any;
  totalElements: number;
  totalPages: number;
}
