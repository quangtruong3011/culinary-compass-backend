export class SignUpResponseDto {
  id: number;
  email: string;
  roles: string[];
}

export class SignUpResponseWithTokenDto {
  user: SignUpResponseDto;
  access_token: string;
  refresh_token: string;
}