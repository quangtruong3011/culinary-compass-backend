export class RefreshTokenResponseDto {
  user: {
    id: number;
    email: string;
    roles: string[];
  };
  access_token: string;
  refresh_token: string;
}