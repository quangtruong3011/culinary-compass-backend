import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  name?: string;

  @ApiProperty({ example: 'johndoe@gmail.com' })
  email: string;

  passwordHash: string;

  @ApiProperty({ example: '0123456789', maxLength: 10 })
  phone?: string;

  @ApiProperty({ example: 'male' })
  gender?: string;

  @ApiProperty({ example: '2023-01-01' })
  birthOfDate?: Date;

  imageUrl?: string;

  roles: string[];
}
