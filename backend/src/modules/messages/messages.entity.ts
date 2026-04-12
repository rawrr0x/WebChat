import { BaseEntity } from 'src/common/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('messages')
export class Message extends BaseEntity {
  @Column()
  body: string;
}
