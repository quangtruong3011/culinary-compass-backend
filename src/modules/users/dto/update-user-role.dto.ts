import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserRoleDto {
  @ApiProperty({
    example: 'admin',
  })
  roleName: string;
}

export class UpdateUserRoleResponseDto {
  user: {
    id: number;
    email: string;
    roles: string[];
  };
}
