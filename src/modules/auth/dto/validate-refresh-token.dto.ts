export interface ValidateRefreshTokenDto {
  id: number;
  email: string;
  roles: string[];
  iat?: number;
  exp?: number;
  // sub: number;
}
