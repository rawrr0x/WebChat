import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @MinLength(1, { message: 'Name length should be more than 1' })
  @ApiProperty()
  name: string;

  @IsString()
  @Length(6, 100, {
    message: 'Password length should be only between 6 and 100 symbols',
  })
  @ApiProperty()
  password: string;
}
