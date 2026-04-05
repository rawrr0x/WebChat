import { FindOptionsWhere, Repository } from 'typeorm';
import { BaseEntity } from './base.entity';
import { PaginationDto } from './utils/pagination/pagination.dto';
import { PaginatedResult } from './utils/pagination/pagination-result.interface';
import { Pagination } from './utils/pagination/pagination.util';

export abstract class BaseRepository<T extends BaseEntity> {
  constructor(protected readonly repository: Repository<T>) {}

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResult<T[]>> {
    const pagination = new Pagination<T>(paginationDto);

    const [data, total] = await this.repository.findAndCount({
      take: Number(pagination.limit),
      skip: Number(pagination.offset()),
    });

    return pagination.result(total, data);
  }

  async findOneById(id: number): Promise<T | null> {
    return this.repository.findOneBy({ id } as FindOptionsWhere<T>);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
