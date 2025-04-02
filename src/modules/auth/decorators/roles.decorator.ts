import { SetMetadata } from "@nestjs/common";
import { RoleEnum } from "../constants/constants";

export const ROLE_KEY = 'roles';
export const Roles = (...roles: RoleEnum[]) => SetMetadata(ROLE_KEY, roles);