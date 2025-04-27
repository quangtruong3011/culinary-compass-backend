export interface CreateTokenPayloadDto {
  id: number;
  email: string;
  roles: string[];
  iat?: number;
  exp?: number;
}
