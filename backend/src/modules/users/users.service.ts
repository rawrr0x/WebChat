import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { HASH_SALT } from 'src/common/constants';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async findById(id: number) {
    const user = await this.userRepository.findOneById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async create(dto: CreateUserDto) {
    const user = await this.userRepository.findOneByEmail(dto.email);

    if (user) {
      throw new ConflictException('User already exists');
    }

    return this.userRepository.create(dto);
  }

  async update(id: number, dto: UpdateUserDto) {
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, HASH_SALT);
    }

    const user = await this.userRepository.update(id, dto);
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async delete(id: number) {
    const user = await this.userRepository.findOneById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.userRepository.delete(user.id);
  }
}
