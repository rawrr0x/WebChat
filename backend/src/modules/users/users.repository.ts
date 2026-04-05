import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/base.repository';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(@InjectRepository(User) userRepository: Repository<User>) {
    super(userRepository);
  }

  async findOneByEmail(email: string) {
    return this.repository.findOneBy({ email });
  }

  async create(dto: CreateUserDto) {
    const user = this.repository.create(dto);
    return this.repository.save(user);
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.repository.update(id, dto);
    return this.findOneById(id);
  }
}
