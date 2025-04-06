export class SignUpResponseDto {
  id: number;
  email: string;
  roles: string[];
}

export class SignUpResponseWithTokenDto extends SignUpResponseDto {
  access_token: string;
}