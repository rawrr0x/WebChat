import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/base.repository';
import { Message } from './messages.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MessageRepository extends BaseRepository<Message> {
  constructor(
    @InjectRepository(Message) messageRepository: Repository<Message>,
  ) {
    super(messageRepository);
  }
}
