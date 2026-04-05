import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Name length should be more than 1' })
  @ApiProperty()
  name?: string;

  @IsOptional()
  @IsString()
  @Length(6, 100, {
    message: 'Password length should be only between 6 and 100 symbols',
  })
  @ApiProperty()
  password?: string;
}
