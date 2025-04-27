import { GetUserDto } from 'src/modules/users/dto/get-user.dto';

export class RefreshTokenResponseDto {
  user: GetUserDto;
  access_token: string;
  refresh_token: string;
}
