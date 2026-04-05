import { PaginatedResult } from './pagination-result.interface';
import { PaginationDto } from './pagination.dto';

export class Pagination<T> {
  page: number;
  limit: number;

  constructor(readonly paginationDto: PaginationDto) {
    this.limit = paginationDto.limit || 25;
    this.page = paginationDto.page || 1;
  }

  offset() {
    return this.limit * this.page - this.limit;
  }

  result(total: number, data: T[]): PaginatedResult<T[]> {
    return {
      data,
      total,
      limit: this.limit,
      page: this.page,
      offset: this.offset(),
      totalPages: Math.ceil(total / this.limit),
      hasNext: this.page < total / this.limit,
      hasPrev: this.page > 1,
    };
  }
}
